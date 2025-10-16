variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "account_id" {
  description = "AWS account ID"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for ECS tasks"
  type        = list(string)
}

variable "execution_role_arn" {
  description = "ECS task execution role ARN"
  type        = string
}

variable "task_role_arn" {
  description = "ECS task role ARN"
  type        = string
}

variable "backend_image" {
  description = "Backend Docker image URI"
  type        = string
}

variable "backend_cpu" {
  description = "CPU units for backend task"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Memory for backend task"
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
  default     = 1
}

variable "backend_secrets" {
  description = "List of secret names for backend"
  type        = list(string)
  default     = []
}

variable "backend_config" {
  description = "List of config names for backend"
  type        = list(string)
  default     = []
}

variable "target_group_arn" {
  description = "ALB target group ARN"
  type        = string
}

variable "security_group_id" {
  description = "ECS tasks security group ID"
  type        = string
}

variable "alb_listener_arn" {
  description = "ALB listener ARN"
  type        = string
}

variable "backend_min_count" {
  description = "Minimum number of backend tasks"
  type        = number
  default     = 1
}

variable "backend_max_count" {
  description = "Maximum number of backend tasks"
  type        = number
  default     = 4
}