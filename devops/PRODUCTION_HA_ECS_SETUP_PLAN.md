# Production High Availability ECS Environment Setup

## Architecture Overview

Production will use a completely different architecture than dev for high availability:

- **VPC**: Multi-AZ with 4 subnets (2 public + 2 private across 2 AZs)
- **Backend**: ECS Fargate cluster with ALB, auto-scaling (1-5 tasks), running in private subnets with NAT Gateway
- **Frontend**: S3 + CloudFront with custom domain
- **SSL**: ACM certificates for both frontend and backend
- **Domains**: `auto-hive.site` (frontend), `prod-api.auto-hive.site` (backend ALB)

## Key Differences from Dev

| Component | Dev                      | Prod                                                   |
| --------- | ------------------------ | ------------------------------------------------------ |
| Backend   | Single EC2 t3.micro      | ECS Fargate + ALB + Auto-scaling                       |
| Network   | 1 AZ, public subnet only | 2 AZs, public + private subnets, NAT Gateway           |
| Secrets   | Parameter Store (SSM)    | AWS Secrets Manager                                    |
| Scaling   | None                     | Auto-scales 1-5 tasks based on traffic                 |
| Cost      | ~$10/month               | ~$60-75/month (ALB $16 + NAT $32 + ECS ~$10-20 + misc) |

## Implementation Steps

### 1. Create Production Environment Directory

Create `/home/ali/all-dev/hackathon/maternity-companion-mama-/iac/environments/prod/` with:

- `main.tf` - Module orchestration (different from dev)
- `variables.tf` - Production-specific variables
- `terraform.tfvars` - Production values (secrets, domain names)
- `backend.tf` - S3 state backend (key: "prod/terraform.tfstate")
- `provider.tf` - AWS provider configuration
- `outputs.tf` - Production outputs

### 2. Update Shared Module for Multi-AZ with Private Subnets

Modify `/home/ali/all-dev/hackathon/maternity-companion-mama-/iac/modules/shared/main.tf`:

- Add private subnet creation (2 private subnets across 2 AZs)
- Add NAT Gateway in public subnets for private subnet internet access
- Add private route tables pointing to NAT Gateway
- Make this configurable so dev remains unchanged

### 3. Update ALB Module for Production SSL

Modify `/home/ali/all-dev/hackathon/maternity-companion-mama-/iac/modules/alb/`:

- Add ACM certificate for `prod-api.auto-hive.site` in `ssl.tf`
- Add Route53 validation records
- Update listener to use HTTPS (port 443) with ACM certificate
- Add HTTP to HTTPS redirect listener
- Configure health checks for `/health` endpoint

### 4. Update ECS Module for Auto-Scaling

Modify `/home/ali/all-dev/hackathon/maternity-companion-mama-/iac/modules/ecs/main.tf`:

- Configure service to run in private subnets
- Set `desired_count` to 1, use Application Auto Scaling
- Add `aws_appautoscaling_target` (min: 1, max: 5)
- Add `aws_appautoscaling_policy` for CPU-based scaling (target: 70%)
- Add `aws_appautoscaling_policy` for memory-based scaling (target: 80%)
- Update security group to allow traffic from ALB only
- Remove public IP assignment (tasks in private subnets)
- Update task definition to use Secrets Manager instead of Parameter Store

### 5. Update CloudFront Module for Production Domain

Modify `/home/ali/all-dev/hackathon/maternity-companion-mama-/iac/modules/cloudfront/`:

- Make domain configurable via variables
- Update `ssl.tf` to support multiple domains (dev: auto-hive.site, prod: auto-hive.site)
- Add conditional Route53 record creation based on environment

### 6. Create Secrets Manager Module for Production

Create new module `/home/ali/all-dev/hackathon/maternity-companion-mama-/iac/modules/secrets-manager/`:

- `main.tf` - Create `aws_secretsmanager_secret` and `aws_secretsmanager_secret_version` resources
- `variables.tf` - Accept secrets map, backend/frontend config
- `outputs.tf` - Output secret ARNs for ECS task definition

Dev will continue using Parameter Store (SSM), Prod will use Secrets Manager for better secret rotation and auditing capabilities.

### 7. Create Production Main Configuration

In `iac/environments/prod/main.tf`:

- Use `shared` module with `create_nat_gateway = true` and `create_private_subnets = true`
- Use `alb` module (not used in dev)
- Use `ecs` module with auto-scaling configuration (not used in dev)
- Use `cloudfront` module with prod domain
- Use `secrets-manager` module for production secrets (instead of parameter-store)
- Use `ecr` module (shared repository or separate prod repo)
- Use `iam` module for ECS task roles and GitHub Actions with Secrets Manager permissions

