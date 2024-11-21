variable "database_url" {
  description = "The URL of the database"
  type        = string
  nullable    = false
}

variable "iteration_tag" {
  description = "Tag used for testing iteration"
  type        = string
  default     = "master"
  nullable    = false
}
