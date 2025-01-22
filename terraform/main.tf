terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = "1.7.5"
}


provider "aws" {
  default_tags {
    tags = {
      Application = "Master"
      Iteration   = var.iteration_tag
    }
  }
}
