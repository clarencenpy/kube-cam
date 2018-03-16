/* eslint-env mocha */

'use strict';

import LiveTrafficData from './LiveTrafficData';

const assert = require('assert');

describe('LiveTrafficData', () => {
  let liveTrafficData;
  let oneConnection;
  const srcSvc = 'svc2';
  const dstSvc = 'svc1';
  const ingressSvc = 'Ingress';


  before(() => {
    liveTrafficData = new LiveTrafficData();

    // Build sample object
    const conn1 = {};
    conn1.metric = { destination_service: dstSvc, source_service: srcSvc, response_code: '200' };
    conn1.values = [[0, '0'], [0, '5']];
    const result = [conn1];
    oneConnection = { data: { result: result } };
  });


  describe('#buildTrafficDataObject()', () => {
    it('should return graph with 2 vertices and 1 edge with 5 traffic', () => {
      const trafficDataObj = liveTrafficData.buildTrafficDataObject(oneConnection);
      assert.equal(trafficDataObj.nodes.length, 2);
      assert.equal(trafficDataObj.connections.length, 1);
      assert.equal(trafficDataObj.connections[0].metrics.normal, 5);
    });
  });


  describe('#buildDetailsPanelObject()', () => {
    it('should return panel with 5 green 0 yellow 0 red', () => {
      const panelObj = liveTrafficData.buildDetailsPanelObject(oneConnection);
      assert.equal(panelObj.details[0].metrics.normal, 5);
      assert.equal(panelObj.details[0].metrics.total, 5);
      assert.equal(panelObj.details[0].metrics.warning, 0);
      assert.equal(panelObj.details[0].metrics.danger, 0);
    });
  });


  describe('#buildDetailsPanelObject()', () => {
    it('should return panel with 1 incoming node and ingress node', () => {
      const panelObj = liveTrafficData.buildDetailsPanelObject(oneConnection);
      assert.equal(panelObj.details.length, 2);
      assert.equal(panelObj.details[0].incoming.length, 1);
      assert.equal(panelObj.details[0].incoming[0].name, srcSvc);
      assert.equal(panelObj.details[1].incoming.length, 0);
      assert.equal(panelObj.details[1].name, ingressSvc);
    });
  });
});
