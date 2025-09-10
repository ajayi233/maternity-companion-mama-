variable "state_bucket_name" {
  description = "Name of the S3 bucket for Terraform state"
  type        = string
  default     = "cloud-crew-terraform-state-2025"
}

variable "state_bucket_region" {
  description = "AWS region for the Terraform state bucket"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "The environment (e.g., dev, prod)"
  type        = string
}

variable "project" {
  description = "The project name (e.g., Frontend)"
  type        = string
}