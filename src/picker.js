Picker = function(el, options) {
  this.$el   = $(el);
  this.$body = $('body');

  // Options
  this.options = _.extend({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    template: JST.datepicker,
    outputTo: this.$el
  }, options);

  // Events
  this.events = {
    'focus': this.onFocus
  };

  this.pickerEvents = {
    'click .done': this.onDone,
    'click .today': this.onToday,
    'change [name=date]': this.onChangeDate,
    'change [name=time]': this.onChangeTime
  };

  // Convenience vars
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
};

Picker.prototype.onFocus = function(e) {
  this.show();
  this.$date.focus();
};

Picker.prototype.onChangeDate = function() {
  this.setDateTime({
    date: this.$date.val(),
    time: this.$time.val()
  });

  this.updateCalendar();
};

Picker.prototype.onChangeTime = function(e) {
  this.setDateTime({
    date: this.$date.val(),
    time: e.currentTarget.value.toUpperCase()
  });
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
