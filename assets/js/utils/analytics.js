(function registerAnalyticsUtils(global) {
  var Costnest = global.Costnest;

  function trackEvent(eventName, params) {
    if (typeof eventName !== 'string' || !eventName.trim()) {
      return;
    }

    if (typeof global.gtag !== 'function') {
      return;
    }

    try {
      global.gtag('event', eventName, sanitizeParams(params));
    } catch (error) {
      return;
    }
  }

  function sanitizeParams(params) {
    if (!params || typeof params !== 'object') {
      return {};
    }

    var safe = {};
    Object.keys(params).forEach(function (key) {
      var value = params[key];
      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        safe[key] = value;
      }
    });

    return safe;
  }

  Costnest.analytics = {
    trackEvent: trackEvent
  };
})(window);
