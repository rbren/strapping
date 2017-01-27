const Sass = require('sass.js/dist/sass.js');
const FILES = require('./bootstrap.js');

let Strapping = window.Strapping = function() {
  this.sass = new Sass('dist/sass.worker.js');
  Object.keys(FILES).forEach(filename => {
    this.sass.writeFile(filename, FILES[filename]);
  })
}

Strapping.prototype.initialize = function() {
  let editor = document.createElement('div');
  editor.setAttribute('id', 'StrappingEditor');
  editor.setAttribute('style', 'position: fixed; top: 0; bottom: 0; left: 0; width: 300px; border-right: 1px solid #ccc');
  let bgColor = document.createElement('input');
  bgColor.setAttribute('name', 'bgcolor');
  editor.appendChild(bgColor);
  document.body.appendChild(editor);
}

Strapping.prototype.compile = function() {
  this.sass.compile(`
@import "_bootstrap";
  `, function(result) {
      console.log('result', result);
      var style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = result.text;
      document.body.appendChild(style);
  })
}
