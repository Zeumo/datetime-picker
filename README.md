# datepicker

A Trello-like datepicker with freeform time.

![](http://cl.ly/image/0r0w001L3a0o/datepicker.mov.gif)

## Usage

```javascript
// jQuery
$('input').datepicker()

// Vanilla
new Picker(document.getElementByTagName('input'))
```

## Options

**dateFormat**

Default: `'MM/DD/YYYY'`

**timeFormat**

Default: `'h:mm A'`

**template**

Default: `JST.datepicker`

## Dependencies

* jQuery
* lodash
* handlebars
* moment
* bootstrap-datepicker

## Development

* `npm install && bower install`
* `gulp`
* Open http://0.0.0.0:8000/example
