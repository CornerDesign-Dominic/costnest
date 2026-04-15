(function registerTemplateSuggestionItemComponent(global) {
  var Costnest = global.Costnest;

  function renderTemplateSuggestionItem(suggestion, index) {
    var safeTitle = escapeHtml(String(suggestion && suggestion.title ? suggestion.title : ''));
    var safePrice = Costnest.currency && typeof Costnest.currency.formatEuro === 'function'
      ? Costnest.currency.formatEuro(Number(suggestion && suggestion.targetPrice))
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

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  Costnest.components = Costnest.components || {};
  Costnest.components.templateSuggestionItem = {
    renderTemplateSuggestionItem: renderTemplateSuggestionItem
  };
})(window);
