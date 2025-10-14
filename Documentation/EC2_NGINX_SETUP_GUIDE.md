# EC2 + Nginx Setup Guide

## 🏗️ **How the New Architecture Works**

### **Architecture Overview**
```
Frontend (CloudFront) → EC2 Instance → Nginx → Backend Container
api.auto-hive.site → Elastic IP → EC2 → Docker Compose → Node.js App
```

### **Components Breakdown**

#### 1. **EC2 Instance (t3.micro)**
- **OS**: Ubuntu 22.04 LTS (AMI: `ami-0bc691261a82b32bc`)
- **Specs**: 1 vCPU, 1 GB RAM, 20 GB EBS storage
- **Networking**: Public subnet with Elastic IP
- **Cost**: ~$8.50/month

#### 2. **Elastic IP**
- **Purpose**: Static IP address that survives instance restarts
- **DNS**: Points `api.auto-hive.site` to this IP
- **Cost**: FREE (when attached to running instance)
- **Benefit**: No more DNS updates needed!

#### 3. **Docker Compose Stack**
- **Nginx**: Reverse proxy with SSL termination
- **Backend**: Your Node.js application from ECR
- **Certbot**: Automatic SSL certificate management

#### 4. **SSL/TLS**
- **Provider**: Let's Encrypt (free)
- **Management**: Automatic renewal via cron job
- **Termination**: Handled by Nginx

## 🔧 **Infrastructure Components**

### **Terraform Modules**

#### 1. **EC2 Module** (`/iac/modules/ec2/`)
```hcl
# Creates:
- EC2 instance with Ubuntu 22.04
- Elastic IP for static addressing
- Security group (ports 22, 80, 443)
- IAM role for ECR/Parameter Store access
- User data script execution
```

#### 2. **User Data Script** (`user-data.sh`)
```bash
# Automatically installs:
- Docker & Docker Compose
- AWS CLI for ECR login
- Nginx configuration
- SSL certificate setup
- Application deployment
```

## 🚀 **How It Works Step by Step**

### **Phase 1: Infrastructure Deployment**
1. **Terraform applies**:
   - Creates EC2 instance
   - Assigns Elastic IP
   - Configures security groups
   - Sets up IAM permissions

2. **Instance boots** with user-data script:
   - Updates Ubuntu packages
   - Installs Docker & Docker Compose
   - Creates application directory
   - Logs into ECR

### **Phase 2: Application Setup**
1. **Docker Compose starts**:
   - Pulls backend image from ECR
   - Starts Nginx container
   - Starts backend container
   - Configures networking

2. **SSL Certificate**:
   - Certbot gets Let's Encrypt certificate
   - Nginx configured for HTTPS
   - Automatic renewal scheduled

### **Phase 3: Runtime**
1. **Traffic Flow**:
   ```
   User → api.auto-hive.site → Elastic IP → EC2:80/443 → Nginx → Backend:5000
   ```

2. **SSL Handling**:
   - HTTP (port 80) → Redirects to HTTPS
   - HTTPS (port 443) → Serves application
   - Certificates auto-renew every 2 months

## 📁 **File Structure on EC2**

```
/opt/mama-app/
├── docker-compose.yml      # Container orchestration
├── nginx.conf             # Nginx configuration
├── .env                   # Environment variables
├── fetch-secrets.sh       # Parameter Store integration
├── startup.sh            # Application startup
├── renew-certs.sh        # SSL renewal
├── certs/                # SSL certificates
│   └── live/
│       └── api.auto-hive.site/
│           ├── fullchain.pem
│           └── privkey.pem
├── logs/                 # Application logs
└── webroot/             # Let's Encrypt challenges
```

## 🔒 **Security Features**

### **Network Security**
- **Security Group**: Only ports 22 (SSH), 80 (HTTP), 443 (HTTPS) open
- **VPC**: Instance in public subnet with controlled access
- **SSL/TLS**: End-to-end encryption with Let's Encrypt

### **Application Security**
- **Nginx Rate Limiting**: 10 requests/second per IP
- **Security Headers**: HSTS, XSS protection, frame options
- **Secrets Management**: AWS Parameter Store integration

### **Access Control**
- **IAM Roles**: Least privilege access to ECR and Parameter Store
- **SSH Access**: Configurable IP restrictions
- **Container Isolation**: Docker containers with minimal privileges

## 💰 **Cost Breakdown**

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| EC2 t3.micro | $8.50 | 750 hours free tier eligible |
| EBS 20GB gp3 | $2.00 | Storage for OS and containers |
| Elastic IP | $0.00 | Free when attached to instance |
| Data Transfer | ~$1-3 | Minimal for API traffic |
| **Total** | **~$11.50** | **vs $35-45 with ECS+ALB** |

## 🔄 **Deployment Process**

### **Initial Deployment**
```bash
# 1. Deploy infrastructure
cd iac/environments/dev
terraform init
terraform plan
terraform apply

# 2. Get Elastic IP
terraform output ec2_elastic_ip

# 3. Update DNS
# Point api.auto-hive.site to the Elastic IP

# 4. Deploy frontend
cd ../../scripts
./deploy-frontend.sh
```

### **Application Updates**
```bash
# 1. Build and push new image
cd scripts
./build-and-push.sh

# 2. Update EC2 (via GitHub Actions or manual)
ssh ubuntu@<elastic-ip>
cd /opt/mama-app
docker-compose pull backend
docker-compose restart backend
```

## 🔍 **Monitoring & Maintenance**

### **Health Checks**
- **Application**: `/health` endpoint
- **SSL**: Certificate expiration monitoring
- **System**: EC2 CloudWatch metrics

### **Logs**
- **Application**: Docker container logs
- **Nginx**: Access and error logs
- **System**: EC2 system logs

### **Backups**
- **EBS Snapshots**: Automated daily backups
- **Configuration**: Terraform state backup
- **Certificates**: Let's Encrypt auto-renewal

## 🚨 **Troubleshooting**

### **Common Issues**

1. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   docker-compose exec nginx nginx -t
   
   # Renew manually if needed
   ./renew-certs.sh
   ```

2. **Backend Not Starting**
   ```bash
   # Check logs
   docker-compose logs backend
   
   # Restart service
   docker-compose restart backend
   ```

3. **Nginx Configuration**
   ```bash
   # Test configuration
   docker-compose exec nginx nginx -t
   
   # Reload configuration
   docker-compose exec nginx nginx -s reload
   ```

## ✅ **Benefits of This Setup**

1. **Cost Effective**: 60-80% cost reduction
2. **Simple**: Single EC2 instance, easy to manage
3. **Reliable**: Elastic IP prevents DNS issues
4. **Secure**: SSL/TLS with automatic renewal
5. **Scalable**: Can add more instances later
6. **Maintainable**: Standard Docker Compose setup

## 🎯 **Next Steps**

1. **Deploy the infrastructure**:
   ```bash
   terraform apply
   ```

2. **Update DNS** to point to Elastic IP

3. **Test the application**:
   ```bash
   curl https://api.auto-hive.site/health
   ```

4. **Deploy frontend** with updated API URL

5. **Monitor and maintain** the setup

This setup provides a robust, cost-effective solution for your maternity companion app with automatic SSL management and zero-downtime deployments!

