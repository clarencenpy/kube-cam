const IstioClient = require('../clients/IstioClient');

class RouteRulesController {
  constructor() {
    this.istio = new IstioClient();
  }


  getRouteRuleByNamespaceAndName(namespace, rule, callback) {
    this.istio.getRouteRuleByNamespaceAndName(namespace, rule, callback);
  }
}

module.exports = RouteRulesController;
