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

View traffic in kube-cam application in the browser at [http://...](http://...)

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
