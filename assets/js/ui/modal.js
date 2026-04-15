(function registerModal(global) {
  var Costnest = global.Costnest;

  function createModalController(config) {
    var backdrop = document.getElementById(config.backdropId);
    var openButton = document.getElementById(config.openButtonId);
    var cancelButton = document.getElementById(config.cancelButtonId);
    var closeButton = document.getElementById(config.closeButtonId);
    var form = document.getElementById(config.formId);
    var firstField = document.getElementById(config.firstFieldId);

    if (!backdrop || !cancelButton || !closeButton || !form || !firstField) {
      return null;
    }

    var lastFocusedElement = null;
    setOpenState(false);

    function open() {
      lastFocusedElement = document.activeElement;
      setOpenState(true);
      firstField.focus();
    }

    function close() {
      setOpenState(false);
      form.reset();
      clearErrors();
      restoreFocus();
    }

    function setOpenState(isOpen) {
      backdrop.hidden = !isOpen;
      backdrop.classList.toggle('is-open', isOpen);
      backdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    function restoreFocus() {
      if (isFocusable(lastFocusedElement)) {
        lastFocusedElement.focus();
        return;
      }

      if (isFocusable(openButton)) {
        openButton.focus();
      }
    }

    function isFocusable(element) {
      if (!element || typeof element.focus !== 'function') {
        return false;
      }

      if (!document.contains(element)) {
        return false;
      }

      if (element.hasAttribute('disabled') || element.hidden) {
        return false;
      }

      return true;
    }

    function clearErrors() {
      config.errorIds.forEach(function (id) {
        setFieldError(id, '');
      });
    }

    function setFieldError(elementId, message) {
      var element = document.getElementById(elementId);
      if (element) {
        element.textContent = message;
      }
    }

    if (openButton) {
      openButton.addEventListener('click', open);
    }
    cancelButton.addEventListener('click', close);
    closeButton.addEventListener('click', close);

    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) {
        close();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (backdrop.classList.contains('is-open') && event.key === 'Escape') {
        close();
      }
    });

    return {
      open: open,
      close: close,
      form: form,
      setFieldError: setFieldError,
      clearErrors: clearErrors
    };
  }

  function createEntryModalController() {
    return createModalController({
      backdropId: 'entry-modal-backdrop',
      openButtonId: 'open-entry-modal',
      cancelButtonId: 'cancel-entry-modal',
      closeButtonId: 'close-entry-modal',
      formId: 'entry-form',
      firstFieldId: 'shop-link',
      errorIds: ['shop-link-error', 'current-price-error', 'target-price-error', 'quantity-error']
    });
  }

  function createCollectionModalController() {
    return createModalController({
      backdropId: 'collection-modal-backdrop',
      openButtonId: 'open-collection-modal',
      cancelButtonId: 'cancel-collection-modal',
      closeButtonId: 'close-collection-modal',
      formId: 'collection-form',
      firstFieldId: 'collection-name',
      errorIds: ['collection-name-error']
    });
  }

  Costnest.modal = {
    createEntryModalController: createEntryModalController,
    createCollectionModalController: createCollectionModalController
  };
})(window);


