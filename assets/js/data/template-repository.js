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
          name: 'Geburtstagsfeier',
          description: 'Alles Wichtige fuer eine entspannte Feier.',
          intro: 'Waehle aus, was du fuer den Geburtstag direkt uebernehmen willst.',
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
          name: 'Silvester',
          description: 'Getraenke, Deko und Basics fuer den Jahreswechsel.',
          intro: 'Aktiviere die Vorschlaege, die fuer deine Silvesterplanung passen.',
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
          name: 'Weihnachten',
          description: 'Typische Besorgungen fuer ruhige Feiertage.',
          intro: 'Setze nur die Punkte auf aktiv, die du in deine Weihnachtsliste uebernehmen willst.',
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
          name: 'Zelten',
          description: 'Basis-Ausstattung fuer den Campingtrip.',
          intro: 'Waehle die Teile, die in deine Camping-Sammlung sollen.',
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
          name: 'Schiffsreise',
          description: 'Wichtige Reiseartikel fuer Tage an Bord.',
          intro: 'Markiere die Vorschlaege, die du fuer die Schiffsreise brauchst.',
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
          name: 'Staedtetrip',
          description: 'Kompakte Liste fuer kurze Reisen.',
          intro: 'Nimm nur mit, was fuer deinen Staedtetrip wirklich relevant ist.',
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
          name: 'Bueromaterial',
          description: 'Die wichtigsten Basics fuer den Arbeitsalltag.',
          intro: 'Aktiviere die Vorschlaege, die du in deine Material-Sammlung uebernehmen willst.',
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
          name: 'Homeoffice',
          description: 'Praktische Ausstattung fuer konzentriertes Arbeiten zu Hause.',
          intro: 'Waehle die Punkte aus, die du fuer dein Homeoffice einplanen willst.',
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
          name: 'Schulbeginn',
          description: 'Grundausstattung fuer den Start ins Schuljahr.',
          intro: 'Setze die Vorschlaege auf aktiv, die du direkt uebernehmen willst.',
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
          name: 'Klassenfahrt',
          description: 'Packliste und Besorgungen fuer mehrtaegige Fahrten.',
          intro: 'Waehle die Punkte aus, die fuer die Klassenfahrt relevant sind.',
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
        flatTemplates.push(cloneTemplate(template));
      });
    });

    return flatTemplates;
  }

  function getById(templateId) {
    if (!templateId) {
      return null;
    }

    var resolvedId = legacyTemplateIdMap[templateId] || templateId;
    var found = null;
    var foundCategory = null;

    categories.some(function (category) {
      var template = category.templates.find(function (entry) {
        return entry.id === resolvedId;
      });

      if (!template) {
        return false;
      }

      found = template;
      foundCategory = category;
      return true;
    });

    if (!found) {
      return null;
    }

    var clonedTemplate = cloneTemplate(found);
    clonedTemplate.categoryId = foundCategory ? foundCategory.id : '';
    clonedTemplate.categoryName = foundCategory ? foundCategory.name : '';
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
    getById: getById
  };
})(window);
