terraform {
  required_version = "> 1.5"

  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    helm = {
      source = "hashicorp/helm"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
  config_context = "minikube"
}

resource "helm_release" "sealed_secrets" {
  name       = "sealed-secrets"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "sealed-secrets"
  version    = ">=1.16.0"

  set {
    name  = "controller.replicaCount"
    value = "1"
  }
}

resource "kubernetes_namespace" "namespace" {
  metadata {
    name = "bsk"
  }
}
