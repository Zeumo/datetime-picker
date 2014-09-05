Picker.prototype.show = function() {
  var elBottom = this.$el.height() + this.$el.offset().top;
  var elLeft   = this.$el.offset().left;

  this.$picker.css({
    top: elBottom + 10 + 'px',
    left: elLeft + 'px',
    position: 'absolute'
  });

  this.closeAll();
  this.$body.append(this.$picker);
};

Picker.prototype.closeAll = function() {
  $('#datepicker').detach();
};

Picker.prototype.close = function() {
  this.$picker.detach();
};

Picker.prototype.done = function(e) {
  e.preventDefault();
  this.close();
};
