(function registerItemRepository(global) {
  var Costnest = global.Costnest;

  function getByCollectionId(collectionId) {
    if (!collectionId) {
      return [];
    }

    var data = Costnest.storage.readAppData();
    return data.items.filter(function (item) {
      return item.collectionId === collectionId;
    }).sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  function add(collectionId, payload) {
    if (!collectionId) {
      return null;
    }

    var quantity = Number.isFinite(payload.quantity) && payload.quantity >= 1 ? Math.floor(payload.quantity) : 1;
    var item = {
      id: Costnest.ids.generateId('item'),
      collectionId: collectionId,
      shopLink: payload.shopLink.trim(),
      title: resolveItemTitle(payload.title, payload.shopLink),
      currentPrice: payload.currentPrice,
      targetPrice: payload.targetPrice,
      quantity: quantity,
      createdAt: new Date().toISOString(),
      status: payload.status === 'bought' ? 'bought' : 'planned',
      note: typeof payload.note === 'string' ? payload.note.trim() : '',
      alternatives: []
    };

    Costnest.storage.updateAppData(function (data) {
      var collectionExists = data.collections.some(function (collection) {
        return collection.id === collectionId;
      });

      if (collectionExists) {
        data.items.push(item);
      }

      return data;
    });

    return item;
  }

  function update(itemId, payload) {
    var updatedItem = null;

    Costnest.storage.updateAppData(function (data) {
      var item = data.items.find(function (entry) {
        return entry.id === itemId;
      });

      if (!item) {
        return data;
      }

      item.shopLink = payload.shopLink.trim();
      item.title = resolveItemTitle(payload.title, payload.shopLink);
      item.currentPrice = payload.currentPrice;
      item.targetPrice = payload.targetPrice;
      item.quantity = Number.isFinite(payload.quantity) && payload.quantity >= 1 ? Math.floor(payload.quantity) : 1;
      item.status = payload.status === 'bought' ? 'bought' : 'planned';
      item.note = typeof payload.note === 'string' ? payload.note.trim() : '';
      if (!Array.isArray(item.alternatives)) {
        item.alternatives = [];
      }
      updatedItem = item;
      return data;
    });

    return updatedItem;
  }

  function remove(itemId) {
    var removed = false;

    Costnest.storage.updateAppData(function (data) {
      var beforeLength = data.items.length;
      data.items = data.items.filter(function (entry) {
        return entry.id !== itemId;
      });
      removed = data.items.length !== beforeLength;
      return data;
    });

    return removed;
  }

  function toggleStatus(itemId) {
    var updatedStatus = null;

    Costnest.storage.updateAppData(function (data) {
      var item = data.items.find(function (entry) {
        return entry.id === itemId;
      });

      if (!item) {
        return data;
      }

      item.status = item.status === 'bought' ? 'planned' : 'bought';
      updatedStatus = item.status;
      return data;
    });

    return updatedStatus;
  }

  function addAlternative(itemId, rawLink, rawPrice) {
    var link = typeof rawLink === 'string' ? rawLink.trim() : '';
    var price = Number.isFinite(rawPrice) ? Number(rawPrice) : null;
    if (!link) {
      return null;
    }
    if (!Number.isFinite(price)) {
      return null;
    }

    var updatedItem = null;

    Costnest.storage.updateAppData(function (data) {
      var item = data.items.find(function (entry) {
        return entry.id === itemId;
      });

      if (!item) {
        return data;
      }

      if (!Array.isArray(item.alternatives)) {
        item.alternatives = [];
      }

      if (item.alternatives.length >= 99) {
        return data;
      }

      item.alternatives.push({
        link: link,
        price: price
      });
      updatedItem = item;
      return data;
    });

    return updatedItem;
  }

  function removeAlternative(itemId, alternativeIndex) {
    var normalizedIndex = Number(alternativeIndex);
    if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0) {
      return null;
    }

    var updatedItem = null;

    Costnest.storage.updateAppData(function (data) {
      var item = data.items.find(function (entry) {
        return entry.id === itemId;
      });

      if (!item || !Array.isArray(item.alternatives) || normalizedIndex >= item.alternatives.length) {
        return data;
      }

      item.alternatives.splice(normalizedIndex, 1);
      updatedItem = item;
      return data;
    });

    return updatedItem;
  }

  function resolveItemTitle(rawTitle, rawLink) {
    var manualTitle = typeof rawTitle === 'string' ? rawTitle.trim() : '';
    if (manualTitle) {
      return manualTitle;
    }

    var link = typeof rawLink === 'string' ? rawLink.trim() : '';
    if (!link) {
      return '';
    }

    var domain = extractDomain(link);
    if (domain) {
      return domain;
    }

    return shortenLink(link, 42);
  }

  function extractDomain(link) {
    try {
      return new URL(link).hostname.replace(/^www\./i, '').toLowerCase();
    } catch (error) {
      return '';
    }
  }

  function shortenLink(link, maxLength) {
    if (link.length <= maxLength) {
      return link;
    }

    return link.slice(0, maxLength - 1) + '…';
  }

  Costnest.itemRepository = {
    getByCollectionId: getByCollectionId,
    add: add,
    update: update,
    remove: remove,
    toggleStatus: toggleStatus,
    addAlternative: addAlternative,
    removeAlternative: removeAlternative
  };
})(window);


