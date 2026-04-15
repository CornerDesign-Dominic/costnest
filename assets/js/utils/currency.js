(function registerCurrency(global) {
  var Costnest = global.Costnest;

  var euroFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function formatEuro(value) {
    return euroFormatter.format(value);
  }

  Costnest.currency = {
    formatEuro: formatEuro
  };
})(window);

