$(function() {
  $('.date-range-picker input').picker();

  $('.button-picker a').picker({
    outputTo: $('.button-picker input')
  });

  $('.prefill-picker input').picker();

  $('.button-picker a').on('datepicker.remove', function(e, el) {
    $(el).val('');
  });

  $('input').on('datepicker.remove', function(e) {
    $(this).val('');
  });
});
