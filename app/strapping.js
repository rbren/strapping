const Sass = require('sass.js/dist/sass.js');
const ColorPicker = require('simple-color-picker');
const saveAs = require('file-saver').saveAs;

const SASS_FILES = require('./bootstrap');
const utils = require('./utils');
const templates = require('./templates');
const themes = require('./themes');

let Strapping = module.exports = function() {}

Strapping.prototype.initialize = function(options) {
  if (typeof options === 'string') options = {workerPath: options};
  this.variables = options.variables || {};
  if (!options.variables) this.load(themes.filter(t => t.name === 'Strapping')[0].scss, true);
  options.parent = options.parent || document.body;
  this.sass = new Sass(options.workerPath);
  Object.keys(SASS_FILES).forEach(filename => {
    this.sass.writeFile(filename, SASS_FILES[filename]);
  });
  this.heading = options.heading;
  if (!window.Strapping.initialized) {
    utils.addCSS(require('simple-color-picker/src/simple-color-picker.css'));
    utils.addCSS(require('!raw-loader!./styles/styles.css'));
  }
  window.Strapping.initialized = true;
  this.editor = document.createElement('div');
  this.editor.setAttribute('id', 'StrappingEditor');
  options.parent.appendChild(this.editor);
  this.compile();
}

Strapping.prototype.saveAs = function(type) {
  type = type || 'css';
  this.compile((result) => {
    if (result.status) return;
    let text = type === 'json' ? JSON.stringify(result.variables, null, 2) : result[type];
    let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    let filename = '';
    if (type === 'json') filename = 'variables.json';
    else if (type === 'css') filename = 'bootstrap.css';
    else if (type === 'sass') filename = '_variables.scss';
    saveAs(blob, filename);
  })
}

Strapping.prototype.load = function(str, noCompile) {
  if (str instanceof window.File) {
    let reader = new FileReader();
    reader.onload = () => {
      this.load(reader.result);
    }
    reader.readAsText(str);
    return;
  }

  let vars = null;
  if (typeof str === 'object') {
    vars = str;
  } else {
    try {
      vars = JSON.parse(str);
    } catch (e) {}
    if (!vars) vars = utils.getVariablesFromSass(str);
  }

  for (let key in vars) {
    this.variables[key] = vars[key];
  }
  if (!noCompile) this.compile(null, true);
}

Strapping.prototype.setTheme = function(themeName) {
  let theme = themes.filter(t => t.name === themeName)[0];
  let vars = utils.getVariablesFromSass(theme.scss);
  for (let key in vars) {
    this.variables[key] = vars[key];
  }
  this.compile(null, true);
}

Strapping.prototype.compile = function(callback, skipInputs) {
  callback = callback || function() {};
  if (!skipInputs && this.compiledOnce) {
    Object.keys(this.variables).forEach(v => {
      this.variables[v] = utils.unescapeQuotes(document.getElementsByName(v)[0].value);
    });
  }
  let varFile = utils.getSassFromVariables(this.variables);
  this.sass.writeFile('bootstrap/_variables.scss', varFile)
  this.editor.innerHTML = templates.loading();
  this.sass.compile('@import "_bootstrap";', (result) => {
    utils.removeCSS('bootstrap');
    utils.removeCSS('strapping');
    this.editor.innerHTML = templates.strapping({
      heading: this.heading,
      vars: this.variables,
      error: result.status ? result.message : null,
    });
    this.compiledOnce = true;
    utils.addCSS(result.text, 'bootstrap');
    let bgColor = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
    this.editor.setAttribute('style', 'background-color: ' + bgColor);

    let varsCSS = Object.keys(this.variables).filter(v => utils.isColor(v)).map(v => `
#StrappingEditor input[name="${utils.escapeQuotes(v)}"] ~ .input-group-addon {
  background-color: ${this.variables[v]};
}
    `).join('\n');
    callback({
      status: result.status,
      message: result.message,
      sass: varFile,
      css: result.text,
      variables: this.variables,
    });
    varsCSS = '@import "bootstrap/_variables.scss";\n' + varsCSS;
    this.sass.compile(varsCSS, result => {
      if (result.status) throw new Error(result.message);
      utils.addCSS(result.text, 'strapping');
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
  this.picker.onChange((color) => {
    if (this.picker.init) {
      input.value = color.toLowerCase();
      elem.querySelector('.input-group-addon').setAttribute('style', 'background-color: ' + color);
    }
    this.picker.init = true;
  })
  input.addEventListener('change', (evt) => {
    let color = evt.target.value;
    if (color && color !== this.picker.color && color.match(/^#\w+/)) {
      this.picker.setColor(color);
    }
  })
}

