output "ecr_repository_url" {
  description = "ECR repository URL for backend"
  value       = module.ecr.repository_url
}

# EC2 outputs (replaces ALB/ECS)
output "ec2_public_ip" {
  description = "EC2 instance public IP"
  value       = module.ec2.public_ip
}

output "ec2_elastic_ip" {
  description = "Elastic IP address for backend"
  value       = module.ec2.elastic_ip
}

output "backend_url" {
  description = "Backend API URL"
  value       = "https://api.auto-hive.site"
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = module.ec2.instance_id
}

# CloudFront outputs - uncomment after CloudFront module is deployed
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

# output "cloudfront_distribution_id" {
#   description = "CloudFront distribution ID"
#   value       = module.cloudfront.cloudfront_distribution_id
# }

output "github_actions_role_arn" {
  description = "ARN of the GitHub Actions IAM role for OIDC"
  value       = module.iam.github_actions_role_arn
}