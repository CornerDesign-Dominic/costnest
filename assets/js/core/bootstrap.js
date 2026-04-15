(function bootstrap(global) {
  var Costnest = global.Costnest;

  function init() {
    if (Costnest.header && typeof Costnest.header.render === 'function') {
      Costnest.header.render();
    }

    if (Costnest.footer && typeof Costnest.footer.render === 'function') {
      Costnest.footer.render();
    }

    if (Costnest.toast && typeof Costnest.toast.render === 'function') {
      Costnest.toast.render();
    }

    if (Costnest.pages && Costnest.pages.home && typeof Costnest.pages.home.init === 'function') {
      Costnest.pages.home.init();
    }

    if (Costnest.pages && Costnest.pages.collectionsOverview && typeof Costnest.pages.collectionsOverview.init === 'function') {
      Costnest.pages.collectionsOverview.init();
    }

    if (Costnest.pages && Costnest.pages.collectionDetail && typeof Costnest.pages.collectionDetail.init === 'function') {
      Costnest.pages.collectionDetail.init();
    }

    if (Costnest.pages && Costnest.pages.templates && typeof Costnest.pages.templates.init === 'function') {
      Costnest.pages.templates.init();
    }

    if (Costnest.pages && Costnest.pages.templateDetail && typeof Costnest.pages.templateDetail.init === 'function') {
      Costnest.pages.templateDetail.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);


