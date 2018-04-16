const bodyParser = require('body-parser');
const express = require('express');
const RouteRulesController = require('../controllers/RouteRulesController');

const router = express.Router();
const routeRules = new RouteRulesController();
const jsonParser = bodyParser.json();

const sendResponse = function sendResponse(err, resp, body, res) {
  if (err) {
    res.status(500);
    res.type('json');
    res.send({ error: err });
  } else {
    res.status(resp.statusCode);
    res.type('json');
    res.send(body);
  }
};


router.get('/namespaces/:namespace/:ruleName', (req, res) => {
  const { namespace, ruleName } = req.params;
  const sendResponseWrapper = updateResponse => (err, resp, body) =>
    sendResponse(err, resp, body, updateResponse);
  routeRules.getRouteRuleByNamespaceAndName(namespace, ruleName, sendResponseWrapper(res));
});


router.get('/namespaces/:namespace', (req, res) => {
  const { namespace } = req.params;
  const sendResponseWrapper = updateResponse => (err, resp, body) =>
    sendResponse(err, resp, body, updateResponse);
  routeRules.getRouteRulesByNamespace(namespace, sendResponseWrapper(res));
});


router.put('/namespaces/:namespace/:ruleName', jsonParser, (req, res) => {
  const { namespace, ruleName } = req.params;
  const sendResponseWrapper = updateResponse => (err, resp, body) =>
    sendResponse(err, resp, body, updateResponse);
  const { body } = req.body;
  routeRules.updateRouteRuleByNamespaceAndName(namespace, ruleName, body,
    sendResponseWrapper(res));
});


router.delete('/namespaces/:namespace/:ruleName', (req, res) => {
  const { namespace, ruleName } = req.params;
  const sendResponseWrapper = updateResponse => (err, resp, body) =>
    sendResponse(err, resp, body, updateResponse);
  routeRules.deleteRouteRuleByNamespaceAndName(namespace, ruleName, sendResponseWrapper(res));
});

module.exports = router;
