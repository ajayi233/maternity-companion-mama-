# Ansible Configuration Management for MAMA App

## 🎯 **Overview**

This Ansible setup replaces the user-data script with proper configuration management, providing:

- **Idempotent deployments** - Run multiple times safely
- **Easy updates** - Deploy new versions with a single command
- **Environment consistency** - Same configuration every time
- **Rollback capability** - Easy to revert changes
- **Audit trail** - Track all configuration changes

## 🏗️ **Architecture with Ansible**

```
Local Machine → Ansible → EC2 Instance
     ↓              ↓           ↓
Terraform    Configuration   Docker
  Deploy       Management    Containers
```

### **Benefits Over User-Data Script**

| Aspect          | User-Data Script       | Ansible                      |
| --------------- | ---------------------- | ---------------------------- |
| **Idempotency** | ❌ Runs once only      | ✅ Can run multiple times    |
| **Updates**     | ❌ Manual intervention | ✅ Automated updates         |
| **Rollback**    | ❌ Difficult           | ✅ Easy with version control |
| **Testing**     | ❌ No dry-run          | ✅ Check mode available      |
| **Debugging**   | ❌ Limited logging     | ✅ Detailed output           |
| **Maintenance** | ❌ SSH + manual work   | ✅ Automated management      |

## 📁 **Ansible Structure**

```
devops/
├── ansible/
│   ├── ansible.cfg              # Ansible configuration
│   ├── requirements.yml         # Ansible collections
│   ├── inventory/
│   │   └── hosts.yml           # Server inventory
│   ├── playbooks/
│   │   ├── site.yml            # Main setup playbook
│   │   └── deploy.yml          # Application deployment
│   └── roles/
│       ├── docker/             # Docker installation
│       ├── aws_cli/            # AWS CLI setup
│       ├── nginx/              # Nginx configuration
│       ├── certbot/            # SSL certificates
│       └── mama_app/           # Application deployment
└── README.md                   # DevOps documentation
```

## 🚀 **Quick Start**

### **1. Prerequisites**

```bash
# Install Ansible
pip install ansible

# Install Ansible collections
cd devops/ansible
ansible-galaxy collection install -r requirements.yml
```

### **2. Initial Setup**

```bash
# Deploy infrastructure with Terraform
cd iac/environments/dev
terraform apply

# Setup server with Ansible(from maternity-companion-mama-)
cd scripts
./ansible-deploy.sh setup
```

### **3. Deploy Updates**

```bash
# Deploy new application version
./ansible-deploy.sh deploy
```

## 🔧 **Ansible Roles Explained**

### **1. Docker Role** (`roles/docker/`)

- Installs Docker and Docker Compose
- Configures Docker service
- Adds user to docker group
- Verifies installation

### **2. AWS CLI Role** (`roles/aws_cli/`)

- Installs AWS CLI v2
- Configures AWS credentials
- Sets up region configuration
- Enables ECR access

### **3. Nginx Role** (`roles/nginx/`)

- Installs and configures Nginx
- Creates reverse proxy configuration
- Sets up SSL termination
- Configures rate limiting and security headers

### **4. Certbot Role** (`roles/certbot/`)

- Installs Certbot
- Obtains Let's Encrypt certificates
- Sets up automatic renewal
- Configures cron jobs

### **5. MAMA App Role** (`roles/mama_app/`)

- Creates application configuration
- Fetches secrets from Parameter Store
- Deploys Docker containers
- Sets up systemd services

## 📋 **Deployment Commands**

### **Initial Setup**

```bash
# Complete server setup
./ansible-deploy.sh setup
```

### **Application Updates**

```bash
# Deploy new version
./ansible-deploy.sh deploy
```

### **Monitoring**

```bash
# Check status
./ansible-deploy.sh status

# View logs
./ansible-deploy.sh logs
```

### **SSL Management**

```bash
# Renew certificates
./ansible-deploy.sh ssl
```

## 🔍 **Advanced Usage**

### **Targeted Updates**

```bash
# Update only Docker
ansible-playbook playbooks/site.yml --tags docker

# Update only Nginx
ansible-playbook playbooks/site.yml --tags nginx

# Update only application
ansible-playbook playbooks/site.yml --tags app
```

