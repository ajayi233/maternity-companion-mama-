Internet [icon: cloud, color: blue, label: "Internet\nGlobal Users"]
Route53 [icon: aws-route-53, label: "Route53\nDNS Management\nauto-hive.site\napi.auto-hive.site"]

CloudFront [icon: aws-cloudfront, label: "CloudFront\nGlobal CDN\nFrontend Distribution\nHTTPS + SSL"]
ACMCloudFront [icon: certificate, color: green, label: "ACM Certificate\nus-east-1\nauto-hive.site\nwww.auto-hive.site"]
S3Bucket [icon: aws-s3, label: "S3 Bucket\nStatic Website\nFrontend Assets\nmama-app-prod-frontend-*"]

VPC [icon: aws-vpc, label: "VPC\n10.0.0.0/16\nDNS Support Enabled"]
IGW [icon: aws-internet-gateway, label: "Internet Gateway\nPublic Internet Access"]

PublicSubnetA [icon: aws-subnet, label: "Public Subnet A\n10.0.1.0/24\neu-west-1a\nALB + NAT Gateway"]
PrivateSubnetA [icon: aws-subnet, label: "Private Subnet A\n10.0.101.0/24\neu-west-1a\nECS Tasks"]

PublicSubnetB [icon: aws-subnet, label: "Public Subnet B\n10.0.2.0/24\neu-west-1b\nALB"]
PrivateSubnetB [icon: aws-subnet, label: "Private Subnet B\n10.0.102.0/24\neu-west-1b\nECS Tasks"]

ALB [icon: aws-application-load-balancer, label: "Application Load Balancer\nMulti-AZ Deployment\nHTTPS Termination\napi.auto-hive.site"]
ACMLB [icon: certificate, color: green, label: "ACM Certificate\neu-west-1\napi.auto-hive.site"]
ALBSecurityGroup [icon: aws-security-group, label: "ALB Security Group\nPort 80, 443\nIngress: 0.0.0.0/0"]

NATGateway [icon: aws-nat-gateway, label: "NAT Gateway\nSingle AZ (eu-west-1a)\nOutbound Internet Access\nCost Optimized"]
NATEIP [icon: aws-elastic-ip, label: "NAT Gateway EIP\nStatic Public IP"]

ECSCluster [icon: aws-ecs, label: "ECS Cluster\nFargate Platform\nContainer Insights Enabled\nAuto Scaling"]
ECSService [icon: aws-ecs, label: "ECS Service\nBackend API\nDesired: 2 Tasks\nMin: 1, Max: 4\nCPU: 512, Memory: 1024MB"]
ECSSecurityGroup [icon: aws-security-group, label: "ECS Security Group\nPort 5000\nIngress: ALB Only"]

ECR [icon: aws-elastic-container-registry, label: "ECR Repository\nDocker Images\nmama-app-prod-backend\nImage Scanning Enabled"]
ParameterStore [icon: aws-ssm-parameter-store, label: "SSM Parameter Store\nSecrets & Configuration\n/mama-app/prod/backend/*\n/mama-app/prod/frontend/*"]

ECSTaskRole [icon: aws-iam, label: "ECS Task Role\nApplication Permissions\nParameter Store Access"]
ECSExecutionRole [icon: aws-iam, label: "ECS Execution Role\nECR + CloudWatch Logs\nParameter Store Access"]
GitHubActionsRole [icon: aws-iam, label: "GitHub Actions Role\nOIDC Authentication\nECR + S3 + CloudFront\nParameter Store Access"]
OIDCProvider [icon: key, color: red, label: "OIDC Provider\nGitHub Actions\nTrust Relationship"]

GitHubActions [icon: github, label: "GitHub Actions\nCI/CD Pipeline\nAutomatic Deployment\nProduction Environment"]

MongoDB [icon: database, color: green, label: "MongoDB Atlas\nManaged Database\nProduction Cluster"]
MnotifyAPI [icon: api, color: yellow, label: "Mnotify API\nSMS Service\nGhana SMS Provider"]
SerpAPI [icon: api, color: yellow, label: "SerpAPI\nHealthcare Data\nFacility Information"]
GhanaNLP [icon: api, color: purple, label: "Ghana NLP API\nTranslation Services\nLocal Language Support"]

CloudWatchLogs [icon: aws-cloudwatch, label: "CloudWatch Logs\nECS Application Logs\n3-Day Retention\nContainer Insights"]

Internet > Route53
Internet > CloudFront
Internet > ALB

Route53 > CloudFront
Route53 > ALB

ACMCloudFront > CloudFront
ACMLB > ALB

CloudFront > S3Bucket

Internet > IGW
IGW > VPC
VPC > PublicSubnetA
VPC > PublicSubnetB
VPC > PrivateSubnetA
VPC > PrivateSubnetB

ALB > PublicSubnetA
ALB > PublicSubnetB
ALB > ALBSecurityGroup

NATEIP > NATGateway
NATGateway > PublicSubnetA
PrivateSubnetA > NATGateway
PrivateSubnetB > NATGateway

ECSCluster > PrivateSubnetA
ECSCluster > PrivateSubnetB
ECSService > ECSCluster
ECSService > ECSSecurityGroup
ECSService > ECSExecutionRole
ECSService > ECSTaskRole

ECSExecutionRole > ECR
ECSService > ECR

ECSTaskRole > ParameterStore
ECSExecutionRole > ParameterStore

ECSService > MongoDB
ECSService > MnotifyAPI
ECSService > SerpAPI
ECSService > GhanaNLP

ECSService > CloudWatchLogs

GitHubActions > OIDCProvider
OIDCProvider > GitHubActionsRole
GitHubActions > ECR
GitHubActions > S3Bucket
GitHubActions > CloudFront
GitHubActions > ParameterStore
GitHubActions > ECSService
