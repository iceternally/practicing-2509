variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for resources"
  type        = string
  default     = "t3-demo"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Public subnet CIDR"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "key_name" {
  description = "Existing EC2 key pair name (for SSH). Leave empty to skip."
  type        = string
  default     = ""
}

variable "repo_url" {
  description = "Git repo URL that contains the app to deploy (placeholder)"
  type        = string
  default     = "https://github.com/your-org/your-repo.git"
}

variable "create_s3" {
  description = "Create an example S3 bucket (optional)"
  type        = bool
  default     = false
}

variable "s3_bucket_name" {
  description = "S3 bucket name (if create_s3=true)"
  type        = string
  default     = ""
}
