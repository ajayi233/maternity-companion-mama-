# Production Deployment Guide

## Overview

This document outlines the deployment process for the MAMA App production environment using ECS Fargate, ALB, and CloudFront.

## Architecture

### Production Infrastructure

```
Internet → CloudFront (auto-hive.site) → S3 (Frontend)
Internet → ALB (api.auto-hive.site) → ECS Fargate (Backend)
```

### Key Components

- **VPC**: 10.1.0.0/16 with public and private subnets
- **ALB**: Application Load Balancer with SSL termination
- **ECS Fargate**: Containerized backend with auto-scaling
- **CloudFront**: Global CDN for frontend
- **S3**: Static website hosting
- **NAT Gateway**: Single AZ for cost optimization
- **Route53**: DNS management

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. Terraform installed
3. Docker installed (for building images)
4. GitHub repository with OIDC configured

## Deployment Steps

### 1. Initialize Production Environment

```bash
cd /iac/environments/prod
terraform init
```

### 2. Plan Infrastructure

```bash
terraform plan
```

### 3. Apply Infrastructure

```bash
terraform apply
```

### 4. Build and Push Backend Image

```bash
# Build Docker image
cd ../../backend
docker build -t mama-app-prod-backend:latest .

# Tag for ECR
docker tag mama-app-prod-backend:latest 615299752577.dkr.ecr.eu-west-1.amazonaws.com/mama-app-prod-backend:latest

# Push to ECR
aws ecr get-login-password --region eu-west-1 --profile cloud-crew-profile | docker login --username AWS --password-stdin 615299752577.dkr.ecr.eu-west-1.amazonaws.com
docker push 615299752577.dkr.ecr.eu-west-1.amazonaws.com/mama-app-prod-backend:latest
```

### 5. Deploy Frontend

```bash
# Build frontend
cd ../frontend
npm install
npm run build

# Deploy to S3
aws s3 sync dist/ s3://$(terraform output -raw s3_bucket_name) --delete --profile cloud-crew-profile

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id $(terraform output -raw cloudfront_distribution_id) --paths "/*" --profile cloud-crew-profile
```

## Configuration

### Environment Variables

Production uses AWS Parameter Store for configuration:

- **Backend Secrets**: `/mama-app/prod/backend/*`
- **Frontend Config**: `/mama-app/prod/frontend/*`

### Auto-Scaling

ECS service auto-scales based on CPU utilization:

- **Target**: 70% CPU utilization
- **Min Tasks**: 1
- **Max Tasks**: 4
- **Scale Out Cooldown**: 60 seconds
- **Scale In Cooldown**: 300 seconds

## Monitoring

### CloudWatch Logs

- **ECS Logs**: `/ecs/mama-app-prod-backend`
- **ALB Logs**: Available in S3 (if enabled)

### Health Checks

- **ALB Health Check**: `/health` endpoint
- **ECS Health Check**: Container health check

## Cost Estimation

### Monthly Costs (Approximate)

- **ECS Fargate**: ~$30-50 (2 tasks, 512 CPU, 1024 MB)
- **ALB**: ~$16
- **NAT Gateway**: ~$35
- **CloudFront**: ~$1-5
- **S3**: ~$1-2
- **Route53**: ~$0.50

**Total**: ~$85-110/month

## Security

### Network Security

- **Private Subnets**: ECS tasks in private subnets
- **Security Groups**: Restrictive ingress/egress rules
- **SSL/TLS**: End-to-end encryption

### Access Control

- **IAM Roles**: Least privilege access
- **OIDC**: GitHub Actions authentication
- **Parameter Store**: Encrypted secrets

## Troubleshooting

### Common Issues

1. **ECS Tasks Not Starting**

   - Check IAM roles and permissions
   - Verify container image exists in ECR
   - Check security group rules

2. **ALB Health Check Failures**

   - Verify backend is running on port 5000
   - Check security group allows ALB traffic
   - Verify health check path

3. **CloudFront Not Updating**
   - Check S3 bucket permissions
   - Verify CloudFront distribution settings
   - Check cache invalidation

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster mama-app-prod-cluster --services mama-app-prod-backend

# View ECS logs
aws logs tail /ecs/mama-app-prod-backend --follow

# Check ALB target health
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

## Rollback Procedures

### Infrastructure Rollback

```bash
cd /iac/environments/prod
terraform destroy
```

### Application Rollback

```bash
# Revert to previous ECS task definition
aws ecs update-service --cluster mama-app-prod-cluster --service mama-app-prod-backend --task-definition <previous-task-definition>
```

## Maintenance

### Regular Tasks

1. **Security Updates**: Update base images monthly
2. **Certificate Renewal**: ACM certificates auto-renew
3. **Log Rotation**: CloudWatch logs auto-expire after 7 days
4. **Cost Monitoring**: Review costs monthly

### Scaling

To increase capacity:

1. Update `backend_max_count` in terraform.tfvars
2. Run `terraform apply`
3. Monitor CPU utilization

## Support

For issues or questions:

1. Check CloudWatch logs
2. Review Terraform state
3. Verify AWS service status
4. Contact development team
