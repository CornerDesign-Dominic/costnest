(function registerTemplateSuggestionItemComponent(global) {
  var Costnest = global.Costnest;

  function renderTemplateSuggestionItem(suggestion, index, options) {
    var normalizedOptions = options && typeof options === 'object' ? options : {};
    var isTitleEditing = Boolean(normalizedOptions.isTitleEditing);
    var isChecked = normalizedOptions.isChecked !== false;
    var safeTitle = escapeHtml(String(suggestion && suggestion.title ? suggestion.title : ''));
    var rawPrice = Number(suggestion && suggestion.targetPrice);
    var hasPrice = Number.isFinite(rawPrice);
    var safePriceValue = hasPrice ? String(rawPrice) : '';
    var safeQuantity = Number.isFinite(Number(suggestion && suggestion.quantity)) && Number(suggestion.quantity) >= 1
      ? Math.floor(Number(suggestion.quantity))
      : 1;

    return [
      '<article class="template-row' + (isTitleEditing ? ' is-title-editing' : '') + '">',
      '  <label class="template-suggestion__check" aria-label="Vorschlag auswählen">',
      '    <input type="checkbox" data-suggestion-index="' + index + '"' + (isChecked ? ' checked' : '') + '>',
      '  </label>',
      '  <div class="template-suggestion__title-wrap">',
      '    <button type="button" class="template-suggestion__title-button' + (isTitleEditing ? ' is-hidden' : '') + '" data-action="edit-title" data-suggestion-index="' + index + '" aria-label="Titel bearbeiten">' + safeTitle + '</button>',
      '    <input class="template-suggestion__title-input' + (isTitleEditing ? '' : ' is-hidden') + '" type="text" value="' + safeTitle + '" data-field="title" data-suggestion-index="' + index + '" aria-label="Titel">',
      '  </div>',
      '  <div class="template-suggestion__meta">',
      '    <label class="template-suggestion__field">',
      '      <span>Preis</span>',
      '      <input class="template-suggestion__input template-suggestion__input--price" type="number" inputmode="decimal" min="0" step="0.01" value="' + escapeHtml(safePriceValue) + '" data-field="targetPrice" data-suggestion-index="' + index + '" aria-label="Wunschpreis">',
      '    </label>',
      '    <label class="template-suggestion__field">',
      '      <span>Anzahl</span>',
      '      <input class="template-suggestion__input template-suggestion__input--quantity" type="number" inputmode="numeric" min="1" step="1" value="' + safeQuantity + '" data-field="quantity" data-suggestion-index="' + index + '" aria-label="Anzahl">',
      '    </label>',
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
