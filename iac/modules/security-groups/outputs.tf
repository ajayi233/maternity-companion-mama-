output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = var.create_alb_sg ? aws_security_group.alb[0].id : null
}

output "ecs_security_group_id" {
  description = "ID of the ECS tasks security group"
  value       = var.create_ecs_sg ? aws_security_group.ecs_tasks[0].id : null
}

output "ec2_security_group_id" {
  description = "ID of the EC2 security group"
  value       = var.create_ec2_sg ? aws_security_group.ec2[0].id : null
}

output "alb_security_group_arn" {
  description = "ARN of the ALB security group"
  value       = var.create_alb_sg ? aws_security_group.alb[0].arn : null
}

output "ecs_security_group_arn" {
  description = "ARN of the ECS tasks security group"
  value       = var.create_ecs_sg ? aws_security_group.ecs_tasks[0].arn : null
}

output "ec2_security_group_arn" {
  description = "ARN of the EC2 security group"
  value       = var.create_ec2_sg ? aws_security_group.ec2[0].arn : null
}






