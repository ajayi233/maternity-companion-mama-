# MAMA App - Deployment Guide

## Prerequisites
- AWS CLI configured with appropriate permissions
- Terraform installed
- Docker installed
- Node.js/npm installed

## Deployment Flow

### Phase 1: Foundation Infrastructure
```bash
cd iac/environments/dev
```

**Step 1.1: Comment out dependent modules in main.tf**
```hcl
# Comment out these modules initially:
# module "alb" { ... }
# module "ecs" { ... }  
# module "cloudfront" { ... }
```

**Step 1.2: Update secrets in terraform.tfvars**
```hcl
aws_account_id = "YOUR_ACTUAL_ACCOUNT_ID"
mongodb_uri = "YOUR_MONGODB_URI"
jwt_secret = "YOUR_JWT_SECRET"
jwt_refresh_secret = "YOUR_JWT_REFRESH_SECRET"
mnotify_api_key = "YOUR_MNOTIFY_API_KEY"
google_maps_api_key = "YOUR_GOOGLE_MAPS_API_KEY"
```

**Step 1.3: Deploy foundation**
```bash
terraform init
terraform plan
terraform apply
```
*Deploys: Parameter Store, IAM roles, ECR, VPC, subnets*

### Phase 2: Application Load Balancer
**Step 2.1: Uncomment ALB module in main.tf**
```hcl
module "alb" {
  # ... uncomment this block
}
```

**Step 2.2: Deploy ALB**
```bash
terraform plan
terraform apply
```

**Step 2.3: Uncomment ALB outputs in outputs.tf**
```hcl
output "alb_dns_name" {
  description = "ALB DNS name for backend API"
  value       = module.alb.alb_dns_name
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${module.alb.alb_dns_name}/api"
}
```

**Step 2.4: Apply to get outputs**
```bash
terraform apply
```

### Phase 3: Backend Application
**Step 3.1: Build and push backend image**
```bash
cd ../../../
./scripts/build-and-push.sh
```

**Step 3.2: Update terraform.tfvars with actual image URI**
```hcl
backend_image = "ACCOUNT_ID.dkr.ecr.-west-2.amazonaws.com/mama-app-dev-backend:latest"
```

**Step 3.3: Uncomment ECS module in main.tf**
```hcl
module "ecs" {
  # ... uncomment this block
}
```

**Step 3.4: Deploy ECS**
```bash
cd iac/environments/dev
terraform plan
terraform apply
```

**Step 3.5: Uncomment ECS outputs in outputs.tf**
```hcl
output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}
```

**Step 3.6: Apply to get outputs**
```bash
terraform apply
```

### Phase 4: Frontend
**Step 4.1: Uncomment CloudFront module in main.tf**
```hcl
module "cloudfront" {
  # ... uncomment this block
}
```

**Step 4.2: Deploy CloudFront**
```bash
terraform plan
terraform apply
```

**Step 4.3: Uncomment CloudFront outputs in outputs.tf**
```hcl
output "frontend_url" {
  description = "Frontend CloudFront URL"
  value       = "https://${module.cloudfront.cloudfront_domain_name}"
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.cloudfront.s3_bucket_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.cloudfront_distribution_id
}
```

**Step 4.4: Apply to get outputs**
```bash
terraform apply
```

**Step 4.5: Deploy frontend**
```bash
cd ../../../
./scripts/deploy-frontend.sh
```

*Note: No parameters needed - uses custom domain `https://api.auto-hive.site/api`*

## Verification
- **Backend Health**: `https://api.auto-hive.site/api/health`
- **Frontend**: `https://auto-hive.site` or `https://d22zv3iyoc3zl5.cloudfront.net/`
- **Logs**: Check CloudWatch logs for any issues

## Rollback Strategy
If any phase fails, comment out the failing module and run `terraform apply` to rollback.

## Environment Variables Handled
- **Backend**: All secrets and config stored in AWS Parameter Store
- **Frontend**: Config fetched from Parameter Store during build
- **ECS**: Pulls environment variables from Parameter Store at runtime

## Useful Commands
```bash
# Get AWS Account ID
aws sts get-caller-identity --query Account --output text

# Get ALB DNS
terraform output -raw alb_dns_name

# Get CloudFront URL
terraform output -raw frontend_url

# Test custom domains
curl https://api.auto-hive.site/api/health
open https://auto-hive.site
```