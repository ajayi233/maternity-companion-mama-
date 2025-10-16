#!/bin/bash

# Ansible Deployment Script for MAMA App
# This script manages the complete deployment process using Ansible

set -e

# Configuration
ANSIBLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../devops/ansible" && pwd)"
TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../iac/environments/dev" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Function to display usage
usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial server setup and configuration"
    echo "  deploy    - Deploy application updates"
    echo "  status    - Check application status"
    echo "  logs      - Show application logs"
    echo "  ssl       - Renew SSL certificates"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup    # Initial deployment"
    echo "  $0 deploy   # Update application"
    echo "  $0 status   # Check status"
}

# Function to get EC2 information from Terraform
get_ec2_info() {
    log "Getting EC2 information from Terraform..."
    
    cd "$TERRAFORM_DIR"
    
    # Get EC2 instance information
    export EC2_INSTANCE_ID=$(terraform output -raw ec2_instance_id 2>/dev/null || echo "")
    export EC2_ELASTIC_IP=$(terraform output -raw ec2_elastic_ip 2>/dev/null || echo "")
    
    if [ -z "$EC2_ELASTIC_IP" ]; then
        error "Could not get EC2 Elastic IP from Terraform outputs"
        error "Make sure Terraform has been applied successfully"
        exit 1
    fi
    
    info "EC2 Instance ID: $EC2_INSTANCE_ID"
    info "EC2 Elastic IP: $EC2_ELASTIC_IP"
    
    cd - > /dev/null
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Ansible is installed
    if ! command -v ansible &> /dev/null; then
        error "Ansible is not installed. Please install Ansible first:"
        echo "  pip install ansible"
        echo "  # or"
        echo "  brew install ansible  # macOS"
        exit 1
    fi
    
    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    # Check if SSH key exists
    if [ ! -f ~/.ssh/mama-app-key.pem ]; then
        warning "SSH key ~/.ssh/mama-app-key.pem not found"
        warning "Make sure you have the correct SSH key for EC2 access"
    fi
    
    log "Prerequisites check completed"
}

# Function to setup Ansible environment
setup_ansible() {
    log "Setting up Ansible environment..."
    
    cd "$ANSIBLE_DIR"
    
    # Install Ansible collections
    log "Installing Ansible collections..."
    ansible-galaxy collection install -r requirements.yml
    
    log "Ansible setup completed"
    
    cd - > /dev/null
}

# Function for initial setup
setup_server() {
    log "Starting initial server setup..."
    
    get_ec2_info
    
    cd "$ANSIBLE_DIR"
    
    # Run the main playbook
    log "Running initial setup playbook..."
    ansible-playbook playbooks/site.yml -v
    
    log "Initial server setup completed!"
    info "Application should be available at: https://dev-api.auto-hive.site"
    
    cd - > /dev/null
}

# Function for application deployment
deploy_app() {
    log "Starting application deployment..."
    
    get_ec2_info
    
    cd "$ANSIBLE_DIR"
    
    # Run the deployment playbook
    log "Running deployment playbook..."
    ansible-playbook playbooks/deploy.yml -v
    
    log "Application deployment completed!"
    
    cd - > /dev/null
}

# Function to check status
check_status() {
    log "Checking application status..."
    
    get_ec2_info
    
    cd "$ANSIBLE_DIR"
    
    # Run status check
    ansible mama_backend -m shell -a "cd $ANSIBLE_DIR && docker-compose ps" -v
    
    cd - > /dev/null
}

# Function to show logs
show_logs() {
    log "Showing application logs..."
    
    get_ec2_info
    
    cd "$ANSIBLE_DIR"
    
    # Show logs
    ansible mama_backend -m shell -a "cd /opt/mama-app && docker-compose logs --tail=50 backend" -v
    
    cd - > /dev/null
}

# Function to renew SSL certificates
renew_ssl() {
    log "Renewing SSL certificates..."
    
    get_ec2_info
    
    cd "$ANSIBLE_DIR"
    
    # Run SSL renewal
    ansible mama_backend -m shell -a "cd /opt/mama-app && ./renew-certs.sh" -v
    
    log "SSL certificate renewal completed!"
    
    cd - > /dev/null
}

# Main script logic
main() {
    case "${1:-help}" in
        setup)
            check_prerequisites
            setup_ansible
            setup_server
            ;;
        deploy)
            check_prerequisites
            deploy_app
            ;;
        status)
            check_prerequisites
            check_status
            ;;
        logs)
            check_prerequisites
            show_logs
            ;;
        ssl)
            check_prerequisites
            renew_ssl
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
