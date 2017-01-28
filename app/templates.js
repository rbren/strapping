const inputGroups = require('./input-groups');
const utils = require('./utils');
const templates = module.exports = {};

templates.loading = function(opts) {
  return `<h4><a target="_blank" href="https://github.com/bobby-brennan/strapping">Strapping!</a> is loading...</h4>`
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

templates.strapping = function(opts) {
  let submit = `
<div class="row">
  <div class="col-xs-6">
    <h2>Strapping!</h2>
  </div>
  <div class="col-xs-6 text-right">
    <h2><input class="btn btn-success" type="submit" value="Set Styles"></h2>
  </div>
</div>`

  let links = inputGroups.concat([{label: "Miscellaneous"}]).map(g => `
    <a href="#${g.label}">${g.label}</a>
  `).join('&nbsp;&bull;&nbsp;');
  links = `<p>${links}</p>`;

  let error = '';
  if (opts.error) error = `
<div class="alert alert-warning">${opts.error}</div>`

  let addedInputs = [];
  let inputs = '';
  inputGroups.forEach(g => {
    let matchingInputs = Object.keys(opts.vars).filter(k => k.substring(1).match(g.pattern));
    addedInputs = addedInputs.concat(matchingInputs);
    inputs += `<a name="${g.label}"></a><h2>${g.label}</h2>`
          + matchingInputs.map(k => templates.input(k, opts.vars[k])).join('\n');
  })
  let unmatchedInputs = Object.keys(opts.vars).filter(k => addedInputs.indexOf(k) === -1);
  inputs += `<a name="Miscellaneous"></a><h2>Miscellaneous</h2>` + unmatchedInputs.map(k => templates.input(k, opts.vars[k])).join('\n');

  return `
<form onsubmit="strapping.compile(); return false">
  ${submit}
  ${error}
  ${links}
  ${inputs}
</form>`
}

