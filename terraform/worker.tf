locals {
  # CPU - 1
  # Memory - 5
  # IO - 10
  max_jobs_per_invocation = 5
}

resource "aws_lambda_function" "worker" {
  function_name = "master-worker"
  role          = aws_iam_role.worker_role.arn
  handler       = "dist/lambda-main.handler"
  filename      = "lambda_function_payload.zip"

  timeout = 60
  # CPU - 1024
  # Memory - 5200
  # IO - 128
  memory_size   = 5200
  architectures = ["x86_64"]

  runtime = "nodejs20.x"

  environment {
    variables = {
      DATABASE_URL = var.database_url
      BUCKET_NAME  = aws_s3_bucket.files.bucket
    }
  }
}

data "aws_iam_policy_document" "worker_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "worker_role" {
  name               = "master-worker-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.worker_assume_role.json
}

# allow to read from SQS
resource "aws_iam_role_policy_attachment" "sqs_role_attachment" {
  role       = aws_iam_role.worker_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

resource "aws_iam_role_policy_attachment" "worker_attachment" {
  role       = aws_iam_role.worker_role.name
  policy_arn = aws_iam_policy.worker_lambda_policy.arn
}

resource "aws_iam_policy" "worker_lambda_policy" {
  name = "worker-lambda-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Sid    = "AllowS3"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.files.arn,
          "${aws_s3_bucket.files.arn}/*"
        ]
      }
    ]
  })
}
