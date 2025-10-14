# AWS Services Documentation - MAMA Health Platform

## Infrastructure Overview

The MAMA platform leverages Amazon Web Services (AWS) to provide a scalable, secure, and cost-effective cloud infrastructure. The architecture follows AWS Well-Architected Framework principles with emphasis on security, reliability, and cost optimization for healthcare applications.

## AWS Services Used

### Core Compute & Networking

#### Amazon EC2 (Elastic Compute Cloud)
- **Instance Type**: t3.micro (1 vCPU, 1 GB RAM)
- **Operating System**: Ubuntu 22.04 LTS
- **Purpose**: Host containerized applications with Docker Compose
- **Configuration**:
  - Elastic IP for static public IP address
  - Security groups for network access control
  - EBS storage for persistent data
  - CloudWatch monitoring enabled

```hcl
# EC2 Instance Configuration
resource "aws_instance" "mama_app" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name              = aws_key_pair.mama_app.key_name
  vpc_security_group_ids = [aws_security_group.mama_app.id]
  subnet_id             = aws_subnet.public[0].id
  
  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    domain_name = var.domain_name
  }))
  
  tags = {
    Name        = "${var.project_name}-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
}
```

#### Amazon VPC (Virtual Private Cloud)
- **CIDR Block**: 10.0.0.0/16
- **Availability Zones**: 2 AZs for high availability
- **Subnets**: 
  - Public subnets: 10.0.1.0/24, 10.0.2.0/24
  - Private subnets: 10.0.3.0/24, 10.0.4.0/24
- **Components**:
  - Internet Gateway for public internet access
  - NAT Gateway for private subnet internet access
  - Route tables for traffic routing
  - Network ACLs for subnet-level security

```hcl
# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.project_name}-${var.environment}-public-${count.index + 1}"
    Type = "Public"
  }
}
```

### Container Services

#### Amazon ECR (Elastic Container Registry)
- **Purpose**: Store Docker images for backend application
- **Features**:
  - Image vulnerability scanning
  - Lifecycle policies for image cleanup
  - Cross-region replication
  - Integration with CI/CD pipelines

```hcl
# ECR Repository
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-${var.environment}-backend"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  lifecycle_policy {
    policy = jsonencode({
      rules = [{
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      }]
    })
  }
}
```

#### Amazon ECS (Elastic Container Service) - Alternative Architecture
- **Cluster**: Fargate serverless compute
- **Services**: Backend API service with auto-scaling
- **Task Definitions**: Container specifications with resource limits
- **Load Balancer Integration**: Application Load Balancer for traffic distribution

```hcl
# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Service
resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-${var.environment}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 5000
  }
}
```

### Load Balancing & SSL

#### Application Load Balancer (ALB)
- **Type**: Application Load Balancer (Layer 7)
- **Scheme**: Internet-facing
- **Listeners**: HTTP (80) and HTTPS (443)
- **Target Groups**: Backend API instances
- **Health Checks**: Custom health check endpoints

```hcl
# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id
  
  enable_deletion_protection = false
  
  tags = {
    Name        = "${var.project_name}-${var.environment}-alb"
    Environment = var.environment
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate_validation.main.certificate_arn
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}
```

#### AWS Certificate Manager (ACM)
- **SSL/TLS Certificates**: Automated certificate provisioning and renewal
- **Domain Validation**: DNS validation for certificate issuance
- **Integration**: Seamless integration with ALB and CloudFront

```hcl
# SSL Certificate
resource "aws_acm_certificate" "main" {
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"
  
  lifecycle {
    create_before_destroy = true
  }
}

# Certificate Validation
resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
```

### Content Delivery & Storage

#### Amazon CloudFront
- **Purpose**: Global content delivery network for frontend assets
- **Origin**: S3 bucket for static website hosting
- **Caching**: Optimized caching policies for SPA applications
- **Security**: Origin Access Control (OAC) for S3 bucket security

```hcl
# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.frontend.bucket}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }
  
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.frontend.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  
  # SPA routing support
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  aliases = [var.frontend_domain]
  
  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.frontend.arn
    ssl_support_method  = "sni-only"
  }
}
```

