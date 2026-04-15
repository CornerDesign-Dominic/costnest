(function registerHomePage(global) {
  var Costnest = global.Costnest;

  function initHomePage() {
    if (document.body.getAttribute('data-page') !== 'home') {
      return;
    }

    function handleStartCollection() {
        if (!Costnest.collectionRepository || typeof Costnest.collectionRepository.create !== 'function') {
          global.location.href = 'pages/collections.html';
          return;
        }

        var collection = Costnest.collectionRepository.create('');
        global.location.href = 'pages/collection-detail.html?collectionId=' + encodeURIComponent(collection.id);
    }

    var startButtons = [
      document.getElementById('start-first-collection'),
      document.getElementById('start-first-collection-cta')
    ];

    startButtons.forEach(function (button) {
      if (button) {
        button.addEventListener('click', handleStartCollection);
      }
    });

    if (!location.hash) {
      return;
    }

    if (location.hash === '#costnest') {
      var heroHeading = document.getElementById('home-hero-title');
      if (heroHeading) {
        heroHeading.setAttribute('tabindex', '-1');
        heroHeading.focus();
      }
    }
  }

  Costnest.pages = Costnest.pages || {};
  Costnest.pages.home = {
    init: initHomePage
  };
})(window);

