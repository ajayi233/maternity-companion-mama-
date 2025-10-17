output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.backend.id
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.backend.public_ip
}

output "elastic_ip" {
  description = "Elastic IP address"
  value       = aws_eip.backend.public_ip
}

# Security group ID is now provided by the security-groups module

output "instance_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.backend.public_dns
}

output "backend_url" {
  description = "Backend API URL"
  value       = "https://${aws_eip.backend.public_ip}"
}

