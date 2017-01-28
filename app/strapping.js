const Sass = require('sass.js/dist/sass.js');
window.Sass = Sass;
const ColorPicker = require('simple-color-picker');

const SASS_FILES = require('./bootstrap');
const utils = require('./utils');

const templates = require('./templates');

let variables = require('./defaults');


let Strapping = module.exports = function() {}

Strapping.prototype.initialize = function(workerPath, element) {
  element = element || document.body;
  this.sass = new Sass(workerPath);
  Object.keys(SASS_FILES).forEach(filename => {
    this.sass.writeFile(filename, SASS_FILES[filename]);
  });
  if (!window.Strapping.initialized) {
    utils.addCSS(require('simple-color-picker/src/simple-color-picker.css'));
    utils.addCSS(require('!raw-loader!./styles/styles.css'));
  }
  window.Strapping.initialized = true;
  this.editor = document.createElement('div');
  this.editor.setAttribute('id', 'StrappingEditor');
  element.appendChild(this.editor);
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
    this.editor.innerHTML = templates.strapping({vars: variables, error: result.status ? result.message : null});
    this.compiledOnce = true;
    utils.addCSS(result.text, 'bootstrap');
    let bgColor = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
    this.editor.setAttribute('style', 'background-color: ' + bgColor);

    let varsCSS = Object.keys(variables).filter(v => utils.isColor(v)).map(v => `
#StrappingEditor input[name="${utils.escapeQuotes(v)}"] ~ .input-group-addon {
  background-color: ${variables[v]};
}
    `).join('\n');
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

