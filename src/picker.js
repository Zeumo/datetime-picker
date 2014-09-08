Picker = function(el, options) {
  this.$el   = $(el);

  // Options
  this.options = _.extend({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    template: JST.datepicker,
    doneText: 'Done',
    outputTo: this.$el,
    onChange: _.noop
  }, options);

  // Events
  this.events = {
    'click': this.onClick
  };

  if (this.$el[0].tagName === 'INPUT') {
    this.events = {
      'focus': this.onClick
    };
  }

  this.pickerEvents = {
    'click .done': this.onDone,
    'click .today': this.onToday,
    'change [name=date]': this.onChangeDate,
    'change [name=time]': this.onChangeTime
  };

  // Convenience vars
  this.$body   = $('body');
  this.$picker = $(this.options.template(this.dateTime()));
  this.$date   = this.$picker.find('[name=date]');
  this.$time   = this.$picker.find('[name=time]');

  // Standardize outputTo
  if (!this.options.outputTo.jquery) {
    this.options.outputTo = $(this.options.outputTo);
  }

  // Set current date and time
  this.setDateTime(this.dateTime());

  // Delegate events
  this.delegateEvents(this.events, this.$el);
  this.delegateEvents(this.pickerEvents, this.$picker);
  this.handlePickerClose();

  // Initialize calendar picker
  this.initializeCalendar();

  return this;
};

Picker.prototype.onClick = function(e) {
  e.preventDefault();

  this.show();
  this.$date.focus();
};

Picker.prototype.onChangeDate = function() {
  this.setDateTime(this.serialize());
  this.updateCalendar();
};

Picker.prototype.onChangeTime = function(e) {
  this.setDateTime(this.serialize());
};

Picker.prototype.onDone = function(e) {
  e.preventDefault();
  this.close();
};

Picker.prototype.onToday = function(e) {
  e.preventDefault();

  this.$date.val(this.dateTime().date);
  this.onChangeDate();
};
