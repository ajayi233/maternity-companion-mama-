#!/bin/bash

# EC2 User Data Script with Auto-Start
# Handles initial setup and auto-starts backend on instance restart

set -e

# Update system packages
apt-get update -y

# Install basic packages needed for Ansible
apt-get install -y \
    python3 \
    python3-pip \
    curl \
    wget \
    unzip

# Install Ansible
pip3 install ansible

# Create directory for Ansible
mkdir -p /opt/ansible

# Docker will be installed and configured by Ansible

# Auto-start backend if application directory exists (for restarts)
if [ -d "/opt/mama-app" ] && [ -f "/opt/mama-app/docker-compose.yml" ]; then
    echo "Application directory found. Starting backend automatically..."
    
    # Wait for Docker to be ready
    sleep 10
    
    # Start the backend application
    cd /opt/mama-app
    docker-compose up -d
    
    echo "Backend auto-started successfully"
else
    echo "Application directory not found. Ready for initial Ansible configuration."
fi

# Log completion
echo "EC2 setup completed with auto-start capability."

