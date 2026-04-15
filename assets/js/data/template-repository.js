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
          intro: 'Waehle aus, was du fuer die Feier direkt in deine Sammlung uebernehmen willst.',
          purposeText: 'Diese Vorlage hilft dir, eine Geburtstagsfeier strukturiert zu planen und alle wichtigen Dinge im Blick zu behalten - von Deko bis Verbrauchsmaterial.',
          details: [
            'Bei einer Geburtstagsfeier gehen oft viele kleine Dinge vergessen, besonders Verbrauchsmaterial wie Teller, Becher oder Kerzen.',
            'Mit einer vorbereiteten Liste kannst du alles im Voraus planen und musst nicht mehrfach einkaufen.',
            'Die Vorlage eignet sich besonders fuer private Feiern zu Hause oder im Garten.'
          ],
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
          intro: 'Nutze die Liste fuer eine klare Silvester-Planung ohne spontane Nachkaeufe.',
          purposeText: 'Mit dieser Vorlage planst du typische Silvester-Einkaeufe in einem Schritt und behältst Deko, Verbrauchsmaterial und Kleinteile zusammen.',
          details: [
            'Zum Jahreswechsel fehlen haeufig erst kurz vorher Dinge wie Einwegglaeser, Servietten oder Tischdeko.',
            'Wenn du alles frueh sammelst, kannst du Mengen besser abschaetzen und Last-Minute-Stress vermeiden.',
            'Die Vorlage passt fuer Feiern zu Hause, in kleinen Gruppen oder fuer eine gemeinsame Feier mit Freunden.'
          ],
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
          intro: 'Stelle deine Weihnachts-Einkaeufe frueh zusammen und uebernehme nur relevante Punkte.',
          purposeText: 'Diese Vorlage hilft dir, wiederkehrende Weihnachts-Besorgungen geordnet vorzubereiten und nichts Wichtiges zu uebersehen.',
          details: [
            'Gerade vor den Feiertagen kommen viele Besorgungen zusammen, vom Verpackungsmaterial bis zur Tischgestaltung.',
            'Mit einer festen Vorlage kannst du wiederkehrende Artikel jedes Jahr schnell erneut nutzen und anpassen.',
            'So bleiben Aufwand und Kosten besser planbar, auch wenn mehrere Termine oder Besuche anstehen.'
          ],
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
          intro: 'Lege deine Camping-Basics als strukturierte Einkaufsliste fuer die Reise an.',
          purposeText: 'Mit dieser Vorlage stellst du sicher, dass du fuer deinen Zelturlaub alles Wichtige dabei hast - von Schlafausruestung bis Verpflegung.',
          details: [
            'Beim Zelten ist eine gute Vorbereitung entscheidend, da fehlende Ausruestung unterwegs oft schwer zu ersetzen ist.',
            'Typische Essentials sind Zelt, Schlafsack, Beleuchtung und einfache Kochmoeglichkeiten.',
            'Je nach Dauer und Ort der Reise kannst du die Liste schnell erweitern oder reduzieren.'
          ],
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
          intro: 'Nutze die Vorlage, um wichtige Reiseartikel fuer deine Schiffsreise frueh zusammenzustellen.',
          purposeText: 'Diese Vorlage hilft dir, typische Besorgungen fuer Tage an Bord geordnet zu planen und mit realistischen Mengen zu erfassen.',
          details: [
            'Auf Schiffsreisen werden oft spezielle Dinge gebraucht, etwa Sonnenschutz, Adapter oder komfortable Reise-Accessoires.',
            'Wenn du die Liste vorab planst, kannst du Fehlkaeufe vermeiden und offene Punkte schnell nachverfolgen.',
            'Die Vorlage eignet sich fuer kurze Kreuzfahrten und laengere Reisen mit mehreren Stopps.'
          ],
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
          intro: 'Plane einen kurzen Staedtetrip mit einer kompakten, realistischen Einkaufsliste.',
          purposeText: 'Diese Vorlage deckt die wichtigsten Besorgungen fuer einen Staedtetrip ab und hilft dir, mit wenig Aufwand vorbereitet zu starten.',
          details: [
            'Bei kurzen Reisen sind praktische Basics wichtiger als eine lange Packliste, zum Beispiel Tagesrucksack, Powerbank und Adapter.',
            'Mit einer festen Vorlage kannst du wiederkehrende Reiseeinkaeufe schneller treffen und doppelte Kaeufe vermeiden.',
            'Die Liste ist bewusst kompakt und laesst sich bei Bedarf um wetter- oder ortsspezifische Punkte erweitern.'
          ],
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
          intro: 'Baue dir eine verlässliche Einkaufsliste fuer regelmaessig benoetigtes Buerozubehoer auf.',
          purposeText: 'Diese Vorlage hilft dir, regelmaessig benoetigtes Bueromaterial gebuendelt zu verwalten und gezielt nachzubestellen.',
          details: [
            'Im Bueroalltag fehlen oft kleine Dinge wie Stifte, Papier oder Verbrauchsmaterial genau dann, wenn sie gebraucht werden.',
            'Mit einer festen Sammlung kannst du Nachkaeufe planen, Alternativen vergleichen und Zeit sparen.',
            'Besonders sinnvoll ist die Vorlage fuer Homeoffice, kleine Teams und wiederkehrende Monatskaeufe.'
          ],
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
          intro: 'Erfasse wichtige Homeoffice-Anschaffungen in einer klaren, wiederverwendbaren Liste.',
          purposeText: 'Die Vorlage unterstuetzt dich dabei, dein Homeoffice strukturiert aufzubauen und noetige Anschaffungen sinnvoll zu priorisieren.',
          details: [
            'Gerade beim Einrichten von Arbeitsplaetzen zu Hause werden Ergonomie und Technik oft stueckweise und ungeplant gekauft.',
            'Mit einer geordneten Vorlage kannst du Bedarfe nach Wichtigkeit priorisieren und Preise besser vergleichen.',
            'So entsteht Schritt fuer Schritt eine funktionale Ausstattung ohne den Ueberblick zu verlieren.'
          ],
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
          intro: 'Nutze diese Vorlage, um alle wichtigen Materialien fuer den Schulstart geordnet einzuplanen.',
          purposeText: 'Mit dieser Vorlage behaeltst du den Ueberblick ueber alle wichtigen Dinge zum Schulbeginn und vermeidest doppelte Kaeufe.',
          details: [
            'Zum Schulbeginn muessen oft viele Materialien gleichzeitig organisiert werden, von Heften bis Schreibzubehoer.',
            'Gerade bei mehreren Kindern oder Klassenlisten geht ohne Struktur schnell ein Artikel unter.',
            'Die Vorlage hilft dir, systematisch einzukaufen und vorbereitet ins Schuljahr zu starten.'
          ],
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
          intro: 'Bereite Besorgungen fuer eine mehrtaegige Klassenfahrt strukturiert und nachvollziehbar vor.',
          purposeText: 'Diese Vorlage hilft dir, wichtige Ausruestung fuer Klassenfahrten vollstaendig zu planen und kurz vor Abfahrt nichts zu vergessen.',
          details: [
            'Vor Klassenfahrten werden oft Reisegepaeck, Kleidung und kleinere Alltagsartikel gleichzeitig benoetigt.',
            'Mit einer vorbereiteten Liste lassen sich fehlende Dinge frueh erkennen und in Ruhe besorgen.',
            'Die Vorlage ist besonders hilfreich fuer mehrtaegige Fahrten mit wechselndem Wetter.'
          ],
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
