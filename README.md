# kube-cam
[![Build Status](https://travis-ci.com/setttings/kube-cam.svg?token=rnsfBSr65omB9Dwzrq4q&branch=master)](https://travis-ci.com/setttings/kube-cam)

Monitoring network traffic on a Kubernetes cluster.

Disclaimer: No identification with actual persons (living or deceased), places, buildings, and products is intended or should be inferred.

## What's Included
* A
* B
* C

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What you need to install the software and how to install them

* [Istio](https://istio.io/)
* [Node.js](https://nodejs.org/en/)

### Installing

Set up a Kubernetes cluster with Istio installed and deploy your application with Istio sidecars.

```
kubectl apply -f install/kubernetes/istio.yaml
```

See the [Istio documentation](https://istio.io/docs/setup/kubernetes/quick-start.html) for detailed instructions and the [sample application](sample) for an example of how to get started.

Install the Prometheus add-on for Istio.

```
kubectl apply -f install/kubernetes/addons/prometheus.yaml
```

Setup port-forwarding for Prometheus.

```
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=prometheus -o jsonpath='{.items[0].metadata.name}') 9090:9090 &
```

Start the kube-cam application.

```
npm install

npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) in your browser.

## Testing

### E2E tests

```
npm test
```

### Style

```
npm run lint
```

## Deployment (tbd)

Build the Kube-Cam image

```
docker build -t kube-cam:latest .
```

Start the Kube-Cam container

```
docker run -p 8080:80 kube-cam:latest
```

## Built With
* Stress
* [Structured procrastination](http://www.structuredprocrastination.com/)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

*

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
