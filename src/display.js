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
  var options = $.extend({},
    this.dateTime(),
    { val: this._val },
    this.options);

  return $(t(this.options.template, options));
};

Picker.prototype.closeAll = function() {
  $('#datepicker').detach();
};

Picker.prototype.close = function() {
  this.$picker.detach();
};
