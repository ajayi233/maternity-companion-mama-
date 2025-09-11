output "ecr_repository_url" {
  description = "ECR repository URL for backend"
  value       = module.ecr.repository_url
}

# Uncomment after ALB module is deployed
output "alb_dns_name" {
  description = "ALB DNS name for backend API"
  value       = module.alb.alb_dns_name
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${module.alb.alb_dns_name}/api"
}

# Uncomment after ECS module is deployed
output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

# CloudFront outputs
output "frontend_url" {
  description = "Frontend CloudFront URL"
  value       = "https://${module.cloudfront.cloudfront_domain_name}"
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = module.cloudfront.cloudfront_domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.cloudfront.s3_bucket_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.cloudfront_distribution_id
}

output "github_actions_role_arn" {
  description = "ARN of the GitHub Actions IAM role for OIDC"
  value       = module.iam.github_actions_role_arn
}