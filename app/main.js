require('./index.html');
const Sass = require('sass.js/dist/sass.js');
const ColorPicker = require('simple-color-picker');
const FILES = require('./bootstrap.js');

let variables = require('./defaults.js');

const addCSS = (css, id) => {
  var style = document.createElement("style");
  if (id) style.setAttribute('id', id);
  style.type = "text/css";
  style.innerHTML = css;
  document.body.appendChild(style);
}

const removeCSS = id => {
  let elem = document.getElementById(id);
  if (elem) elem.parentNode.removeChild(elem);
}

const escapeQuotes = str => {
  return str.replace(/"/g, '&quot;');
}
const unescapeQuotes = str => {
  return str.replace(/&quot;/g, '"');
}
const isColor = name => {
  return name.match(/(brand|color|gray|-bg|-text|-border)/);
}

const INPUT_GROUPS = [{
  label: "Branding",
  pattern: /^(brand-|body-bg)/,
}, {
  label: "State",
  pattern: /^state-/,
}, {
  label: "Buttons",
  pattern: /^btn-/
}, {
  label: "Navbar",
  pattern: /^navbar-/,
}, {
  label: "Alerts",
  pattern: /^alert-/,
}, {
  label: "Inputs",
  pattern: /^(input-|form-|label-)/,
}, {
  label: "Dropdowns",
  pattern: /^(dropdown-)/,
}, {
  label: "Navigation",
  pattern: /^nav-/,
}, {
  label: "Modals",
  pattern: /^modal-/,
}, {
  label: "Tooltips",
  pattern: /^(tooltip-|popover-)/
}, {
  label: "Code",
  pattern: /^(pre-|code-|kbd-)/,
}, {
  label: "Badges",
  pattern: /^badge-/,
}, {
  label: "Breadcrumbs",
  pattern: /^breadcrumb-/,
}, {
  label: "List Groups",
  pattern: /list-group-/,
}, {
  label: "Thumbnails",
  pattern: /^thumbnail-/,
}, {
  label: "Blockquotes",
  pattern: /^blockquote-/
}, {
  label: "Wells",
  pattern: /^well-/,
}, {
  label: "Jumbotron",
  pattern: /jumbotron-/,
}, {
  label: "Tables",
  pattern: /^table-/,
}, {
  label: "Progress Bar",
  pattern: /^progress-/
}, {
  label: "Panel",
  pattern: /^panel-/,
}, {
  label: "Carousel",
  pattern: /^carousel-/,
}, {
  label: "Pagination",
  pattern: /^(pagination-|pager-)/
}, {
  label: "Fonts",
  pattern: /^(font-|headings-|text-color|link-color|link-hover-color)/
}, {
  label: "Grays",
  pattern: /^gray/,
}, {
  label: "Sizes",
  pattern: /^(padding-|line-height|border-radius-)/,
}, {
  label: "Z-index",
  pattern: /^zindex/,
}, {
  label: "Grid",
  pattern: /^(screen-|grid-|container-)/,
}]

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

  let addedInputs = [];
  let inputs = '';
  INPUT_GROUPS.forEach(g => {
    let matchingInputs = Object.keys(opts.vars).filter(k => k.substring(1).match(g.pattern));
    addedInputs = addedInputs.concat(matchingInputs);
    inputs += `<h2>${g.label}</h2>` + matchingInputs.map(k => inputTemplate(k, opts.vars[k])).join('\n');
  })
  let unmatchedInputs = Object.keys(opts.vars).filter(k => addedInputs.indexOf(k) === -1);
  inputs += `<h2>Miscellaneous</h2>` + unmatchedInputs.map(k => inputTemplate(k, opts.vars[k])).join('\n');

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
    removeCSS('bootstrap');
    removeCSS('strapping');
    this.editor.innerHTML = strappingTemplate({vars: variables, error: result.status ? result.message : null});
    this.compiledOnce = true;
    addCSS(result.text, 'bootstrap');
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
      addCSS(result.text, 'strapping');
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

window.strapping = new Strapping();
