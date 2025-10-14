# EC2 Migration Plan: ECS → EC2 + Docker Compose + Certbot

## Overview

This plan migrates from ECS Fargate + ALB to a single EC2 instance with Docker Compose, saving ~$25-35/month while maintaining functionality.

## Architecture Comparison

### Current (ECS + ALB)

```
Frontend (CloudFront) → ALB → ECS Task (Fargate) → Backend
api.auto-hive.site → ALB DNS → Container
```

### New (EC2 + Docker Compose)

```
Frontend (CloudFront) → EC2 Instance → Docker Containers → Backend
api.auto-hive.site → Elastic IP → EC2 → Docker Compose
```

## Cost Analysis

| Component      | Current    | New        | Monthly Savings  |
| -------------- | ---------- | ---------- | ---------------- |
| ECS Fargate    | $15-25     | $0         | $15-25           |
| ALB            | $20        | $0         | $20              |
| EC2 t3.micro   | $0         | $8.50      | -$8.50           |
| EBS gp3 (20GB) | $0         | $2         | -$2              |
| Elastic IP     | $0         | $0         | $0               |
| **Total**      | **$35-45** | **$10.50** | **$24.50-34.50** |

## EC2 DNS Solution: Elastic IP

### ✅ **Static IP Address**

- **Elastic IP**: Provides static IPv4 address
- **Persistence**: Survives instance stop/start/reboot
- **Cost**: FREE when attached to running instance
- **DNS**: Set once, never change again

### ✅ **No More IP Updates**

- Point `api.auto-hive.site` to Elastic IP
- Instance restarts don't affect DNS
- Zero maintenance for IP changes

## Infrastructure Changes Required

### 1. Remove ECS Components

- ❌ ECS Cluster
- ❌ ECS Task Definition
- ❌ ECS Service
- ❌ ALB + Target Group
- ❌ ECS Security Groups

### 2. Add EC2 Components

- ✅ EC2 Instance (t3.micro)
- ✅ Elastic IP
- ✅ EC2 Security Group
- ✅ EBS Volume (gp3, 20GB)
- ✅ IAM Role for ECR access

### 3. Keep Existing Components

- ✅ ECR Repository (for Docker images)
- ✅ Parameter Store (for secrets)
- ✅ CloudFront (for frontend)
- ✅ VPC + Subnets

## Terraform Changes Required

### New EC2 Module Structure

```
modules/
├── ec2/
│   ├── main.tf          # EC2 instance, Elastic IP, Security Group
│   ├── variables.tf     # EC2 configuration variables
│   ├── outputs.tf       # EC2 outputs (IP, DNS, etc.)
│   └── user-data.sh     # Instance initialization script
```

### Main Configuration Changes

```hcl
# Remove ECS and ALB modules
# module "ecs" { ... }     # DELETE
# module "alb" { ... }     # DELETE

# Add EC2 module
module "ec2" {
  source = "../../modules/ec2"

  project_name    = var.project_name
  environment     = var.environment
  vpc_id         = module.shared.vpc_id
  subnet_id      = module.shared.public_subnet_ids[0]
  backend_image  = var.backend_image

  # Secrets from Parameter Store
  secrets = [
    "mongodb-uri",
    "jwt-secret",
    "jwt-refresh-secret",
    "mnotify-api-key",
    "serpapi-key"
  ]

  config = [
    "jwt-expires-in",
    "jwt-refresh-expires-in",
    "bcrypt-rounds",
    "rate-limit-window-ms",
    "rate-limit-max-requests",
    "mnotify-sender-id",
    "mnotify-base-url",
    "sms-simulation-mode",
    "cors-origin",
    "password-reset-expires-minutes",
    "cookie-expires-in",
    "default-location"
  ]
}
```

## Docker Compose Setup

### docker-compose.yml

```yaml
version: "3.8"

services:
  backend:
    image: ${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}
    container_name: mama-backend
    restart: unless-stopped
    ports:
      - "80:5000"
      - "443:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      # Secrets will be injected from Parameter Store
    volumes:
      - ./certs:/app/certs
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: mama-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - backend

  certbot:
    image: certbot/certbot
    container_name: mama-certbot
    volumes:
      - ./certs:/etc/letsencrypt
      - ./webroot:/var/www/html
    command: certonly --webroot --webroot-path=/var/www/html --email your-email@domain.com --agree-tos --no-eff-email -d api.auto-hive.site
```

## SSL with Certbot

### Automated SSL Certificate Management

1. **Initial Certificate**: Get Let's Encrypt certificate
2. **Auto-renewal**: Cron job for certificate renewal
3. **Nginx Proxy**: Handle SSL termination
4. **HTTP → HTTPS**: Automatic redirects

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.auto-hive.site;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name api.auto-hive.site;

    ssl_certificate /etc/nginx/certs/live/api.auto-hive.site/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/live/api.auto-hive.site/privkey.pem;

    location / {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Deployment Strategy

### 1. Zero-Downtime Migration

1. **Deploy EC2**: Create new infrastructure alongside existing
2. **Test EC2**: Verify backend functionality
3. **Update DNS**: Point api.auto-hive.site to Elastic IP
4. **Monitor**: Ensure everything works
5. **Cleanup**: Remove ECS/ALB resources

### 2. Automated Deployment

- **GitHub Actions**: Build and push to ECR
- **EC2 User Data**: Pull latest image and restart containers
- **Health Checks**: Verify deployment success

## Security Considerations

### EC2 Security Group

```hcl
resource "aws_security_group" "ec2" {
  name_prefix = "${var.project_name}-${var.environment}-ec2-"
  vpc_id      = var.vpc_id

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH (restrict to your IP)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["YOUR_IP/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Monitoring & Logging

### CloudWatch Integration

- **EC2 Metrics**: CPU, Memory, Disk usage
- **Application Logs**: Docker container logs
- **Custom Metrics**: Health check status

### Backup Strategy

- **EBS Snapshots**: Automated daily backups
- **Configuration Backup**: Terraform state
- **Certificate Backup**: SSL certificates

## Migration Steps

### Phase 1: Infrastructure Setup

1. Create EC2 module
2. Update main.tf
3. Deploy EC2 infrastructure
4. Configure Elastic IP

### Phase 2: Application Deployment

1. Create Docker Compose setup
2. Configure Nginx + Certbot
3. Deploy backend application
4. Test SSL certificates

### Phase 3: DNS Cutover

1. Update DNS to point to Elastic IP
2. Monitor application health
3. Verify SSL functionality

### Phase 4: Cleanup

1. Remove ECS resources
2. Remove ALB resources
3. Update documentation

## Risk Assessment

### Low Risk

- ✅ Cost savings significant
- ✅ Elastic IP provides static addressing
- ✅ Docker Compose is well-established
- ✅ Certbot is reliable for SSL

### Medium Risk

- ⚠️ Single point of failure (one EC2 instance)
- ⚠️ Manual scaling required
- ⚠️ Instance management overhead

### Mitigation

- 🔄 Automated backups
- 🔄 Health monitoring
- 🔄 Quick recovery procedures

## Next Steps

1. **Create EC2 Terraform module**
2. **Design Docker Compose configuration**
3. **Plan SSL certificate automation**
4. **Test in staging environment**
5. **Execute migration plan**

