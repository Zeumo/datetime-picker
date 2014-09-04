Picker = function(el, options) {
  this.$el   = $(el);
  this.$body = $('body');

  this.options = _.extend({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    template: JST.datepicker,
  }, options);

  this.events = {
    'focus': this.show
  };

  this.pickerEvents = {
    'click .done': this.done,
    'change [name=date]': this.onChangeDate,
    'change [name=time]': this.onChangeTime
  };

  this.$picker = $(this.options.template(this.dateTime()));

  this.setDateTime(this.dateTime());

  this.delegateEvents(this.events, this.$el);
  this.delegateEvents(this.pickerEvents, this.$picker);
  this.handleDocumentClose();

  this.render();
};
