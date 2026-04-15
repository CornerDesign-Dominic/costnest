(function registerTemplatesPage(global) {
  var Costnest = global.Costnest;

  function initTemplatesPage() {
    if (document.body.getAttribute('data-page') !== 'templates') {
      return;
    }

    var groupsElement = document.getElementById('template-groups');
    var filtersElement = document.getElementById('template-category-filters');
    var searchInput = document.getElementById('template-search');
    var emptyState = document.getElementById('templates-empty-state');

    if (!groupsElement || !filtersElement || !searchInput || !emptyState || !Costnest.templateRepository || typeof Costnest.templateRepository.getCategories !== 'function') {
      return;
    }

    var categories = Costnest.templateRepository.getCategories();
    var lastTrackedSearchQuery = '';
    var state = {
      activeCategory: 'all',
      query: '',
      expandedByCategory: createInitialExpandedMap(categories)
    };

    renderFilters();
    renderGroups();

    filtersElement.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-category-filter]');
      if (!trigger) {
        return;
      }

      var nextCategory = String(trigger.getAttribute('data-category-filter') || 'all');
      if (state.activeCategory === nextCategory) {
        return;
      }

      state.activeCategory = nextCategory;
      trackTemplateFilter(nextCategory);
      renderFilters();
      renderGroups();
    });

    groupsElement.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-action="toggle-category"]');
      if (!trigger) {
        return;
      }

      if (state.query) {
        return;
      }

      var categoryId = String(trigger.getAttribute('data-category-id') || '');
      if (!categoryId || !(categoryId in state.expandedByCategory)) {
        return;
      }

      state.expandedByCategory[categoryId] = !state.expandedByCategory[categoryId];
      renderGroups();
    });

    searchInput.addEventListener('input', function () {
      state.query = String(searchInput.value || '').trim().toLowerCase();
      trackTemplateSearch(state.query);
      renderGroups();
    });

    function renderFilters() {
      var chips = [
        createFilterChip('all', 'Alle', state.activeCategory === 'all')
      ];

      categories.forEach(function (category) {
        chips.push(createFilterChip(category.id, category.name, state.activeCategory === category.id));
      });

      filtersElement.innerHTML = chips.join('');
    }

    function createFilterChip(categoryId, label, isActive) {
      return [
        '<button type="button" class="template-filter-chip' + (isActive ? ' is-active' : '') + '" data-category-filter="' + categoryId + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">',
        '  ' + escapeHtml(label),
        '</button>'
      ].join('');
    }

    function renderGroups() {
      var visibleGroups = categories
        .filter(matchesActiveCategory)
        .map(function (category) {
          var visibleTemplates = category.templates.filter(function (template) {
            return matchesQuery(template, category, state.query);
          });

          if (!visibleTemplates.length) {
            return null;
          }

          return {
            category: category,
            templates: visibleTemplates
          };
        })
        .filter(Boolean);

      if (!visibleGroups.length) {
        groupsElement.innerHTML = '';
        emptyState.hidden = false;
        return;
      }

      emptyState.hidden = true;
      groupsElement.innerHTML = visibleGroups.map(function (group) {
        return renderGroup(group.category, group.templates);
      }).join('');
    }

    function renderGroup(category, visibleTemplates) {
      var baseCount = category.templates.length;
      var isFilteredView = visibleTemplates.length !== baseCount;
      var countLabel = isFilteredView
        ? visibleTemplates.length + ' von ' + baseCount + ' Vorlagen'
        : baseCount + ' Vorlagen';
      var isExpanded = state.query ? true : Boolean(state.expandedByCategory[category.id]);
      var bodyId = 'template-group-body-' + category.id;

      return [
        '<section class="card template-group" aria-label="Kategorie ' + escapeHtml(category.name) + '">',
        '  <header class="template-group__head">',
        '    <div class="template-group__meta">',
        '      <h2>' + escapeHtml(category.name) + '</h2>',
        '      <p>' + escapeHtml(category.description) + '</p>',
        '      <small>' + escapeHtml(countLabel) + '</small>',
        '    </div>',
        '    <button type="button" class="template-group__toggle" data-action="toggle-category" data-category-id="' + category.id + '" aria-expanded="' + (isExpanded ? 'true' : 'false') + '" aria-controls="' + bodyId + '"' + (state.query ? ' aria-disabled="true" title="Bei Suche geoeffnet"' : '') + '>',
        '      <span>' + (isExpanded ? 'Einklappen' : 'Aufklappen') + '</span>',
        '      <span class="template-group__toggle-icon" aria-hidden="true">' + (isExpanded ? '&#8722;' : '+') + '</span>',
        '    </button>',
        '  </header>',
        '  <div class="template-group__content" id="' + bodyId + '"' + (isExpanded ? '' : ' hidden') + '>',
        '    <div class="template-group__grid">',
        visibleTemplates.map(function (template) {
          return renderTemplateCard(template);
        }).join(''),
        '    </div>',
        '  </div>',
        '</section>'
      ].join('');
    }

    function renderTemplateCard(template) {
      var suggestionCount = Array.isArray(template.suggestions) ? template.suggestions.length : 0;
      var detailUrl = Costnest.routes && typeof Costnest.routes.getTemplateDetailUrl === 'function'
        ? Costnest.routes.getTemplateDetailUrl(template)
        : '#';
      return [
        '<a class="template-card template-card--link" href="' + detailUrl + '">',
        '  <h3>' + escapeHtml(template.name) + '</h3>',
        '  <p>' + escapeHtml(template.description) + '</p>',
        '  <small>' + suggestionCount + ' Vorschlaege</small>',
        '</a>'
      ].join('');
    }

    function matchesActiveCategory(category) {
      return state.activeCategory === 'all' || category.id === state.activeCategory;
    }

    function trackTemplateSearch(query) {
      if (!query) {
        lastTrackedSearchQuery = '';
        return;
      }

      if (query === lastTrackedSearchQuery) {
        return;
      }

      lastTrackedSearchQuery = query;
      if (Costnest.analytics && typeof Costnest.analytics.trackEvent === 'function') {
        Costnest.analytics.trackEvent('template_search', {
          query_length: query.length
        });
      }
    }

    function trackTemplateFilter(categoryId) {
      if (Costnest.analytics && typeof Costnest.analytics.trackEvent === 'function') {
        Costnest.analytics.trackEvent('template_filter', {
          category_id: categoryId,
          category_name: getCategoryNameById(categoryId)
        });
      }
    }

    function getCategoryNameById(categoryId) {
      if (categoryId === 'all') {
        return 'Alle';
      }

      var match = categories.find(function (category) {
        return category.id === categoryId;
      });

      return match ? match.name : '';
    }
  }

  function createInitialExpandedMap(categories) {
    return categories.reduce(function (acc, category, index) {
      acc[category.id] = category.defaultExpanded === true || index < 2;
      return acc;
    }, {});
  }

  function matchesQuery(template, category, query) {
    if (!query) {
      return true;
    }

    var inTemplateName = String(template.name || '').toLowerCase().indexOf(query) !== -1;
    var inTemplateDescription = String(template.description || '').toLowerCase().indexOf(query) !== -1;
    var inCategoryName = String(category.name || '').toLowerCase().indexOf(query) !== -1;

    return inTemplateName || inTemplateDescription || inCategoryName;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  Costnest.pages = Costnest.pages || {};
  Costnest.pages.templates = {
    init: initTemplatesPage
  };
})(window);
