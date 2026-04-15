(function registerRoutesUtils(global) {
  var Costnest = global.Costnest;

  // Zentrale URL-Stelle fuer spaetere Umstellung auf echte SEO-Pfade.
  // Aktuell bleiben wir bewusst beim bestehenden Query-Format.
  function getTemplateDetailUrl(template, options) {
    var key = resolveTemplateKey(template);
    return getTemplateDetailUrlByKey(key, options);
  }

  function getTemplateDetailUrlByKey(templateKey, options) {
    var normalizedKey = String(templateKey || '').trim();
    var safeKey = encodeURIComponent(normalizedKey);
    var settings = options && typeof options === 'object' ? options : {};
    var fromHome = settings.fromHome === true || isHomeContext();

    var pathPrefix = fromHome ? 'pages/' : '';
    return pathPrefix + 'template-detail.html?templateId=' + safeKey;
  }

  function resolveTemplateKey(template) {
    if (!template || typeof template !== 'object') {
      return '';
    }

    var slug = String(template.slug || '').trim();
    if (slug) {
      return slug;
    }

    return String(template.id || '').trim();
  }

  function isHomeContext() {
    try {
      return document && document.body && document.body.getAttribute('data-page') === 'home';
    } catch (error) {
      return false;
    }
  }

  Costnest.routes = {
    getTemplateDetailUrl: getTemplateDetailUrl,
    getTemplateDetailUrlByKey: getTemplateDetailUrlByKey
  };
})(window);
