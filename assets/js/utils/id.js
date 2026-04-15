(function registerIdUtils(global) {
  var Costnest = global.Costnest;

  function generateId(prefix) {
    var randomPart = Math.random().toString(36).slice(2, 8);
    return prefix + '-' + Date.now() + '-' + randomPart;
  }

  Costnest.ids = {
    generateId: generateId
  };
})(window);

