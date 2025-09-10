#!/bin/bash

set -e

# Configuration
PROJECT_NAME="mama-app"
ENVIRONMENT="dev"
REGION="us-west-2"
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

cd backend
docker build -t ${BACKEND_REPO}:latest .
docker tag ${BACKEND_REPO}:latest ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest

echo -e "${YELLOW}📤 Pushing backend image...${NC}"
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest

cd ..

echo -e "${GREEN}✅ Backend build and push completed!${NC}"
echo -e "${GREEN}Backend image: ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest${NC}"
echo -e "${YELLOW}📝 Update terraform.tfvars with:${NC}"
echo -e "backend_image = \"${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest\""