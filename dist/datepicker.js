/*
 *  datepicker.js 0.2.1
 *  https://github.com/Zeumo/datepicker.js
 *
 *  /!\ Don't edit this file directly!
 *  It was generated by the datepicker.js build system.
 */

(function(window) {
  var Picker, pluginName = 'picker';

  Picker = function(el, options) {
  this.$el   = $(el);

  // Options
  this.options = _.extend({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    template: JST.datepicker,
    doneText: 'Save',
    removeText: 'Remove',
    prefill: false,
    outputTo: this.$el,
    onChange: _.noop,
    onRemove: _.noop,
    onInitialize: _.noop
  }, options);

  this.options.onChange     = _.bind(this.options.onChange, this);
  this.options.onRemove     = _.bind(this.options.onRemove, this);
  this.options.onInitialize = _.bind(this.options.onInitialize, this);

  // Events
  this.events = {
    'click': this.onClick
  };

  if (this.isInput()) {
    this.events = {
      'focus': this.onClick
    };
  }

  this.pickerEvents = {
    'click .done': this.onDone,
    'click .remove': this.onRemove
  };

  // Convenience vars
  this.$body   = $('body');
  this.$picker = $(this.render());
  this.$date   = this.$picker.find('[name=date]');
  this.$time   = this.$picker.find('[name=time]');

  // Standardize outputTo
  if (!this.options.outputTo) {
    this.options.outputTo = this.$el;
  }
  if (!this.options.outputTo.jquery) {
    this.options.outputTo = $(this.options.outputTo);
  }

  // Set current date and time
  var m = moment(this.options.outputTo.val());
  this.setDateTime(this.dateTime());

  if (m.isValid()) {
    this.setDateTime({
      date: m.format(this.options.dateFormat),
      time: m.format(this.options.timeFormat)
    });
    this.outputDateTime();
  }

  // Prefill empty field
  if (this.options.prefill && !m.isValid()) {
    this.outputDateTime();
  }

  // Delegate events
  this.delegateEvents(this.events, this.$el);
  this.delegateEvents(this.pickerEvents, this.$picker);
  this.handlePickerClose();

  // Initialize calendar picker
  this.initializeCalendar();

  this.options.onInitialize();
  this.$el.trigger('initialize');

  return this;
};

Picker.prototype.onClick = function(e) {
  e.preventDefault();

  this.show();
  this.$date.focus();
};

Picker.prototype.onChangeDate = function() {
  this.setDateTime(this.serialize());
  this.outputDateTime();
  this.updateCalendar();
};

Picker.prototype.onChangeTime = function(e) {
  this.setDateTime(this.serialize());
};

Picker.prototype.onDone = function(e) {
  e.preventDefault();
  this.close();
  this.onChangeDate();
};

Picker.prototype.onRemove = function(e) {
  e.preventDefault();
  delete this.savedVal;
  this.close();
  this.unsetDateTime();
};

Picker.prototype.delegateEvents = function(events, $el) {
  _(events).each(function(method, key) {
    var match     = key.match(/^(\S+)\s*(.*)$/);
    var eventName = match[1];
    var handler   = match[2];
    method        = _.bind(method, this);

    $el.on(eventName, handler, method);
  }, this);
};

Picker.prototype.handlePickerClose = function() {
  var self = this;

  var handler = function(e) {
    var isEl       = !!$(e.target).closest(self.$el).length,
        isDetached = !$(document).find(e.target).length,
        isPicker   = !!$(e.target).closest('#datepicker').length;

    if (isEl || isDetached || isPicker) return;
    this.close();
  };

  $(document).on('click', _.bind(handler, this));

  $(document).on('keyup', _.bind(function(e) {
    // Esc
    if (e.which === 27) this.close();
  }, this));
};

Picker.prototype.show = function() {
  var elBottom = this.$el.outerHeight(true) + this.$el.offset().top,
      elLeft   = this.$el.offset().left;

  this.$picker.find('.remove').toggleClass('hidden', !this.savedVal);

  this.$picker.css({
    top: elBottom + 5 + 'px',
    left: elLeft + 'px',
    position: 'absolute'
  });

  this.closeAll();
  this.$body.append(this.$picker);
};

Picker.prototype.render = function() {
  return $(this.options.template(
    _.extend({},
      this.dateTime(),
      { val: this._val },
      this.options)
  ));
};

Picker.prototype.closeAll = function() {
  $('#datepicker').detach();
};

Picker.prototype.close = function() {
  this.$picker.detach();
};

Picker.prototype.dateTime = function(offsetHours) {
  offsetHours = offsetHours || 1;

  if (this.hasPrecedingPicker()) {
    offsetHours += 1;
  }

  return {
    date: moment().format(this.options.dateFormat),
    time: moment().add(offsetHours, 'hour').startOf('hour')
            .format(this.options.timeFormat)
  };
};

Picker.prototype.setDateTime = function(obj) {
  var date = obj.date,
      time = this.normalizeTime(obj.time),
      datetime;

  this._val = moment([date, time].join(' '));

  // Reset the moment object if we got an invalid date
  if (!this._val.isValid()) {
    datetime = this.dateTime();
    this._val = moment([datetime.date, datetime.time].join(' '));
  }

  this.$date.val(this._val.format(this.options.dateFormat));
  this.$time.val(this._val.format(this.options.timeFormat));
};

Picker.prototype.outputDateTime = function() {
  this.savedVal = this._val;
  formattedVal  = this.formattedVal();

  this.options.outputTo.val(formattedVal);

  if (this.isInput()) {
    this.$el.trigger('change');
  }

  this.options.onChange();
};

Picker.prototype.unsetDateTime = function(obj) {
  this.$el.trigger('datepicker.remove', this.options.outputTo);
  this.options.onRemove();
};

Picker.prototype.formattedVal = function() {
  if (!this.savedVal) return;
  return this.savedVal.format([this.options.dateFormat, this.options.timeFormat].join(' '));
};

Picker.prototype.normalizeTime = function(time) {
  // Normalize minutes
  if (!(/\d:\d{2}/).test(time)) {
    time = time.replace(/(^\d+)/, "$1:00");
  }

  // Normalize spacing
  if (!(/\s[a|p]/i).test(time)) {
    time = time.replace(/(a|p)/i, " $1");
  }

  // Normalize meridian
  if (!(/m/i).test(time)) {
    time = time.replace(/(a|p)/i, "$1m");
  }

  return time;
};

Picker.prototype.isInput = function() {
  return this.$el[0].tagName === 'INPUT';
};

Picker.prototype.serialize = function() {
  return {
    date: this.$date.val(),
    time: this.$time.val().toUpperCase()
  };
};

Picker.prototype.hasPrecedingPicker = function() {
  var dtp = this.$el.siblings('input').data(pluginName);
  if (dtp) return true;
};

Picker.prototype.initializeCalendar = function() {
  this.calendarEvents = {
    'changeDate': this.onCalendarChangeDate
  };

  this.$calendar = this.$picker.find('.calendar').datepicker({
    startDate: '-0d'
  });

  this.updateCalendar();
  this.delegateEvents(this.calendarEvents, this.$calendar);
};

Picker.prototype.updateCalendar = function() {
  this.$calendar.datepicker('update', this.$date.val());
};

Picker.prototype.onCalendarChangeDate = function(e) {
  var date = e.format();

  if (date) {
    this.$date.val(date);
    this.setDateTime(this.serialize());
  }
};

$.fn[pluginName] = function (options) {
  this.each(function() {
    if (!$.data(this, pluginName)) {
      $.data(this, pluginName, new Picker(this, options));
    }
  });
  return this;
};

this["JST"] = this["JST"] || {};
this["JST"]["datepicker"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"datepicker\">\n  <div class=\"row\">\n    <div class=\"col-xs-6\">\n      <label for=\"date-picker\">Date</label>\n      <input type=\"text\" value=\"";
  if (helper = helpers.date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" name=\"date\" id=\"date-picker\" class=\"form-control\">\n    </div>\n    <div class=\"col-xs-6\">\n    <label for=\"time-picker\">Time</label>\n      <input type=\"text\" value=\"";
  if (helper = helpers.time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" name=\"time\" id=\"time-picker\" class=\"form-control\">\n    </div>\n  </div>\n\n  <div class=\"calendar\"></div>\n\n  <a href=\"#\" class=\"btn btn-primary pull-left done\">";
  if (helper = helpers.doneText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.doneText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n  <a href=\"#\" class=\"btn text-danger pull-right remove hidden\">";
  if (helper = helpers.removeText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.removeText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n</div>\n";
  return buffer;
  });

  window.Picker = Picker;
}(this));
