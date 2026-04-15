(function registerTemplateDetailPage(global) {
  var Costnest = global.Costnest;

  function initTemplateDetailPage() {
    if (document.body.getAttribute('data-page') !== 'template-detail') {
      return;
    }

    var notFoundElement = document.getElementById('template-not-found');
    var contentElement = document.getElementById('template-detail-content');
    var titleElement = document.getElementById('template-title');
    var introCopyElement = document.getElementById('template-intro-copy');
    var purposeCopyElement = document.getElementById('template-purpose-copy');
    var suggestionsListElement = document.getElementById('template-suggestions-list');
    var relatedSection = document.getElementById('template-related');
    var relatedLinksElement = document.getElementById('template-related-links');
    var bottomConvertButton = document.getElementById('convert-template-bottom');

    if (!notFoundElement || !contentElement || !titleElement || !introCopyElement || !purposeCopyElement || !suggestionsListElement || !relatedSection || !relatedLinksElement || !bottomConvertButton) {
      return;
    }

    var templateId = Costnest.url && typeof Costnest.url.getTemplateIdFromUrl === 'function'
      ? Costnest.url.getTemplateIdFromUrl()
      : String(new URLSearchParams(global.location.search).get('templateId') || '').trim();
    var template = Costnest.templateRepository && typeof Costnest.templateRepository.getById === 'function'
      ? Costnest.templateRepository.getById(templateId)
      : null;

    if (!template) {
      contentElement.hidden = true;
      notFoundElement.hidden = false;
      return;
    }

    contentElement.hidden = false;
    notFoundElement.hidden = true;
    titleElement.textContent = template.name;
    introCopyElement.textContent = template.intro || 'Diese Vorlage hilft dir beim schnellen Einstieg.';
    purposeCopyElement.textContent = template.purposeText || template.description || 'Waehle passende Vorschlaege aus und uebernimm sie in eine Sammlung.';
    applyTemplateSeo(template);
    renderRelatedTemplates();

    var checkedMap = {};
    template.suggestions.forEach(function (_, index) {
      checkedMap[String(index)] = true;
    });

    renderSuggestions();

    suggestionsListElement.addEventListener('change', function (event) {
      var toggle = event.target.closest('[data-suggestion-index]');
      if (!toggle) {
        return;
      }

      checkedMap[String(toggle.getAttribute('data-suggestion-index'))] = Boolean(toggle.checked);
      syncConvertButtons();
    });

    bottomConvertButton.addEventListener('click', convertToCollection);

    function syncConvertButtons() {
      var selectedCount = countSelected();
      var label = selectedCount > 0
        ? 'In Sammlung umwandeln (' + selectedCount + ')'
        : 'In Sammlung umwandeln (0)';

      bottomConvertButton.textContent = label;
    }

    function countSelected() {
      return template.suggestions.reduce(function (acc, _, index) {
        return checkedMap[String(index)] ? acc + 1 : acc;
      }, 0);
    }

    function renderSuggestions() {
      var renderer = Costnest.components
        && Costnest.components.templateSuggestionItem
        && typeof Costnest.components.templateSuggestionItem.renderTemplateSuggestionItem === 'function'
        ? Costnest.components.templateSuggestionItem.renderTemplateSuggestionItem
        : null;

      suggestionsListElement.innerHTML = template.suggestions.map(function (suggestion, index) {
        if (renderer) {
          return renderer(suggestion, index);
        }

        return renderSuggestionFallback(suggestion, index);
      }).join('');

      syncConvertButtons();
    }

    function convertToCollection() {
      var selectedSuggestions = template.suggestions.filter(function (_, index) {
        return Boolean(checkedMap[String(index)]);
      });

      var result = Costnest.domain
        && Costnest.domain.templates
        && typeof Costnest.domain.templates.createCollectionFromTemplate === 'function'
        ? Costnest.domain.templates.createCollectionFromTemplate(template, selectedSuggestions)
        : null;

      if (!result || !result.collection) {
        return;
      }

      if (Costnest.toast && typeof Costnest.toast.flashNextPage === 'function') {
        Costnest.toast.flashNextPage('Sammlung erstellt');
      }

      global.location.href = 'collection-detail.html?collectionId=' + encodeURIComponent(result.collection.id);
    }

    function renderRelatedTemplates() {
      if (!Costnest.templateRepository || typeof Costnest.templateRepository.getRelatedByCategory !== 'function') {
        relatedSection.hidden = true;
        return;
      }

      var relatedTemplates = Costnest.templateRepository.getRelatedByCategory(template.slug || template.id, 4).slice(0, 4);
      if (!relatedTemplates.length) {
        relatedSection.hidden = true;
        relatedLinksElement.innerHTML = '';
        return;
      }

      var linkRenderer = Costnest.components
        && Costnest.components.templateRelatedLink
        && typeof Costnest.components.templateRelatedLink.renderRelatedTemplateLink === 'function'
        ? Costnest.components.templateRelatedLink.renderRelatedTemplateLink
        : null;

      relatedSection.hidden = false;
      relatedLinksElement.innerHTML = relatedTemplates.slice(0, 4).map(function (entry) {
        if (linkRenderer) {
          return linkRenderer(entry);
        }

        return renderRelatedLinkFallback(entry);
      }).join('');
    }
  }

  function applyTemplateSeo(template) {
    var fallbackTitle = 'Vorlage | Costnest';
    var nextTitle = normalizeText(template && template.seoTitle) || fallbackTitle;
    var fallbackDescription = 'Vorlage in Costnest nutzen und in eine Sammlung umwandeln.';
    var nextDescription = normalizeText(template && template.seoDescription) || fallbackDescription;

    document.title = nextTitle;
    setMetaDescription(nextDescription);
    setCanonicalUrl();
  }

  function setMetaDescription(content) {
    var meta = document.querySelector('meta[name=\"description\"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  }

  function setCanonicalUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    var url = new URL(global.location.href);
    url.hash = '';
    canonical.setAttribute('href', url.toString());
  }

  function normalizeText(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  }

  function renderSuggestionFallback(suggestion, index) {
    var safeTitle = escapeHtml(String(suggestion && suggestion.title ? suggestion.title : ''));
    var safePrice = Number.isFinite(Number(suggestion && suggestion.targetPrice))
      ? Costnest.currency.formatEuro(Number(suggestion.targetPrice))
      : '—';
    var safeQuantity = Number.isFinite(Number(suggestion && suggestion.quantity)) && Number(suggestion.quantity) >= 1
      ? Math.floor(Number(suggestion.quantity))
      : 1;

    return [
      '<article class="card template-suggestion">',
      '  <label class="template-suggestion__check">',
      '    <input type="checkbox" data-suggestion-index="' + index + '" checked>',
      '    <span class="template-suggestion__title">' + safeTitle + '</span>',
      '  </label>',
      '  <div class="template-suggestion__meta">',
      '    <span class="template-suggestion__price">' + safePrice + '</span>',
      '    <span class="template-suggestion__quantity">x' + safeQuantity + '</span>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function renderRelatedLinkFallback(template) {
    var key = encodeURIComponent(String(template && (template.slug || template.id) ? (template.slug || template.id) : ''));
    var label = escapeHtml(String(template && template.name ? template.name : 'Vorlage'));
    return '<a class="template-related__link" href="template-detail.html?templateId=' + key + '">' + label + '</a>';
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
  Costnest.pages.templateDetail = {
    init: initTemplateDetailPage
  };
})(window);
