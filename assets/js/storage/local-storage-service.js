(function registerStorage(global) {
  var Costnest = global.Costnest;
  var STORAGE_KEY = 'costnest.appData.v2';
  var LEGACY_APPDATA_KEYS = ['costrack.appData.v2'];
  var LEGACY_ENTRIES_KEYS = ['costrack.projectEntries.v1', 'costnest.projectEntries.v1'];
  var LEGACY_COLLECTION_ENTRIES_KEYS = ['costrack.collectionEntries.v1', 'costnest.collectionEntries.v1'];

  function createEmptyData() {
    return {
      version: 2,
      collections: [],
      items: []
    };
  }

  function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function sanitizeCollection(raw) {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    var id = typeof raw.id === 'string' ? raw.id : '';
    var name = typeof raw.name === 'string' ? raw.name.trim() : '';
    var createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
    var budget = parseNullableNumber(raw.budget);

    if (!id || !name || !createdAt) {
      return null;
    }

    return {
      id: id,
      name: name,
      createdAt: createdAt,
      budget: budget
    };
  }

  function sanitizeItem(raw) {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    var id = typeof raw.id === 'string' ? raw.id : '';
    var collectionId = typeof raw.collectionId === 'string'
      ? raw.collectionId
      : (typeof raw.projectId === 'string' ? raw.projectId : '');
    var shopLink = typeof raw.shopLink === 'string' ? raw.shopLink.trim() : '';
    var title = typeof raw.title === 'string' ? raw.title.trim() : '';
    var currentPrice = parseNullableNumber(raw.currentPrice);
    var targetPrice = parseNullableNumber(raw.targetPrice);
    var quantity = Number(raw.quantity);
    var createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
    var status = raw && raw.status === 'bought' ? 'bought' : 'planned';
    var note = typeof raw.note === 'string' ? raw.note.trim() : '';
    var alternatives = Array.isArray(raw.alternatives)
      ? raw.alternatives
        .map(function (entry) {
          if (typeof entry === 'string') {
            var legacyLink = entry.trim();
            if (!legacyLink) {
              return null;
            }
            return {
              link: legacyLink,
              price: null
            };
          }

          if (!entry || typeof entry !== 'object') {
            return null;
          }

          var altLink = typeof entry.link === 'string' ? entry.link.trim() : '';
          if (!altLink) {
            return null;
          }

          return {
            link: altLink,
            price: parseNullableNumber(entry.price)
          };
        })
        .filter(Boolean)
      : [];

    if (!id || !collectionId || !createdAt) {
      return null;
    }

    return {
      id: id,
      collectionId: collectionId,
      shopLink: shopLink,
      title: title,
      currentPrice: currentPrice,
      targetPrice: targetPrice,
      quantity: Number.isFinite(quantity) && quantity >= 1 ? Math.floor(quantity) : 1,
      createdAt: createdAt,
      status: status,
      note: note,
      alternatives: alternatives
    };
  }

  function parseNullableNumber(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function sanitizeData(raw) {
    if (!raw || typeof raw !== 'object') {
      return createEmptyData();
    }

    var rawCollections = Array.isArray(raw.collections)
      ? raw.collections
      : (Array.isArray(raw.projects) ? raw.projects : []);
    var collections = rawCollections.map(sanitizeCollection).filter(Boolean);
    var collectionIdMap = collections.reduce(function (acc, collection) {
      acc[collection.id] = true;
      return acc;
    }, {});

    var items = Array.isArray(raw.items) ? raw.items.map(sanitizeItem).filter(function (item) {
      return item && collectionIdMap[item.collectionId];
    }) : [];

    return {
      version: 2,
      collections: collections,
      items: items
    };
  }

  function readLegacyEntries() {
    var raw = readFirstLocalStorageValue(LEGACY_ENTRIES_KEYS.concat(LEGACY_COLLECTION_ENTRIES_KEYS));

    if (!raw) {
      return [];
    }

    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Costnest: Konnte alte Eintragsdaten nicht lesen.', error);
      return [];
    }
  }

  function migrateLegacyEntries() {
    var legacyEntries = readLegacyEntries();

    if (legacyEntries.length === 0) {
      return createEmptyData();
    }

    var now = new Date().toISOString();
    var defaultCollectionId = 'collection-' + Date.now();

    var migratedItems = legacyEntries
      .map(function (entry, index) {
        return sanitizeItem({
          id: typeof entry.id === 'string' ? entry.id : 'item-' + Date.now() + '-' + index,
          collectionId: defaultCollectionId,
          shopLink: entry.shopLink,
          currentPrice: entry.currentPrice,
          targetPrice: entry.targetPrice,
          createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : now
        });
      })
      .filter(Boolean);

    if (migratedItems.length === 0) {
      return createEmptyData();
    }

    return {
      version: 2,
      collections: [
        {
          id: defaultCollectionId,
          name: 'Meine Sammlung',
          createdAt: now,
          budget: null
        }
      ],
      items: migratedItems
    };
  }

  function readAppData() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = readFirstLocalStorageValue(LEGACY_APPDATA_KEYS);
    }

    if (!raw) {
      var migrated = migrateLegacyEntries();
      writeAppData(migrated);
      return migrated;
    }

    try {
      var parsed = JSON.parse(raw);
      return sanitizeData(parsed);
    } catch (error) {
      console.warn('Costnest: Konnte gespeicherte Sammlungsdaten nicht lesen.', error);
      var fallbackData = migrateLegacyEntries();
      writeAppData(fallbackData);
      return fallbackData;
    }
  }

  function readFirstLocalStorageValue(keys) {
    for (var i = 0; i < keys.length; i += 1) {
      var raw = localStorage.getItem(keys[i]);
      if (raw) {
        return raw;
      }
    }

    return null;
  }

  function writeAppData(data) {
    var sanitized = sanitizeData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  }

  function updateAppData(mutator) {
    var current = readAppData();
    var draft = cloneData(current);
    var result = mutator(draft);
    var nextData = result && typeof result === 'object' ? result : draft;
    return writeAppData(nextData);
  }

  Costnest.storage = {
    readAppData: readAppData,
    writeAppData: writeAppData,
    updateAppData: updateAppData,
    keys: {
      appData: STORAGE_KEY,
      legacyAppData: LEGACY_APPDATA_KEYS.slice(),
      legacyEntries: LEGACY_ENTRIES_KEYS.slice(),
      legacyCollectionEntries: LEGACY_COLLECTION_ENTRIES_KEYS.slice()
    }
  };
})(window);


