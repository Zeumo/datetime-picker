Picker.prototype.show = function() {
  var elBottom = this.$el.outerHeight(true) + this.$el.offset().top,
      elLeft   = this.$el.offset().left;

  this.$picker.find('.remove').toggleClass('hidden', !this.savedVal);

  this.$picker.css({
    top: elBottom + 5 + 'px',
    left: elLeft + 'px',
    position: 'absolute'
  });

  this.closeAll();
  this.$body.append(this.$picker);
};

Picker.prototype.render = function() {
  return $(this.options.template(
    _.extend({},
      this.dateTime(),
      { val: this.val },
      this.options)
  ));
};

Picker.prototype.closeAll = function() {
  $('#datepicker').detach();
};

Picker.prototype.close = function() {
  this.$picker.detach();
};
