(function registerHeader(global) {
  var Costnest = global.Costnest;
  var THEME_STORAGE_KEY = 'costnest.theme';
  var LIGHT_THEME = 'light';
  var DARK_THEME = 'dark';

  function getSystemTheme() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
    } catch (error) {
      return LIGHT_THEME;
    }
  }

  function getStoredTheme() {
    try {
      var rawValue = global.localStorage.getItem(THEME_STORAGE_KEY);
      if (rawValue === LIGHT_THEME || rawValue === DARK_THEME) {
        return rawValue;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function resolveActiveTheme() {
    var storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    var htmlTheme = document.documentElement.getAttribute('data-theme');
    if (htmlTheme === LIGHT_THEME || htmlTheme === DARK_THEME) {
      return htmlTheme;
    }

    return getSystemTheme();
  }

  function applyTheme(theme) {
    var activeTheme = theme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.documentElement.style.colorScheme = activeTheme;
    return activeTheme;
  }

  function persistTheme(theme) {
    try {
      global.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      return;
    }
  }

  function getToggleText(theme) {
    return theme === DARK_THEME ? 'Dunkel' : 'Hell';
  }

  function updateThemeToggle(button, theme) {
    if (!button) {
      return;
    }

    var isDark = theme === DARK_THEME;
    button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    button.setAttribute('aria-label', 'Darstellungsmodus wechseln. Aktuell: ' + getToggleText(theme));
    button.textContent = getToggleText(theme);
  }

  function bindThemeToggle() {
    var toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) {
      return;
    }

    var activeTheme = applyTheme(resolveActiveTheme());
    updateThemeToggle(toggleButton, activeTheme);

    toggleButton.addEventListener('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme') === DARK_THEME ? DARK_THEME : LIGHT_THEME;
      var nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
      var appliedTheme = applyTheme(nextTheme);
      persistTheme(appliedTheme);
      updateThemeToggle(toggleButton, appliedTheme);
    });
  }

  function renderHeader() {
    var slot = document.getElementById('app-header');
    if (!slot) {
      return;
    }

    var page = document.body ? document.body.getAttribute('data-page') : '';
    var isHome = page === 'home';
    var isCollectionsArea = page === 'collections' || page === 'collection-detail';
    var isTemplatesPage = page === 'templates';

    var homeHref = isHome ? 'index.html' : '../index.html';
    var collectionsHref = isHome ? 'pages/collections.html' : 'collections.html';
    var templatesHref = isHome ? 'pages/templates.html' : 'templates.html';

    slot.innerHTML = [
      '<header class="app-header" role="banner">',
      '  <div class="app-header__inner">',
      '    <a class="brand" href="' + homeHref + '">Costnest</a>',
      '    <nav aria-label="Hauptnavigation">',
      '      <ul class="nav-list">',
      '        <li><a class="nav-link ' + (isCollectionsArea ? 'is-active' : '') + '" href="' + collectionsHref + '">Sammlungen</a></li>',
      '        <li><a class="nav-link ' + (isTemplatesPage ? 'is-active' : '') + '" href="' + templatesHref + '">Vorlagen</a></li>',
      '      </ul>',
      '    </nav>',
      '    <button type="button" class="theme-toggle" id="theme-toggle" aria-live="polite">Hell</button>',
      '  </div>',
      '</header>'
    ].join('');

    bindThemeToggle();
  }

  Costnest.header = {
    render: renderHeader
  };
})(window);

