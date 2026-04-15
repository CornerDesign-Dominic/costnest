(function registerTemplateRepository(global) {
  var Costnest = global.Costnest;

  var categories = [
    {
      id: 'feiern',
      name: 'Feiern',
      description: 'Vorlagen fuer typische Feier-Anlaesse.',
      defaultExpanded: true,
      templates: [
        {
          id: 'geburtstagsfeier',
          slug: 'geburtstagsfeier',
          name: 'Geburtstagsfeier',
          description: 'Alles Wichtige fuer eine entspannte Feier.',
          intro: 'Waehle aus, was du fuer den Geburtstag direkt uebernehmen willst.',
          purposeText: 'Erstelle eine Einkaufsliste fuer deine naechste Geburtstagsfeier und plane Deko sowie Verbrauchsmaterial geordnet vor.',
          seoTitle: 'Vorlage Geburtstagsfeier | Costnest',
          seoDescription: 'Plane deine Geburtstagsfeier mit einer klaren Vorlage fuer typische Einkaeufe und ueberfuehre sie direkt in eine Sammlung.',
          suggestions: [
            { title: 'Luftballons (30er Pack)', targetPrice: 6.50, quantity: 1 },
            { title: 'Girlande', targetPrice: 7.90, quantity: 1 },
            { title: 'Pappteller (20 Stueck)', targetPrice: 4.90, quantity: 1 },
            { title: 'Pappbecher (20 Stueck)', targetPrice: 3.90, quantity: 1 },
            { title: 'Geburtstagskerzen', targetPrice: 2.50, quantity: 1 }
          ]
        },
        {
          id: 'silvester',
          slug: 'silvester',
          name: 'Silvester',
          description: 'Getraenke, Deko und Basics fuer den Jahreswechsel.',
          intro: 'Aktiviere die Vorschlaege, die fuer deine Silvesterplanung passen.',
          purposeText: 'Sammle typische Einkaeufe fuer Silvester an einem Ort, damit du schnell siehst, was noch fehlt.',
          seoTitle: 'Vorlage Silvester | Costnest',
          seoDescription: 'Nutze die Silvester-Vorlage, um typische Einkaeufe strukturiert zu sammeln und als Sammlung weiterzuverwenden.',
          suggestions: [
            { title: 'Sektglaeser (Einweg, 20 Stueck)', targetPrice: 5.90, quantity: 1 },
            { title: 'Konfetti', targetPrice: 3.50, quantity: 2 },
            { title: 'Tischdecke', targetPrice: 6.90, quantity: 1 },
            { title: 'Knabbereien', targetPrice: 14.90, quantity: 1 },
            { title: 'Partyhuete (10er Set)', targetPrice: 4.90, quantity: 1 }
          ]
        },
        {
          id: 'weihnachten',
          slug: 'weihnachten',
          name: 'Weihnachten',
          description: 'Typische Besorgungen fuer ruhige Feiertage.',
          intro: 'Setze nur die Punkte auf aktiv, die du in deine Weihnachtsliste uebernehmen willst.',
          purposeText: 'Plane deine Weihnachts-Einkaeufe fruehzeitig und behalte bei wiederkehrenden Artikeln den Ueberblick.',
          seoTitle: 'Vorlage Weihnachten | Costnest',
          seoDescription: 'Erstelle mit der Weihnachts-Vorlage eine geordnete Einkaufssammlung fuer die Feiertage und behalte Kosten im Blick.',
          suggestions: [
            { title: 'Lichterkette', targetPrice: 19.90, quantity: 1 },
            { title: 'Geschenkpapier', targetPrice: 4.50, quantity: 2 },
            { title: 'Geschenkband', targetPrice: 2.90, quantity: 2 },
            { title: 'Servietten (Weihnachtsmotiv)', targetPrice: 3.50, quantity: 1 },
            { title: 'Teelichter (50er Pack)', targetPrice: 8.90, quantity: 1 }
          ]
        }
      ]
    },
    {
      id: 'urlaub',
      name: 'Urlaub',
      description: 'Vorbereitete Listen fuer unterschiedliche Reisearten.',
      defaultExpanded: true,
      templates: [
        {
          id: 'zelten',
          slug: 'urlaub-zelten',
          name: 'Zelten',
          description: 'Basis-Ausstattung fuer den Campingtrip.',
          intro: 'Waehle die Teile, die in deine Camping-Sammlung sollen.',
          purposeText: 'Erstelle eine Einkaufsliste fuer deinen naechsten Strand- oder Campingurlaub mit den wichtigsten Basics.',
          seoTitle: 'Vorlage Urlaub Zelten | Costnest',
          seoDescription: 'Plane deinen Campingurlaub mit einer Vorlage fuer wichtige Ausruestung und uebernimm sie mit einem Klick als Sammlung.',
          suggestions: [
            { title: '2-Personen Zelt', targetPrice: 119.00, quantity: 1 },
            { title: 'Isomatte', targetPrice: 34.90, quantity: 2 },
            { title: 'Schlafsack 3 Jahreszeiten', targetPrice: 59.90, quantity: 2 },
            { title: 'Campinglampe', targetPrice: 24.90, quantity: 1 },
            { title: 'Gaskocher', targetPrice: 44.90, quantity: 1 }
          ]
        },
        {
          id: 'schiffsreise',
          slug: 'urlaub-schiffsreise',
          name: 'Schiffsreise',
          description: 'Wichtige Reiseartikel fuer Tage an Bord.',
          intro: 'Markiere die Vorschlaege, die du fuer die Schiffsreise brauchst.',
          purposeText: 'Bereite deine Schiffsreise strukturiert vor und halte Reiseartikel sowie geplante Kosten sauber zusammen.',
          seoTitle: 'Vorlage Urlaub Schiffsreise | Costnest',
          seoDescription: 'Nutze eine geordnete Schiffsreise-Vorlage fuer Reiseeinkaeufe und verwandle sie direkt in eine bearbeitbare Sammlung.',
          suggestions: [
            { title: 'Sonnencreme SPF 50', targetPrice: 11.90, quantity: 2 },
            { title: 'Koffer (M)', targetPrice: 89.00, quantity: 1 },
            { title: 'Nackenkissen', targetPrice: 19.90, quantity: 1 },
            { title: 'Reisestecker', targetPrice: 12.90, quantity: 1 },
            { title: 'Sonnenbrille', targetPrice: 39.90, quantity: 1 }
          ]
        },
        {
          id: 'staedtetrip',
          slug: 'urlaub-staedtetrip',
          name: 'Staedtetrip',
          description: 'Kompakte Liste fuer kurze Reisen.',
          intro: 'Nimm nur mit, was fuer deinen Staedtetrip wirklich relevant ist.',
          purposeText: 'Nutze diese Vorlage fuer einen kompakten Staedtetrip und ordne wiederkehrende Reiseeinkaeufe in einer Liste.',
          seoTitle: 'Vorlage Urlaub Staedtetrip | Costnest',
          seoDescription: 'Behalte beim Staedtetrip den Ueberblick: Vorlage auswaehlen, Einkaeufe ordnen und als Sammlung weiterverwenden.',
          suggestions: [
            { title: 'Tagesrucksack', targetPrice: 39.90, quantity: 1 },
            { title: 'Powerbank', targetPrice: 24.90, quantity: 1 },
            { title: 'Reiseadapter', targetPrice: 12.90, quantity: 1 },
            { title: 'Bequeme Sneaker', targetPrice: 69.90, quantity: 1 },
            { title: 'Kulturbeutel', targetPrice: 18.90, quantity: 1 }
          ]
        }
      ]
    },
    {
      id: 'buero-arbeit',
      name: 'Buero & Arbeit',
      description: 'Wiederkehrende Einkaeufe fuer Arbeitsplatz und Homeoffice.',
      defaultExpanded: false,
      templates: [
        {
          id: 'bueromaterial',
          slug: 'bueromaterial',
          name: 'Bueromaterial',
          description: 'Die wichtigsten Basics fuer den Arbeitsalltag.',
          intro: 'Aktiviere die Vorschlaege, die du in deine Material-Sammlung uebernehmen willst.',
          purposeText: 'Erfasse deine Sammlung fuer Bueromaterialien, die du regelmaessig brauchst, und speichere Alternativen zum Sparen.',
          seoTitle: 'Vorlage Bueromaterial | Costnest',
          seoDescription: 'Ordne Bueroeinkaeufe mit der Vorlage Bueromaterial und erstelle daraus schnell eine wiederverwendbare Sammlung.',
          suggestions: [
            { title: 'Druckerpapier A4 (500 Blatt)', targetPrice: 5.90, quantity: 2 },
            { title: 'Kugelschreiber (10er Set)', targetPrice: 8.50, quantity: 1 },
            { title: 'Bleistifte HB (6er Set)', targetPrice: 3.50, quantity: 1 },
            { title: 'Schreibtischunterlage', targetPrice: 14.90, quantity: 1 },
            { title: 'LED Tischlampe', targetPrice: 29.90, quantity: 1 }
          ]
        },
        {
          id: 'homeoffice',
          slug: 'homeoffice',
          name: 'Homeoffice',
          description: 'Praktische Ausstattung fuer konzentriertes Arbeiten zu Hause.',
          intro: 'Waehle die Punkte aus, die du fuer dein Homeoffice einplanen willst.',
          purposeText: 'Stelle eine uebersichtliche Homeoffice-Liste zusammen, damit wichtige Anschaffungen schnell vergleichbar bleiben.',
          seoTitle: 'Vorlage Homeoffice | Costnest',
          seoDescription: 'Die Homeoffice-Vorlage hilft dir, Arbeitsmaterial geordnet zu sammeln und geplante Ausgaben im Blick zu behalten.',
          suggestions: [
            { title: 'Monitorstaender', targetPrice: 34.90, quantity: 1 },
            { title: 'Externe Tastatur', targetPrice: 39.90, quantity: 1 },
            { title: 'Mauspad', targetPrice: 12.90, quantity: 1 },
            { title: 'Webcam', targetPrice: 59.90, quantity: 1 },
            { title: 'Laptophalterung', targetPrice: 27.90, quantity: 1 }
          ]
        }
      ]
    },
    {
      id: 'schule',
      name: 'Schule',
      description: 'Vorlagen fuer Start und Organisation im Schulalltag.',
      defaultExpanded: false,
      templates: [
        {
          id: 'schulbeginn',
          slug: 'schulbeginn',
          name: 'Schulbeginn',
          description: 'Grundausstattung fuer den Start ins Schuljahr.',
          intro: 'Setze die Vorschlaege auf aktiv, die du direkt uebernehmen willst.',
          purposeText: 'Plane den Schulstart mit einer klaren Liste fuer Material und behalte die Gesamtausgaben frueh im Blick.',
          seoTitle: 'Vorlage Schulbeginn | Costnest',
          seoDescription: 'Starte organisiert ins Schuljahr: mit der Vorlage Schulbeginn fuer wichtige Besorgungen und klare Kostenuebersicht.',
          suggestions: [
            { title: 'Schulhefte (A4 kariert)', targetPrice: 1.20, quantity: 8 },
            { title: 'Federmappe', targetPrice: 14.90, quantity: 1 },
            { title: 'Buntstifte (12er Set)', targetPrice: 6.90, quantity: 1 },
            { title: 'Brotdose', targetPrice: 12.50, quantity: 1 },
            { title: 'Trinkflasche', targetPrice: 11.90, quantity: 1 }
          ]
        },
        {
          id: 'klassenfahrt',
          slug: 'klassenfahrt',
          name: 'Klassenfahrt',
          description: 'Packliste und Besorgungen fuer mehrtaegige Fahrten.',
          intro: 'Waehle die Punkte aus, die fuer die Klassenfahrt relevant sind.',
          purposeText: 'Nutze die Vorlage fuer Klassenfahrten, um Ausruestung und Besorgungen geordnet und stressfrei vorzubereiten.',
          seoTitle: 'Vorlage Klassenfahrt | Costnest',
          seoDescription: 'Plane eine Klassenfahrt mit einer kompakten Vorlage fuer Packliste und typische Einkaeufe.',
          suggestions: [
            { title: 'Reisetasche', targetPrice: 49.90, quantity: 1 },
            { title: 'Regenjacke', targetPrice: 39.90, quantity: 1 },
            { title: 'Handtuchset', targetPrice: 19.90, quantity: 1 },
            { title: 'Taschenlampe', targetPrice: 14.90, quantity: 1 },
            { title: 'Snacks fuer unterwegs', targetPrice: 8.90, quantity: 1 }
          ]
        }
      ]
    }
  ];

  var legacyTemplateIdMap = {
    geburtstag: 'geburtstagsfeier',
    'urlaub-zelten': 'zelten',
    'urlaub-schiffsreise': 'schiffsreise'
  };

  function getCategories() {
    return categories.map(cloneCategory);
  }

  function getAll() {
    var flatTemplates = [];

    categories.forEach(function (category) {
      category.templates.forEach(function (template) {
        flatTemplates.push(attachCategoryMeta(template, category));
      });
    });

    return flatTemplates;
  }

  function getById(templateId) {
    if (!templateId) {
      return null;
    }

    var resolvedId = resolveTemplateKey(templateId);
    var found = findTemplateAndCategory(resolvedId);

    if (!found) {
      return null;
    }

    return attachCategoryMeta(found.template, found.category);
  }

  function getRelatedByCategory(templateId, maxCount) {
    var resolvedId = resolveTemplateKey(templateId);
    var found = findTemplateAndCategory(resolvedId);
    if (!found) {
      return [];
    }

    var limit = Number.isFinite(maxCount) && maxCount > 0 ? Math.floor(maxCount) : 3;

    return found.category.templates
      .filter(function (template) {
        return template.id !== found.template.id;
      })
      .slice(0, limit)
      .map(function (template) {
        return attachCategoryMeta(template, found.category);
      });
  }

  function resolveTemplateKey(rawKey) {
    var key = String(rawKey || '').trim();
    if (!key) {
      return '';
    }

    return legacyTemplateIdMap[key] || key;
  }

  function findTemplateAndCategory(resolvedKey) {
    if (!resolvedKey) {
      return null;
    }

    var result = null;

    categories.some(function (category) {
      var template = category.templates.find(function (entry) {
        return entry.id === resolvedKey || entry.slug === resolvedKey;
      });

      if (!template) {
        return false;
      }

      result = {
        category: category,
        template: template
      };
      return true;
    });

    return result;
  }

  function attachCategoryMeta(template, category) {
    var clonedTemplate = cloneTemplate(template);
    clonedTemplate.categoryId = category ? category.id : '';
    clonedTemplate.categoryName = category ? category.name : '';
    return clonedTemplate;
  }

  function cloneCategory(category) {
    return JSON.parse(JSON.stringify(category));
  }

  function cloneTemplate(template) {
    return JSON.parse(JSON.stringify(template));
  }

  Costnest.templateRepository = {
    getCategories: getCategories,
    getAll: getAll,
    getById: getById,
    getRelatedByCategory: getRelatedByCategory
  };
})(window);
