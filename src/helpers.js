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

  this.val = moment([date, time].join(' '));

  // Reset the moment object if we got an invalid date
  if (!this.val.isValid()) {
    datetime = this.dateTime();
    this.val = moment([datetime.date, datetime.time].join(' '));
  }

  this.$date.val(this.val.format(this.options.dateFormat));
  this.$time.val(this.val.format(this.options.timeFormat));
};

Picker.prototype.outputDateTime = function() {
  formattedVal  = this.formattedVal();
  this.savedVal = this.val;

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
  return this.val.format([this.options.dateFormat, this.options.timeFormat].join(' '));
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
