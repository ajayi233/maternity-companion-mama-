output "instance_id" {
  description = "ID of the GitHub runner EC2 instance"
  value       = aws_instance.github_runner.id
}

output "instance_public_ip" {
  description = "Public IP of the GitHub runner EC2 instance"
  value       = aws_instance.github_runner.public_ip
}