variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}



variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
}

# backend_image removed - Ansible handles Docker image configuration

variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT refresh secret key"
  type        = string
  sensitive   = true
}

variable "mnotify_api_key" {
  description = "Mnotify API key"
  type        = string
  sensitive   = true
}



variable "google_maps_api_key" {
  description = "Google Maps API key for frontend"
  type        = string
  sensitive   = true
}

variable "serpapi_key" {
  description = "SerpAPI key for healthcare facilities"
  type        = string
  sensitive   = true
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "github_repositories" {
  description = "List of GitHub repositories for OIDC access"
  type        = list(string)
  default     = []
}

# EC2 Configuration Variables
variable "ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "EC2 Key Pair name for SSH access"
  type        = string
  default     = "mama-app-key"
}

variable "ghana_nlp_api_base_url" {
  description = "Ghana NLP API base URL for translation services"
  type        = string
}

variable "ghana_nlp_subscription_key" {
  description = "Ghana NLP API subscription key"
  type        = string
  sensitive   = true
}
