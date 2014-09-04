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
      time = obj.time,
      val, m;

  // Normalize minutes
  if (!(/\d:\d{2}/).test(time)) {
    time = time.replace(/(^\d+)/, "$1:00");
  }

  // Normalize spacing
  if (!(/\s[am|pm]/i).test(time)) {
    time = time.replace(/(am|pm)/i, " $1");
  }

  m = moment(date + ' ' + time);

  if (!m.isValid()) {
    var datetime = this.dateTime();
    m   = moment(datetime.date + ' ' + datetime.time);
  }

  val = m.format(this.options.dateFormat + ' ' + this.options.timeFormat);

  this.$el.val(val);

  if (this.$picker) {
    this.$picker.find('[name=date]').val(m.format(this.options.dateFormat));
    this.$picker.find('[name=time]').val(m.format(this.options.timeFormat));
  }
};

Picker.prototype.hasPrecedingPicker = function() {
  var dtp = this.$el.siblings('input').data(pluginName);
  if (dtp) return true;
};
