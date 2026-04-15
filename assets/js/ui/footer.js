(function registerFooter(global) {
  var Costnest = global.Costnest;

  function renderFooter() {
    var slot = document.getElementById('app-footer');
    if (!slot) {
      return;
    }

    var page = document.body ? document.body.getAttribute('data-page') : '';
    var isHome = page === 'home';
    var pagePrefix = isHome ? 'pages/' : '';
    var versionText = 'Costnest - Beta';

    slot.innerHTML = [
      '<footer class="app-footer" role="contentinfo">',
      '  <div class="app-footer__inner">',
      '    <nav class="app-footer__nav" aria-label="Rechtliche Informationen">',
      '      <a href="' + pagePrefix + 'impressum.html">Impressum</a>',
      '      <a href="' + pagePrefix + 'datenschutz.html">Datenschutz</a>',
      '      <a href="' + pagePrefix + 'agb.html">AGB</a>',
      '    </nav>',
      '    <div class="app-footer__meta">',
      '      <small class="app-footer__version">' + versionText + '</small>',
      '      <small class="app-footer__copy">&copy; Costnest</small>',
      '    </div>',
      '  </div>',
      '</footer>'
    ].join('');
  }

  Costnest.footer = {
    render: renderFooter
  };
})(window);
