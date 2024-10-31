# locals {
#   database_url = "postgres://master:${random_password.db_password.result}@${aws_db_instance.db.address}:5432/master?ssl=no-verify"
#   zones = ["eu-west-1a", "eu-west-1b"]
# }
#
# resource "random_password" "db_password" {
#   length  = 16
#   special = false
# }
#
# resource "aws_db_instance" "db" {
#   identifier        = "master-db"
#   db_name           = "master"
#   allocated_storage = 10
#   engine            = "postgres"
#   engine_version    = "16.3"
#   instance_class    = "db.t3.micro"
#
#   username = "master"
#   password = random_password.db_password.result
#
#   db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
#   vpc_security_group_ids = [aws_security_group.group.id]
#
#   skip_final_snapshot = true
#   publicly_accessible = true
# }
#
# resource "aws_db_subnet_group" "db_subnet_group" {
#   name       = "master-db-subnet-group"
#   subnet_ids = [for subnet in aws_subnet.main : subnet.id]
# }
#
#
# resource "aws_vpc" "main" {
#   cidr_block = "10.0.0.0/16"
#
#   enable_dns_support = true
#   # for public DB
#   enable_dns_hostnames = true
# }
#
# resource "aws_subnet" "main" {
#   count = 2
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.${count.index}.0/24"
#   availability_zone = local.zones[count.index]
# }
#
# resource "aws_route_table_association" "main" {
#   count = 2
#   subnet_id      = aws_subnet.main[count.index].id
#   route_table_id = aws_route_table.table.id
# }
#
# resource "aws_route_table" "table" {
#   vpc_id = aws_vpc.main.id
#
#   route {
#     cidr_block = "10.0.0.0/16"
#     gateway_id = "local"
#   }
#
#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.gw.id
#   }
# }
#
# resource "aws_internet_gateway" "gw" {
#   vpc_id = aws_vpc.main.id
# }
#
# resource "aws_security_group" "group" {
#   name   = "db-security-group"
#   vpc_id = aws_vpc.main.id
# }
#
# resource "aws_vpc_security_group_ingress_rule" "ingress_db" {
#   security_group_id = aws_security_group.group.id
#   cidr_ipv4         = "0.0.0.0/0"
#   from_port         = 5432
#   to_port           = 5432
#   ip_protocol       = "tcp"
# }
#
# resource "aws_vpc_security_group_egress_rule" "egress_all" {
#   security_group_id = aws_security_group.group.id
#   cidr_ipv4         = "0.0.0.0/0"
#   ip_protocol       = "-1"
# }
