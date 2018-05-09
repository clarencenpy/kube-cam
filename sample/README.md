## Deploying a sample application

Deploy application with Istio sidecar injection

```
kubectl apply -f <(istioctl kube-inject -f config.yaml)
```

Get the IP address used by the frontend container

```
kubectl get ingress
```

Deploy kube-cam application  (tbd)

```
npm run dev
```

Send traffic to frontend container

```
curl $ip_address
```

View traffic in kube-cam application in the browser at http://ip-address

## Deploying a sample application with mirroring

Deploy second version of sample application

```
kubectl apply -f <(istioctl kube-inject -f config-frontend-v2.yaml)
```

Visit `http://localhost:8080`, verify that traffic gets routed round-robin between v1 and v2 of the frontend service.

Create routing rules to route all traffic to v1 of the frontend service.

```
istioctl create -f route-mirror.yaml
```

Create routing rules to mirror traffic to v2 of the frontend service.

```
istioctl create -f route-mirror.yaml
```

## Notes

### Sending traffic to the service
See [traffic](traffic) for more information on how to set up a script to generate traffic

### More details
The frontend service supports 2 endpoints

* `/`
* `/number`

The `/number` endpoint sends a request to the backend service, so a `GET /number`
request will show traffic between the internet and the frontend service, and from the
frontend service to the backend service.
