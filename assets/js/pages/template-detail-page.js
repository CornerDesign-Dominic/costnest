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
    trackTemplateView();
    applyTemplateSeo(template);
    renderRelatedTemplates();

    var checkedMap = {};
    var suggestionDrafts = template.suggestions.map(function (suggestion) {
      return {
        title: String(suggestion && suggestion.title ? suggestion.title : '').trim(),
        targetPrice: Number.isFinite(Number(suggestion && suggestion.targetPrice)) ? Number(suggestion.targetPrice) : null,
        quantity: Number.isFinite(Number(suggestion && suggestion.quantity)) && Number(suggestion.quantity) >= 1
          ? Math.floor(Number(suggestion.quantity))
          : 1
      };
    });
    var editingTitleIndex = null;
    var originalTitleByIndex = {};

    suggestionDrafts.forEach(function (_, index) {
      checkedMap[String(index)] = true;
    });

    renderSuggestions();

    suggestionsListElement.addEventListener('change', function (event) {
      var toggle = event.target.closest('[data-suggestion-index]');
      if (!toggle || toggle.type !== 'checkbox') {
        return;
      }

      checkedMap[String(toggle.getAttribute('data-suggestion-index'))] = Boolean(toggle.checked);
      syncConvertButtons();
    });

    suggestionsListElement.addEventListener('click', function (event) {
      var editTitleButton = event.target.closest('[data-action="edit-title"]');
      if (!editTitleButton) {
        return;
      }

      var index = getIndexFromEventNode(editTitleButton);
      if (index < 0 || index >= suggestionDrafts.length) {
        return;
      }

      originalTitleByIndex[String(index)] = suggestionDrafts[index].title;
      editingTitleIndex = index;
      renderSuggestions();
      focusTitleInput(index);
    });

    suggestionsListElement.addEventListener('input', function (event) {
      var input = event.target.closest('[data-field]');
      if (!input) {
        return;
      }

      var field = String(input.getAttribute('data-field') || '');
      var index = getIndexFromEventNode(input);
      if (index < 0 || index >= suggestionDrafts.length) {
        return;
      }

      if (field === 'title') {
        suggestionDrafts[index].title = String(input.value || '');
      }
    });

    suggestionsListElement.addEventListener('focusin', function (event) {
      var input = event.target.closest('[data-field]');
      if (!input) {
        return;
      }

      var field = String(input.getAttribute('data-field') || '');
      if (field !== 'targetPrice' && field !== 'quantity') {
        return;
      }

      if (typeof input.select === 'function') {
        input.select();
      }
    });

    suggestionsListElement.addEventListener('blur', function (event) {
      var input = event.target.closest('[data-field]');
      if (!input) {
        return;
      }

      commitInlineField(input);
    }, true);

    suggestionsListElement.addEventListener('keydown', function (event) {
      var input = event.target.closest('[data-field]');
      if (!input) {
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        commitInlineField(input);
        input.blur();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        cancelInlineField(input);
      }
    });

    bottomConvertButton.addEventListener('click', convertToCollection);

    function syncConvertButtons() {
      var selectedCount = countSelected();
      var label = selectedCount > 0
        ? 'Sammlung erstellen (' + selectedCount + ')'
        : 'Sammlung erstellen (0)';

      bottomConvertButton.textContent = label;
    }

    function countSelected() {
      return suggestionDrafts.reduce(function (acc, _, index) {
        return checkedMap[String(index)] ? acc + 1 : acc;
      }, 0);
    }

    function renderSuggestions() {
      var renderer = Costnest.components
        && Costnest.components.templateSuggestionItem
        && typeof Costnest.components.templateSuggestionItem.renderTemplateSuggestionItem === 'function'
        ? Costnest.components.templateSuggestionItem.renderTemplateSuggestionItem
        : null;

      var rowsMarkup = suggestionDrafts.map(function (suggestion, index) {
        if (renderer) {
          return renderer(suggestion, index, {
            isTitleEditing: editingTitleIndex === index,
            isChecked: Boolean(checkedMap[String(index)])
          });
        }

        return renderSuggestionFallback(
          suggestion,
          index,
          editingTitleIndex === index,
          Boolean(checkedMap[String(index)])
        );
      }).join('');

      suggestionsListElement.innerHTML = '<section class="card template-list-card" aria-label="Vorschlagsliste">' + rowsMarkup + '</section>';

      syncConvertButtons();
    }

    function convertToCollection() {
      var selectedSuggestions = suggestionDrafts
        .filter(function (_, index) {
          return Boolean(checkedMap[String(index)]);
        })
        .map(function (suggestion) {
          return {
            title: String(suggestion.title || '').trim(),
            targetPrice: Number.isFinite(suggestion.targetPrice) ? Number(suggestion.targetPrice) : null,
            quantity: Number.isFinite(suggestion.quantity) && suggestion.quantity >= 1 ? Math.floor(suggestion.quantity) : 1
          };
        });

      trackTemplateConvert(selectedSuggestions.length);

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

    function trackTemplateView() {
      if (Costnest.analytics && typeof Costnest.analytics.trackEvent === 'function') {
        Costnest.analytics.trackEvent('template_view', {
          template_name: template.name || '',
          template_slug: template.slug || template.id || '',
          category_name: template.categoryName || ''
        });
      }
    }

    function trackTemplateConvert(selectedCount) {
      if (Costnest.analytics && typeof Costnest.analytics.trackEvent === 'function') {
        Costnest.analytics.trackEvent('template_convert', {
          template_name: template.name || '',
          template_slug: template.slug || template.id || '',
          category_name: template.categoryName || '',
          selected_count: Number.isFinite(selectedCount) ? selectedCount : 0
        });
      }
    }

    function commitInlineField(input) {
      var field = String(input.getAttribute('data-field') || '');
      var index = getIndexFromEventNode(input);
      if (index < 0 || index >= suggestionDrafts.length) {
        return;
      }

      if (field === 'title') {
        var rawTitle = String(input.value || '').trim();
        if (!rawTitle) {
          suggestionDrafts[index].title = originalTitleByIndex[String(index)] || suggestionDrafts[index].title || 'Eintrag';
        } else {
          suggestionDrafts[index].title = rawTitle;
        }

        editingTitleIndex = null;
        delete originalTitleByIndex[String(index)];
        renderSuggestions();
        return;
      }

      if (field === 'targetPrice') {
        var priceValue = parsePriceInput(String(input.value || ''));
        suggestionDrafts[index].targetPrice = Number.isFinite(priceValue) ? priceValue : null;
        input.value = Number.isFinite(suggestionDrafts[index].targetPrice) ? String(suggestionDrafts[index].targetPrice) : '';
        return;
      }

      if (field === 'quantity') {
        var quantityValue = parseQuantityInput(String(input.value || ''));
        suggestionDrafts[index].quantity = Number.isFinite(quantityValue) ? quantityValue : 1;
        input.value = String(suggestionDrafts[index].quantity);
      }
    }

    function cancelInlineField(input) {
      var field = String(input.getAttribute('data-field') || '');
      var index = getIndexFromEventNode(input);
      if (index < 0 || index >= suggestionDrafts.length) {
        return;
      }

      if (field === 'title') {
        input.value = originalTitleByIndex[String(index)] || suggestionDrafts[index].title || '';
        editingTitleIndex = null;
        delete originalTitleByIndex[String(index)];
        renderSuggestions();
        return;
      }

      if (field === 'targetPrice') {
        input.value = Number.isFinite(suggestionDrafts[index].targetPrice) ? String(suggestionDrafts[index].targetPrice) : '';
        return;
      }

      if (field === 'quantity') {
        input.value = String(suggestionDrafts[index].quantity);
      }
    }

    function getIndexFromEventNode(node) {
      if (!node) {
        return -1;
      }

      var rawIndex = node.getAttribute('data-suggestion-index');
      var parsedIndex = Number(rawIndex);
      return Number.isInteger(parsedIndex) ? parsedIndex : -1;
    }

    function focusTitleInput(index) {
      var selector = '.template-suggestion__title-input[data-suggestion-index="' + index + '"]';
      var input = suggestionsListElement.querySelector(selector);
      if (!input) {
        return;
      }

      input.focus();
      input.select();
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
    setCanonicalUrl(template);
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

  function setCanonicalUrl(template) {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    var url = null;
    var templateKey = String(template && (template.slug || template.id) ? (template.slug || template.id) : '').trim();
    if (templateKey && Costnest.routes && typeof Costnest.routes.getTemplateDetailUrlByKey === 'function') {
      var detailUrl = Costnest.routes.getTemplateDetailUrlByKey(templateKey);
      url = new URL(detailUrl, global.location.href);
    } else {
      url = new URL(global.location.href);
    }
    url.hash = '';
    canonical.setAttribute('href', url.toString());
  }

  function normalizeText(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  }

  function parsePriceInput(rawValue) {
    var normalized = String(rawValue || '').trim().replace(',', '.');
    if (!normalized) {
      return null;
    }

    var parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  function parseQuantityInput(rawValue) {
    var normalized = String(rawValue || '').trim();
    if (!normalized) {
      return 1;
    }

    var parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      return 1;
    }

    var floored = Math.floor(parsed);
    return floored >= 1 ? floored : 1;
  }

  function renderSuggestionFallback(suggestion, index, isTitleEditing, isChecked) {
    var safeTitle = escapeHtml(String(suggestion && suggestion.title ? suggestion.title : ''));
    var safePriceValue = Number.isFinite(Number(suggestion && suggestion.targetPrice))
      ? String(Number(suggestion.targetPrice))
      : '';
    var safeQuantity = Number.isFinite(Number(suggestion && suggestion.quantity)) && Number(suggestion.quantity) >= 1
      ? Math.floor(Number(suggestion.quantity))
      : 1;

    return [
      '<article class="template-row' + (isTitleEditing ? ' is-title-editing' : '') + '">',
      '  <label class="template-suggestion__check">',
      '    <input type="checkbox" data-suggestion-index="' + index + '"' + (isChecked ? ' checked' : '') + '>',
      '  </label>',
      '  <div class="template-suggestion__title-wrap">',
      '    <button type="button" class="template-suggestion__title-button' + (isTitleEditing ? ' is-hidden' : '') + '" data-action="edit-title" data-suggestion-index="' + index + '">' + safeTitle + '</button>',
      '    <input class="template-suggestion__title-input' + (isTitleEditing ? '' : ' is-hidden') + '" type="text" value="' + safeTitle + '" data-field="title" data-suggestion-index="' + index + '">',
      '  </div>',
      '  <div class="template-suggestion__meta">',
      '    <label class="template-suggestion__field">',
      '      <span>Preis</span>',
      '      <input class="template-suggestion__input template-suggestion__input--price" type="number" min="0" step="0.01" value="' + escapeHtml(safePriceValue) + '" data-field="targetPrice" data-suggestion-index="' + index + '">',
      '    </label>',
      '    <label class="template-suggestion__field">',
      '      <span>Anzahl</span>',
      '      <input class="template-suggestion__input template-suggestion__input--quantity" type="number" min="1" step="1" value="' + safeQuantity + '" data-field="quantity" data-suggestion-index="' + index + '">',
      '    </label>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function renderRelatedLinkFallback(template) {
    var key = String(template && (template.slug || template.id) ? (template.slug || template.id) : '');
    var detailUrl = Costnest.routes && typeof Costnest.routes.getTemplateDetailUrlByKey === 'function'
      ? Costnest.routes.getTemplateDetailUrlByKey(key)
      : '#';
    var label = escapeHtml(String(template && template.name ? template.name : 'Vorlage'));
    return '<a class="template-related__link" href="' + detailUrl + '">' + label + '</a>';
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
