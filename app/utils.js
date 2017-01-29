const utils = module.exports = {};

utils.escapeQuotes = str => {
  return str.replace(/"/g, '&quot;');
}
utils.unescapeQuotes = str => {
  return str.replace(/&quot;/g, '"');
}

utils.isColor = name => {
  return name.match(/(brand|color|gray|-bg$|-text$|-border$)/);
}

utils.addCSS = (css, id) => {
  var style = document.createElement("style");
  if (id) style.setAttribute('id', id);
  style.type = "text/css";
  style.innerHTML = css;
  document.body.appendChild(style);
}

utils.removeCSS = id => {
  let elem = document.getElementById(id);
  if (elem) elem.parentNode.removeChild(elem);
}

utils.replaceLessVars = less => {
  let vars = {};
  for (let key in less) {
    let val = less[key];
    if (val.value) val = val.value;
    val = val.replace(/@/g, '$').replace(/spin\(([^,]+),[^\)]+\)/, '$1');
    let newKey = key.replace('@', '$');
    vars[newKey] = val;
  }
  return vars;
}

utils.getSassFromVariables = variables => {
  let varFile = `$bootstrap-sass-asset-helper: false !default;\n`;
  varFile += Object.keys(variables).map(v => v + ': ' + variables[v] + ' !default;').join('\n');
  return varFile;
}

utils.getVariablesFromSass = scss => {
  let vars = {}
  scss.split('\n')
    .map(l => l.match(/^(\$\S+):\s*(.*)\s*!default;.*$/))
    .filter(l => l)
    .map(match => {
      return {name: match[1], value: match[2].trim()}
    })
    .forEach(v => {
      vars[v.name] = v.value;
    })

  return vars;
}
