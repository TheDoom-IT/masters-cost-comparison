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
    "label": ""
}
with Diagram("AWS Cloud architecture", show=False, direction="LR", graph_attr=graph_attr):
    with Cluster("AWS Cloud"):
        with Cluster("Web"):
            api = APIGateway("API Gateway")
            server = Lambda("Web")
            api >> server
        with Cluster("Worker"):
            worker = Lambda("Worker")
            server >> SQS("Worker queue") >> worker

    User("User") >> api

graph_attr = {
    "pad": "0.2",
    "splines": "true",
    "label": ""
}
with Diagram("Dedicated server architecture", show=False, direction="TB", graph_attr=graph_attr):
    with Cluster("Dedicated server"):
        with Cluster("Web"):
            nginx = Nginx("Nginx")
            servers = [Docker("Web instance 1"), Docker("Web instance 2")]
            nginx >> servers
        with Cluster("Worker"):
            workers = [Docker("Worker instance 1"), Docker("Worker instance 2"), Docker("Worker instance 3")]

    User("User") >> nginx

graph_attr = {
    "pad": "0.2",
    "splines": "true",
    "label": ""
}
with Diagram("JMeter distributed testing", show=False, direction="TB", graph_attr=graph_attr):
    with Cluster(""):
        instances = [EC2("JMeter node 1"), EC2("JMeter node 2"), EC2("JMeter node 3"), EC2("JMeter node 4")]
        EC2("JMeter controller node") >> instances

    instances >> Server("Application")



