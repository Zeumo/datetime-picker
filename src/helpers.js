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
      m    = moment([date, time].join(' ')),
      val, datetime;

  // Reset the moment object if we got an invalid date
  if (!m.isValid()) {
    datetime = this.dateTime();
    m = moment([datetime.date, datetime.time].join(' '));
  }

  val = m.format([this.options.dateFormat, this.options.timeFormat].join(' '));

  this.options.outputTo.val(val);
  this.$date.val(m.format(this.options.dateFormat));
  this.$time.val(m.format(this.options.timeFormat));

  this.options.onChange();
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

Picker.prototype.hasPrecedingPicker = function() {
  var dtp = this.$el.siblings('input').data(pluginName);
  if (dtp) return true;
};
