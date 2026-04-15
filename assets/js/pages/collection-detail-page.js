(function registerCollectionDetailPage(global) {
  var Costnest = global.Costnest;
  var VIEW_STORAGE_KEY_PREFIX = 'costnest.collectionDetailView.v1.';
  var LEGACY_VIEW_STORAGE_KEY_PREFIXES = ['costrack.collectionDetailView.v1.', 'costrack.projectDetailView.v1.', 'costnest.projectDetailView.v1.'];

  function initCollectionDetailPage() {
    if (document.body.getAttribute('data-page') !== 'collection-detail') {
      return;
    }

    var pageTitle = document.getElementById('collection-title');
    var editCollectionTitleButton = document.getElementById('edit-collection-title');
    var pageMeta = document.getElementById('collection-meta');
    var listElement = document.getElementById('collection-item-list');
    var summaryElement = document.getElementById('collection-summary-card');
    var emptyState = document.getElementById('collection-empty-state');
    var filterEmptyState = document.getElementById('collection-filter-empty-state');
    var notFoundState = document.getElementById('collection-not-found');
    var openEntryButton = document.getElementById('open-entry-modal');
    var exportCsvButton = document.getElementById('export-csv-button');
    var modalTitle = document.getElementById('entry-modal-title');
    var submitButton = document.getElementById('entry-submit-button');
    var filterCard = document.getElementById('item-filter-card');
    var searchFilterInput = document.getElementById('search-filter');
    var hideBoughtToggle = document.getElementById('hide-bought-toggle');
    var sortFilterSelect = document.getElementById('sort-filter');
    var deleteItemBackdrop = document.getElementById('delete-item-modal-backdrop');
    var closeDeleteItemButton = document.getElementById('close-delete-item-modal');
    var cancelDeleteItemButton = document.getElementById('cancel-delete-item-modal');
    var deleteItemForm = document.getElementById('delete-item-form');
    var confirmDeleteItemButton = document.getElementById('confirm-delete-item');

    if (!pageTitle || !editCollectionTitleButton || !pageMeta || !listElement || !summaryElement || !emptyState || !filterEmptyState || !notFoundState || !openEntryButton || !exportCsvButton || !modalTitle || !submitButton || !filterCard || !searchFilterInput || !hideBoughtToggle || !sortFilterSelect || !deleteItemBackdrop || !closeDeleteItemButton || !cancelDeleteItemButton || !deleteItemForm || !confirmDeleteItemButton) {
      return;
    }

    var params = new URLSearchParams(global.location.search);
    var collectionId = params.get('collectionId');
    var collection = Costnest.collectionRepository.getById(collectionId);

    if (!collection) {
      notFoundState.hidden = false;
      emptyState.hidden = true;
      filterEmptyState.hidden = true;
      summaryElement.hidden = true;
      openEntryButton.hidden = true;
      exportCsvButton.hidden = true;
      filterCard.hidden = true;
      pageTitle.textContent = 'Sammlung';
      pageMeta.textContent = '';
      return;
    }

    var modalController = Costnest.modal.createEntryModalController();
    if (!modalController) {
      return;
    }

    var editingItemId = null;
    var pendingDeleteItemId = null;
    var expandedItems = {};
    var expandedAlternatives = {};
    var copyResetTimers = {};
    var viewState = loadViewState(collection.id);
    pageTitle.textContent = collection.name;

    function showToast(message, tone) {
      if (Costnest.toast && typeof Costnest.toast.show === 'function') {
        Costnest.toast.show(message, tone ? { tone: tone } : undefined);
      }
    }

    openEntryButton.addEventListener('click', function () {
      setEntryModalMode('create');
    });

    emptyState.addEventListener('click', function () {
      setEntryModalMode('create');
      modalController.open();
    });

    exportCsvButton.addEventListener('click', function () {
      exportCurrentCollectionCsv();
    });

    editCollectionTitleButton.addEventListener('click', function () {
      var input = global.prompt('Titel bearbeiten', collection.name || '');
      if (input === null) {
        return;
      }

      var nextName = String(input || '').trim();
      if (!nextName) {
        showToast('Titel fehlt', 'neutral');
        return;
      }

      var updated = Costnest.collectionRepository.updateName(collection.id, nextName);
      if (!updated) {
        showToast('Fehler', 'neutral');
        return;
      }

      collection.name = updated.name;
      pageTitle.textContent = updated.name;
      showToast('Gespeichert');
    });

    hideBoughtToggle.addEventListener('change', function () {
      viewState.hideBought = Boolean(hideBoughtToggle.checked);
      normalizeViewState();
      syncFilterControls();
      saveViewState(collection.id, viewState);
      render();
    });

    sortFilterSelect.addEventListener('change', function () {
      viewState.sortBy = String(sortFilterSelect.value || 'newest');
      normalizeViewState();
      syncFilterControls();
      saveViewState(collection.id, viewState);
      render();
    });

    searchFilterInput.addEventListener('input', function () {
      viewState.searchTerm = String(searchFilterInput.value || '');
      normalizeViewState();
      syncFilterControls();
      saveViewState(collection.id, viewState);
      render();
    });

    summaryElement.addEventListener('click', function (event) {
      var actionElement = event.target.closest('[data-action]');
      if (!actionElement) {
        return;
      }

      if (actionElement.getAttribute('data-action') === 'edit-budget') {
        event.preventDefault();
        openBudgetEditor();
      }
    });

    summaryElement.addEventListener('keydown', function (event) {
      var actionElement = event.target.closest('[data-action="edit-budget"]');
      if (!actionElement) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openBudgetEditor();
      }
    });

    modalController.form.addEventListener('submit', function (event) {
      event.preventDefault();
      modalController.clearErrors();

      var formData = new FormData(modalController.form);
      var payload = {
        shopLink: String(formData.get('shopLink') || ''),
        title: String(formData.get('itemTitle') || ''),
        currentPrice: Costnest.validation.parseOptionalPrice(String(formData.get('currentPrice') || '')),
        targetPrice: Costnest.validation.parseOptionalPrice(String(formData.get('targetPrice') || '')),
        quantity: Costnest.validation.parseQuantity(String(formData.get('itemQuantity') || '')),
        note: String(formData.get('itemNote') || ''),
        status: editingItemId ? getExistingStatus(editingItemId) : 'planned'
      };

      var validationResult = Costnest.validation.validateEntryInput(payload);
      if (!validationResult.isValid) {
        modalController.setFieldError('shop-link-error', validationResult.errors.shopLink);
        modalController.setFieldError('current-price-error', '');
        modalController.setFieldError('target-price-error', '');
        modalController.setFieldError('quantity-error', validationResult.errors.quantity);
        return;
      }

      if (editingItemId) {
        Costnest.itemRepository.update(editingItemId, payload);
        showToast('Gespeichert');
      } else {
        Costnest.itemRepository.add(collection.id, payload);
        showToast('Gespeichert');
      }

      modalController.close();
      setEntryModalMode('create');
      render();
    });

    listElement.addEventListener('click', function (event) {
      var actionElement = event.target.closest('[data-action]');
      if (!actionElement) {
        return;
      }

      var action = actionElement.getAttribute('data-action');
      var itemId = actionElement.getAttribute('data-item-id');
      if (!itemId) {
        return;
      }

      if (action === 'edit') {
        openEditItemModal(itemId);
        return;
      }

      if (action === 'copy-link') {
        copyItemLink(itemId, actionElement);
        return;
      }

      if (action === 'delete') {
        openDeleteItemModal(itemId);
        return;
      }

      if (action === 'toggle-status') {
        Costnest.itemRepository.toggleStatus(itemId);
        showToast('Aktualisiert');
        render();
        return;
      }

      if (action === 'remove-alternative') {
        var alternativeIndex = Number(actionElement.getAttribute('data-alternative-index'));
        Costnest.itemRepository.removeAlternative(itemId, alternativeIndex);
        showToast('Gelöscht');
        render();
        return;
      }

      if (action === 'copy-alternative-link') {
        var alternativeLink = String(actionElement.getAttribute('data-alternative-link') || '');
        var alternativeIndex = String(actionElement.getAttribute('data-alternative-index') || '');
        if (!alternativeLink) {
          return;
        }

        copyToClipboard(alternativeLink).then(function () {
          var copyStateKey = itemId + '-alt-' + alternativeIndex;
          showCopySuccessState(copyStateKey, actionElement);
        }).catch(function () {
          showToast('Fehler', 'neutral');
        });
        return;
      }

      if (action === 'toggle-alternatives') {
        if (!Boolean(expandedItems[itemId])) {
          toggleItemExpansion(itemId);
          render();
          return;
        }

        toggleAlternatives(itemId);
        render();
        return;
      }

      if (action === 'toggle-card') {
        toggleItemExpansion(itemId);
        render();
      }

    });

    listElement.addEventListener('submit', function (event) {
      var form = event.target.closest('.alternative-form');
      if (!form) {
        return;
      }

      event.preventDefault();

      var itemId = String(form.getAttribute('data-item-id') || '');
      if (!itemId) {
        return;
      }

      var input = form.elements.alternativeLink;
      var priceInput = form.elements.alternativePrice;
      var error = form.querySelector('.alternative-error');
      var rawValue = input ? String(input.value || '').trim() : '';
      var rawPriceValue = priceInput ? String(priceInput.value || '').trim() : '';

      if (error) {
        error.textContent = '';
      }

      if (!rawValue) {
        if (error) {
          error.textContent = 'Link fehlt.';
        }
        return;
      }

      if (!isLikelyUrl(rawValue)) {
        if (error) {
          error.textContent = 'Ungültiger Link.';
        }
        return;
      }

      if (!rawPriceValue) {
        if (error) {
          error.textContent = 'Preis fehlt.';
        }
        return;
      }

      var parsedPrice = Costnest.validation.parseOptionalPrice(rawPriceValue);
      if (!Number.isFinite(parsedPrice)) {
        if (error) {
          error.textContent = 'Ungültiger Preis.';
        }
        return;
      }

      var updated = Costnest.itemRepository.addAlternative(itemId, rawValue, parsedPrice);
      if (!updated) {
        if (error) {
          error.textContent = 'Max. 99.';
        }
        return;
      }

      expandedAlternatives[itemId] = true;
      showToast('Gespeichert');
      render();
    });

    closeDeleteItemButton.addEventListener('click', closeDeleteItemModal);
    cancelDeleteItemButton.addEventListener('click', closeDeleteItemModal);
    deleteItemBackdrop.addEventListener('click', function (event) {
      if (event.target === deleteItemBackdrop) {
        closeDeleteItemModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (deleteItemBackdrop.classList.contains('is-open') && event.key === 'Escape') {
        closeDeleteItemModal();
      }
    });

    deleteItemForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!pendingDeleteItemId) {
        closeDeleteItemModal();
        return;
      }

      Costnest.itemRepository.remove(pendingDeleteItemId);
      closeDeleteItemModal();
      showToast('Gelöscht');
      render();
    });

    function normalizeViewState() {
      var validSort = ['newest', 'oldest', 'current-desc', 'current-asc', 'diff-desc', 'diff-asc'];

      viewState.statusFilter = 'all';

      if (validSort.indexOf(viewState.sortBy) === -1) {
        viewState.sortBy = 'newest';
      }

      if (typeof viewState.searchTerm !== 'string') {
        viewState.searchTerm = '';
      }

      viewState.searchTerm = viewState.searchTerm.trim();
      viewState.hideBought = Boolean(viewState.hideBought);

    }

    function syncFilterControls() {
      searchFilterInput.value = viewState.searchTerm;
      sortFilterSelect.value = viewState.sortBy;
      hideBoughtToggle.checked = viewState.hideBought;
      hideBoughtToggle.disabled = false;
    }

    function getExistingStatus(itemId) {
      var currentItems = Costnest.itemRepository.getByCollectionId(collection.id);
      var currentItem = currentItems.find(function (item) {
        return item.id === itemId;
      });

      return currentItem ? currentItem.status : 'planned';
    }

    function openEditItemModal(itemId) {
      var entries = Costnest.itemRepository.getByCollectionId(collection.id);
      var item = entries.find(function (entry) {
        return entry.id === itemId;
      });

      if (!item) {
        return;
      }

      editingItemId = item.id;
      modalController.form.elements.shopLink.value = item.shopLink;
      modalController.form.elements.itemTitle.value = item.title || '';
      modalController.form.elements.currentPrice.value = formatEditablePrice(item.currentPrice);
      modalController.form.elements.targetPrice.value = formatEditablePrice(item.targetPrice);
      modalController.form.elements.itemQuantity.value = String(getEntryQuantity(item));
      modalController.form.elements.itemNote.value = item.note || '';
      setEntryModalMode('edit');
      modalController.open();
    }

    function setEntryModalMode(mode) {
      if (mode === 'edit') {
        modalTitle.textContent = 'Bearbeiten';
        submitButton.textContent = 'Speichern';
        return;
      }

      editingItemId = null;
      modalTitle.textContent = 'Neuer Eintrag';
      submitButton.textContent = 'Speichern';
      modalController.form.reset();
      modalController.clearErrors();
    }

    function openDeleteItemModal(itemId) {
      pendingDeleteItemId = itemId;
      deleteItemBackdrop.hidden = false;
      deleteItemBackdrop.classList.add('is-open');
      deleteItemBackdrop.setAttribute('aria-hidden', 'false');
      confirmDeleteItemButton.focus();
    }

    function closeDeleteItemModal() {
      pendingDeleteItemId = null;
      deleteItemBackdrop.hidden = true;
      deleteItemBackdrop.classList.remove('is-open');
      deleteItemBackdrop.setAttribute('aria-hidden', 'true');
    }

    function formatEditablePrice(value) {
      if (!Number.isFinite(value)) {
        return '';
      }

      return String(Number(value).toFixed(2)).replace('.', ',');
    }

    function render() {
      normalizeViewState();
      syncFilterControls();

      var entries = Costnest.itemRepository.getByCollectionId(collection.id);
      var visibleEntries = Costnest.itemView.applyView(entries, viewState);

      listElement.innerHTML = '';
      emptyState.hidden = entries.length !== 0;
      filterEmptyState.hidden = !(entries.length > 0 && visibleEntries.length === 0);

      visibleEntries.forEach(function (entry) {
        listElement.appendChild(createEntryCard(entry));
      });

      renderSummary(entries);
      pageMeta.textContent = entries.length + ' Einträge';
      saveViewState(collection.id, viewState);
    }

    function createEntryCard(entry) {
      var card = document.createElement('article');
      var isCardExpanded = Boolean(expandedItems[entry.id]);
      card.className = 'card collection-item' + (entry.status === 'bought' ? ' collection-item--bought' : '') + (isCardExpanded ? ' collection-item--expanded' : '');
      card.setAttribute('data-item-id', entry.id);
      var currentTotal = getCurrentTotalForEntry(entry);
      var targetTotal = getTargetTotalForEntry(entry);
      var difference = getDifferenceTotalForEntry(entry);
      var diffClass = difference > 0 ? 'is-positive' : (difference < 0 ? 'is-negative' : '');
      var isBought = entry.status === 'bought';
      var domainLabel = getHostLabel(entry.shopLink);
      var displayTitle = getDisplayTitle(entry);
      var quantityValue = getEntryQuantity(entry);
      var alternatives = Array.isArray(entry.alternatives) ? entry.alternatives : [];
      var alternativesCount = alternatives.length;
      var isExpanded = expandedAlternatives[entry.id] !== false;
      var hasAlternatives = alternativesCount > 0;
      var alternativesSectionIsOpen = isExpanded;
      var canAddAlternative = alternativesCount < 99;
      var hasCurrentPrice = Number.isFinite(entry.currentPrice);
      var hasTargetPrice = Number.isFinite(entry.targetPrice);
      var hasComparableValues = hasCurrentPrice && hasTargetPrice;
      var unitCurrentValueLabel = hasCurrentPrice ? Costnest.currency.formatEuro(entry.currentPrice) : '—';
      var unitTargetValueLabel = hasTargetPrice ? Costnest.currency.formatEuro(entry.targetPrice) : '—';
      var currentValueLabel = hasCurrentPrice ? Costnest.currency.formatEuro(currentTotal) : '—';
      var targetValueLabel = hasTargetPrice ? Costnest.currency.formatEuro(targetTotal) : '—';
      var unitDifference = hasCurrentPrice && hasTargetPrice ? (entry.targetPrice - entry.currentPrice) : null;
      var unitDiffValueLabel = Number.isFinite(unitDifference) ? Costnest.currency.formatEuro(unitDifference) : '—';
      var totalDiffValueLabel = hasCurrentPrice && hasTargetPrice ? Costnest.currency.formatEuro(difference) : '—';
      var diffValueClass = hasComparableValues ? ('collection-item__price-difference-value ' + diffClass) : 'collection-item__price-difference-value';
      var unitDiffClass = hasComparableValues ? ('collection-item__detail-value collection-item__detail-value--diff ' + diffClass) : 'collection-item__detail-value collection-item__detail-value--diff';
      var totalDiffClass = hasComparableValues ? ('collection-item__detail-value collection-item__detail-value--diff ' + diffClass) : 'collection-item__detail-value collection-item__detail-value--diff';
      var totalDiffPercentLabel = formatDifferencePercent(difference, currentTotal);
      var totalDiffPercentClass = hasComparableValues ? ('collection-item__detail-percent ' + diffClass) : 'collection-item__detail-percent';
      var alternativesPreview = alternativesCount > 0
        ? '+' + alternativesCount + ' Alternativen'
        : 'Keine Alternativen';
      var collapsedAlternativesMarkup = '<button type="button" class="collection-item__alternatives-preview" data-action="toggle-alternatives" data-item-id="' + entry.id + '" aria-expanded="' + (isExpanded ? 'true' : 'false') + '">' + alternativesPreview + '</button>';
      var cardStateLabel = isCardExpanded ? 'Einklappen' : 'Aufklappen';

      card.innerHTML = [
        '<div class="collection-item__summary" aria-label="Eintrag ' + cardStateLabel + '">',
        '  <div class="collection-item__top">',
        '    <div class="collection-item__actions collection-item__actions--top">',
        '      <button type="button" class="icon-button collection-item__action-button" data-action="edit" data-item-id="' + entry.id + '" aria-label="Bearbeiten" title="Bearbeiten">',
        '        ' + getEditIconMarkup(),
        '      </button>',
        '      <button type="button" class="icon-button icon-button-danger collection-item__action-button collection-item__action-button--danger" data-action="delete" data-item-id="' + entry.id + '" aria-label="Löschen" title="Löschen">',
        '        ' + getDeleteIconMarkup(),
        '      </button>',
        '    </div>',
        '    <a class="collection-item__title-link" href="' + escapeHtml(entry.shopLink) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(displayTitle) + '</a>',
        '    <div class="collection-item__domain-row">',
        '      <button type="button" class="icon-button icon-button-subtle link-copy-button collection-item__copy-inline" data-action="copy-link" data-item-id="' + entry.id + '" aria-label="Link kopieren" title="Link kopieren">' + getCopyIconMarkup() + '</button>',
        '      <a class="collection-item__domain-link" href="' + escapeHtml(entry.shopLink) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(domainLabel) + '</a>',
        '    </div>',
        '  </div>',
        '  <div class="collection-item__middle">',
        '    <div class="collection-item__price-primary">',
        '      <span class="collection-item__price-label">Preis</span>',
        '      <span class="collection-item__price-value">' + currentValueLabel + '</span>',
        '    </div>',
        '    <div class="collection-item__price-secondary">',
        '      <div class="collection-item__price-meta">',
        '        <span class="collection-item__price-meta-label">Wunsch</span>',
        '        <span class="collection-item__price-meta-value">' + targetValueLabel + '</span>',
        '      </div>',
        '      <div class="collection-item__price-meta">',
        '        <span class="collection-item__price-meta-label">Diff.</span>',
        '        <span class="' + diffValueClass + '">' + totalDiffValueLabel + '</span>',
        '      </div>',
        '      <div class="collection-item__price-meta collection-item__price-meta--quantity">',
        '        <span class="collection-item__price-meta-label">Anzahl</span>',
        '        <span class="collection-item__price-meta-value">x' + quantityValue + '</span>',
        '      </div>',
        '    </div>',
        '    <label class="collection-item__bought-toggle" data-action="toggle-status" data-item-id="' + entry.id + '">',
        '      <input type="checkbox" class="collection-item__bought-checkbox" ' + (isBought ? 'checked ' : '') + '>',
        '      <span class="collection-item__bought-label">Gekauft</span>',
        '    </label>',
        '    <button type="button" class="collection-item__collapse-chevron" data-action="toggle-card" data-item-id="' + entry.id + '" aria-expanded="' + (isCardExpanded ? 'true' : 'false') + '" aria-label="Details umschalten">' + getCollapseChevronIconMarkup(isCardExpanded) + '</button>',
        '  </div>',
        '  <div class="collection-item__bottom">',
        '    ' + collapsedAlternativesMarkup,
        '  </div>',
        '</div>',
        '<div class="collection-item__details' + (isCardExpanded ? ' is-open' : '') + '"' + (isCardExpanded ? '' : ' hidden') + '>',
        '<div class="collection-item__detail-grid" aria-label="Preisberechnung">',
        '  <section class="collection-item__detail-col">',
        '    <div class="collection-item__detail-col-title">Shop</div>',
        '    <div class="collection-item__detail-row">',
        '      <span class="collection-item__detail-label">Einzelpreis</span>',
        '      <span class="collection-item__detail-value">' + unitCurrentValueLabel + '</span>',
        '    </div>',
        '    <div class="collection-item__detail-row">',
        '      <span class="collection-item__detail-label">Gesamt</span>',
        '      <span class="collection-item__detail-value">' + currentValueLabel + '</span>',
        '    </div>',
        '  </section>',
        '  <section class="collection-item__detail-col">',
        '    <div class="collection-item__detail-col-title">Wunsch</div>',
        '    <div class="collection-item__detail-row">',
        '      <span class="collection-item__detail-label">Einzelpreis</span>',
        '      <span class="collection-item__detail-value">' + unitTargetValueLabel + '</span>',
        '    </div>',
        '    <div class="collection-item__detail-row">',
        '      <span class="collection-item__detail-label">Gesamt</span>',
        '      <span class="collection-item__detail-value">' + targetValueLabel + '</span>',
        '    </div>',
        '  </section>',
        '  <section class="collection-item__detail-col">',
        '    <div class="collection-item__detail-col-head">',
        '      <div class="collection-item__detail-col-title">Differenz</div>',
        '      <div class="' + totalDiffPercentClass + '">' + totalDiffPercentLabel + '</div>',
        '    </div>',
        '    <div class="collection-item__detail-row">',
        '      <span class="collection-item__detail-label">Einzelpreis</span>',
        '      <span class="' + unitDiffClass + '">' + unitDiffValueLabel + '</span>',
        '    </div>',
        '    <div class="collection-item__detail-row">',
        '      <span class="collection-item__detail-label">Gesamt</span>',
        '      <span class="' + totalDiffClass + '">' + totalDiffValueLabel + '</span>',
        '    </div>',
        '  </section>',
        '</div>',
        '<div class="collection-item__detail-row collection-item__detail-row--note">',
        '  <span class="collection-item__detail-col-title">Notiz</span>',
        '  <span class="collection-item__note">' + (entry.note ? escapeHtml(entry.note) : '—') + '</span>',
        '</div>',
        '<section class="collection-item__alternatives-block" aria-label="Alternativen">',
        '  <div class="collection-item__alternatives-head">',
        '    <span class="collection-item__detail-col-title">Alternativen (' + alternativesCount + ')</span>',
        '    <button type="button" class="collection-item__alternatives-chevron" data-action="toggle-alternatives" data-item-id="' + entry.id + '" aria-expanded="' + (alternativesSectionIsOpen ? 'true' : 'false') + '" aria-label="Alternativen umschalten">',
        getCollapseChevronIconMarkup(alternativesSectionIsOpen),
        '    </button>',
        '  </div>',
        '  <section class="collection-item__alternatives' + (alternativesSectionIsOpen ? ' is-open' : '') + '"' + (alternativesSectionIsOpen ? '' : ' hidden') + ' aria-label="Alternativen Liste">',
        renderAlternativesList(entry.id, alternatives),
        '    <form class="alternative-form" data-item-id="' + entry.id + '">',
        '      <input type="url" name="alternativeLink" placeholder="https://..." ' + (canAddAlternative ? '' : 'disabled') + '>',
        '      <input type="text" name="alternativePrice" inputmode="decimal" placeholder="Preis" ' + (canAddAlternative ? '' : 'disabled') + '>',
        '      <button type="submit" class="icon-button" ' + (canAddAlternative ? '' : 'disabled') + '>+</button>',
        '      <p class="alternative-error" aria-live="polite"></p>',
        '    </form>',
        '  </section>',
        '</section>',
        '</div>',
      ].join('');

      return card;
    }

    function renderAlternativesList(itemId, alternatives) {
      if (!alternatives.length) {
        return '<p class="collection-item__alternatives-empty">Keine Alternativen.</p>';
      }

      return [
        '<ul class="collection-item__alternatives-list">',
        alternatives.map(function (alternative, index) {
          var altLink = getAlternativeLink(alternative);
          var altPrice = getAlternativePrice(alternative);
          var altPriceLabel = Number.isFinite(altPrice) ? Costnest.currency.formatEuro(altPrice) : '—';
          return [
            '<li>',
            '  <button type="button" class="icon-button icon-button-subtle link-copy-button" data-action="copy-alternative-link" data-item-id="' + itemId + '" data-alternative-index="' + index + '" data-alternative-link="' + escapeHtml(altLink) + '" aria-label="Alternative kopieren" title="Alternative kopieren">' + getCopyIconMarkup() + '</button>',
            '  <a href="' + escapeHtml(altLink) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(getHostLabel(altLink)) + '</a>',
            '  <span class="collection-item__alternative-price">' + altPriceLabel + '</span>',
            '  <button type="button" class="icon-button icon-button-danger" data-action="remove-alternative" data-item-id="' + itemId + '" data-alternative-index="' + index + '" aria-label="Alternative löschen" title="Alternative löschen">' + getDeleteIconMarkup() + '</button>',
            '</li>'
          ].join('');
        }).join(''),
        '</ul>'
      ].join('');
    }

    function renderSummary(entries) {
      var totals = entries.reduce(function (acc, entry) {
        acc.current += getCurrentTotalForEntry(entry);
        acc.target += getTargetTotalForEntry(entry);
        return acc;
      }, { current: 0, target: 0 });

      var budgetValue = Number.isFinite(collection.budget) ? collection.budget : null;
      var budgetLabel = Number.isFinite(budgetValue) ? Costnest.currency.formatEuro(budgetValue) : '—';
      var diffIstVsWunsch = totals.current - totals.target;
      var diffBudgetVsIst = Number.isFinite(budgetValue) ? (budgetValue - totals.current) : null;
      var diffIstVsWunschClass = diffIstVsWunsch > 0 ? 'is-negative' : (diffIstVsWunsch < 0 ? 'is-positive' : '');
      var diffBudgetVsIstClass = Number.isFinite(diffBudgetVsIst)
        ? (diffBudgetVsIst > 0 ? 'is-positive' : (diffBudgetVsIst < 0 ? 'is-negative' : ''))
        : '';

      summaryElement.hidden = false;
      summaryElement.innerHTML = [
        '<div class="budget-kpi-grid" aria-label="Budget KPI Übersicht">',
        '  <section class="budget-kpi">',
        '    <span class="budget-kpi__label">Shop</span>',
        '    <span class="budget-kpi__value">' + Costnest.currency.formatEuro(totals.current) + '</span>',
        '    <div class="budget-kpi__subdiff budget-kpi__subdiff--placeholder" aria-hidden="true">',
        '      <span class="budget-kpi__subdiff-label"> </span>',
        '      <span class="budget-kpi__subdiff-value"> </span>',
        '    </div>',
        '  </section>',
        '  <section class="budget-kpi">',
        '    <span class="budget-kpi__label">Wunsch</span>',
        '    <span class="budget-kpi__value">' + Costnest.currency.formatEuro(totals.target) + '</span>',
        '    <div class="budget-kpi__subdiff">',
        '      <span class="budget-kpi__subdiff-label">Shop vs Wunsch</span>',
        '      <span class="budget-kpi__subdiff-value ' + diffIstVsWunschClass + '">' + Costnest.currency.formatEuro(diffIstVsWunsch) + '</span>',
        '    </div>',
        '  </section>',
        '  <section class="budget-kpi budget-kpi--budget">',
        '    <span class="budget-kpi__label">Budget</span>',
        '    <button type="button" class="budget-kpi__edit-hit" data-action="edit-budget" aria-label="Budget bearbeiten" title="Budget bearbeiten">',
        '      <span class="budget-kpi__value">' + budgetLabel + '</span>',
        '      <span class="budget-kpi__edit-icon" aria-hidden="true">' + getEditIconMarkup() + '</span>',
        '    </button>',
        '    <div class="budget-kpi__subdiff budget-kpi__subdiff--strong">',
        '      <span class="budget-kpi__subdiff-label">Shop vs Budget</span>',
        '      <span class="budget-kpi__subdiff-value ' + diffBudgetVsIstClass + '">' + (Number.isFinite(diffBudgetVsIst) ? Costnest.currency.formatEuro(diffBudgetVsIst) : '—') + '</span>',
        '    </div>',
        '  </section>',
        '</div>'
      ].join('');
    }

    function openBudgetEditor() {
      var currentBudget = Number.isFinite(collection.budget) ? collection.budget : null;
      var defaultValue = Number.isFinite(currentBudget) ? String(currentBudget.toFixed(2)).replace('.', ',') : '';
      var input = global.prompt('Budget eingeben (leer zum Entfernen)', defaultValue);

      if (input === null) {
        return;
      }

      var parsedBudget = Costnest.validation.parseOptionalPrice(String(input));
      if (String(input).trim() && !Number.isFinite(parsedBudget)) {
        showToast('Ungültiger Betrag', 'neutral');
        return;
      }

      var updatedCollection = Costnest.collectionRepository.updateBudget(collection.id, parsedBudget);
      if (!updatedCollection) {
        showToast('Fehler', 'neutral');
        return;
      }

      collection.budget = updatedCollection.budget;
      showToast('Gespeichert');
      render();
    }

    function getEntryQuantity(entry) {
      if (!entry || !Number.isFinite(entry.quantity)) {
        return 1;
      }

      var normalized = Math.floor(entry.quantity);
      return normalized >= 1 ? normalized : 1;
    }

    function getCurrentTotalForEntry(entry) {
      return getSafePrice(entry.currentPrice) * getEntryQuantity(entry);
    }

    function getTargetTotalForEntry(entry) {
      return getSafePrice(entry.targetPrice) * getEntryQuantity(entry);
    }

    function getDifferenceTotalForEntry(entry) {
      return getTargetTotalForEntry(entry) - getCurrentTotalForEntry(entry);
    }

    function getSafePrice(value) {
      return Number.isFinite(value) ? value : 0;
    }

    function exportCurrentCollectionCsv() {
      var entries = Costnest.itemRepository.getByCollectionId(collection.id);
      var csvContent = buildCsvContent(entries);
      var filename = createCollectionCsvFilename(collection.name);
      downloadCsvFile(filename, csvContent);
      showToast('Exportiert');
    }

    function buildCsvContent(entries) {
      var header = [
        'Nr.',
        'Titel',
        'Domain',
        'Link',
        'Anzahl',
        'Einzelpreis Shop',
        'Einzelpreis Wunsch',
        'Einzelpreis Differenz',
        'Gesamtpreis Shop',
        'Gesamtpreis Wunsch',
        'Gesamtpreis Differenz',
        'Notiz'
      ];

      var rows = entries.map(function (entry, index) {
        var quantity = getEntryQuantity(entry);
        var hasCurrentPrice = Number.isFinite(entry.currentPrice);
        var hasTargetPrice = Number.isFinite(entry.targetPrice);
        var singleDiff = hasCurrentPrice && hasTargetPrice ? (entry.targetPrice - entry.currentPrice) : null;
        var totalCurrent = hasCurrentPrice ? getCurrentTotalForEntry(entry) : null;
        var totalTarget = hasTargetPrice ? getTargetTotalForEntry(entry) : null;
        var totalDiff = Number.isFinite(singleDiff) ? singleDiff * quantity : null;

        return [
          String(index + 1),
          getDisplayTitle(entry),
          getHostLabel(entry.shopLink),
          entry.shopLink,
          String(quantity),
          formatCsvPrice(entry.currentPrice),
          formatCsvPrice(entry.targetPrice),
          formatCsvPrice(singleDiff),
          formatCsvPrice(totalCurrent),
          formatCsvPrice(totalTarget),
          formatCsvPrice(totalDiff),
          entry.note || ''
        ];
      });

      return [header].concat(rows).map(function (row) {
        return row.map(escapeCsvValue).join(';');
      }).join('\r\n');
    }

    function formatCsvPrice(value) {
      if (!Number.isFinite(value)) {
        return '';
      }

      return Number(value).toFixed(2).replace('.', ',');
    }

    function escapeCsvValue(value) {
      var normalized = value === null || value === undefined ? '' : String(value);
      var escaped = normalized.replaceAll('"', '""');
      return '"' + escaped + '"';
    }

    function createCollectionCsvFilename(collectionName) {
      var baseName = typeof collectionName === 'string' ? collectionName.trim() : 'sammlung';
      if (!baseName) {
        baseName = 'sammlung';
      }

      var safe = baseName
        .toLowerCase()
        .replace(/[\\/:*?"<>|]+/g, '-')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      return (safe || 'sammlung') + '.csv';
    }

    function downloadCsvFile(filename, csvContent) {
      var blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    function toggleAlternatives(itemId) {
      if (!itemId) {
        return;
      }

      var isCurrentlyOpen = expandedAlternatives[itemId] !== false;
      expandedAlternatives[itemId] = !isCurrentlyOpen;
    }

    function toggleItemExpansion(itemId) {
      if (!itemId) {
        return;
      }

      expandedItems[itemId] = !Boolean(expandedItems[itemId]);
    }

    function copyItemLink(itemId, triggerButton) {
      var entries = Costnest.itemRepository.getByCollectionId(collection.id);
      var item = entries.find(function (entry) {
        return entry.id === itemId;
      });

      if (!item || !item.shopLink) {
        return;
      }

      copyToClipboard(item.shopLink).then(function () {
        showCopySuccessState(itemId, triggerButton);
      }).catch(function () {
        showToast('Fehler', 'neutral');
      });
    }

    function copyToClipboard(value) {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        return navigator.clipboard.writeText(value);
      }

      return new Promise(function (resolve, reject) {
        var input = document.createElement('textarea');
        input.value = value;
        input.setAttribute('readonly', 'true');
        input.style.position = 'fixed';
        input.style.top = '-1000px';
        document.body.appendChild(input);
        input.select();

        try {
          var success = document.execCommand('copy');
          document.body.removeChild(input);
          if (success) {
            resolve();
            return;
          }
          reject(new Error('copy-failed'));
        } catch (error) {
          document.body.removeChild(input);
          reject(error);
        }
      });
    }

    function showCopySuccessState(itemId, button) {
      if (!button) {
        return;
      }

      if (copyResetTimers[itemId]) {
        global.clearTimeout(copyResetTimers[itemId]);
      }

      button.innerHTML = getCheckIconMarkup();
      button.setAttribute('aria-label', 'Kopiert');
      button.setAttribute('title', 'Kopiert');
      button.classList.add('is-copied');

      copyResetTimers[itemId] = global.setTimeout(function () {
        button.innerHTML = getCopyIconMarkup();
        button.setAttribute('aria-label', 'Link kopieren');
        button.setAttribute('title', 'Link kopieren');
        button.classList.remove('is-copied');
        copyResetTimers[itemId] = null;
      }, 1100);
    }

    render();
  }

  function getHostLabel(urlString) {
    try {
      return new URL(urlString).hostname.replace(/^www\./i, '').toLowerCase();
    } catch (error) {
      return shortenLabel(urlString, 34);
    }
  }

  function getDisplayTitle(entry) {
    var title = entry && typeof entry.title === 'string' ? entry.title.trim() : '';
    if (title) {
      return title;
    }

    return getHostLabel(entry.shopLink);
  }

  function shortenLabel(value, maxLength) {
    if (typeof value !== 'string') {
      return '';
    }

    if (value.length <= maxLength) {
      return value;
    }

    return value.slice(0, maxLength - 1) + '…';
  }

  function formatDifferencePercent(differenceValue, baseValue) {
    if (!Number.isFinite(differenceValue) || !Number.isFinite(baseValue) || baseValue === 0) {
      return '—';
    }

    var percent = (differenceValue / baseValue) * 100;
    var rounded = Math.round(percent * 10) / 10;
    var sign = rounded > 0 ? '+' : '';
    return sign + rounded.toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }) + ' %';
  }

  function isLikelyUrl(value) {
    try {
      var parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  function getAlternativeLink(alternative) {
    if (typeof alternative === 'string') {
      return alternative;
    }

    if (alternative && typeof alternative === 'object' && typeof alternative.link === 'string') {
      return alternative.link;
    }

    return '';
  }

  function getAlternativePrice(alternative) {
    if (!alternative || typeof alternative !== 'object') {
      return null;
    }

    return Number.isFinite(alternative.price) ? alternative.price : null;
  }

  function getEditIconMarkup() {
    return [
      '<svg class="icon-stroke" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '  <path d="M12 20h9"/>',
      '  <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
      '</svg>'
    ].join('');
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

  function getCopyIconMarkup() {
    return [
      '<svg class="icon-stroke" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '  <rect x="9" y="9" width="11" height="11" rx="2" ry="2"></rect>',
      '  <path d="M5 15V5a1 1 0 0 1 1-1h10"></path>',
      '</svg>'
    ].join('');
  }

  function getCheckIconMarkup() {
    return [
      '<svg class="icon-stroke" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '  <path d="M20 6 9 17l-5-5"></path>',
      '</svg>'
    ].join('');
  }

  function getCollapseChevronIconMarkup(isExpanded) {
    return [
      '<svg class="icon-stroke" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      isExpanded
        ? '  <path d="m6 9 6 6 6-6"></path>'
        : '  <path d="m9 6 6 6-6 6"></path>',
      '</svg>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function loadViewState(collectionId) {
    var defaultState = {
      statusFilter: 'all',
      hideBought: false,
      sortBy: 'newest',
      searchTerm: ''
    };

    var key = VIEW_STORAGE_KEY_PREFIX + collectionId;
    var raw = localStorage.getItem(key);
    if (!raw) {
      raw = readLegacyViewState(collectionId);
    }
    if (!raw) {
      return defaultState;
    }

    try {
      var parsed = JSON.parse(raw);
      return {
        statusFilter: typeof parsed.statusFilter === 'string' ? parsed.statusFilter : defaultState.statusFilter,
        hideBought: Boolean(parsed.hideBought),
        sortBy: typeof parsed.sortBy === 'string' ? parsed.sortBy : defaultState.sortBy,
        searchTerm: typeof parsed.searchTerm === 'string' ? parsed.searchTerm : defaultState.searchTerm
      };
    } catch (error) {
      return defaultState;
    }
  }

  function saveViewState(collectionId, viewState) {
    var key = VIEW_STORAGE_KEY_PREFIX + collectionId;
    localStorage.setItem(key, JSON.stringify({
      statusFilter: viewState.statusFilter,
      hideBought: viewState.hideBought,
      sortBy: viewState.sortBy,
      searchTerm: viewState.searchTerm
    }));
  }

  function readLegacyViewState(collectionId) {
    for (var i = 0; i < LEGACY_VIEW_STORAGE_KEY_PREFIXES.length; i += 1) {
      var raw = localStorage.getItem(LEGACY_VIEW_STORAGE_KEY_PREFIXES[i] + collectionId);
      if (raw) {
        return raw;
      }
    }

    return null;
  }

  Costnest.pages = Costnest.pages || {};
  Costnest.pages.collectionDetail = {
    init: initCollectionDetailPage
  };
})(window);





