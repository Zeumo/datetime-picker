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

  this.options.onInitialize(this);
  this.$el.trigger('initialize', this);

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
