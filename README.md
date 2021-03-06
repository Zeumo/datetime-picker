# datepicker

A Trello-like datepicker with freeform time.

![](http://cl.ly/image/0r0w001L3a0o/datepicker.mov.gif)

## Usage

```javascript
// jQuery
$('input').picker()

// Vanilla
new Picker(document.getElementByTagName('input'))
```

## Options

**startDate**

Default: `'-0d'`

**dateFormat**

Default: `'MM/DD/YYYY'`

**defaultTimeRange**

Default: `{ hours: 1 }`

* Only used with an input range

**doneText**

Default: `'Done'`

**timeFormat**

Default: `'h:mm A'`

**template**

Default: `JST.datepicker`

**outputTo**

Default: `this.$el`

**prefill**

Default: `true`

**onChange**

Default: `noop` bound to `this` (picker instance)

## Dependencies

* jQuery
* moment
* bootstrap-datepicker

## Development

* `npm install && bower install`
* `gulp`
* Open http://0.0.0.0:8000/example
