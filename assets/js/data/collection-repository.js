(function registerCollectionRepository(global) {
  var Costnest = global.Costnest;

  function getAll() {
    var data = Costnest.storage.readAppData();
    return data.collections.slice().sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  function getById(collectionId) {
    if (!collectionId) {
      return null;
    }

    var data = Costnest.storage.readAppData();
    return data.collections.find(function (collection) {
      return collection.id === collectionId;
    }) || null;
  }

  function create(name) {
    var resolvedName = resolveCollectionName(name);
    var collection = {
      id: Costnest.ids.generateId('collection'),
      name: resolvedName,
      createdAt: new Date().toISOString(),
      budget: null
    };

    Costnest.storage.updateAppData(function (data) {
      data.collections.push(collection);
      return data;
    });

    return collection;
  }

  function updateName(collectionId, name) {
    var nextName = typeof name === 'string' ? name.trim() : '';
    if (!nextName) {
      return null;
    }

    var updatedCollection = null;

    Costnest.storage.updateAppData(function (data) {
      var collection = data.collections.find(function (entry) {
        return entry.id === collectionId;
      });

      if (!collection) {
        return data;
      }

      collection.name = nextName;
      updatedCollection = {
        id: collection.id,
        name: collection.name,
        createdAt: collection.createdAt,
        budget: Number.isFinite(collection.budget) ? collection.budget : null
      };
      return data;
    });

    return updatedCollection;
  }

  function remove(collectionId) {
    var removed = false;

    Costnest.storage.updateAppData(function (data) {
      var beforeCount = data.collections.length;
      data.collections = data.collections.filter(function (collection) {
        return collection.id !== collectionId;
      });

      if (data.collections.length === beforeCount) {
        return data;
      }

      data.items = data.items.filter(function (item) {
        return item.collectionId !== collectionId;
      });
      removed = true;
      return data;
    });

    return removed;
  }

  function updateBudget(collectionId, budgetValue) {
    var nextBudget = Number.isFinite(budgetValue) ? Number(budgetValue) : null;
    var updatedCollection = null;

    Costnest.storage.updateAppData(function (data) {
      var collection = data.collections.find(function (entry) {
        return entry.id === collectionId;
      });

      if (!collection) {
        return data;
      }

      collection.budget = nextBudget;
      updatedCollection = {
        id: collection.id,
        name: collection.name,
        createdAt: collection.createdAt,
        budget: collection.budget
      };
      return data;
    });

    return updatedCollection;
  }

  function resolveCollectionName(name) {
    var rawName = typeof name === 'string' ? name.trim() : '';
    if (rawName) {
      return ensureUniqueCollectionName(rawName);
    }

    var collections = getAll();
    var maxNumber = collections.reduce(function (acc, collection) {
      var match = /^Sammlung\s+(\d+)$/i.exec(collection.name);
      if (!match) {
        return acc;
      }

      var num = Number(match[1]);
      return Number.isFinite(num) && num > acc ? num : acc;
    }, 0);

    return ensureUniqueCollectionName('Sammlung ' + (maxNumber + 1));
  }

  function ensureUniqueCollectionName(baseName) {
    var collections = getAll();
    var existingNames = collections.map(function (collection) {
      return String(collection.name || '').trim().toLocaleLowerCase('de-DE');
    });
    var normalizedBaseName = baseName.trim().toLocaleLowerCase('de-DE');

    if (existingNames.indexOf(normalizedBaseName) === -1) {
      return baseName;
    }

    var suffix = 2;
    while (suffix <= 9999) {
      var nextName = baseName + ' (' + suffix + ')';
      var normalizedNext = nextName.toLocaleLowerCase('de-DE');
      if (existingNames.indexOf(normalizedNext) === -1) {
        return nextName;
      }
      suffix += 1;
    }

    return baseName + ' (' + Date.now() + ')';
  }

  function getAllWithStats() {
    var data = Costnest.storage.readAppData();

    return data.collections.map(function (collection) {
      var collectionItems = data.items.filter(function (item) {
        return item.collectionId === collection.id;
      });

      var totals = collectionItems.reduce(function (acc, item) {
        var quantity = Number.isFinite(item.quantity) && item.quantity >= 1 ? Math.floor(item.quantity) : 1;
        acc.current += getSafePrice(item.currentPrice) * quantity;
        acc.target += getSafePrice(item.targetPrice) * quantity;
        return acc;
      }, { current: 0, target: 0 });

      return {
        id: collection.id,
        name: collection.name,
        createdAt: collection.createdAt,
        budget: Number.isFinite(collection.budget) ? collection.budget : null,
        entryCount: collectionItems.length,
        totalCurrent: totals.current,
        totalTarget: totals.target
      };
    }).sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  function getSafePrice(value) {
    return Number.isFinite(value) ? value : 0;
  }

  Costnest.collectionRepository = {
    getAll: getAll,
    getById: getById,
    create: create,
    updateName: updateName,
    updateBudget: updateBudget,
    remove: remove,
    getAllWithStats: getAllWithStats
  };
})(window);


