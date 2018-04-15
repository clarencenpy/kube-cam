const express = require('express');
const RouteRulesController = require('../controllers/RouteRulesController');

const router = express.Router();
const routeRules = new RouteRulesController();

router.get('/namespaces/*/*', (req, res) => {
  const { 0: namespace, 1: ruleName } = req.params;
  const sendResponse = function sendResponse(err, resp, body) {
    res.status(resp.statusCode);
    res.send(body);
  };
  routeRules.getRouteRuleByNamespaceAndName(namespace, ruleName, sendResponse);
});

module.exports = router;
