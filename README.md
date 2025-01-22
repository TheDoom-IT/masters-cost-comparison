# Cost comparison between AWS Lambda and dedicated server

This repository contains the following directories:
- [app](app/README.md): A simple Node.js application used to 
    load test both environments (AWS Lambda and dedicated server) and
    generate costs.
- diagrams: Diagrams used to explain the architecture of the
    application on different environments. It uses Python [diagrams](https://diagrams.mingrammer.com/)
    package for drawing.
- [traffic](app/README.md): Scripts used to download and parse
    traffic data from Wikipedia.
- [terraform](terraform/README.md): Terraform scripts required
    to deploy the infrastructure on AWS.
- load-test: Contains scripts used to run Apache Jmeter load tests
    on both environments.
