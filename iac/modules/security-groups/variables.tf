variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "create_alb_sg" {
  description = "Whether to create ALB security group"
  type        = bool
  default     = false
}

variable "create_ecs_sg" {
  description = "Whether to create ECS tasks security group"
  type        = bool
  default     = false
}

variable "create_ec2_sg" {
  description = "Whether to create EC2 security group"
  type        = bool
  default     = false
}

variable "ecs_port" {
  description = "Port for ECS tasks"
  type        = number
  default     = 5000
}

variable "ec2_app_port" {
  description = "Port for EC2 application"
  type        = number
  default     = 5000
}

variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
