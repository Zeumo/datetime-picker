Picker.prototype.delegateEvents = function(events, $el) {
  _(events).each(function(method, key) {
    var match     = key.match(/^(\S+)\s*(.*)$/);
    var eventName = match[1];
    var handler   = match[2];
    method        = _.bind(method, this);

    $el.on(eventName, handler, method);
  }, this);
};

Picker.prototype.handleDocumentClose = function() {
  $(document).on('click', _.bind(function(e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.target.tagName === 'TD') return;

    if (!$(e.target).closest('#datepicker').length) {
      this.close();
    }
  }, this));
};

Picker.prototype.onChangeDate = function(e) {
  this.setDateTime({
    date: e.currentTarget.value,
    time: this.$picker.find('[name=time]').val()
  });

  this.updateCalendar();
};

Picker.prototype.onChangeTime = function(e) {
  this.setDateTime({
    date: this.$picker.find('[name=date]').val(),
    time: e.currentTarget.value.toUpperCase()
  });
};
