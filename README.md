# Strapping!

[Check out the demo](https://bobby-brennan.github.io/strapping)

Strapping is a web plugin for generating custom [Bootstrap](http://getbootstrap.com) themes.
Including Strapping on any page that uses Bootstrap CSS will allow you to live-edit the pages
colors, sizes, and fonts.

You can incorporate Strapping into your project in two ways:

1. Include Strapping in **development** mode to help you customize your site's styles
2. Include Strapping in **production** to allow users, customers, and teams to create themes for your site

## Usage
```html
<html>
  <head>
    <script src="strapping.min.js"></script>
  </head>
  <body onload="strapping.initialize()">
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

### Style
By default, Strapping loads in a fixed-position column on the left-hand size of the page
once you call `initialize()`.  This only really works in desktop, and may intefere with
your page, e.g. by covering the navbar.  You can re-position Strapping using CSS:

```css
#StrappingEditor {
  position: fixed;
  top: 72px;
  bottom: 0;
  right: 0;
  width: 300px;
}
```

This will put the editor on the right-hand-side, leaving 72px of room at the top for a navbar.

### Fields
By default, Strapping allows modification of any Bootstrap variable. You can restrict the list
of available fields using strings and regular expressions:

```js
strapping.initialize({
  fields: [/^(alert-|button-|brand-)/, 'border-radius-base', 'link-color'],
})
```

