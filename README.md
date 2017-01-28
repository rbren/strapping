# Strapping!

[Check out the demo](https://bobby-brennan.github.io/strapping)

Strapping is a web plugin for generating custom [Bootstrap](http://getbootstrap.com) themes.
Including Strapping on any page that uses Bootstrap CSS will allow you to live-edit the pages
colors, sizes, and fonts.

You can incorporate Strapping into your project in two ways:

1. Include Strapping in **development** to help you customize your site's styles
2. Include Strapping in **production** to allow users, customers, and teams to create themes for your site

## Usage
The `dist/` folder comes with two files:

* strapping.min.js
* sass.worker.js - from [sass.js](http://github.com/medialize/sass.js)

sass.worker.js is rather large (~3MB), so it's only loaded if Strapping
is initialized.

```html
<html>
  <head>
    <script src="path/to/strapping.min.js"></script>
  </head>
  <body onload="strapping.initialize('path/to/sass.worker.js')">
    <div class="alert alert-info">
      Customize Me!
    </div>
  </body>
</html>
```

This will load Strapping in a fixed-position side column (like you can see on the left now).
There can edit your bootstrap variables.  Clicking **Set Styles** will re-compile
Bootstrap and apply the styles to the page.

You can save the resulting CSS or Sass to a local file (e.g. if you're working on your own site).
If you're using Strapping in production to allow your users to customize your UI, you'll probably
want to save the result to a CDN or database.

```
strapping.onCompiled(function(result) {
  console.log(result.status);    // 0 if everything went OK
  console.log(result.message);   // Check this if status !== 0
  console.log(result.variables); // A JavaScript object mapping variables to values
  console.log(result.css);       // Full Bootstrap CSS
  console.log(result.scss);      // A _variables.scss file for inclusion in Bootstrap
  strapping.saveAs('css');       // Show the "Save As" dialog in the browser
});
```

## Customization

By default Strapping will just append itself to the document body. You can also pass
in a parent element:

```html
<body>
  <div id="Strapping"></div>
  <script>
    strapping.initialize('path/to/sass.worker.js', document.getElementById('Strapping'));
  </script>
</body>
```

The inserted element will have the id `#StrappingEditor`, so you can also apply CSS to it:

```css
#StrappingEditor {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 300px;
}
```

### Fields
By default, Strapping allows modification of any Bootstrap variable. You can restrict the list
of available fields using strings and regular expressions:

```js
strapping.initialize({
  fields: [/^(alert-|button-|brand-)/, 'border-radius-base', 'link-color'],
})
```

