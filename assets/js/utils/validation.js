(function registerValidation(global) {
  var Costnest = global.Costnest;

  function parsePrice(rawValue) {
    if (typeof rawValue !== 'string') {
      return NaN;
    }

    var normalized = rawValue.trim().replace(',', '.');
    if (!normalized) {
      return NaN;
    }

    return Number(normalized);
  }

  function parseOptionalPrice(rawValue) {
    if (typeof rawValue !== 'string') {
      return null;
    }

    if (!rawValue.trim()) {
      return null;
    }

    var parsed = parsePrice(rawValue);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function parseQuantity(rawValue) {
    if (typeof rawValue !== 'string') {
      return 1;
    }

    var normalized = rawValue.trim();
    if (!normalized) {
      return 1;
    }

    var parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      return NaN;
    }

    var rounded = Math.floor(parsed);
    return rounded >= 1 ? rounded : NaN;
  }

  function validateEntryInput(data) {
    return {
      isValid: true,
      errors: {
        shopLink: '',
        quantity: ''
      }
    };
  }

  Costnest.validation = {
    parsePrice: parsePrice,
    parseOptionalPrice: parseOptionalPrice,
    parseQuantity: parseQuantity,
    validateEntryInput: validateEntryInput
  };
})(window);


