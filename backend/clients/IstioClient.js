const request = require('request');

class IstioClient {
  constructor() {
    this.baseUrl = 'http://localhost:8081/apis/config.istio.io/v1alpha2'
  }


  getRouteRuleByNamespaceAndName(namespace, rule, callback) {
    const url = `${this.baseUrl}/namespaces/${namespace}/routerules/${rule}`;
    request(url, callback);
  }
}

module.exports = IstioClient;
