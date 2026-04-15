(function registerUrlUtils(global) {
  var Costnest = global.Costnest;

  function getTemplateIdFromUrl() {
    try {
      var params = new URLSearchParams(global.location.search);
      var value = String(params.get('templateId') || '').trim();
      return value;
    } catch (error) {
      return '';
    }
  }

  Costnest.url = Costnest.url || {};
  Costnest.url.getTemplateIdFromUrl = getTemplateIdFromUrl;
})(window);
