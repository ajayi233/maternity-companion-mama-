# DevOps Infrastructure Management

This directory contains all DevOps and infrastructure management tools for the MAMA App.

## 📁 Directory Structure

```
devops/
├── ansible/                    # Configuration management
│   ├── ansible.cfg            # Ansible configuration
│   ├── requirements.yml       # Ansible collections
│   ├── inventory/             # Server inventory
│   ├── playbooks/             # Deployment playbooks
│   └── roles/                 # Reusable Ansible roles
├── README.md                  # This file
└── ANSIBLE_SETUP_GUIDE.md     # Complete Ansible documentation
```

## 🚀 Quick Commands

### Infrastructure Deployment
```bash
# Bootstrap infrastructure
cd ../iac/state-bootstrap && terraform init && terraform apply

# Deploy EC2 infrastructure
cd ../iac/environments/dev
terraform init && terraform apply

# Setup server with Ansible
cd ../../scripts
./ansible-deploy.sh setup
```

### Application Deployment
```bash
# Deploy application updates
./ansible-deploy.sh deploy

# Check status
./ansible-deploy.sh status

# View logs
./ansible-deploy.sh logs
```

### Build and Deploy
```bash
# Build and push Docker images
./scripts/build-and-push.sh

# Deploy frontend
./scripts/deploy-frontend.sh

# Verify deployment
curl https://api.auto-hive.site/health
```

## 🔧 DevOps Tools

### **Terraform** (`../iac/`)
- Infrastructure as Code
- AWS resource provisioning
- Environment management

### **Ansible** (`ansible/`)
- Configuration management
- Application deployment
- Server automation

### **Docker**
- Container orchestration
- Application packaging
- ECR integration

## 📚 Documentation

- **[Ansible Setup Guide](ANSIBLE_SETUP_GUIDE.md)** - Complete Ansible configuration management
- **[Main README](../README.md#devopscloud)** - Full infrastructure setup instructions

## 🛠️ Useful Commands

```bash
# Get AWS Account ID
aws sts get-caller-identity --query Account --output text

# Get Terraform outputs
cd ../iac/environments/dev && terraform output

# Check Ansible connectivity
cd ansible && ansible mama_backend -m ping

# View application logs
cd ../scripts && ./ansible-deploy.sh logs
```

## 🎯 Architecture

**Current Setup: EC2 + Ansible + Docker**
```
Frontend (CloudFront) → EC2 Instance → Nginx → Backend Container
api.auto-hive.site → Elastic IP → EC2 → Docker Compose → Node.js App
```

**Cost Optimization**: ~$25-35/month savings compared to ECS + ALB setup.