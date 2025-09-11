#!/bin/bash

set -e

# Configuration
PROJECT_NAME="mama-app"
ENVIRONMENT="dev"
REGION="us-west-2"
PROFILE="cloud-crew-profile"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Use custom domain for API - no parameters needed
API_URL="https://api.auto-hive.site/api"
S3_BUCKET=$(cd iac/environments/dev && terraform output -raw s3_bucket_name 2>/dev/null || echo "")
CLOUDFRONT_ID=$(cd iac/environments/dev && terraform output -raw cloudfront_distribution_id 2>/dev/null || echo "")

if [ -z "$S3_BUCKET" ]; then
    echo -e "${RED}❌ Error: Could not get S3 bucket name from Terraform outputs${NC}"
    echo -e "${YELLOW}Make sure Terraform has been applied first${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 Deploying frontend to S3 and CloudFront${NC}"
echo -e "${YELLOW}📡 API URL: ${API_URL}${NC}"
echo -e "${YELLOW}🪣 S3 Bucket: ${S3_BUCKET}${NC}"

# Get frontend config from Parameter Store
echo -e "${YELLOW}📡 Fetching frontend configuration from Parameter Store...${NC}"
VITE_APP_NAME=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENVIRONMENT}/frontend/app-name" --profile ${PROFILE} --query 'Parameter.Value' --output text 2>/dev/null || echo "MAMA")
VITE_APP_VERSION=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENVIRONMENT}/frontend/app-version" --profile ${PROFILE} --query 'Parameter.Value' --output text 2>/dev/null || echo "1.0.0")
VITE_APP_DESCRIPTION=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENVIRONMENT}/frontend/app-description" --profile ${PROFILE} --query 'Parameter.Value' --output text 2>/dev/null || echo "AI-powered maternal health companion")
VITE_API_VERSION=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENVIRONMENT}/frontend/api-version" --profile ${PROFILE} --query 'Parameter.Value' --output text 2>/dev/null || echo "v1")
VITE_GOOGLE_MAPS_API_KEY=$(aws ssm get-parameter --name "/${PROJECT_NAME}/${ENVIRONMENT}/frontend/google-maps-api-key" --with-decryption --profile ${PROFILE} --query 'Parameter.Value' --output text 2>/dev/null || echo "")

# Build frontend with environment variables
cd frontend
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

echo -e "${YELLOW}🏗️  Building frontend with configuration from Parameter Store...${NC}"
export VITE_APP_NAME="$VITE_APP_NAME"
export VITE_APP_VERSION="$VITE_APP_VERSION"
export VITE_APP_DESCRIPTION="$VITE_APP_DESCRIPTION"
# Use custom domain for API calls
export VITE_API_BASE_URL="${API_URL}"
export VITE_API_VERSION="$VITE_API_VERSION"
export VITE_GOOGLE_MAPS_API_KEY="$VITE_GOOGLE_MAPS_API_KEY"
export NODE_ENV="production"
npm run build

# Upload to S3
echo -e "${YELLOW}📤 Uploading to S3...${NC}"
aws s3 sync dist/ s3://${S3_BUCKET}/ --delete --profile ${PROFILE}

# Invalidate CloudFront cache
if [ ! -z "$CLOUDFRONT_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*" --profile ${PROFILE}
fi

cd ..

echo -e "${GREEN}✅ Frontend deployment completed!${NC}"
echo -e "${GREEN}🌐 Frontend URL: https://$(cd iac/environments/dev && terraform output -raw cloudfront_domain_name)${NC}"