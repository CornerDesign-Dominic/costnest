(function registerHeader(global) {
  var Costnest = global.Costnest;

  function renderHeader() {
    var slot = document.getElementById('app-header');
    if (!slot) {
      return;
    }

    var page = document.body ? document.body.getAttribute('data-page') : '';
    var isHome = page === 'home';
    var isCollectionsArea = page === 'collections' || page === 'collection-detail';

    var homeHref = isHome ? 'index.html' : '../index.html';
    var collectionsHref = isHome ? 'pages/collections.html' : 'collections.html';

    slot.innerHTML = [
      '<header class="app-header" role="banner">',
      '  <div class="app-header__inner">',
      '    <a class="brand" href="' + homeHref + '">Costnest</a>',
      '    <nav aria-label="Hauptnavigation">',
      '      <ul class="nav-list">',
      '        <li><a class="nav-link ' + (isCollectionsArea ? 'is-active' : '') + '" href="' + collectionsHref + '">Sammlungen</a></li>',
      '      </ul>',
      '    </nav>',
      '  </div>',
      '</header>'
    ].join('');
  }

  Costnest.header = {
    render: renderHeader
  };
})(window);



