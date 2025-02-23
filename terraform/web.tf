resource "aws_lambda_function" "web" {
  function_name = "master-web"
  role          = aws_iam_role.web_role.arn
  handler       = "dist/lambda-main.handler"
  filename      = "lambda_function_payload.zip"

  timeout = 29 # API Gateway has a 30 second timeout
  # The web uses around 110MB (90%) of memory
  memory_size   = 128
  architectures = ["x86_64"]

  runtime = "nodejs20.x"

  environment {
    variables = {
      DATABASE_URL  = var.database_url
      SQS_QUEUE_URL = aws_sqs_queue.worker_queue.url
    }
  }
}

data "aws_iam_policy_document" "web_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "web_role" {
  name               = "master-web-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.web_assume_role.json
}

resource "aws_iam_role_policy_attachment" "web_attachment" {
  role       = aws_iam_role.web_role.name
  policy_arn = aws_iam_policy.web_lambda_policy.arn
}

resource "aws_iam_policy" "web_lambda_policy" {
  name = "web-lambda-policy"

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
      },
      {
        Sid    = "AllowSQS"
        Effect = "Allow"
        Action = [
          "sqs:sendmessage"
        ]
        Resource = [
          aws_sqs_queue.worker_queue.arn
        ]
      },
    ]
  })
}
