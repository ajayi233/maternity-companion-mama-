data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Parameter Store for secrets and config
module "parameter_store" {
  source = "../../modules/parameter-store"
  
  project_name = var.project_name
  environment  = var.environment
  
  secrets = {
    "backend/mongodb-uri"         = var.mongodb_uri
    "backend/jwt-secret"          = var.jwt_secret
    "backend/jwt-refresh-secret"  = var.jwt_refresh_secret
    "backend/mnotify-api-key"     = var.mnotify_api_key
    "backend/serpapi-key"         = var.serpapi_key
  }
  
  backend_config = {
    "port"                              = "5000"
    "node-env"                          = "production"
    "jwt-expires-in"                    = "15m"
    "jwt-refresh-expires-in"            = "7d"
    "bcrypt-rounds"                     = "12"
    "rate-limit-window-ms"              = "900000"
    "rate-limit-max-requests"           = "100"
    "api-rate-limit"                    = "100"
    "mnotify-sender-id"                 = "MAMA AI APP"
    "mnotify-base-url"                  = "https://api.mnotify.com/api"
    "sms-simulation-mode"               = "false"
    "cors-origin"                       = "https://auto-hive.site"
    "password-reset-expires-minutes"    = "10"
    "cookie-expires-in"                 = "7"
    "default-location"                  = "Ahodwo, Ashanti Region, Ghana"
  }
  
  frontend_config = {
    "app-name"        = "MAMA"
    "app-version"     = "1.0.0"
    "app-description" = "AI-powered maternal health companion for Ghana"
    "api-version"     = "v1"
    "node-env"        = "production"
  }
  
  frontend_secrets = {
    "google-maps-api-key"         = var.google_maps_api_key
    "ghana-nlp-api-base-url"      = var.ghana_nlp_api_base_url
    "ghana-nlp-subscription-key"  = var.ghana_nlp_subscription_key
  }
}

# IAM roles
module "iam" {
  source = "../../modules/iam"
  
  project_name          = var.project_name
  environment           = var.environment
  region                = data.aws_region.current.name
  account_id            = data.aws_caller_identity.current.account_id
  github_repositories   = var.github_repositories
  create_oidc_provider  = false  # OIDC provider already exists in account
}

# ECR repository
module "ecr" {
  source = "../../modules/ecr"
  
  project_name = var.project_name
  environment  = var.environment
}

# Shared infrastructure (VPC, subnets, NAT)
module "shared" {
  source = "../../modules/shared"
  
  project_name           = var.project_name
  environment            = var.environment
  region                 = data.aws_region.current.name
  vpc_cidr               = var.vpc_cidr
  availability_zones     = var.availability_zones
  create_private_subnets = true  # Enable private subnets for prod
}

# Security Groups
module "security_groups" {
  source = "../../modules/security-groups"
  
  project_name     = var.project_name
  environment      = var.environment
  vpc_id           = module.shared.vpc_id
  create_ec2_sg    = false  # Prod doesn't use EC2
  create_alb_sg    = true
  create_ecs_sg    = true
  ecs_port         = 5000
  ec2_app_port     = 5000
  ssh_cidr_blocks  = ["0.0.0.0/0"]   #not needed for prod(used by ec2)
}

# ALB for backend
module "alb" {
  source = "../../modules/alb"
  
  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.shared.vpc_id
  public_subnet_ids = module.shared.public_subnet_ids
  security_group_id = module.security_groups.alb_security_group_id
  
  depends_on = [module.security_groups]
}

# ECS Fargate for backend
module "ecs" {
  source = "../../modules/ecs"
  
  project_name           = var.project_name
  environment            = var.environment
  region                 = data.aws_region.current.name
  account_id             = data.aws_caller_identity.current.account_id
  vpc_id                 = module.shared.vpc_id
  subnet_ids             = module.shared.private_subnet_ids
  execution_role_arn     = module.iam.ecs_task_execution_role_arn
  task_role_arn          = module.iam.ecs_task_role_arn
  backend_image          = var.backend_image
  backend_cpu            = var.backend_cpu
  backend_memory         = var.backend_memory
  backend_desired_count  = var.backend_desired_count
  backend_min_count      = var.backend_min_count
  backend_max_count      = var.backend_max_count
  target_group_arn       = module.alb.target_group_arn
  security_group_id      = module.security_groups.ecs_security_group_id
  alb_listener_arn       = module.alb.listener_arn
  
  backend_secrets = [
    "mongodb-uri",
    "jwt-secret",
    "jwt-refresh-secret",
    "mnotify-api-key",
    "serpapi-key"
  ]
  
  backend_config = [
    "port",
    "node-env",
    "jwt-expires-in",
    "jwt-refresh-expires-in",
    "bcrypt-rounds",
    "rate-limit-window-ms",
    "rate-limit-max-requests",
    "api-rate-limit",
    "mnotify-sender-id",
    "mnotify-base-url",
    "sms-simulation-mode",
    "cors-origin",
    "password-reset-expires-minutes",
    "cookie-expires-in",
    "default-location"
  ]
  
  depends_on = [module.parameter_store, module.alb, module.security_groups]
}

# CloudFront for frontend
module "cloudfront" {
  source = "../../modules/cloudfront"
  
  project_name = var.project_name
  environment  = var.environment
  domain_name  = "auto-hive.site"
}
