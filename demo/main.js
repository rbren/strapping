require('./html/index.html');

window.start = function() {
  strapping.initialize({
    workerPath: 'dist/sass.worker.js',
    parent: document.getElementById('StrappingContainer'),
  });
}

