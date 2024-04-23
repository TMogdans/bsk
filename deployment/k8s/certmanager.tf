resource "kubernetes_namespace" "certmanager" {
  metadata {
    name = "certmanager"
  }
}

resource "helm_release" "certmanager" {
  depends_on = [
    kubernetes_namespace.certmanager,
  ]

  name       = "certmanager"
  namespace  = kubernetes_namespace.certmanager.metadata.0.name

  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"

  set {
    name  = "installCRDs"
    value = "true"
  }
}

resource "time_sleep" "wait_for_certmanager" {
  depends_on = [
    helm_release.certmanager,
  ]

  create_duration = "10s"
}
