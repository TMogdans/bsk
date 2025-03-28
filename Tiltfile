k8s_yaml([
'./deployment/k8s/monitoring/namespace.yaml',
'./deployment/k8s/monitoring/prometheus/configMap.yaml',
'./deployment/k8s/monitoring/prometheus/clusterRole.yaml',
'./deployment/k8s/monitoring/prometheus/deployment.yaml',
'./deployment/k8s/monitoring/prometheus/service.yaml',
])

k8s_yaml([
'./deployment/k8s/nats/deployment.yaml',
'./deployment/k8s/nats/service.yaml',
])

k8s_yaml([
'./deployment/k8s/krakend/configMap.yaml',
'./deployment/k8s/krakend/deployment.yaml',
'./deployment/k8s/krakend/service.yaml',
'./deployment/k8s/krakend/ingress.yaml',
])

k8s_yaml([
'./deployment/k8s/namespace.yaml',
'./services/library-service/deployment/production/k8s/configMap.yaml',
'./services/library-service/deployment/production/k8s/deployment.yaml',
'./services/library-service/deployment/production/k8s/service.yaml',
])

k8s_yaml([
'./rating-write-service/deployment/production/k8s/db/postgres-configmap.yaml',
'./rating-write-service/deployment/production/k8s/db/postgres-deployment.yaml',
'./rating-write-service/deployment/production/k8s/db/postgres-service.yaml',
'./rating-write-service/deployment/production/k8s/db/rating-write-service-postgres-storage.yaml',
'./rating-write-service/deployment/production/k8s/db/sealed-postgres-password-secret.yaml',

'./rating-write-service/deployment/production/k8s/configMap.yaml',
'./rating-write-service/deployment/production/k8s/autoscaler.yaml',
'./rating-write-service/deployment/production/k8s/deployment.yaml',
'./rating-write-service/deployment/production/k8s/service.yaml',
])

k8s_resource(
'krakend',
port_forwards=['8080:8080', '8090:8090'],
labels=['api-gateway']
)

k8s_resource(
'library-service',
labels=['services']
)

k8s_resource(
'rating-write-service',
labels=['services']
)

k8s_resource(
'nats',
port_forwards=['4222:4222', '8222:8222'],
labels=['messaging']
)

k8s_resource(
'prometheus-server',
port_forwards=['9090:9090'],
labels=['monitoring']
)
