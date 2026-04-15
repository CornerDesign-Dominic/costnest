(function registerTemplateRepository(global) {
  var Costnest = global.Costnest;

  var templates = [
    {
      id: 'bueromaterial',
      name: 'Bueromaterial',
      description: 'Alles fuer den Arbeitsalltag an einem Ort gesammelt.',
      intro: 'Aktiviere die Vorschlaege, die du fuer deine Sammlung uebernehmen willst.',
      suggestions: [
        { title: 'Druckerpapier A4 (500 Blatt)', targetPrice: 5.90, quantity: 2 },
        { title: 'Kugelschreiber (10er Set)', targetPrice: 8.50, quantity: 1 },
        { title: 'Bleistifte HB (6er Set)', targetPrice: 3.50, quantity: 1 },
        { title: 'Schreibtischunterlage', targetPrice: 14.90, quantity: 1 },
        { title: 'LED Tischlampe', targetPrice: 29.90, quantity: 1 }
      ]
    },
    {
      id: 'geburtstag',
      name: 'Geburtstag',
      description: 'Typische Einkaeufe fuer eine Feier schnell vorbereitet.',
      intro: 'Waehle aus, was fuer deine Feier direkt in die Sammlung soll.',
      suggestions: [
        { title: 'Luftballons (30er Pack)', targetPrice: 6.50, quantity: 1 },
        { title: 'Luftschlangen', targetPrice: 2.90, quantity: 2 },
        { title: 'Pappteller (20 Stueck)', targetPrice: 4.90, quantity: 1 },
        { title: 'Pappbecher (20 Stueck)', targetPrice: 3.90, quantity: 1 },
        { title: 'Geburtstagskerzen (24 Stueck)', targetPrice: 2.50, quantity: 1 }
      ]
    },
    {
      id: 'urlaub-zelten',
      name: 'Urlaub - Zelten',
      description: 'Grundausstattung fuer den naechsten Campingtrip.',
      intro: 'Setze nur die Dinge auf aktiv, die du wirklich einplanen willst.',
      suggestions: [
        { title: '2-Personen Zelt', targetPrice: 119.00, quantity: 1 },
        { title: 'Isomatte', targetPrice: 34.90, quantity: 2 },
        { title: 'Schlafsack 3 Jahreszeiten', targetPrice: 59.90, quantity: 2 },
        { title: 'Campinglampe', targetPrice: 24.90, quantity: 1 },
        { title: 'Gaskocher', targetPrice: 44.90, quantity: 1 }
      ]
    },
    {
      id: 'urlaub-schiffsreise',
      name: 'Urlaub - Schiffsreise',
      description: 'Praktische Reiseartikel fuer entspannte Tage an Bord.',
      intro: 'Markiere die Vorschlaege, die in deine Reise-Sammlung sollen.',
      suggestions: [
        { title: 'Sonnencreme SPF 50', targetPrice: 11.90, quantity: 2 },
        { title: 'Koffer (M)', targetPrice: 89.00, quantity: 1 },
        { title: 'Nackenkissen', targetPrice: 19.90, quantity: 1 },
        { title: 'Reisestecker', targetPrice: 12.90, quantity: 1 },
        { title: 'Sonnenbrille', targetPrice: 39.90, quantity: 1 }
      ]
    },
    {
      id: 'schulbeginn',
      name: 'Schulbeginn',
      description: 'Wichtige Basics fuer einen stressfreien Start.',
      intro: 'Passe die Auswahl an und uebernimm sie direkt in eine Sammlung.',
      suggestions: [
        { title: 'Schulhefte (A4 kariert)', targetPrice: 1.20, quantity: 8 },
        { title: 'Federmappe', targetPrice: 14.90, quantity: 1 },
        { title: 'Buntstifte (12er Set)', targetPrice: 6.90, quantity: 1 },
        { title: 'Brotdose', targetPrice: 12.50, quantity: 1 },
        { title: 'Trinkflasche', targetPrice: 11.90, quantity: 1 }
      ]
    }
  ];

  function getAll() {
    return templates.map(cloneTemplate);
  }

  function getById(templateId) {
    if (!templateId) {
      return null;
    }

    var found = templates.find(function (template) {
      return template.id === templateId;
    });

    return found ? cloneTemplate(found) : null;
  }

  function cloneTemplate(template) {
    return JSON.parse(JSON.stringify(template));
  }

  Costnest.templateRepository = {
    getAll: getAll,
    getById: getById
  };
})(window);
