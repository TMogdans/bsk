resource "kubernetes_deployment" "nats_deployment" {
  depends_on = [kubernetes_namespace.namespace]

  metadata {
    name      = "nats"
    namespace = kubernetes_namespace.namespace.metadata[0].name
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
  depends_on = [kubernetes_deployment.nats_deployment]

  metadata {
    name      = "nats"
    namespace = kubernetes_namespace.namespace.metadata[0].name
  }

  spec {
    selector = {
      app = "nats"
    }

    port {
      name        = "client"
      port        = 4222
      target_port = 4222
    }

    port {
      name        = "cluster"
      port        = 8222
      target_port = 8222
    }
  }
}