### 8. Configure Production Variables

In `iac/environments/prod/terraform.tfvars`:

- `environment = "prod"`
- `vpc_cidr = "10.1.0.0/16"` (different from dev)
- `availability_zones = ["eu-west-1a", "eu-west-1b"]`
- `create_nat_gateway = true`
- `backend_image` pointing to ECR
- Production MongoDB URI (separate database)
- Production API keys and secrets
- `backend_desired_count = 1`
- `backend_min_count = 1`
- `backend_max_count = 5`

### 9. Update Backend State Configuration

In `iac/environments/prod/backend.tf`:

- Point to S3 bucket: `cloud-crew-terraform-state-2025`
- Use key: `prod/terraform.tfstate`
- Enable encryption and locking

### 10. Update IAM Module for Secrets Manager

Modify `/home/ali/all-dev/hackathon/maternity-companion-mama-/iac/modules/iam/main.tf`:

- Add Secrets Manager read permissions to ECS task execution role
- Add Secrets Manager permissions to GitHub Actions role for production
- Keep Parameter Store permissions for dev environment

### 11. Testing & Validation

- Run `terraform plan` in prod environment
- Review all resources being created (VPC, NAT, ALB, ECS, CloudFront, ACM certs)
- Verify estimated costs with Infracost
- Apply infrastructure
- Validate DNS propagation
- Test auto-scaling by generating load

### 12. Update CI/CD for Production

- Update GitHub Actions to deploy to prod environment
- Add separate workflow for production deployments
- Configure ECS service updates via GitHub Actions

## Files to Create/Modify

**New Files:**

- `iac/environments/prod/main.tf`
- `iac/environments/prod/variables.tf`
- `iac/environments/prod/terraform.tfvars`
- `iac/environments/prod/backend.tf`
- `iac/environments/prod/provider.tf`
- `iac/environments/prod/outputs.tf`
- `iac/modules/secrets-manager/main.tf`
- `iac/modules/secrets-manager/variables.tf`
- `iac/modules/secrets-manager/outputs.tf`

**Modify:**

- `iac/modules/shared/main.tf` - Add private subnets and NAT Gateway
- `iac/modules/shared/variables.tf` - Add NAT/private subnet flags
- `iac/modules/shared/outputs.tf` - Output private subnet IDs
- `iac/modules/ecs/main.tf` - Add auto-scaling resources and Secrets Manager support
- `iac/modules/ecs/variables.tf` - Add auto-scaling variables
- `iac/modules/alb/ssl.tf` - Add ACM certificate for prod-api
- `iac/modules/cloudfront/main.tf` - Make domain configurable
- `iac/modules/cloudfront/ssl.tf` - Support auto-hive.site
- `iac/modules/cloudfront/variables.tf` - Add domain variables
- `iac/modules/iam/main.tf` - Add Secrets Manager permissions

## Cost Estimation

- **EC2 NAT Gateway**: ~$32/month (per AZ: $0.045/hr)
- **Application Load Balancer**: ~$16/month
- **ECS Fargate**: ~$10-20/month (1 task baseline, scales to 5)
- **CloudFront + S3**: ~$1-5/month (usage-based)
- **Secrets Manager**: ~$0.40/month per secret (~$3/month for ~7 secrets)
- **Data Transfer**: Variable
- **Total**: ~$60-75/month baseline

## Security Considerations

- ECS tasks run in private subnets (no direct internet access)
- NAT Gateway for outbound connectivity only
- ALB in public subnet with security groups
- ACM certificates for all HTTPS traffic
- AWS Secrets Manager for production secrets (better rotation, auditing, encryption)
- IAM roles with least privilege
- Separate VPC CIDR from dev to avoid conflicts

## To-dos

- [ ] Create production environment directory structure with all Terraform files
- [ ] Create Secrets Manager module for production secret management
- [ ] Update shared module to support private subnets and NAT Gateway for production
- [ ] Update ALB module with ACM certificate and HTTPS configuration for prod-api.auto-hive.site
- [ ] Update ECS module with auto-scaling configuration (1-5 tasks) and private subnet support
- [ ] Update CloudFront module to support auto-hive.site domain configuration
- [ ] Update IAM module to add Secrets Manager permissions for production
- [ ] Create production terraform.tfvars with all production-specific values and secrets
- [ ] Run terraform plan and validate all resources for production environment
