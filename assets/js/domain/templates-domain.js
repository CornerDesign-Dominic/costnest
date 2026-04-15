(function registerTemplatesDomain(global) {
  var Costnest = global.Costnest;

  function mapTemplateToItems(template, selectedSuggestions) {
    if (!template || !Array.isArray(selectedSuggestions)) {
      return [];
    }

    return selectedSuggestions.map(function (suggestion) {
      return {
        shopLink: '',
        title: String(suggestion && suggestion.title ? suggestion.title : '').trim(),
        currentPrice: null,
        targetPrice: Number.isFinite(Number(suggestion && suggestion.targetPrice)) ? Number(suggestion.targetPrice) : null,
        quantity: Number.isFinite(Number(suggestion && suggestion.quantity)) && Number(suggestion.quantity) >= 1 ? Math.floor(Number(suggestion.quantity)) : 1,
        note: '',
        status: 'planned'
      };
    });
  }

  function createCollectionFromTemplate(template, selectedSuggestions) {
    if (!template || !Costnest.collectionRepository || !Costnest.itemRepository) {
      return null;
    }

    var collection = Costnest.collectionRepository.create(template.name);
    var mappedItems = mapTemplateToItems(template, selectedSuggestions);

    mappedItems.forEach(function (itemPayload) {
      Costnest.itemRepository.add(collection.id, itemPayload);
    });

    return {
      collection: collection,
      items: mappedItems
    };
  }

  Costnest.domain = Costnest.domain || {};
  Costnest.domain.templates = {
    createCollectionFromTemplate: createCollectionFromTemplate,
    mapTemplateToItems: mapTemplateToItems
  };
})(window);
