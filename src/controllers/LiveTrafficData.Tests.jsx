/* eslint-env mocha */

'use strict';

import LiveTrafficData from './LiveTrafficData';

const assert = require('assert');

describe('LiveTrafficData', () => {
  let liveTrafficData;
  let graph1;
  let graph2;
  const srcSvc = 'svc2';
  const dstSvc = 'svc1';
  const v1 = 'v1';
  const v2 = 'v2';
  const ingressSvc = 'Ingress';


  before(() => {
    liveTrafficData = new LiveTrafficData();

    // Build sample object
    const conn1 = {};
    conn1.metric = {
      destination_service: dstSvc, source_service: srcSvc, response_code: '200', source_version: v1, destination_version: v1,
    };
    conn1.values = [[0, '0'], [0, '5']];

    const conn2 = {};
    conn2.metric = {
      destination_service: dstSvc, source_service: srcSvc, response_code: '200', source_version: v1, destination_version: v2,
    };
    conn2.values = [[0, '0'], [0, '5']];

    const result1 = [conn1];
    graph1 = { data: { result: result1 } };

    const result2 = [conn1, conn2];
    graph2 = { data: { result: result2 } };
  });


  describe('#buildTrafficDataObject()', () => {
    it('should return graph with 2 vertices and 1 edge with 5 traffic', () => {
      const trafficDataObj = liveTrafficData.buildTrafficDataObject(graph1);
      assert.equal(trafficDataObj.nodes.length, 2);
      assert.equal(trafficDataObj.connections.length, 1);
      assert.equal(trafficDataObj.connections[0].metrics.normal, 5);
    });
  });


  describe('#buildTrafficDataObject()', () => {
    it('different svc versions should map to diff vertices', () => {
      const data = liveTrafficData.buildTrafficDataObject(graph2);
      assert.equal(data.nodes.length, 3);
      assert.equal(data.connections.length, 2);
      assert.equal(data.nodes[0].name, `${dstSvc} ${v1}`);
      assert.equal(data.nodes[1].name, `${dstSvc} ${v2}`);
    });
  });


  describe('#buildDetailsPanelObject()', () => {
    it('should return panel with 5 green 0 yellow 0 red', () => {
      const panelObj = liveTrafficData.buildDetailsPanelObject(graph1);
      assert.equal(panelObj.details[0].metrics.normal, 5);
      assert.equal(panelObj.details[0].metrics.total, 5);
      assert.equal(panelObj.details[0].metrics.warning, 0);
      assert.equal(panelObj.details[0].metrics.danger, 0);
    });
  });


  describe('#buildDetailsPanelObject()', () => {
    it('should return panel with 1 incoming node and ingress node', () => {
      const panelObj = liveTrafficData.buildDetailsPanelObject(graph1);
      assert.equal(panelObj.details.length, 2);
      assert.equal(panelObj.details[0].incoming.length, 1);
      assert.equal(panelObj.details[0].incoming[0].name, `${srcSvc} ${v1}`);
      assert.equal(panelObj.details[1].incoming.length, 0);
      assert.equal(panelObj.details[1].name, ingressSvc);
    });
  });
});
