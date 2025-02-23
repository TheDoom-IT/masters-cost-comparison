resource "aws_apigatewayv2_api" "api" {
  name          = "master-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "backend_lambda_integration" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  description        = "Backend Lambda integration"
  integration_method = "POST" # must be POST for AWS_PROXY
  integration_uri    = aws_lambda_function.web.invoke_arn
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "$default"

  target = "integrations/${aws_apigatewayv2_integration.backend_lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id = aws_apigatewayv2_api.api.id
  name   = "$default"

  auto_deploy = true
}

# allow API Gateway to invoke the Lambda function
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.web.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_stage.default_stage.execution_arn}/*"
}
