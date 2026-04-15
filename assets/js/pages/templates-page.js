(function registerTemplatesPage(global) {
  var Costnest = global.Costnest;

  function initTemplatesPage() {
    if (document.body.getAttribute('data-page') !== 'templates') {
      return;
    }

    var listElement = document.getElementById('template-list');
    if (!listElement || !Costnest.templateRepository || typeof Costnest.templateRepository.getAll !== 'function') {
      return;
    }

    var templates = Costnest.templateRepository.getAll();
    listElement.innerHTML = templates.map(function (template) {
      return [
        '<a class="card template-card template-card--link" href="template-detail.html?templateId=' + encodeURIComponent(template.id) + '">',
        '  <h2>' + escapeHtml(template.name) + '</h2>',
        '  <p>' + escapeHtml(template.description) + '</p>',
        '  <small>5 Vorschlaege</small>',
        '</a>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  Costnest.pages = Costnest.pages || {};
  Costnest.pages.templates = {
    init: initTemplatesPage
  };
})(window);
