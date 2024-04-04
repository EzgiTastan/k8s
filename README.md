# Microservices Communication with RabbitMQ and Kubernetes

This repository demonstrates the communication between microservices using RabbitMQ -as the message broker- and Kubernetes -for orchestration-. It consists of multiple microservices including a client application, a provider application, a MySQL database, and RabbitMQ, each running in its own Kubernetes deployment.

## Prerequisites

Before you begin, ensure you have the following technologies are installed:
- Kubernetes
- Docker

## Setup Instructions

1. **Clone the Repository**: Clone this repository to your local machine.

2. **Deploy RabbitMQ**: Apply the RabbitMQ deployment and service configuration files to your Kubernetes cluster.
    ```bash
    kubectl apply -f k8s/deployments/rabbitmq.yaml
    kubectl apply -f k8s/services/rabbitmq-service.yaml
    ```

3. **Deploy MySQL**: Apply the MySQL deployment and service configuration files.
    ```bash
    kubectl apply -f k8s/deployments/mysql-deployment.yaml
    kubectl apply -f k8s/services/mysql-service.yaml
    ```

4. **Deploy Client Application**: Apply the client application deployment and service configuration files.
    ```bash
    kubectl apply -f k8s/deployments/client-deployment.yaml
    kubectl apply -f k8s/services/client-service.yaml
    ```

5. **Deploy Provider Application**: Apply the provider application deployment and service configuration files.
    ```bash
    kubectl apply -f k8s/deployments/provider-deployment.yaml
    kubectl apply -f k8s/services/provider-service.yaml
    ```

6. **Access Services**: Once all deployments are running, you can access the client application at `http://localhost:3000` and the provider application at `http://localhost:3000`.
