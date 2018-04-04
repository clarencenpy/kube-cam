'use strict';

class Utils {
  getServiceNames(data) {
    const destinationService = `${data.destination_service} ${data.destination_version}`;

    let sourceService = data.source_service;
    if (sourceService === 'ingress.istio-system.svc.cluster.local') {
      sourceService = 'Ingress';
    } else {
      sourceService = `${data.source_service} ${data.source_version}`;
    }

    return { src: sourceService, dst: destinationService };
  }


  updateConnectionMetrics(metrics, responseCode, seen) {
    const type = responseCode.charAt(0);

    const ResponseCode = {
      SUCCESS: '2',
      CLIENTERROR: '4',
      SERVERERROR: '5',
    };

    if (type === ResponseCode.CLIENTERROR) {
      metrics.warning += seen;
    } else if (type === ResponseCode.SERVERERROR) {
      metrics.danger += seen;
    } else {
      metrics.normal += seen;
    }
  }
}

export default Utils;
