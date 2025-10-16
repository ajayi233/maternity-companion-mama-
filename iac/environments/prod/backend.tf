terraform {
  backend "s3" {
    bucket       = "cloud-crew-terraform-state-2025"
    key          = "prod/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true
    profile      = "cloud-crew-profile"
  }
}
