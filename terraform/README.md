# Terraform for cost comparison application

This directory contains Terraform configuration required to
run application stored in `../app` directory.

## Requirements
Terraform version 1.7.5 is required to run this configuration.

Before proceeding, create `.env` file based on the `.env.dist` file
and fill it in with proper values.

## Usage
```bash
# Export environment variables
export `cat .env`

# Init Terraform
terraform init

# Apply Terraform
terraform apply
```
