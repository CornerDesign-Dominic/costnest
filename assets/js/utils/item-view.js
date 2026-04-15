(function registerItemViewUtils(global) {
  var Costnest = global.Costnest;

  function applyView(entries, viewState) {
    var filtered = entries.filter(function (entry) {
      return matchesFilters(entry, viewState);
    });

    return filtered.sort(function (a, b) {
      return compareBySort(a, b, viewState.sortBy);
    });
  }

  function matchesFilters(entry, viewState) {
    if (viewState.statusFilter === 'planned' && entry.status !== 'planned') {
      return false;
    }

    if (viewState.statusFilter === 'bought' && entry.status !== 'bought') {
      return false;
    }

    if (viewState.statusFilter !== 'bought' && viewState.hideBought && entry.status === 'bought') {
      return false;
    }

    if (!matchesSearch(entry, viewState.searchTerm)) {
      return false;
    }

    return true;
  }

  function matchesSearch(entry, searchTerm) {
    var query = typeof searchTerm === 'string' ? searchTerm.trim().toLowerCase() : '';
    if (!query) {
      return true;
    }

    var title = typeof entry.title === 'string' ? entry.title.trim().toLowerCase() : '';
    var domain = extractDomain(entry.shopLink);
    var note = typeof entry.note === 'string' ? entry.note.trim().toLowerCase() : '';

    return title.indexOf(query) !== -1 || domain.indexOf(query) !== -1 || note.indexOf(query) !== -1;
  }

  function extractDomain(link) {
    if (typeof link !== 'string' || !link.trim()) {
      return '';
    }

    try {
      return new URL(link).hostname.replace(/^www\./i, '').toLowerCase();
    } catch (error) {
      return link.trim().toLowerCase();
    }
  }

  function compareBySort(a, b, sortBy) {
    if (sortBy === 'oldest') {
      return compareDate(a.createdAt, b.createdAt);
    }

    if (sortBy === 'current-desc') {
      return getCurrentTotal(b) - getCurrentTotal(a);
    }

    if (sortBy === 'current-asc') {
      return getCurrentTotal(a) - getCurrentTotal(b);
    }

    if (sortBy === 'diff-desc') {
      return getDifferenceTotal(b) - getDifferenceTotal(a);
    }

    if (sortBy === 'diff-asc') {
      return getDifferenceTotal(a) - getDifferenceTotal(b);
    }

    return compareDate(b.createdAt, a.createdAt);
  }

  function compareDate(a, b) {
    return new Date(a).getTime() - new Date(b).getTime();
  }

  function getQuantity(entry) {
    if (!entry || !Number.isFinite(entry.quantity)) {
      return 1;
    }

    var normalized = Math.floor(entry.quantity);
    return normalized >= 1 ? normalized : 1;
  }

  function getCurrentTotal(entry) {
    return getSafePrice(entry.currentPrice) * getQuantity(entry);
  }

  function getDifferenceTotal(entry) {
    return (getSafePrice(entry.targetPrice) - getSafePrice(entry.currentPrice)) * getQuantity(entry);
  }

  function getSafePrice(value) {
    return Number.isFinite(value) ? value : 0;
  }

  Costnest.itemView = {
    applyView: applyView
  };
})(window);

