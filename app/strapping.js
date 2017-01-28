const Sass = require('sass.js/dist/sass.js');
const ColorPicker = require('simple-color-picker');
const saveAs = require('file-saver').saveAs;

const SASS_FILES = require('./bootstrap');
const utils = require('./utils');
const templates = require('./templates');

let variables = require('./defaults');


let Strapping = module.exports = function() {}

Strapping.prototype.initialize = function(options) {
  if (typeof options === 'string') options = {workerPath: options};
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

Strapping.prototype.compile = function(callback) {
  callback = callback || function() {};
  if (this.compiledOnce) {
    Object.keys(variables).forEach(v => {
      variables[v] = utils.unescapeQuotes(document.getElementsByName(v)[0].value);
    });
  }
  let varFile = `$bootstrap-sass-asset-helper: false !default\n`;
  varFile += Object.keys(variables).map(v => v + ': ' + variables[v] + ';').join('\n');
  this.sass.writeFile('bootstrap/_variables.scss', varFile)
  this.editor.innerHTML = templates.loading();
  this.sass.compile('@import "_bootstrap";', (result) => {
    utils.removeCSS('bootstrap');
    utils.removeCSS('strapping');
    this.editor.innerHTML = templates.strapping({
      heading: this.heading,
      vars: variables,
      error: result.status ? result.message : null,
    });
    this.compiledOnce = true;
    utils.addCSS(result.text, 'bootstrap');
    let bgColor = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
    this.editor.setAttribute('style', 'background-color: ' + bgColor);

    let varsCSS = Object.keys(variables).filter(v => utils.isColor(v)).map(v => `
#StrappingEditor input[name="${utils.escapeQuotes(v)}"] ~ .input-group-addon {
  background-color: ${variables[v]};
}
    `).join('\n');
    callback({
      status: result.status,
      message: result.message,
      sass: varFile,
      css: result.text,
      variables: variables,
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
  this.picker.onChange(function(color) {
    input.value = color.toLowerCase();
    elem.querySelector('.input-group-addon').setAttribute('style', 'background-color: ' + color);
  })
}

