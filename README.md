# Strapping!

[Check out the demo](http://bbrennan.info/strapping/)

Strapping! is a GUI for working with Bootstrap. Bootstrap provides a valuable set of
default styles and components for the web, but customizing it can be a pain.

Strapping allows you to build and preview customized Bootstrap themes.
You can change the default color schemes, import new fonts from Google Fonts,
and mess with any of the variables provided by Bootstrap's variables.less

When you're done, you can preview your theme right in your browser, and you can copy the generated CSS into your project.

## Running Locally
```bash
npm install -g strapping
strapping --styles ./bootstrap.css --settings ./bootstrap_config.json --port 3000
```

Then visit localhost:3000 to start creating your custom bootstrap theme.
Clicking "Save" will push your edits to bootstrap.css and bootstrap_config.json.

This means that any page which points to the `styles` CSS file will immediately reflect your changes:
```html
<link rel="stylesheet" href="bootstrap.css">
```

So you can preview your theme inside your project as you edit.
