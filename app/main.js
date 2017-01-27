const Sass = require('sass.js/dist/sass.js');
const ColorPicker = require('simple-color-picker');
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
const isColor = name => {
  return name.indexOf('brand') !== -1 || name.indexOf('color') !== -1;
}

const loadingTemplate = function(opts) {
  return `<h2>Loading</h2>`
}

const inputTemplate = function(name, value) {
  let input = `
<input class="input-xs form-control" type="text" value="${escapeQuotes(value)}" name="${name}">`

  if (isColor(name)) {
    input = `
<div class="input-group color-input-group" onclick="strapping.showColorPicker(this)">
    ${input}
    <span class="input-group-addon"></span>
    </span>
</div>`
  }

  return `
<div class="form-group">
  <label>${name.substring(1)}</label>
  ${input}
</div>`
}

const strappingTemplate = function(opts) {
  let submit = `
<div class="form-group">
  <input class="btn btn-success" type="submit" value="Set Styles">
</div>`

  let error = '';
  if (opts.error) error = `
<div class="alert alert-warning">${opts.error}</div>`

  let inputs = Object.keys(opts.vars).map(k => inputTemplate(k, opts.vars[k])).join('\n')
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
  if (!window.Strapping.initialized) {
    addCSS(require('simple-color-picker/src/simple-color-picker.css'));
    addCSS(require('!raw-loader!./styles.css'));
  }
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
    this.editor.setAttribute('style', 'background-color: ' + bgColor);

    let varsCSS = Object.keys(variables).filter(v => isColor(v)).map(v => `
#StrappingEditor input[name="${escapeQuotes(v)}"] ~ .input-group-addon {
  background-color: ${variables[v]};
}
    `).join('\n');
    varsCSS = '@import "bootstrap/_variables.scss";\n' + varsCSS;
    this.sass.compile(varsCSS, result => {
      if (result.status) throw new Error(result.message);
      addCSS(result.text);
    })
  })
}

Strapping.prototype.showColorPicker = function(elem) {
  let input = elem.querySelector('input');
  if (this.picker) this.picker.remove();
  this.picker = new ColorPicker({
    color: input.value,
    el: elem.parentElement,
    width: 130,
    height: 100,
  });
  this.picker.onChange(function(color) {
    input.value = color;
    elem.querySelector('.input-group-addon').setAttribute('style', 'background-color: ' + color);
  })
}

window.strapping = new Strapping();
