terraform {
  backend "s3" {
    bucket       = "cloud-crew-terraform-state-2025"  # Updated bucket name
    key          = "dev/terraform.tfstate"
    region       = "us-west-2"
    encrypt      = true
    use_lockfile = true  # Enable S3 native locking
    profile      = "cloud-crew-profile"
  }
} 