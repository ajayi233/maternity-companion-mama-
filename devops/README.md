# DevOps Quick Reference

This is a simplified reference for the DevOps/Cloud infrastructure. 

**For complete documentation, see the main [README.md](../README.md#devopscloud) in the project root.**

## Quick Commands

```bash
# Bootstrap infrastructure
cd iac/state-bootstrap && terraform init && terraform apply

# Deploy in phases
cd ../environments/dev
terraform init && terraform apply  # Foundation
# Uncomment modules one by one and apply

# Build and deploy
./scripts/build-and-push.sh
./scripts/deploy-frontend.sh

# Verify deployment
curl https://api.auto-hive.site/api/health
```

## Useful Commands
```bash
# Get AWS Account ID
aws sts get-caller-identity --query Account --output text

# Get outputs
terraform output

# Check logs
aws logs tail /ecs/mama-app-dev --follow
```

**See [main README](../README.md#devopscloud) for detailed setup instructions.**