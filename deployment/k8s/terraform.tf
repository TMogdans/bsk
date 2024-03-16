terraform {
  required_version = "> 1.5"
}

provider "kubernetes" {
  config_path = "~/.kube/config"
  config_context = "minikube"
}

resource "helm_release" "sealed_secrets" {
  name       = "sealed-secrets"
  repository = "https://github.com/bitnami/charts"
  chart      = "sealed-secrets"
  version    = ">=1.16.0"

  set {
    name  = "controller.replicaCount"
    value = "1"
  }
}

resource "kubernetes_namespace" "game_unity" {
  metadata {
    name = "game-unity"
  }
}

resource "kubernetes_deployment" "nats_deployment" {
  metadata {
    name      = "nats"
    namespace = kubernetes_namespace.game_unity.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "nats"
      }
    }

    template {
      metadata {
        labels = {
          app = "nats"
        }
      }

      spec {
        container {
          name  = "nats"
          image = "nats:latest"
        }
      }
    }
  }
}

resource "kubernetes_service" "nats_service" {
  metadata {
    name      = "nats"
    namespace = kubernetes_namespace.game_unity.metadata[0].name
  }

  spec {
    selector = {
      app = "nats"
    }

    port {
      port        = 4222
      target_port = 4222
    }

    port {
      port        = 8222
      target_port = 8222
    }
  }
}
