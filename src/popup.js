document.addEventListener('DOMContentLoaded', function() {  
  $('#sections').height($('#options').height());
  $('section').height($('#options').height());
  $('section#info').height($('#options').height()+1);

  var analytics_method = 'none';
  var unwants = 0;

  chrome.storage.sync.get('unwants', function(items) {
    unwants = items.unwants
    $('#unwants').text(unwants);
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "check_analytics"}, function(response) {
      analytics_method = response.message;
    });
  });

  $('.dnw-option').click(function() {
    var reason = $(this).data('reason');

    if (analytics_method != "none") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "send_analytics", reason: reason});
      });
    } else {
      // handle no analytics
    }

    show_section('sending');
    unwants++;
    $('#unwants').text(unwants);
    chrome.storage.sync.set({
      unwants: unwants
    });
  });

  $('.bar-option').click(function() {
    var option = $(this).data('option');
    show_section(option);
  });

  $('.btn').click(function() {
    var which = $(this).data('return');
    show_section(which);
  });

  $('#reset').click(function() {
    unwants = 0;
    $('#unwants').text(unwants);
    $('#settings span').show();
    chrome.storage.sync.set({
      unwants: unwants
    });
  });
});

function show_section(section) {
  $('#sections').animate({scrollLeft: $('#sections').scrollLeft() + $('section#' + section).position().left}, 500, 'smooth');
  $('#settings span').hide();
}

$.easing.smooth = function (x, t, b, c, d) {
  if ((t/=d/2) < 1) return c/2*t*t + b;
  return -c/2 * ((--t)*(t-2) - 1) + b;
};