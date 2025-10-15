// External Requests
Internet [icon: cloud, color: blue]
Route53 [icon: aws-route-53, label: "Route53\nauto-hive.site"]
CloudFront [icon: aws-cloudfront, label: "CloudFront\nFrontend CDN"]
ALB [icon: aws-elastic-load-balancing, label: "Application Load Balancer\nmama-app-dev-alb"]

// VPC Connectivity
IGW [icon: aws-internet-gateway, label: "Internet Gateway"]
VPC [icon: aws-vpc, label: "VPC\n10.0.0.0/16"]
PublicSubnet1 [icon: aws-subnet, label: "Public Subnet 1\nus-west-2a"]
PublicSubnet2 [icon: aws-subnet, label: "Public Subnet 2\nus-west-2b"]
ECSCluster [icon: aws-ecs, label: "ECS Cluster\nFargate"]

// SSL
ACM [icon: certificate, color: green, label: "ACM SSL\napi.auto-hive.site"]

// Backend Security & Load Balancing
ALBSecurityGroup [icon: aws-security-group, label: "ALB Security Group\n80, 443"]
TargetGroup [icon: aws-target-group, label: "Target Group\nPort 5000"]
ECSService [icon: aws-ecs-service, label: "ECS Service\nmama-app-dev-backend"]
ECSSecurityGroup [icon: aws-security-group, label: "ECS Security Group\n5000 from ALB"]

// ECS Dependencies
ECR [icon: aws-elastic-container-registry, label: "ECR\nDocker Images"]
ParameterStore [icon: aws-ssm-parameter-store, label: "SSM Parameter Store\nSecrets & Config"]
CloudWatch [icon: aws-cloudwatch, label: "CloudWatch Logs"]

// IAM Roles
ECSExecutionRole [icon: aws-iam, label: "ECS Execution Role\nPull from ECR & Params"]
ECSTaskRole [icon: aws-iam, label: "ECS Task Role"]

// CI/CD
GitHubActions [icon: github, label: "GitHub Actions CI/CD"]
GitHubActionsRole [icon: aws-iam, label: "GitHub Actions Role\nOIDC + ECR + ECS + S3"]
OIDCProvider [icon: key, color: red, label: "OIDC Provider\nGitHub"]

// Frontend
S3Bucket [icon: aws-s3, label: "S3 Bucket\nFrontend"]

// External Services
MongoDB [icon: database, color: green, label: "MongoDB Atlas"]
MnotifyAPI [icon: api, color: yellow, label: "Mnotify API\nSMS"]
SerpAPI [icon: api, color: yellow, label: "SerpAPI\nHealthcare Data"]

// External Flow
Internet > Route53
Internet > CloudFront
Internet > ALB

// VPC Flow
Internet > IGW
IGW > VPC
VPC > PublicSubnet1
VPC > PublicSubnet2
PublicSubnet1 > ECSCluster
PublicSubnet2 > ECSCluster

// DNS Resolution
Route53 > CloudFront
Route53 > ALB

// SSL Binding
ACM > ALB
ACM > CloudFront

// Backend Flow
ALB > ALBSecurityGroup
ALB > TargetGroup
TargetGroup > ECSService
ECSService > ECSCluster
ECSService > ECSSecurityGroup

// ECS Dependencies
ECSService > ECR
ECSService > ParameterStore
ECSService > CloudWatch
ECSService > ECSExecutionRole
ECSService > ECSTaskRole

// Backend External Connections
ECSService > MongoDB
ECSService > MnotifyAPI
ECSService > SerpAPI

// Frontend Flow
CloudFront > S3Bucket

// IAM Role Access
ECSExecutionRole > ECR
ECSExecutionRole > ParameterStore
ECSExecutionRole > CloudWatch

// CI/CD Flow
GitHubActions > GitHubActionsRole
GitHubActionsRole > OIDCProvider
GitHubActions > ECR
GitHubActions > ECSService
GitHubActions > S3Bucket
GitHubActions > CloudFront
GitHubActions > ParameterStore

