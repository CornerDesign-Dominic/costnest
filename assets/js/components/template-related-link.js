(function registerTemplateRelatedLinkComponent(global) {
  var Costnest = global.Costnest;

  function renderRelatedTemplateLink(template) {
    var templateKey = encodeURIComponent(String(template && (template.slug || template.id) ? (template.slug || template.id) : ''));
    var label = escapeHtml(String(template && template.name ? template.name : 'Vorlage'));

    return '<a class="template-related__link" href="template-detail.html?templateId=' + templateKey + '">' + label + '</a>';
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  Costnest.components = Costnest.components || {};
  Costnest.components.templateRelatedLink = {
    renderRelatedTemplateLink: renderRelatedTemplateLink
  };
})(window);
