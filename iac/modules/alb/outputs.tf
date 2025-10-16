output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the load balancer"
  value       = aws_lb.main.zone_id
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.backend.arn
}

# Security group ID is now provided by the security-groups module

output "listener_arn" {
  description = "ARN of the HTTPS listener"
  value       = aws_lb_listener.https.arn
}

# Security group ID is now provided by the security-groups module

output "dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}