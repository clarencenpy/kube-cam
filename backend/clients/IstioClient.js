const config = require('config');
const request = require('request');

class IstioClient {
  constructor() {
    this.baseUrl = `${config.get('istio')}/apis/config.istio.io/v1alpha2`;
  }


  getRouteRuleByNamespaceAndName(namespace, rule, callback) {
    const url = `${this.baseUrl}/namespaces/${namespace}/routerules/${rule}`;
    request.get(url, callback);
  }


  getRouteRulesByNamespace(namespace, callback) {
    const url = `${this.baseUrl}/namespaces/${namespace}/routerules`;
    request.get(url, callback);
  }


  deleteRouteRuleByNamespaceAndName(namespace, rule, callback) {
    const url = `${this.baseUrl}/namespaces/${namespace}/routerules/${rule}`;
    request.delete(url, callback);
  }


  createRouteRuleByNamespaceAndName(namespace, body, callback) {
    const url = `${this.baseUrl}/namespaces/${namespace}/routerules`;
    const options = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, */*'
      },
      body: JSON.stringify(body)
    };
    request(options, callback);
  }

}

module.exports = IstioClient;
