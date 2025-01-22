from diagrams import Diagram, Cluster
from diagrams.aws.compute import Lambda, EC2
from diagrams.aws.integration import SQS
from diagrams.aws.network import APIGateway
from diagrams.onprem.client import Client, User
from diagrams.onprem.compute import Server
from diagrams.onprem.container import Docker
from diagrams.onprem.network import Nginx

graph_attr = {
    "pad": "0.2",
}
with Diagram("AWS Cloud infrastructure", show=False, direction="LR", graph_attr=graph_attr):
    with Cluster("AWS Cloud"):
        with Cluster("Server"):
            api = APIGateway("API Gateway")
            server = Lambda("Server")
            api >> server
        with Cluster("Worker"):
            worker = Lambda("Worker")
            server >> SQS("Worker queue") >> worker

    User("User") >> api

graph_attr = {
    "pad": "0.2",
    "splines": "true"
}
with Diagram("Dedicated server infrastructure", show=False, direction="TB", graph_attr=graph_attr):
    with Cluster("Dedicated server"):
        with Cluster("Server"):
            nginx = Nginx("Nginx")
            servers = [Docker("Server instance 1"), Docker("Server instance 2")]
            nginx >> servers
        with Cluster("Worker"):
            workers = [Docker("Worker instance 1"), Docker("Worker instance 2"), Docker("Worker instance 3")]

    User("User") >> nginx

graph_attr = {
    "pad": "0.2",
    "splines": "true"
}
with Diagram("JMeter testing platform", show=False, direction="TB", graph_attr=graph_attr):
    with Cluster(""):
        instances = [EC2("JMeter slave 1"), EC2("JMeter slave 2"), EC2("JMeter slave 3")]

    Client("JMeter master") >> instances

    instances >> Server("Application")



