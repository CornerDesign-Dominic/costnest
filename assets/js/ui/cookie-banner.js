(function registerCookieBanner(global) {
  var Costnest = global.Costnest;
  var CONSENT_KEY = 'cookie_consent';
  var CONSENT_ACCEPTED = 'accepted';
  var CONSENT_DECLINED = 'declined';
  var GA_MEASUREMENT_ID = 'G-MLFZN60477';

  function render() {
    var consent = readConsent();

    if (consent === CONSENT_ACCEPTED) {
      loadAnalytics();
      return;
    }

    if (consent === CONSENT_DECLINED) {
      return;
    }

    mountBanner();
  }

  function mountBanner() {
    if (document.getElementById('cookie-banner')) {
      return;
    }

    var banner = document.createElement('aside');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie Hinweis');

    banner.innerHTML = [
      '<div class="cookie-banner__inner">',
      '  <p class="cookie-banner__text">Wir verwenden Cookies, um die Nutzung unserer Website zu analysieren und zu verbessern.</p>',
      '  <div class="cookie-banner__actions">',
      '    <button type="button" class="button button-primary" data-action="accept-cookies">Akzeptieren</button>',
      '    <button type="button" class="button button-ghost" data-action="decline-cookies">Ablehnen</button>',
      '    <a class="cookie-banner__link" href="/pages/datenschutz.html">Mehr erfahren</a>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      banner.classList.add('is-visible');
    });

    banner.addEventListener('click', function (event) {
      var acceptBtn = event.target.closest('[data-action="accept-cookies"]');
      if (acceptBtn) {
        writeConsent(CONSENT_ACCEPTED);
        loadAnalytics();
        unmountBanner(banner);
        return;
      }

      var declineBtn = event.target.closest('[data-action="decline-cookies"]');
      if (declineBtn) {
        writeConsent(CONSENT_DECLINED);
        unmountBanner(banner);
      }
    });
  }

  function unmountBanner(banner) {
    if (!banner) {
      return;
    }

    banner.classList.remove('is-visible');
    global.setTimeout(function () {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 180);
  }

  function readConsent() {
    try {
      var value = global.localStorage.getItem(CONSENT_KEY);
      if (value === CONSENT_ACCEPTED || value === CONSENT_DECLINED) {
        return value;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function writeConsent(value) {
    try {
      global.localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
      return;
    }
  }

  function loadAnalytics() {
    if (global.__costnestGaLoaded) {
      return;
    }

    global.__costnestGaLoaded = true;
    global.dataLayer = global.dataLayer || [];
    global.gtag = global.gtag || function gtag() {
      global.dataLayer.push(arguments);
    };

    global.gtag('js', new Date());
    global.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });

    var existingScript = document.querySelector('script[data-analytics="ga4"]');
    if (existingScript) {
      return;
    }

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    script.setAttribute('data-analytics', 'ga4');
    document.head.appendChild(script);
  }

  Costnest.cookieBanner = {
    render: render,
    loadAnalytics: loadAnalytics,
    keys: {
      consent: CONSENT_KEY
    }
  };
})(window);
