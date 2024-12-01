from diagrams import Diagram, Cluster
from diagrams.aws.compute import Lambda, EC2
from diagrams.aws.database import RDSPostgresqlInstance
from diagrams.aws.integration import SQS
from diagrams.aws.network import APIGateway
from diagrams.onprem.client import Client, User
from diagrams.onprem.compute import Server
from diagrams.onprem.container import Docker

graph_attr = {
    "pad": "0.2",
}

with Diagram("Web application with worker", show=False, direction="LR", graph_attr=graph_attr):
    with Cluster("AWS Cloud"):
        with Cluster("Server"):
            api = APIGateway("API Gateway")
            server = Lambda("Server")
            api >> server
        with Cluster("Worker"):
            worker = Lambda("Worker")
            server >> SQS("Worker queue") >> worker

    User("User") >> api
    [worker, server] >> RDSPostgresqlInstance("Database")

with Diagram("Dedicated server infrastructure", show=False, direction="TB", graph_attr=graph_attr):
    with Cluster("Dedicated server"):
        containers = [Docker("Server"), Docker("Worker")]

    containers >> RDSPostgresqlInstance("Database")

graph_attr = {
    "pad": "0.2",
    "splines": "true"
}
with Diagram("JMeter testing platform", show=False, direction="TB", graph_attr=graph_attr):
    with Cluster(""):
        instances = [EC2("JMeter slave 1"), EC2("JMeter slave 2"), EC2("JMeter slave 3")]

    Client("JMeter master") >> instances

    instances >> Server("Application")



