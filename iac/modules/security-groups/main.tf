# ALB Security Group
resource "aws_security_group" "alb" {
  count       = var.create_alb_sg ? 1 : 0
  name_prefix = "${var.project_name}-${var.environment}-alb-"
  vpc_id      = var.vpc_id
  description = "Security group for Application Load Balancer"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-alb-sg"
    Type = "ALB"
  })
}

# ECS Tasks Security Group
resource "aws_security_group" "ecs_tasks" {
  count       = var.create_ecs_sg ? 1 : 0
  name_prefix = "${var.project_name}-${var.environment}-ecs-tasks-"
  vpc_id      = var.vpc_id
  description = "Security group for ECS tasks"

  ingress {
    from_port       = var.ecs_port
    to_port         = var.ecs_port
    protocol        = "tcp"
    security_groups = var.create_alb_sg ? [aws_security_group.alb[0].id] : []
    description     = "Allow traffic from ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-ecs-tasks-sg"
    Type = "ECS"
  })
}

# EC2 Security Group
resource "aws_security_group" "ec2" {
  count       = var.create_ec2_sg ? 1 : 0
  name_prefix = "${var.project_name}-${var.environment}-ec2-"
  vpc_id      = var.vpc_id
  description = "Security group for EC2 instance"

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  # SSH (restrict to specified CIDR blocks)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_cidr_blocks
    description = "SSH"
  }

  # Backend application port
  ingress {
    from_port   = var.ec2_app_port
    to_port     = var.ec2_app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend application"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-ec2-sg"
    Type = "EC2"
  })
}






