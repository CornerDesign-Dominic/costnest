(function registerToast(global) {
  var Costnest = global.Costnest;
  var FLASH_KEY = 'costnest.toast.flash.v1';
  var LEGACY_FLASH_KEY = 'costrack.toast.flash.v1';
  var MAX_VISIBLE_TOASTS = 4;
  var DEFAULT_DURATION_MS = 2600;
  var containerElement = null;

  function render() {
    ensureContainer();
    consumeFlashToast();
  }

  function show(message, options) {
    if (!message) {
      return;
    }

    ensureContainer();

    var normalizedOptions = options && typeof options === 'object' ? options : {};
    var tone = normalizedOptions.tone === 'neutral' ? 'neutral' : 'success';
    var duration = Number.isFinite(normalizedOptions.duration) ? normalizedOptions.duration : DEFAULT_DURATION_MS;

    var toast = document.createElement('div');
    toast.className = 'app-toast app-toast--' + tone;
    toast.setAttribute('role', 'status');
    toast.textContent = String(message);
    containerElement.appendChild(toast);

    while (containerElement.childElementCount > MAX_VISIBLE_TOASTS) {
      containerElement.removeChild(containerElement.firstElementChild);
    }

    global.setTimeout(function () {
      toast.classList.add('is-leaving');
      global.setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 220);
    }, duration);
  }

  function flashNextPage(message, options) {
    if (!message) {
      return;
    }

    var payload = {
      message: String(message),
      tone: options && options.tone === 'neutral' ? 'neutral' : 'success'
    };

    try {
      sessionStorage.setItem(FLASH_KEY, JSON.stringify(payload));
    } catch (error) {
      show(message, options);
    }
  }

  function ensureContainer() {
    if (containerElement && document.body.contains(containerElement)) {
      return;
    }

    var existing = document.getElementById('app-toast-region');
    if (existing) {
      containerElement = existing;
      return;
    }

    containerElement = document.createElement('div');
    containerElement.id = 'app-toast-region';
    containerElement.className = 'app-toast-region';
    containerElement.setAttribute('aria-live', 'polite');
    containerElement.setAttribute('aria-atomic', 'false');
    document.body.appendChild(containerElement);
  }

  function consumeFlashToast() {
    try {
      var raw = sessionStorage.getItem(FLASH_KEY);
      if (!raw) {
        raw = sessionStorage.getItem(LEGACY_FLASH_KEY);
      }
      if (!raw) {
        return;
      }

      sessionStorage.removeItem(FLASH_KEY);
      sessionStorage.removeItem(LEGACY_FLASH_KEY);
      var payload = JSON.parse(raw);
      if (!payload || typeof payload.message !== 'string') {
        return;
      }

      show(payload.message, { tone: payload.tone });
    } catch (error) {
      sessionStorage.removeItem(FLASH_KEY);
    }
  }

  Costnest.toast = {
    render: render,
    show: show,
    flashNextPage: flashNextPage
  };
})(window);

