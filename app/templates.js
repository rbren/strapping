const inputGroups = require('./input-groups');
const utils = require('./utils');
const themes = require('./themes');
const templates = module.exports = {};

templates.loading = function(opts) {
  return `<h4><a target="_blank" href="https://github.com/bobby-brennan/strapping">Strapping!</a> is building your theme...</h4>`
}

templates.input = function(name, value) {
  let input = `
<input class="input-sm form-control" type="text" value="${utils.escapeQuotes(value)}" name="${name}">`

  if (utils.isColor(name)) {
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

templates.heading = function() {
  return `
<div class="form-group">
  <div class="btn-toolbar">
    <input class="btn btn-primary" type="submit" value="Preview">
    <div class="btn-group">
      <label for="StrappingLoadInput"><a class="btn btn-primary">Load</a></label>
      <input style="display:none" id="StrappingLoadInput" type="file" onchange="strapping.load(this.files[0])">
    </div>
    <div class="btn-group hover-dropdown">
      <a class="btn btn-primary dropdown-toggle">Save <span class="caret"></span></a>
      <ul class="dropdown-menu">
        <li><a onclick="strapping.saveAs('css')">CSS</a></li>
        <li><a onclick="strapping.saveAs('sass')">Sass</a></li>
        <li><a onclick="strapping.saveAs('json')">JSON</a></li>
      </ul>
    </div>
  </div>
</div>`

}

templates.themes = function() {
  return `
<h2>Themes</h2>
<p>
  <span class="text-danger">Warning:</span>
  Setting a theme will overwrite your current settings.
</p>
  ` + themes.map(theme => `
<a href="#" onclick="strapping.setTheme('${theme.name}')">${theme.name}</a> - ${theme.description}
  `).join('<br>\n');
}

templates.fonts = function(fonts, addedFonts) {
  const fontItem = font => `<li><a onclick="strapping.addFont('${font.family}')">${font.family}</a></li>`
  const addedFontItem = font => `
<li>
  <span style='font-family: "${font.family}"'>${font.family}</span>
  &nbsp;
  <a class="text-danger" onclick="strapping.removeFont('${font.family}')">&times;</a>
</li>
  `;
  return `
<div class="dropdown form-group">
  <a class="btn btn-default dropdown-toggle" data-toggle="dropdown">Add Fonts <span class="caret"></span></a>
  <ul class="dropdown-menu">
    ${fonts.map(f => fontItem(f)).join('\n')}
  </ul>
</div>
<p>Preview fonts on <a href="https://fonts.google.com/" target="_blank">fonts.google.com</a></p>
<ul>
  ${addedFonts.map(f => addedFontItem(f)).join('\n')}
</ul>
  `
}

templates.strapping = function(opts) {
  let heading = opts.heading || templates.heading();
  let links = `
    <label>Jump to:</label><br>
  ` + inputGroups.concat([{label: "Miscellaneous"}]).map(g => `
    <a href="#${g.label}">${g.label}</a>
  `).join('&nbsp;&bull;&nbsp;');
  links = `<p>${links}</p>`;

  let error = opts.error ? `<div class="alert alert-warning">${opts.error}</div>` : '';

  let addedInputs = [];
  let inputs = '';
  inputGroups.forEach(g => {
    let matchingInputs = Object.keys(opts.vars).filter(k => k.substring(1).match(g.pattern));
    addedInputs = addedInputs.concat(matchingInputs);
    let inputGroupHTML = `<a name="${g.label}"></a><h2>${g.label}</h2>`;
    if (g.label === 'Fonts') inputGroupHTML += templates.fonts(opts.fonts, opts.addedFonts);
    inputGroupHTML += matchingInputs.map(k => templates.input(k, opts.vars[k])).join('\n');
    inputs += inputGroupHTML;
  })
  let unmatchedInputs = Object.keys(opts.vars).filter(k => addedInputs.indexOf(k) === -1);
  inputs += `<a name="Miscellaneous"></a><h2>Miscellaneous</h2>` + unmatchedInputs.map(k => templates.input(k, opts.vars[k])).join('\n');

  return `
<form onsubmit="strapping.compile(); return false">
  ${heading}
  ${error}
  ${links}
  ${templates.themes()}
  ${inputs}
</form>`
}


