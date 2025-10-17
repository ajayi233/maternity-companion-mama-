#!/bin/bash
# Build and push backend image to ECR
# for production environment\

set -e

# Configuration
PROJECT_NAME="mama-app"
ENVIRONMENT="prod"
REGION="eu-west-1"
PROFILE="cloud-crew-profile"
ACCOUNT_ID=$(aws sts get-caller-identity --profile ${PROFILE} --query Account --output text)

# ECR Repository name - match ECR module naming
BACKEND_REPO="${PROJECT_NAME}-${ENVIRONMENT}-backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Building and pushing Docker images for ${PROJECT_NAME}-${ENVIRONMENT}${NC}"

# Login to ECR
echo -e "${YELLOW}🔐 Logging into ECR...${NC}"
aws ecr get-login-password --region ${REGION} --profile ${PROFILE} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Build and push backend
echo -e "${YELLOW}🏗️  Building backend image (using existing ECR repo: ${BACKEND_REPO})...${NC}"

cd ../../backend
docker build -t ${BACKEND_REPO}:latest .
docker tag ${BACKEND_REPO}:latest ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest

echo -e "${YELLOW}📤 Pushing backend image...${NC}"
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest

cd ../scripts

echo -e "${GREEN}✅ Backend build and push completed!${NC}"
echo -e "${GREEN}Backend image: ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest${NC}"
echo -e "${YELLOW}📝 The ECS service will automatically pull the new image${NC}"
echo -e "${YELLOW}🔍 Check ECS service status with:${NC}"
echo -e "aws ecs describe-services --cluster mama-app-prod-cluster --services mama-app-prod-backend --profile ${PROFILE}"
