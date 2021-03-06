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
    startDate: '-0d',
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

  this.endPickerEvents = {
    'change': this.setTimeToBeforeEndPicker
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
  } else if (this.isStartPicker()) {
    this.delegateEvents(this.endPickerEvents, this.$endPicker);
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
