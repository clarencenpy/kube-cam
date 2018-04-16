const IstioClient = require('../clients/IstioClient');

class RouteRulesController {
  constructor() {
    this.istio = new IstioClient();
  }


  getRouteRuleByNamespaceAndName(namespace, rule, callback) {
    this.istio.getRouteRuleByNamespaceAndName(namespace, rule, callback);
  }


  getRouteRulesByNamespace(namespace, callback) {
    this.istio.getRouteRulesByNamespace(namespace, callback);
  }


  deleteRouteRuleByNamespaceAndName(namespace, rule, callback) {
    this.istio.deleteRouteRuleByNamespaceAndName(namespace, rule, callback);
  }


  updateRouteRuleByNamespaceAndName(namespace, ruleName, ruleObject, sendRespCallback) {
    const istio = new IstioClient();
    const addOrUpdateRule = function addOrUpdateRule(err, resp, body) {
      if (resp.statusCode !== 404) {
        const createRule = function createRule(err, resp, respBody) {
          if (err) {
            console.log(err);
          } else {
            istio.createRouteRuleByNamespaceAndName(namespace, ruleObject, sendRespCallback);
          }
        }
        istio.deleteRouteRuleByNamespaceAndName(namespace, ruleName, createRule);
      } else {
        istio.createRouteRuleByNamespaceAndName(namespace, ruleObject, sendRespCallback);
      }
    };
    istio.getRouteRuleByNamespaceAndName(namespace, ruleName, addOrUpdateRule);
  }
}

module.exports = RouteRulesController;
