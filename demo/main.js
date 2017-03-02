require('./html/index.html');

window.start = function() {
  strapping.initialize({
    workerPath: 'build/sass.worker.js',
    parent: document.getElementById('StrappingContainer'),
  });
}

