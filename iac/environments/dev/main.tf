data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Parameter Store for secrets
module "parameter_store" {
  source = "../../modules/parameter-store"

  project_name = var.project_name
  environment  = var.environment

  secrets = {
    "backend/mongodb-uri"           = var.mongodb_uri
    "backend/jwt-secret"           = var.jwt_secret
    "backend/jwt-refresh-secret"   = var.jwt_refresh_secret
    "backend/mnotify-api-key"      = var.mnotify_api_key
    "backend/serpapi-key"          = var.serpapi_key
  }

 backend_config = {
    "port"                         = "5000"
     "node-env"                     = "production"
     "jwt-expires-in"               = "15m"
    "jwt-refresh-expires-in"       = "7d"
     "bcrypt-rounds"                = "12"
     "rate-limit-window-ms"         = "900000"
     "rate-limit-max-requests"      = "100"
     "api-rate-limit"               = "100"
     "mnotify-sender-id"            = "MAMA AI APP"
     "mnotify-base-url"             = "https://api.mnotify.com/api"
     "sms-simulation-mode"          = "false"
     "cors-origin"                  = "https://dev.auto-hive.site"
     "password-reset-expires-minutes" = "10"
     "cookie-expires-in"            = "7"
    "default-location"             = "Ahodwo, Ashanti Region, Ghana"
 }

  frontend_config = {
    "app-name"        = "MAMA"
    "app-version"     = "1.0.0"
    "app-description" = "AI-powered maternal health companion for Ghana"
    "api-version"     = "v1"
    "node-env"        = "production"
  }

  frontend_secrets = {
    "google-maps-api-key" = var.google_maps_api_key
    "ghana-nlp-api-base-url" = var.ghana_nlp_api_base_url
    "ghana-nlp-subscription-key" = var.ghana_nlp_subscription_key
  }
}

# IAM roles
module "iam" {
  source = "../../modules/iam"

  project_name        = var.project_name
  environment         = var.environment
  region              = data.aws_region.current.name
  account_id          = data.aws_caller_identity.current.account_id
  github_repositories = var.github_repositories
  # frontend_bucket_arn = module.cloudfront.s3_bucket_arn

  # depends_on = [module.cloudfront]
}

# ECR repository
module "ecr" {
  source = "../../modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}

# Shared infrastructure
module "shared" {
  source = "../../modules/shared"

  project_name           = var.project_name
  environment            = var.environment
  region                 = data.aws_region.current.name
  vpc_cidr               = var.vpc_cidr
  availability_zones     = var.availability_zones
  create_private_subnets = false  # Dev uses public subnets only
}

# Security Groups
module "security_groups" {
  source = "../../modules/security-groups"

  project_name     = var.project_name
  environment      = var.environment
  vpc_id           = module.shared.vpc_id
  create_ec2_sg    = true
  create_alb_sg    = false  # Dev doesn't use ALB
  create_ecs_sg    = false  # Dev doesn't use ECS
  ssh_cidr_blocks  = ["0.0.0.0/0"]  # TODO: Restrict to your IP
  ec2_app_port     = 5000
}

# EC2 Instance for Backend (replaces ECS + ALB)
module "ec2" {
  source = "../../modules/ec2"
  
  project_name      = var.project_name
  environment       = var.environment
  region            = data.aws_region.current.name
  account_id        = data.aws_caller_identity.current.account_id
  vpc_id            = module.shared.vpc_id
  subnet_id         = module.shared.public_subnet_ids[0]
  security_group_id = module.security_groups.ec2_security_group_id
  ami_id            = var.ami_id
  instance_type     = var.instance_type
  key_pair_name     = var.key_pair_name
  api_domain_name   = "dev-api.auto-hive.site"

  depends_on = [module.parameter_store, module.security_groups]
}

# CloudFront for fzrontend (no longer needs ALB DNS)
module "cloudfront" {
  source = "../../modules/cloudfront"

  project_name = var.project_name
  environment  = var.environment
  domain_name  = "dev.auto-hive.site"
  # alb_dns_name removed - frontend will connect directly to EC2 via dev-api.auto-hive.site
}

