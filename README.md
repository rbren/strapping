# Strapping!

[Check out the demo](https://bobby-brennan.github.io/strapping)

Strapping is a web plugin for live-editing custom [Bootstrap](http://getbootstrap.com) themes.
Include Strapping on any page that uses Bootstrap CSS, and use the toolbar to modify the page's
colors, sizes, and fonts.

You can incorporate Strapping into your project in two ways:

1. Include Strapping in **development** to help you customize your site's styles
2. Include Strapping in **production** to allow users and teams to create themes for your site

## Usage
```
npm install --save strapping
```

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

## Customization

### Saving
By default, Strapping provides buttons for saving the resulting CSS or Sass to a local file.
If you're using Strapping in production to allow your users to customize your UI, you'll probably
want to save the result to a CDN or database. To do this, you can replace the default buttons
with your own:
```
window.save = function(result) {
  if (result.status) throw new Error(result.message);
  console.log(result.css);
  console.log(result.sass);
  console.log(result.json);
  // Pass the result to S3, localStorage, ...
}

strapping.initialize({
  workerPath: 'path/to/sass.worker.js',
  heading: `
<a onclick="strapping.compile()">Preview</a>
<a onclick="strapping.compile(save)">Save</a>
  `,
})
```

### Loading
You can use `strapping.load()` to set the theme using saved JSON or Sass:

```
window.save = function((result) => {
  localStorage.setItem('_variables.scss', result.sass);
})

let saved = localStorage.getItem('_variables.scss');
if (saved) strapping.load(saved);
```

### Position and Styles
By default Strapping will just append itself to the document body. You can also pass
in a parent element:

```html
<body>
  <div id="Strapping"></div>
  <script>
    strapping.initialize({
      workerPath: 'path/to/sass.worker.js',
      parent: document.getElementById('Strapping'),
    });
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
  workerPath: 'path/to/sass.worker.js',
  fields: [/^(alert-|button-|brand-)/, 'border-radius-base', 'link-color'],
})
```