#### Amazon S3 (Simple Storage Service)
- **Frontend Hosting**: Static website hosting for React application
- **Bucket Policy**: Restricted access via CloudFront OAC
- **Versioning**: Enabled for deployment rollback capabilities
- **Encryption**: Server-side encryption with AES-256

```hcl
# S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-${var.environment}-frontend"
}

# S3 Bucket Configuration
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "index.html"
  }
}

# S3 Bucket Policy for CloudFront
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}
```

### Security & Secrets Management

#### AWS Systems Manager Parameter Store
- **Purpose**: Secure storage of application configuration and secrets
- **Encryption**: KMS encryption for sensitive parameters
- **Access Control**: IAM policies for parameter access
- **Integration**: Runtime parameter retrieval by applications

```hcl
# Parameter Store - Database URI
resource "aws_ssm_parameter" "mongodb_uri" {
  name  = "/${var.project_name}/${var.environment}/mongodb-uri"
  type  = "SecureString"
  value = var.mongodb_uri
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Parameter Store - JWT Secret
resource "aws_ssm_parameter" "jwt_secret" {
  name  = "/${var.project_name}/${var.environment}/jwt-secret"
  type  = "SecureString"
  value = var.jwt_secret
}

# Parameter Store - SMS API Key
resource "aws_ssm_parameter" "mnotify_api_key" {
  name  = "/${var.project_name}/${var.environment}/mnotify-api-key"
  type  = "SecureString"
  value = var.mnotify_api_key
}
```

#### AWS IAM (Identity and Access Management)
- **Roles**: Service-specific roles with least privilege access
- **Policies**: Custom policies for application permissions
- **Instance Profiles**: EC2 instance roles for AWS service access
- **GitHub Actions**: OIDC provider for CI/CD authentication

```hcl
# EC2 Instance Role
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-${var.environment}-ec2-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Parameter Store Access Policy
resource "aws_iam_role_policy" "parameter_store_access" {
  name = "${var.project_name}-${var.environment}-parameter-store-access"
  role = aws_iam_role.ec2_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/${var.environment}/*"
      }
    ]
  })
}

# GitHub Actions OIDC Role
resource "aws_iam_role" "github_actions" {
  name = "${var.project_name}-${var.environment}-github-actions-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repository}:*"
          }
        }
      }
    ]
  })
}
```

### Monitoring & Logging

#### Amazon CloudWatch
- **Metrics**: System and application metrics monitoring
- **Logs**: Centralized log aggregation and analysis
- **Alarms**: Automated alerting for system issues
- **Dashboards**: Visual monitoring dashboards

```hcl
# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/ec2/${var.project_name}-${var.environment}"
  retention_in_days = 30
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# CloudWatch Alarm - High CPU
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  
  dimensions = {
    InstanceId = aws_instance.mama_app.id
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}
```

### DNS & Domain Management

#### Amazon Route 53
- **Hosted Zone**: DNS management for custom domain
- **Record Sets**: A records, CNAME records for service endpoints
- **Health Checks**: DNS failover and health monitoring
- **Certificate Validation**: DNS validation for SSL certificates

```hcl
# Route 53 Hosted Zone
resource "aws_route53_zone" "main" {
  name = var.domain_name
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# A Record for API
resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"
  
  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# A Record for Frontend (CloudFront)
resource "aws_route53_record" "frontend" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"
  
  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}
```

## Security Groups Configuration

