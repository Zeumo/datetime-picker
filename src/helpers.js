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

Picker.prototype.isStartPicker = function() {
  return !!this.$endPicker;
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

Picker.prototype.endPickerDate = function() {
  return new Date(this.$endPicker.val());
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

Picker.prototype.setTimeToBeforeEndPicker = function() {
  var endTime          = this.endPickerDate();
  var newStartTime     = moment(endTime).subtract(this.options.defaultTimeRange);
  var currentStartTime = this.selectedMoment()

  // Don't update dateTime if the currentStartTime is already < than endTime
  if (currentStartTime < endTime) return;

  if (newStartTime.isValid()) {
    this.setDateTime({
      date: newStartTime.format(this.options.dateFormat),
      time: newStartTime.format(this.options.timeFormat)
    });
    this.outputDateTime();
    this.updateCalendar();
  }
};
