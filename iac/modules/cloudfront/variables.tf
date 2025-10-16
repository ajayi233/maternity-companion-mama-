variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "alb_dns_name" {
  description = "ALB DNS name for API proxy"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name for CloudFront distribution"
  type        = string
  default     = "auto-hive.site"
}

variable "api_domain_name" {
  description = "API domain name for backend"
  type        = string
  default     = "api.auto-hive.site"
}

# Provider for CloudFront certificates (must be us-east-1)
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = "cloud-crew-profile"
}