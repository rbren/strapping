const Sass = require('sass.js/dist/sass.js');
const FILES = require('./bootstrap.js');

let variables = require('./defaults.js');

const addCSS = css => {
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  document.body.appendChild(style);
}

const escapeQuotes = str => {
  return str.replace(/"/g, '&quot;');
}
const unescapeQuotes = str => {
  return str.replace(/&quot;/g, '"');
}

const loadingTemplate = function(opts) {
  return `<h2>Loading</h2>`
}

const strappingTemplate = function(opts) {
  let submit = `
<div class="form-group">
  <input class="btn btn-success" type="submit" value="Set Styles">
</div>`

  let error = '';
  if (opts.error) error = `
<div class="alert alert-warning">${opts.error}</div>`

  let inputs = Object.keys(opts.vars).map(k => `
<div class="form-group">
  <label>${k}</label>
  <input class="input-xs form-control" type="text" value="${escapeQuotes(opts.vars[k])}" name="${k}">
</div>`).join('\n');

  return `
<form onsubmit="strapping.compile(); return false">
  ${submit}
  ${error}
  ${inputs}
</form>`
}

let Strapping = window.Strapping = function() {
  this.sass = new Sass('dist/sass.worker.js');
  Object.keys(FILES).forEach(filename => {
    this.sass.writeFile(filename, FILES[filename]);
  })
}

Strapping.prototype.initialize = function() {
  if (!window.Strapping.initialized) addCSS(require('!raw-loader!./styles.css'));
  window.Strapping.initialized = true;
  this.editor = document.createElement('div');
  this.editor.setAttribute('id', 'StrappingEditor');
  document.body.appendChild(this.editor);
  this.compile();
}

Strapping.prototype.compile = function() {
  try {
    this.compileInner();
  } catch (e) {
    console.log(e);
  }
}

Strapping.prototype.compileInner = function() {
  if (this.compiledOnce) {
    Object.keys(variables).forEach(v => {
      variables[v] = unescapeQuotes(document.getElementsByName(v)[0].value);
    });
  }
  let varFile = `$bootstrap-sass-asset-helper: false !default\n`;
  varFile += Object.keys(variables).map(v => v + ': ' + variables[v] + ';').join('\n');
  this.sass.writeFile('bootstrap/_variables.scss', varFile)
  this.editor.innerHTML = loadingTemplate();
  this.sass.compile('@import "_bootstrap";', (result) => {
    this.editor.innerHTML = strappingTemplate({vars: variables, error: result.status ? result.message : null});
    this.compiledOnce = true;
    addCSS(result.text);
    let bgColor = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
    console.log('bg', bgColor);
    this.editor.setAttribute('style', 'background-color: ' + bgColor);
  })
}

window.strapping = new Strapping();
