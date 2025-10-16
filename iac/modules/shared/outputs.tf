output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = var.create_private_subnets ? aws_subnet.private[*].id : []
}

output "nat_gateway_id" {
  description = "NAT Gateway ID"  
  value       = var.create_private_subnets ? (length(aws_nat_gateway.main) > 0 ? aws_nat_gateway.main[0].id : null) : null
} 