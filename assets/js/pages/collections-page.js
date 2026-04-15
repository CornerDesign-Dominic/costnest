(function registerCollectionsOverviewPage(global) {
  var Costnest = global.Costnest;

  function initCollectionsOverviewPage() {
    if (document.body.getAttribute('data-page') !== 'collections') {
      return;
    }

    var listElement = document.getElementById('collections-overview-list');
    var emptyState = document.getElementById('collections-empty-state');
    var deleteBackdrop = document.getElementById('delete-collection-modal-backdrop');
    var closeDeleteButton = document.getElementById('close-delete-collection-modal');
    var cancelDeleteButton = document.getElementById('cancel-delete-collection-modal');
    var deleteForm = document.getElementById('delete-collection-form');
    var confirmDeleteButton = document.getElementById('confirm-delete-collection');

    if (!listElement || !emptyState || !deleteBackdrop || !closeDeleteButton || !cancelDeleteButton || !deleteForm || !confirmDeleteButton) {
      return;
    }

    var pendingDeleteCollectionId = null;
    render();

    function render() {
      var collections = Costnest.collectionRepository.getAllWithStats();
      listElement.innerHTML = '';
      emptyState.hidden = true;

      listElement.appendChild(createAddCollectionCard());

      collections.forEach(function (collection) {
        listElement.appendChild(createCollectionCard(collection));
      });
    }

    function createAddCollectionCard() {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'card collection-overview-card collection-overview-card--add';
      card.setAttribute('data-action', 'open-collection');
      card.setAttribute('aria-label', 'Sammlung hinzufügen');
      card.innerHTML = [
        '<span class="collection-overview-card__add-title">Sammlung hinzufügen</span>'
      ].join('');
      return card;
    }

    function createCollectionCard(collection) {
      var card = document.createElement('article');
      card.className = 'card collection-overview-card';
      var createdAt = formatCollectionDate(collection.createdAt);
      var entryLabel = collection.entryCount + ' Einträge';
      var budgetLabel = Number.isFinite(collection.budget) ? Costnest.currency.formatEuro(collection.budget) : '—';

      card.innerHTML = [
        '<button type="button" class="collection-edit-hint collection-edit-hint--button collection-delete-button" data-action="delete-collection" data-collection-id="' + collection.id + '" aria-label="Sammlung loeschen" title="Sammlung loeschen">' + getDeleteIconMarkup() + '</button>',
        '<a class="collection-overview-card__link" href="collection-detail.html?collectionId=' + encodeURIComponent(collection.id) + '">',
        '  <div class="collection-overview-card__head">',
        '    <h2>' + escapeHtml(collection.name) + '</h2>',
        '    <div class="collection-overview-card__amounts">',
        '      <div class="collection-overview-card__amount">',
        '        <span class="collection-overview-card__price-label">Gesamt Budget</span>',
        '        <span class="collection-overview-card__price-value collection-overview-card__price-value--budget">' + budgetLabel + '</span>',
        '      </div>',
        '      <div class="collection-overview-card__amount">',
        '        <span class="collection-overview-card__price-label">Gesamtkosten (Ist)</span>',
        '        <span class="collection-overview-card__price-value">' + Costnest.currency.formatEuro(collection.totalCurrent) + '</span>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div class="collection-overview-card__meta-row">',
        '    <span>' + escapeHtml(entryLabel) + '</span>',
        '    <span>Erstellt am ' + escapeHtml(createdAt) + '</span>',
        '  </div>',
        '</a>'
      ].join('');

      return card;
    }

    function openDeleteModal(collectionId) {
      pendingDeleteCollectionId = collectionId;
      deleteBackdrop.hidden = false;
      deleteBackdrop.classList.add('is-open');
      deleteBackdrop.setAttribute('aria-hidden', 'false');
      confirmDeleteButton.focus();
    }

    function closeDeleteModal() {
      pendingDeleteCollectionId = null;
      deleteBackdrop.hidden = true;
      deleteBackdrop.classList.remove('is-open');
      deleteBackdrop.setAttribute('aria-hidden', 'true');
    }

    listElement.addEventListener('click', function (event) {
      var openButton = event.target.closest('[data-action="open-collection"]');
      if (openButton) {
        var collection = Costnest.collectionRepository.create('');
        if (Costnest.toast && typeof Costnest.toast.flashNextPage === 'function') {
          Costnest.toast.flashNextPage('Gespeichert');
        }
        global.location.href = 'collection-detail.html?collectionId=' + encodeURIComponent(collection.id);
        return;
      }

      var deleteButton = event.target.closest('[data-action="delete-collection"]');
      if (!deleteButton) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openDeleteModal(String(deleteButton.getAttribute('data-collection-id') || ''));
    });

    closeDeleteButton.addEventListener('click', closeDeleteModal);
    cancelDeleteButton.addEventListener('click', closeDeleteModal);
    deleteBackdrop.addEventListener('click', function (event) {
      if (event.target === deleteBackdrop) {
        closeDeleteModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (deleteBackdrop.classList.contains('is-open') && event.key === 'Escape') {
        closeDeleteModal();
      }
    });

    deleteForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!pendingDeleteCollectionId) {
        closeDeleteModal();
        return;
      }

      Costnest.collectionRepository.remove(pendingDeleteCollectionId);
      closeDeleteModal();
      render();
      if (Costnest.toast && typeof Costnest.toast.show === 'function') {
        Costnest.toast.show('Geloescht');
      }
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatCollectionDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString('de-DE');
  }

  function getDeleteIconMarkup() {
    return [
      '<svg class="icon-stroke" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '  <path d="M3 6h18"/>',
      '  <path d="M8 6V4h8v2"/>',
      '  <path d="M19 6l-1 14H6L5 6"/>',
      '  <path d="M10 11v6"/>',
      '  <path d="M14 11v6"/>',
      '</svg>'
    ].join('');
  }

  Costnest.pages = Costnest.pages || {};
  Costnest.pages.collectionsOverview = {
    init: initCollectionsOverviewPage
  };
})(window);
