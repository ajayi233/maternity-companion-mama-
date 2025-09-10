# Backend secrets
resource "aws_ssm_parameter" "secrets" {
  for_each = var.secrets

  name  = "/${var.project_name}/${var.environment}/${each.key}"
  type  = "SecureString"
  value = each.value

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Backend configuration (non-secret)
resource "aws_ssm_parameter" "backend_config" {
  for_each = var.backend_config

  name  = "/${var.project_name}/${var.environment}/backend/${each.key}"
  type  = "String"
  value = each.value

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Frontend configuration (non-secret)
resource "aws_ssm_parameter" "frontend_config" {
  for_each = var.frontend_config

  name  = "/${var.project_name}/${var.environment}/frontend/${each.key}"
  type  = "String"
  value = each.value

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Frontend secrets
resource "aws_ssm_parameter" "frontend_secrets" {
  for_each = var.frontend_secrets

  name  = "/${var.project_name}/${var.environment}/frontend/${each.key}"
  type  = "SecureString"
  value = each.value

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}