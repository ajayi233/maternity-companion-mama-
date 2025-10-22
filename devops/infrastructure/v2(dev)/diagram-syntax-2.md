// External Requests
Internet [icon: cloud, color: blue]
Route53 [icon: aws-route-53, label: "Route53\nauto-hive.site"]
CloudFront [icon: aws-cloudfront, label: "CloudFront\nFrontend CDN"]

// VPC Connectivity
IGW [icon: aws-internet-gateway, label: "Internet Gateway"]
VPC [icon: aws-vpc, label: "VPC\n10.0.0.0/16"]
PublicSubnet1 [icon: aws-subnet, label: "Public Subnet 1\neu-west-1a\nEC2 Instance"]

// Backend Infrastructure (EC2-based)
EC2Instance [icon: aws-ec2, label: "EC2 Instance\ni-032e87fe13fe06c69\n46.137.141.81"]
EC2SecurityGroup [icon: aws-security-group, label: "EC2 Security Group\n80, 443, 22"]
ElasticIP [icon: aws-elastic-ip, label: "Elastic IP\n46.137.141.81"]

// SSL Certificates
ACM [icon: certificate, color: green, label: "ACM SSL\nauto-hive.site\nwww.auto-hive.site\n(CloudFront only)"]

// Frontend Infrastructure
S3Bucket [icon: aws-s3, label: "S3 Bucket\nmama-app-dev-frontend-va6nhivy"]

// Container Registry
ECR [icon: aws-elastic-container-registry, label: "ECR\nDocker Images"]

// Configuration & Secrets
ParameterStore [icon: aws-ssm-parameter-store, label: "SSM Parameter Store\nSecrets & Config"]

// IAM Roles
EC2Role [icon: aws-iam, label: "EC2 Instance Role\nECR + SSM + SSM Commands"]
OIDCProvider [icon: key, color: red, label: "OIDC Provider\nGitHub"]
GitHubActionsRole [icon: aws-iam, label: "GitHub Actions Role\nOIDC + ECR + S3 + SSM + CloudFront"]

// CI/CD
GitHubActions [icon: github, label: "GitHub Actions CI/CD"]

// External Services
MongoDB [icon: database, color: green, label: "MongoDB Atlas"]
MnotifyAPI [icon: api, color: yellow, label: "Mnotify API\nSMS"]
SerpAPI [icon: api, color: yellow, label: "SerpAPI\nHealthcare Data"]
GhanaNLP [icon: api, color: purple, label: "Ghana NLP API\nTranslation"]

// External Flow
Internet > Route53
Internet > CloudFront
Internet > EC2Instance

// VPC Flow (EC2 only in first subnet)
Internet > IGW
IGW > VPC
VPC > PublicSubnet1
PublicSubnet1 > EC2Instance

// DNS Resolution
Route53 > CloudFront
Route53 > ElasticIP
ElasticIP > EC2Instance

// SSL Binding (CloudFront only)
ACM > CloudFront

// Backend Infrastructure
EC2Instance > EC2SecurityGroup
EC2Instance > EC2Role
ElasticIP > EC2Instance

// EC2 Dependencies
EC2Instance > ECR
EC2Instance > ParameterStore

// Backend External Connections
EC2Instance > MongoDB
EC2Instance > MnotifyAPI
EC2Instance > SerpAPI
EC2Instance > GhanaNLP

// Frontend Flow
CloudFront > S3Bucket

// IAM Role Access
EC2Role > ECR
EC2Role > ParameterStore

// CI/CD Flow
GitHubActions > OIDCProvider
OIDCProvider > GitHubActionsRole
GitHubActions > ECR
GitHubActions > EC2Instance
GitHubActions > S3Bucket
GitHubActions > CloudFront
GitHubActions > ParameterStore
