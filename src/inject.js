(function() {
  var analytics_method = "none";

  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    switch (msg.action) {
      case 'check_analytics':
        var code = String.raw`
          document.body.className = document.body.className.replace(/dnw-gaq|dnw-ga|dnw-none/g, "");
          if (typeof _gaq !== 'undefined') document.body.className += " dnw-gaq";
          else if (typeof ga !== 'undefined') document.body.className += " dnw-ga";
          else document.body.className += " dnw-none";
        `;
        inject_script(code);

        analytics_method = ($('body').hasClass('dnw-gaq')) ? "gaq" : analytics_method;
        analytics_method = ($('body').hasClass('dnw-ga')) ? "ga" : analytics_method;

        sendResponse({message: analytics_method});
        break;

      case 'send_analytics':
        if (analytics_method == 'gaq') {
          var code = String.raw`
            _gaq.push([
              '_set',
              'campaignParams',
              'utm_campaign=` + msg.reason + `&utm_source=DO%20NOT%20WANT!&utm_medium=complaint'
            ]);
            _gaq.push(['_trackPageview']);
          `;
        } else if (analytics_method == 'ga') {
          var code = String.raw`
            ga('set', 'campaignName', '` + msg.reason + `');
            ga('set', 'campaignSource', 'DO%20NOT%20WANT!');
            ga('set', 'campaignMedium', 'complaint');
            ga('send', 'pageview');
          `;
        }
        inject_script(code)
        sendResponse({message: 'oooh weee, can dooo'});
        break;

      default:
        sendResponse({message: 'this is what it sounds like when doves cry'});
        break;
    }
  });

  function inject_script(code) {
    var dnw_injection = document.getElementById('dnw_script');
    if (dnw_injection) dnw_injection.parentNode.removeChild(dnw_injection);
    var script = document.createElement('script');
    script.id = 'dnw_script';
    script.innerHTML = code;
    document.body.appendChild(script);
  }
})();