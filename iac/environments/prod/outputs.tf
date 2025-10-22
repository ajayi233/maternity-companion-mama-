output "vpc_id" {
  description = "Production VPC ID"
  value       = module.shared.vpc_id
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.dns_name
}

output "api_endpoint" {
  description = "Backend API endpoint"
  value       = "https://api.auto-hive.site"
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = module.cloudfront.cloudfront_domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.cloudfront_distribution_id
}

output "s3_bucket_name" {
  description = "Frontend S3 bucket name"
  value       = module.cloudfront.s3_bucket_name
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs.service_name
}

output "github_actions_role_arn" {
  description = "GitHub Actions IAM role ARN"
  value       = module.iam.github_actions_role_arn
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = "615299752577.dkr.ecr.eu-west-1.amazonaws.com/mama-app-prod-backend"
}






