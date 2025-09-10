resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-${var.environment}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn           = var.task_role_arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = var.backend_image
      
      portMappings = [
        {
          containerPort = 5000
          protocol      = "tcp"
        }
      ]

      environment = concat(
        [
          {
            name  = "NODE_ENV"
            value = "production"
          },
          {
            name  = "PORT"
            value = "5000"
          }
        ],
        [
          for config_name in var.backend_config : {
            name      = upper(replace(config_name, "-", "_"))
            valueFrom = "arn:aws:ssm:${var.region}:${var.account_id}:parameter/${var.project_name}/${var.environment}/backend/${config_name}"
          }
        ]
      )

      secrets = [
        for secret_name in var.backend_secrets : {
          name      = upper(replace(replace(secret_name, "backend/", ""), "-", "_"))
          valueFrom = "arn:aws:ssm:${var.region}:${var.account_id}:parameter/${var.project_name}/${var.environment}/${secret_name}"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      essential = true
    }
  ])

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project_name}-${var.environment}-backend"
  retention_in_days = 7

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.project_name}-${var.environment}-ecs-tasks-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-${var.environment}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight           = 100
    base             = 0
  }

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight           = 0
    base             = 1
  }

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = var.subnet_ids
    assign_public_ip = true  # Required for public subnets to access Parameter Store
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "backend"
    container_port   = 5000
  }

  depends_on = [var.target_group_arn]

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}