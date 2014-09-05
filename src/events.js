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
  var self = this;

  var handler = function(e) {
    var isEl       = !!$(e.target).closest(self.$el).length,
        isDetached = !$(document).find(e.target).length,
        isPicker   = !!$(e.target).closest('#datepicker').length;

    if (isEl || isDetached || isPicker) return;
    this.close();
  };

  $(document).on('click', _.bind(handler, this));

  $(document).on('keyup', _.bind(function(e) {
    // Esc
    if (e.which === 27) this.close();
  }, this));
};
