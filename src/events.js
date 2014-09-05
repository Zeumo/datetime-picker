Picker.prototype.delegateEvents = function(events, $el) {
  _(events).each(function(method, key) {
    var match     = key.match(/^(\S+)\s*(.*)$/);
    var eventName = match[1];
    var handler   = match[2];
    method        = _.bind(method, this);

    $el.on(eventName, handler, method);
  }, this);
};

Picker.prototype.handlePickerClose = function() {
  $(document).on('click', _.bind(function(e) {
    var isInput  = e.target.tagName === 'INPUT',
        isDetached = !$(document).find(e.target).length,
        isPicker = !!$(e.target).closest('#datepicker').length;

    if (isInput || isDetached || isPicker) return;
    this.close();
  }, this));
};
