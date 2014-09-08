$(function() {
  $('.date-range-picker input').picker();

  $('.button-picker a').picker({
    outputTo: $('.button-picker input')
  });

  $('.prefill-picker input').picker();
});
