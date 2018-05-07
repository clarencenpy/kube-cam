/* eslint-env mocha */

const TrafficFlow = require('./TrafficFlowController');
const assert = require('assert');

describe('TrafficFlowController', () => {
  let trafficFlow;
  let graph1;
  let graph2;
  const srcSvc = 'svc2';
  const dstSvc = 'svc1';
  const v1 = 'v1';
  const v2 = 'v2';


  before(() => {
    trafficFlow = new TrafficFlow();

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
      const trafficDataObj = trafficFlow.buildTrafficDataObject(graph1);
      assert.equal(trafficDataObj.nodes.length, 2);
      assert.equal(trafficDataObj.connections.length, 1);
      assert.equal(trafficDataObj.connections[0].metrics.normal, 5);
    });
  });


  describe('#buildTrafficDataObject()', () => {
    it('different svc versions should map to diff vertices', () => {
      const data = trafficFlow.buildTrafficDataObject(graph2);
      assert.equal(data.nodes.length, 3);
      assert.equal(data.connections.length, 2);
      assert.equal(data.nodes[0].name, `${dstSvc} ${v1}`);
      assert.equal(data.nodes[1].name, `${dstSvc} ${v2}`);
    });
  });
});
