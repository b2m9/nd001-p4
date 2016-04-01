function insertLink() {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = '//fonts.googleapis.com/css?family=Open+Sans:400,700';
  var h = document.getElementsByTagName('head')[0];
  h.parentNode.insertBefore(l, h);
};


function logCRP() {
  var t = window.performance.timing,
    dcl = t.domContentLoadedEventStart - t.domLoading,
    complete = t.domComplete - t.domLoading;
  var stats = document.getElementById("crp-stats");
  stats.textContent = 'DCL: ' + dcl + 'ms, onload: ' + complete + 'ms';
}

window.addEventListener("load", function(event) {
  logCRP();
  insertLink();

  (function(w, g) {
    w['GoogleAnalyticsObject'] = g;
    w[g] = w[g] || function() {
      (w[g].q = w[g].q || []).push(arguments)
    };
    w[g].l = 1 * new Date();
  })(window, 'ga');
});
