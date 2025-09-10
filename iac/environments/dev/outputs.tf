output "vpc_id" {
  description = "ID of the VPC"
  value       = module.shared.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = module.shared.vpc_cidr
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.shared.private_subnet_ids
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.shared.public_subnet_ids
}