### Application Load Balancer Security Group
```hcl
resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-${var.environment}-alb-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### EC2 Instance Security Group
```hcl
resource "aws_security_group" "mama_app" {
  name_prefix = "${var.project_name}-${var.environment}-ec2-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }
  
  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  ingress {
    description     = "HTTPS from ALB"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Cost Optimization Strategies

### Current Architecture Cost Analysis
```
Monthly Cost Breakdown (EC2-based):
- EC2 t3.micro instance: ~$8.50/month
- Elastic IP: ~$3.65/month (when not attached to running instance)
- EBS storage (20GB): ~$2.00/month
- Data transfer: ~$1.00/month
- Route 53 hosted zone: ~$0.50/month
- CloudFront: ~$1.00/month (first 1TB free)
- Parameter Store: Free tier
- CloudWatch: Free tier (basic monitoring)

Total: ~$16.65/month
```

### Alternative ECS Architecture Cost
```
Monthly Cost Breakdown (ECS Fargate):
- ECS Fargate (0.25 vCPU, 0.5GB): ~$12.00/month
- Application Load Balancer: ~$16.20/month
- NAT Gateway: ~$32.40/month
- Other services: ~$5.00/month

Total: ~$65.60/month
```

### Cost Optimization Techniques
1. **Reserved Instances**: 1-year commitment for 30-40% savings
2. **Spot Instances**: For non-critical workloads (up to 90% savings)
3. **Auto Scaling**: Scale down during low usage periods
4. **S3 Intelligent Tiering**: Automatic cost optimization for storage
5. **CloudWatch Logs Retention**: Set appropriate retention periods
6. **Data Transfer Optimization**: Use CloudFront for global content delivery

## Disaster Recovery & Backup

### Backup Strategy
```hcl
# EBS Snapshot Lifecycle
resource "aws_dlm_lifecycle_policy" "backup" {
  description        = "EBS snapshot lifecycle policy"
  execution_role_arn = aws_iam_role.dlm_lifecycle_role.arn
  state              = "ENABLED"
  
  policy_details {
    resource_types   = ["VOLUME"]
    target_tags = {
      Environment = var.environment
    }
    
    schedule {
      name = "Daily snapshots"
      
      create_rule {
        interval      = 24
        interval_unit = "HOURS"
        times         = ["03:00"]
      }
      
      retain_rule {
        count = 7
      }
      
      copy_tags = true
    }
  }
}
```

### Multi-AZ Deployment
```hcl
# Auto Scaling Group for High Availability
resource "aws_autoscaling_group" "mama_app" {
  name                = "${var.project_name}-${var.environment}-asg"
  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.backend.arn]
  health_check_type   = "ELB"
  
  min_size         = 1
  max_size         = 3
  desired_capacity = 1
  
  launch_template {
    id      = aws_launch_template.mama_app.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "${var.project_name}-${var.environment}"
    propagate_at_launch = true
  }
}
```

## Performance Optimization

### CloudFront Caching Configuration
```hcl
# Optimized caching behavior for API
ordered_cache_behavior {
  path_pattern     = "/api/*"
  allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
  cached_methods   = ["GET", "HEAD", "OPTIONS"]
  target_origin_id = "ALB-${aws_lb.main.name}"
  
  forwarded_values {
    query_string = true
    headers      = ["Authorization", "Content-Type"]
    
    cookies {
      forward = "none"
    }
  }
  
  viewer_protocol_policy = "redirect-to-https"
  min_ttl                = 0
  default_ttl            = 0
  max_ttl                = 0
}
```

### Auto Scaling Policies
```hcl
# Scale Up Policy
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "${var.project_name}-${var.environment}-scale-up"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name = aws_autoscaling_group.mama_app.name
}

# Scale Down Policy
resource "aws_autoscaling_policy" "scale_down" {
  name                   = "${var.project_name}-${var.environment}-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name = aws_autoscaling_group.mama_app.name
}
```

## Compliance & Security Best Practices

### HIPAA Compliance Considerations
1. **Encryption**: All data encrypted in transit and at rest
2. **Access Logging**: CloudTrail for API access logging
3. **Network Isolation**: VPC with private subnets
4. **Access Control**: IAM roles with least privilege
5. **Audit Trail**: CloudWatch logs for application events

### Security Hardening
```hcl
# WAF for Application Protection
resource "aws_wafv2_web_acl" "main" {
  name  = "${var.project_name}-${var.environment}-waf"
  scope = "CLOUDFRONT"
  
  default_action {
    allow {}
  }
  
  rule {
    name     = "RateLimitRule"
    priority = 1
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }
}
```

This comprehensive AWS services documentation provides detailed coverage of all cloud infrastructure components used in the MAMA platform, including configuration examples, cost optimization strategies, and security best practices.