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

