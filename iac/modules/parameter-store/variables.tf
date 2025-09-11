variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "secrets" {
  description = "Map of secret names to values"
  type        = map(string)
}

variable "backend_config" {
  description = "Map of backend configuration parameters (non-secret)"
  type        = map(string)
  default     = {}
}

variable "frontend_config" {
  description = "Map of frontend configuration parameters (non-secret)"
  type        = map(string)
  default     = {}
}

variable "frontend_secrets" {
  description = "Map of frontend secret parameters"
  type        = map(string)
  default     = {}
}