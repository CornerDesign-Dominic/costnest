(function registerTemplateDetailPage(global) {
  var Costnest = global.Costnest;

  function initTemplateDetailPage() {
    if (document.body.getAttribute('data-page') !== 'template-detail') {
      return;
    }

    var notFoundElement = document.getElementById('template-not-found');
    var contentElement = document.getElementById('template-detail-content');
    var categoryElement = document.getElementById('template-category');
    var titleElement = document.getElementById('template-title');
    var introElement = document.getElementById('template-intro');
    var suggestionsListElement = document.getElementById('template-suggestions-list');
    var relatedSection = document.getElementById('template-related');
    var relatedLinksElement = document.getElementById('template-related-links');
    var topConvertButton = document.getElementById('convert-template-top');
    var bottomConvertButton = document.getElementById('convert-template-bottom');

    if (!notFoundElement || !contentElement || !categoryElement || !titleElement || !introElement || !suggestionsListElement || !relatedSection || !relatedLinksElement || !topConvertButton || !bottomConvertButton) {
      return;
    }

    var params = new URLSearchParams(global.location.search);
    var templateId = params.get('templateId');
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
    categoryElement.textContent = 'Oberkategorie: ' + (template.categoryName || '-');
    titleElement.textContent = template.name;
    introElement.textContent = template.intro;
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

    topConvertButton.addEventListener('click', convertToCollection);
    bottomConvertButton.addEventListener('click', convertToCollection);

    function syncConvertButtons() {
      var selectedCount = countSelected();
      var label = selectedCount > 0
        ? 'In Sammlung umwandeln (' + selectedCount + ')'
        : 'In Sammlung umwandeln (0)';

      topConvertButton.textContent = label;
      bottomConvertButton.textContent = label;
    }

    function countSelected() {
      return template.suggestions.reduce(function (acc, _, index) {
        return checkedMap[String(index)] ? acc + 1 : acc;
      }, 0);
    }

    function renderSuggestions() {
      suggestionsListElement.innerHTML = template.suggestions.map(function (suggestion, index) {
        return [
          '<article class="card template-suggestion">',
          '  <label class="template-suggestion__check">',
          '    <input type="checkbox" data-suggestion-index="' + index + '" checked>',
          '    <span class="template-suggestion__title">' + escapeHtml(suggestion.title) + '</span>',
          '  </label>',
          '  <div class="template-suggestion__meta">',
          '    <span class="template-suggestion__price">' + Costnest.currency.formatEuro(suggestion.targetPrice) + '</span>',
          '    <span class="template-suggestion__quantity">x' + suggestion.quantity + '</span>',
          '  </div>',
          '</article>'
        ].join('');
      }).join('');

      syncConvertButtons();
    }

    function convertToCollection() {
      var collection = Costnest.collectionRepository.create(template.name);
      var selectedSuggestions = template.suggestions.filter(function (_, index) {
        return Boolean(checkedMap[String(index)]);
      });

      selectedSuggestions.forEach(function (suggestion) {
        Costnest.itemRepository.add(collection.id, {
          shopLink: '',
          title: suggestion.title,
          currentPrice: null,
          targetPrice: Number(suggestion.targetPrice),
          quantity: Number(suggestion.quantity),
          note: '',
          status: 'planned'
        });
      });

      if (Costnest.toast && typeof Costnest.toast.flashNextPage === 'function') {
        Costnest.toast.flashNextPage('Sammlung erstellt');
      }

      global.location.href = 'collection-detail.html?collectionId=' + encodeURIComponent(collection.id);
    }

    function renderRelatedTemplates() {
      if (!Costnest.templateRepository || typeof Costnest.templateRepository.getRelatedByCategory !== 'function') {
        relatedSection.hidden = true;
        return;
      }

      var relatedTemplates = Costnest.templateRepository.getRelatedByCategory(template.id, 4).slice(0, 4);
      if (!relatedTemplates.length) {
        relatedSection.hidden = true;
        relatedLinksElement.innerHTML = '';
        return;
      }

      relatedSection.hidden = false;
      relatedLinksElement.innerHTML = relatedTemplates.slice(0, 4).map(function (entry) {
        var templateKey = entry.slug || entry.id;
        return '<a class="template-related__link" href="template-detail.html?templateId=' + encodeURIComponent(templateKey) + '">' + escapeHtml(entry.name) + '</a>';
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

  function normalizeText(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
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
