# Project Configuration
project_name = "mama-app"
environment  = "dev"
region       = "us-west-2"

# Network Configuration
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-west-2a", "us-west-2b"]

# Backend Configuration
backend_image = "578641869747.dkr.ecr.us-west-2.amazonaws.com/mama-app-dev-backend:latest"

# Secrets (will be stored in Parameter Store)
mongodb_uri         = "mongodb+srv://ajayidaniel:deathnote@cluster49.gvrhw.mongodb.net/mama-app?retryWrites=true&w=majority&appName=Cluster49"
jwt_secret         = "SOME_SECRET"
jwt_refresh_secret = "some_secret_token"
mnotify_api_key    = "some_random_api_key"
google_maps_api_key = "some_random_key"
aws_account_id     = "578641869747"