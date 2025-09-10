variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}


variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "subnet_id" {
  description = "ID of the public subnet"
  type        = string
}

variable "security_group_id" {
  description = "ID of the security group"
  type        = string
}

variable "iam_instance_profile" {
  description = "Name of the IAM instance profile"
  type        = string
}

variable "github_token" {
  description = "GitHub Personal Access Token for runner registration"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., dev, staging, prod)"
  type        = string
}


variable "ami_id" {
  description = "AMI ID for the bastion host"
  type        = string
 
  default     = "ami-03aa99ddf5498ceb9"  # Amazon Ubuntu eu-west-1
}

variable "runner_type" {
  type        = string
  description = "Type of runner (e.g., frontend, backend)"
}