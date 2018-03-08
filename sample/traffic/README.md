## Steps to generate visitor traffic

### Setup

Install pip dependencies

```
pip install -r requirements.txt
```

### Running locally

Export the following environment variables

```
export URL=""
```

Start script

```
locust -f generate_traffic.py --host=$URL
```

Visit http://localhost:8089 to initialize test


### Running in a cluster

See the Locust [helm chart](https://github.com/kubernetes/charts/tree/master/stable/locust) for setting up a load test in the Kubernetes cluster  
