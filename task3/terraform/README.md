# Terraform demo/template for task3

This folder contains a minimal Terraform template that provisions:

- VPC
- Public subnet
- Internet Gateway and public route
- Security Group (SSH, HTTP, and port 8000 for uvicorn)
- EC2 instance that bootstraps a repo and starts a FastAPI app with uvicorn
- Optional S3 bucket (controlled by `create_s3`)

Notes:
- This is a demo/template. Review user_data and the `repo_url` variable and update
  the uvicorn start command to match your app's module path (e.g. `app.main:app`).
- The EC2 user_data uses Amazon Linux 2 and installs git and python3. For production
  you'd replace this with a baked AMI or a proper configuration management approach.

Quickstart:

1. Copy `terraform.tfvars.example` to `terraform.tfvars` and edit values.

2. Initialize and apply (PowerShell example):

```powershell
cd task3/terraform
terraform init
terraform apply
```

3. After apply, the `instance_public_ip` output shows the public IP. The FastAPI
   app should be reachable at `http://<ip>:8000` (or port 80 if your app binds there).

Cleanup:

```powershell
terraform destroy
```

Security:

- The security group allows SSH from anywhere for demo convenience — restrict it
  before using in any real environment.
- If you provide `key_name`, Terraform will associate it to the EC2 instance so
  you can SSH in.
