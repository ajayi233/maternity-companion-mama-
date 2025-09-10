output "parameter_arns" {
  description = "ARNs of created parameters"
  value       = { for k, v in aws_ssm_parameter.secrets : k => v.arn }
}