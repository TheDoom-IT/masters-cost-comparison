resource "aws_sqs_queue" "worker_queue" {
  name = "master-queue"

  # documentation recommends setting this to 6x the function timeout
  visibility_timeout_seconds = aws_lambda_function.worker.timeout * 6

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.worker_deadletter.arn
    maxReceiveCount     = local.max_jobs_per_invocation
  })
}


resource "aws_lambda_event_source_mapping" "worker_queue_mapping" {
  event_source_arn = aws_sqs_queue.worker_queue.arn
  function_name    = aws_lambda_function.worker.function_name

  function_response_types = ["ReportBatchItemFailures"]

  batch_size = 5
}

resource "aws_sqs_queue" "worker_deadletter" {
  name = "master-deadletter-queue"
}
