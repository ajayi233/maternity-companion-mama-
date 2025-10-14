# Deployment Guide - MAMA Health Platform

## Overview

This guide covers the complete deployment process for the MAMA platform, from local development to production deployment on AWS. The platform uses a modern DevOps approach with Infrastructure as Code (Terraform) and Configuration Management (Ansible).

## Prerequisites

### Required Tools

| Tool | Version | Installation |
|------|---------|-------------|
| **Terraform** | ≥ 1.0 | [Download](https://www.terraform.io/downloads) |
| **AWS CLI** | ≥ 2.0 | [Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) |
| **Docker** | ≥ 20.0 | [Install Guide](https://docs.docker.com/get-docker/) |
| **Node.js** | ≥ 18.0 | [Download](https://nodejs.org/) |
| **Ansible** | ≥ 2.9 | `pip install ansible` |

### AWS Account Setup

1. **Create AWS Account** with appropriate permissions
2. **Configure AWS CLI**:
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, and region
   ```
3. **Verify AWS Access**:
   ```bash
   aws sts get-caller-identity
   ```

### Domain Configuration

1. **Purchase Domain** (e.g., from Route 53 or external registrar)
2. **Update DNS** to point to AWS Route 53 (if using external registrar)
3. **Configure Environment Variables** with your domain name

## Environment Setup

### Development Environment

#### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd maternity-companion-mama-/backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/mama-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# SMS Service
MNOTIFY_API_KEY=your-mnotify-api-key
MNOTIFY_SENDER_ID=MAMA-APP

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Frontend Environment Variables:**
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_APP_NAME=MAMA Health Ghana
VITE_ENABLE_VOICE_CHAT=true
```

#### Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Production Deployment

### Phase 1: Infrastructure Bootstrap

#### 1. Initialize Terraform State
```bash
cd iac/state-bootstrap

# Initialize Terraform
terraform init

# Create state bucket and DynamoDB table
terraform apply -auto-approve

# Note the outputs for main configuration
terraform output
```

#### 2. Configure Main Environment
```bash
cd ../environments/dev

# Copy terraform variables template
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

**Required Terraform Variables:**
```hcl
# Project Configuration
project_name = "mama-app"
environment  = "dev"
region      = "eu-west-1"

# Domain Configuration
domain_name = "your-domain.com"
api_subdomain = "api"
frontend_subdomain = "www"

# Network Configuration
vpc_cidr = "10.0.0.0/16"
availability_zones = ["eu-west-1a", "eu-west-1b"]

# Instance Configuration
instance_type = "t3.micro"
key_pair_name = "mama-app-key"

# Application Configuration
backend_image = "615299752577.dkr.ecr.eu-west-1.amazonaws.com/mama-app-dev-backend:latest"

# Secrets (store in AWS Parameter Store)
mongodb_uri = "your-mongodb-atlas-connection-string"
jwt_secret = "your-production-jwt-secret"
jwt_refresh_secret = "your-production-refresh-secret"
mnotify_api_key = "your-mnotify-api-key"
google_maps_api_key = "your-google-maps-api-key"
```

### Phase 2: Deploy Basic Infrastructure

#### 1. Deploy Foundation Components
```bash
# Ensure only basic modules are uncommented in main.tf
# ✅ module "parameter_store"
# ✅ module "iam"
# ✅ module "ecr"
# ✅ module "shared"

terraform init
terraform plan
terraform apply -auto-approve
```

**Expected Resources:** ~48 resources including VPC, IAM roles, ECR repository, Parameter Store

#### 2. Build and Push Backend Image
```bash
cd ../../../scripts

# Make script executable
chmod +x build-and-push.sh

# Build and push Docker image
./build-and-push.sh

# Note the image URI for terraform.tfvars
```

### Phase 3: Deploy Application Load Balancer

#### 1. Uncomment ALB Module
```bash
cd ../iac/environments/dev

# Edit main.tf to uncomment:
# module "alb" {
#   source = "../../modules/alb"
#   ...
# }

# Edit outputs.tf to uncomment ALB outputs
```

#### 2. Deploy ALB
```bash
terraform plan
terraform apply -auto-approve
```

**Expected Output:** ALB with SSL certificate and target groups

### Phase 4: Deploy Backend Application

#### 1. Uncomment ECS Module
```bash
# Edit main.tf to uncomment:
# module "ecs" {
#   source = "../../modules/ecs"
#   ...
# }

# Update terraform.tfvars with correct backend image URI
backend_image = "615299752577.dkr.ecr.eu-west-1.amazonaws.com/mama-app-dev-backend:latest"
```

#### 2. Deploy ECS Service
```bash
terraform plan
terraform apply -auto-approve
```

**Expected Output:** ECS cluster with running backend service

#### 3. Verify Backend Deployment
```bash
# Check service status
aws ecs describe-services --cluster mama-app-dev --services mama-app-dev-backend

# Test API endpoint
curl https://api.your-domain.com/health
```

### Phase 5: Deploy Frontend Application

#### 1. Uncomment CloudFront Module
```bash
# Edit main.tf to uncomment:
# module "cloudfront" {
#   source = "../../modules/cloudfront"
#   ...
# }
```

#### 2. Deploy CloudFront and S3
```bash
terraform plan
terraform apply -auto-approve
```

#### 3. Build and Deploy Frontend
```bash
cd ../../../scripts

# Make script executable
chmod +x deploy-frontend.sh

# Deploy frontend to S3
./deploy-frontend.sh
```

#### 4. Verify Frontend Deployment
```bash
# Test frontend URL
curl https://your-domain.com

# Check CloudFront distribution
aws cloudfront list-distributions
```

### Phase 6: Final Configuration

#### 1. Update IAM Dependencies
```bash
# Edit main.tf to add CloudFront bucket dependency to IAM module
# frontend_bucket_arn = module.cloudfront.s3_bucket_arn
# depends_on = [module.cloudfront]

terraform plan
terraform apply -auto-approve
```

#### 2. Configure DNS (if using external registrar)
```bash
# Get Route 53 name servers
aws route53 get-hosted-zone --id <hosted-zone-id>

# Update your domain registrar's DNS settings with these name servers
```

## Alternative Deployment: EC2 with Ansible

### 1. Deploy EC2 Infrastructure
```bash
# Use EC2 module instead of ECS
# Edit main.tf to use:
# module "ec2" {
#   source = "../../modules/ec2"
#   ...
# }

terraform apply -auto-approve
```

### 2. Configure with Ansible
```bash
cd ../../../devops/ansible

# Update inventory with EC2 instance IP
nano inventory/hosts.yml

# Deploy application
ansible-playbook -i inventory/hosts.yml playbooks/site.yml
```

### 3. Ansible Deployment Commands
```bash
cd scripts

# Setup server (first time only)
./ansible-deploy.sh setup

# Deploy application updates
./ansible-deploy.sh deploy

# Check application status
./ansible-deploy.sh status

# View logs
./ansible-deploy.sh logs
```

## CI/CD Pipeline Setup

### GitHub Actions Configuration

#### 1. Setup GitHub Secrets
```bash
# In your GitHub repository, add these secrets:
AWS_ROLE_ARN=arn:aws:iam::ACCOUNT:role/mama-app-dev-github-actions-role
AWS_REGION=eu-west-1
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
MNOTIFY_API_KEY=your-mnotify-key
```

#### 2. Workflow Files
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy MAMA Platform

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install backend dependencies
        run: |
          cd backend
          npm ci
          
      - name: Run backend tests
        run: |
          cd backend
          npm test
          
      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build frontend
        run: |
          cd frontend
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    permissions:
      id-token: write
      contents: read
      
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ secrets.AWS_REGION }}
          
      - name: Build and push backend image
        run: |
          cd scripts
          ./build-and-push.sh
          
      - name: Deploy infrastructure
        run: |
          cd iac/environments/dev
          terraform init
          terraform apply -auto-approve
          
      - name: Deploy frontend
        run: |
          cd scripts
          ./deploy-frontend.sh
```

## Monitoring and Health Checks

### Application Health Checks

#### Backend Health Check
```bash
# Health endpoint
curl https://api.your-domain.com/health

# Expected response:
{
  "success": true,
  "message": "MAMA Backend API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "uptime": 3600,
  "database": "connected"
}
```

#### Frontend Health Check
```bash
# Frontend availability
curl -I https://your-domain.com

# Expected: HTTP 200 OK
```

### CloudWatch Monitoring

#### Key Metrics to Monitor
- **EC2/ECS CPU Utilization**: < 80%
- **Memory Utilization**: < 80%
- **API Response Time**: < 500ms
- **Error Rate**: < 1%
- **Database Connections**: Monitor connection pool

#### CloudWatch Alarms
```bash
# Create CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "mama-app-high-cpu" \
  --alarm-description "High CPU utilization" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## Backup and Disaster Recovery

### Database Backup
```bash
# MongoDB Atlas automatic backups are enabled
# For self-hosted MongoDB:
mongodump --uri="mongodb://localhost:27017/mama-app" --out=/backup/$(date +%Y%m%d)
```

### Infrastructure Backup
```bash
# Terraform state is backed up in S3
# EBS snapshots are automated via DLM policy
aws dlm get-lifecycle-policies
```

### Application Code Backup
- **Git Repository**: Primary source of truth
- **Docker Images**: Stored in ECR with lifecycle policies
- **Frontend Assets**: Versioned in S3 with versioning enabled

## Troubleshooting

### Common Deployment Issues

#### 1. Terraform State Lock
```bash
# If terraform apply fails with state lock error:
terraform force-unlock <lock-id>
```

#### 2. Docker Build Failures
```bash
# Check Docker daemon
docker info

# Clean Docker cache
docker system prune -a

# Rebuild with no cache
docker build --no-cache -t mama-backend .
```

#### 3. ECS Service Won't Start
```bash
# Check ECS service events
aws ecs describe-services --cluster mama-app-dev --services mama-app-dev-backend

# Check CloudWatch logs
aws logs tail /ecs/mama-app-dev --follow

# Check task definition
aws ecs describe-task-definition --task-definition mama-app-dev-backend
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
aws acm list-certificates

# Check DNS validation records
aws route53 list-resource-record-sets --hosted-zone-id <zone-id>
```

#### 5. Frontend Not Loading
```bash
# Check S3 bucket contents
aws s3 ls s3://mama-app-dev-frontend/

# Check CloudFront distribution
aws cloudfront get-distribution --id <distribution-id>

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

### Performance Optimization

#### Backend Optimization
```bash
# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s https://api.your-domain.com/health

# Check database performance
# MongoDB Atlas provides built-in performance monitoring
```

#### Frontend Optimization
```bash
# Analyze bundle size
cd frontend
npm run build
npx webpack-bundle-analyzer dist/static/js/*.js

# Check Lighthouse scores
npx lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

## Security Checklist

### Pre-Deployment Security
- [ ] All secrets stored in AWS Parameter Store
- [ ] No hardcoded credentials in code
- [ ] HTTPS enforced for all endpoints
- [ ] Security groups follow least privilege
- [ ] IAM roles have minimal required permissions
- [ ] Database access restricted to application only

### Post-Deployment Security
- [ ] SSL certificates are valid and auto-renewing
- [ ] API rate limiting is active
- [ ] CloudWatch logging is enabled
- [ ] Security headers are configured
- [ ] Regular security updates scheduled

## Cost Optimization

### Current Monthly Costs (Estimated)
```
EC2 t3.micro:           $8.50
Elastic IP:             $3.65
EBS Storage (20GB):     $2.00
Route 53 Hosted Zone:   $0.50
CloudFront:             $1.00
Data Transfer:          $2.00
CloudWatch:             $0.00 (free tier)
Parameter Store:        $0.00 (free tier)

Total:                  ~$17.65/month
```

### Cost Optimization Tips
1. **Use Reserved Instances** for predictable workloads (30-40% savings)
2. **Enable Auto Scaling** to scale down during low usage
3. **Monitor Data Transfer** costs and optimize
4. **Use CloudFront** to reduce origin server load
5. **Set up billing alerts** to monitor costs

This deployment guide provides comprehensive instructions for deploying the MAMA platform from development to production, including troubleshooting and optimization strategies.