### **Dry Run (Check Mode)**

```bash
# See what would change without making changes
ansible-playbook playbooks/site.yml --check --diff
```

### **Verbose Output**

```bash
# More detailed output
ansible-playbook playbooks/site.yml -vvv
```

### **Single Host Operations**

```bash
# Run command on specific host
ansible mama_backend -m shell -a "docker-compose ps"

# Copy files to server
ansible mama_backend -m copy -a "src=local-file dest=/remote/path"
```

## 🔐 **Security Features**

### **Secrets Management**

- Secrets fetched from AWS Parameter Store
- No hardcoded credentials in playbooks
- Encrypted communication with AWS

### **Access Control**

- SSH key-based authentication
- IAM roles for AWS access
- Minimal required permissions

### **SSL/TLS**

- Let's Encrypt certificates
- Automatic renewal
- Security headers configured

## 📊 **Monitoring & Maintenance**

### **Health Checks**

```bash
# Check application health
ansible mama_backend -m uri -a "url=http://localhost:5000/health"

# Check SSL certificate
ansible mama_backend -m shell -a "certbot certificates"
```

### **Log Management**

```bash
# Application logs
ansible mama_backend -m shell -a "docker-compose logs backend"

# Nginx logs
ansible mama_backend -m shell -a "tail -f /var/log/nginx/access.log"
```

### **System Monitoring**

```bash
# Disk usage
ansible mama_backend -m shell -a "df -h"

# Memory usage
ansible mama_backend -m shell -a "free -h"

# Docker status
ansible mama_backend -m shell -a "docker system df"
```

## 🔄 **CI/CD Integration**

### **GitHub Actions Example**

```yaml
name: Deploy with Ansible
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Ansible
        run: |
          pip install ansible
          cd devops/ansible
          ansible-galaxy collection install -r requirements.yml

      - name: Deploy Application
        run: |
          cd scripts
          ./ansible-deploy.sh deploy
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **SSH Connection Failed**

   ```bash
   # Check SSH key permissions
   chmod 600 ~/.ssh/mama-app-key.pem

   # Test SSH connection
   ssh -i ~/.ssh/mama-app-key.pem ubuntu@<EC2_IP>
   ```

2. **Ansible Playbook Failed**

   ```bash
   # Run with verbose output
   ansible-playbook playbooks/site.yml -vvv

   # Check specific task
   ansible-playbook playbooks/site.yml --tags docker -vvv
   ```

3. **Docker Container Not Starting**

   ```bash
   # Check container logs
   ansible mama_backend -m shell -a "docker-compose logs backend"

   # Restart containers
   ansible mama_backend -m shell -a "docker-compose restart"
   ```

### **Debugging Commands**

```bash
# Check Ansible connectivity
ansible mama_backend -m ping

# Verify inventory
ansible-inventory --list

# Test specific module
ansible mama_backend -m shell -a "docker --version"
```

## 📈 **Benefits Summary**

### **Operational Benefits**

- ✅ **Automated deployments** - No manual intervention
- ✅ **Consistent environments** - Same setup every time
- ✅ **Easy rollbacks** - Version control integration
- ✅ **Audit trail** - Track all changes
- ✅ **Scalable** - Easy to add more servers

### **Development Benefits**

- ✅ **Faster deployments** - Single command updates
- ✅ **Environment parity** - Dev/staging/prod consistency
- ✅ **Testing** - Dry-run capabilities
- ✅ **Documentation** - Self-documenting infrastructure
- ✅ **Collaboration** - Team can manage infrastructure

### **Cost Benefits**

- ✅ **Reduced downtime** - Faster, safer deployments
- ✅ **Less manual work** - Automated maintenance
- ✅ **Better resource utilization** - Optimized configurations
- ✅ **Faster recovery** - Quick rollback capabilities

## 🎯 **Next Steps**

1. **Deploy with Terraform**: `terraform apply`
2. **Setup with Ansible**: `./ansible-deploy.sh setup`
3. **Verify deployment**: `./ansible-deploy.sh status`
4. **Test application**: `curl https://api.auto-hive.site/health`
5. **Deploy updates**: `./ansible-deploy.sh deploy`

This Ansible setup transforms your infrastructure from manual, error-prone deployments to automated, reliable configuration management!
