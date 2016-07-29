/*
 *  datepicker.js 0.6.0
 *  https://github.com/Zeumo/datepicker.js
 *
 *  /!\ Don't edit this file directly!
 *  It was generated by the datepicker.js build system.
 */

(function(window) {
  var Picker, pluginName = 'picker', templates = {};

  var t = function(s,d){
    for(var p in d) s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
    return s;
  };

  Picker = function(el, options) {
  this.$el          = $(el);
  this._initialized = false;
  this.range        = this.initializeRange(options);

  if (this.hasRange()) {
    this._initialized = true;
    return this;
  }

  // Options
  this.options = $.extend({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    template: templates.datepicker,
    doneText: 'Save',
    removeText: 'Remove',
    prefill: false,
    defaultTimeRange: { hours: 1 },
    outputTo: this.$el,
    onChange: function() {},
    onRemove: function() {},
    onInitialize: function() {}
  }, options);

  this.$startPicker = this.options.startPicker;
  this.$endPicker   = this.options.endPicker;

  this.options.onChange     = this.options.onChange.bind(this);
  this.options.onRemove     = this.options.onRemove.bind(this);
  this.options.onInitialize = this.options.onInitialize.bind(this);

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

  this.startPickerEvents = {
    'change': this.setTimeAfterStartPicker
  }

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
  var m = moment(new Date(this.options.outputTo.val()));
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
  if (this.isEndPicker()) {
    this.delegateEvents(this.startPickerEvents, this.$startPicker);
  }

  // Initialize calendar picker
  this.initializeCalendar();

  this.options.onInitialize();
  this.$el.trigger('initialize');

  this._initialized = true;
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
  for(var key in events) {
    var match     = key.match(/^(\S+)\s*(.*)$/);
    var eventName = match[1];
    var handler   = match[2];
    var method    = events[key];

    $el.on(eventName, handler, method.bind(this));
  }
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

  $(document).on('click', handler.bind(this));

  $(document).on('keyup', function(e) {
    // Esc
    if (e.which === 27) this.close();
  }.bind(this));
};

Picker.prototype.show = function() {
  var elHeight = this.$el.outerHeight(true);
      elBottom = elHeight + this.$el.offset().top,
      elLeft   = this.$el.offset().left;

  this.$picker.find('.remove').toggleClass('hidden', !this.savedVal);

  this.$picker.css({
    top: elBottom + 5 + 'px',
    left: elLeft + 'px',
    position: 'absolute'
  });

  this.closeAll();
  this.$body.append(this.$picker);

  var pickerHeight = this.$picker.outerHeight(true);
  var pickerBottom = pickerHeight + this.$picker.offset().top;

  if (pickerBottom > window.innerHeight) {
    this.$picker.css({
      top: this.$el.offset().top - pickerHeight + 5 + 'px',
      position: 'absolute'
    });
  }
};

Picker.prototype.render = function() {
  var options = $.extend({},
    this.dateTime(),
    { val: this._val },
    this.options);

  return $(t(this.options.template, options));
};

Picker.prototype.closeAll = function() {
  $('#datepicker').detach();
};

Picker.prototype.close = function() {
  this.$picker.detach();
};

Picker.prototype.dateTime = function(offsetHours) {
  offsetHours = offsetHours || 1;

  if (this.hasPrecedingPicker() || this.isEndPicker()) {
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

  this._val = moment(new Date([date, time].join(' ')));

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

  if (this._initialized) {
    if (this.isInput()) {
      this.$el.trigger('change');
    }

    this.options.onChange();
  }
};

Picker.prototype.unsetDateTime = function(obj) {
  this.options.outputTo.val('');
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

Picker.prototype.isEndPicker = function() {
  return !!this.$startPicker;
};

Picker.prototype.hasRange = function() {
  return !!this.range.length;
}

Picker.prototype.initializeRange = function(options) {
  var children = this.$el.find('input');

  if (children.length !== 2) return [];

  return children.map(function(index) {
    var rangeOptions;

    if (index === 1) {
      rangeOptions = $.extend({ startPicker: $(children[0]) }, options);
    } else {
      rangeOptions = $.extend({ endPicker: $(children[1]) }, options);
    }
    return new Picker(this, rangeOptions);
  });
};

Picker.prototype.startPickerDate = function() {
  return new Date(this.$startPicker.val());
};

Picker.prototype.selectedMoment = function() {
  return moment(new Date(this.options.outputTo.val()));
};

Picker.prototype.setTimeAfterStartPicker = function() {
  var startTime      = this.startPickerDate();
  var newEndTime     = moment(startTime).add(this.options.defaultTimeRange);
  var currentEndTime = this.selectedMoment()

  // Don't update dateTime if the currentEndTime is already > than startTime
  if (currentEndTime > startTime) return;

  if (newEndTime.isValid()) {
    this.setDateTime({
      date: newEndTime.format(this.options.dateFormat),
      time: newEndTime.format(this.options.timeFormat)
    });
    this.outputDateTime();
    this.updateCalendar();
  }
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

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

templates["datepicker"] = "<div id=\"datepicker\">  <div class=\"row\">    <div class=\"col-xs-6\">      <label for=\"date-picker\">Date</label>      <input type=\"text\" value=\"{date}\" name=\"date\" id=\"date-picker\" class=\"form-control\">    </div>    <div class=\"col-xs-6\">    <label for=\"time-picker\">Time</label>      <input type=\"text\" value=\"{time}\" name=\"time\" id=\"time-picker\" class=\"form-control\">    </div>  </div>  <div class=\"calendar\"></div>  <a href=\"#\" class=\"btn btn-primary pull-left done\">{doneText}</a>  <a href=\"#\" class=\"btn text-danger pull-right remove hidden\">{removeText}</a></div>";

  window.Picker = Picker;
}(this));
