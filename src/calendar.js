Picker.prototype.initializeCalendar = function() {
  this.calendarEvents = {
    'changeDate': this.onCalendarChangeDate
  };

  var $calendar = this.$picker.find('.calendar').datepicker({
    startDate: '-0d'
  });

  $calendar.datepicker('update', this.$picker.find('[name=date]').val());

  this.delegateEvents(this.calendarEvents, $calendar);
};

Picker.prototype.onCalendarChangeDate = function(e) {
  var date = e.format();
      $date = this.$picker.find('[name=date]'),
      $time = this.$picker.find('[name=time]');

  if (date) {
    $date.val(date);

    this.setDateTime({
      date: date,
      time: $time.val()
    });
  }
};

