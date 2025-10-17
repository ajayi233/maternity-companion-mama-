# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-${var.environment}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ECS Task Role
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach AWS managed policy for ECS task execution (includes ECR permissions)
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Additional ECR permissions policy
resource "aws_iam_policy" "ecr_policy" {
  name = "${var.project_name}-${var.environment}-ecr-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach ECR policy to execution role
resource "aws_iam_role_policy_attachment" "ecs_ecr_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecr_policy.arn
}

# OIDC Provider for GitHub Actions
resource "aws_iam_openid_connect_provider" "github_actions" {
  count = var.create_oidc_provider ? 1 : 0
  
  url = "https://token.actions.githubusercontent.com"
  
  client_id_list = [
    "sts.amazonaws.com"
  ]
  
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# GitHub Actions Role
resource "aws_iam_role" "github_actions_role" {
  name = "${var.project_name}-${var.environment}-github-actions-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.create_oidc_provider ? aws_iam_openid_connect_provider.github_actions[0].arn : "arn:aws:iam::${var.account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              for repo in var.github_repositories : "repo:${repo}:*"
            ]
          }
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ECR Policy for GitHub Actions
resource "aws_iam_policy" "github_actions_ecr_policy" {
  name = "${var.project_name}-${var.environment}-github-actions-ecr-policy"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeRepositories"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# ECS Policy for GitHub Actions
resource "aws_iam_policy" "github_actions_ecs_policy" {
  name = "${var.project_name}-${var.environment}-github-actions-ecs-policy"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:DescribeServices",
          "ecs:UpdateService",
          "ecs:RegisterTaskDefinition",
          "ecs:DescribeTaskDefinition"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# S3 and CloudFront Policy for GitHub Actions
resource "aws_iam_policy" "github_actions_frontend_policy" {
  count = var.frontend_bucket_arn != "" ? 1 : 0
  name = "${var.project_name}-${var.environment}-github-actions-frontend-policy"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          var.frontend_bucket_arn,
          "${var.frontend_bucket_arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach policies to GitHub Actions role
resource "aws_iam_role_policy_attachment" "github_actions_ecr_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_ecr_policy.arn
}

resource "aws_iam_role_policy_attachment" "github_actions_ecs_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_ecs_policy.arn
}

resource "aws_iam_role_policy_attachment" "github_actions_frontend_policy" {
  count      = var.frontend_bucket_arn != "" ? 1 : 0
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_frontend_policy[0].arn
}

# Policy for Parameter Store access
resource "aws_iam_policy" "parameter_store_policy" {
  name = "${var.project_name}-${var.environment}-parameter-store-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:${var.region}:${var.account_id}:parameter/${var.project_name}/${var.environment}/*"
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach Parameter Store policy to execution role
resource "aws_iam_role_policy_attachment" "ecs_parameter_store_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.parameter_store_policy.arn
}

# Attach Parameter Store policy to GitHub Actions role
resource "aws_iam_role_policy_attachment" "github_actions_parameter_store_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.parameter_store_policy.arn
}

# SSM Policy for GitHub Actions (to run commands on EC2)
resource "aws_iam_policy" "github_actions_ssm_policy" {
  name = "${var.project_name}-${var.environment}-github-actions-ssm-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:SendCommand",
          "ssm:GetCommandInvocation",
          "ssm:DescribeInstanceInformation",
          "ssm:ListCommandInvocations"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach SSM policy to GitHub Actions role
resource "aws_iam_role_policy_attachment" "github_actions_ssm_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_ssm_policy.arn
}

# S3 Policy for GitHub Actions (for frontend deployment)
resource "aws_iam_policy" "github_actions_s3_policy" {
  name = "${var.project_name}-${var.environment}-github-actions-s3-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.project_name}-${var.environment}-frontend-*",
          "arn:aws:s3:::${var.project_name}-${var.environment}-frontend-*/*"
        ]
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach S3 policy to GitHub Actions role
resource "aws_iam_role_policy_attachment" "github_actions_s3_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_s3_policy.arn
}

# CloudFront Policy for GitHub Actions (for cache invalidation)
resource "aws_iam_policy" "github_actions_cloudfront_policy" {
  name = "${var.project_name}-${var.environment}-github-actions-cloudfront-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Attach CloudFront policy to GitHub Actions role
resource "aws_iam_role_policy_attachment" "github_actions_cloudfront_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_cloudfront_policy.arn
}