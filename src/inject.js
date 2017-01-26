chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  switch (msg.action) {
    case 'check_analytics':
      var dnw_injection = document.getElementById('dnw_script');
      if (dnw_injection) dnw_injection.parentNode.removeChild(dnw_injection);
      var script = document.createElement('script');
      script.id = 'dnw_script';

      var code = String.raw`
        document.body.className = document.body.className.replace(/dnw-gaq|dnw-ga|dnw-none/g, "");
        if (typeof _gaq !== 'undefined') document.body.className += " dnw-gaq";
        else if (typeof ga !== 'undefined') document.body.className += " dnw-ga";
        else document.body.className += " dnw-none";
      `;

      script.innerHTML = code;
      document.body.appendChild(script);

      var analytics_method = "none";
      analytics_method = ($('body').hasClass('dnw-gaq')) ? "gaq" : analytics_method;
      analytics_method = ($('body').hasClass('dnw-ga')) ? "ga" : analytics_method;

      sendResponse({message: analytics_method});
      break;

    default:
      sendResponse({message: 'this is what it sounds like when doves cry'});
      break;
  }
});

/*
if (dnw_analytics == 'gaq') {
  sendResponse({message: "it's gaq"});
  ga.push([
    '_set',
    'campaignParams',
    'utm_campaign=CAMPAIGN&utm_source=SOURCE&utm_medium=MEDIUM'
  ]);
} else if (dnw_analytics == 'ga') {
  sendResponse({message: "it's ga"});
  ga('set', 'campaignName', 'mygrandcampaign');
  ga('set', 'campaignSource', 'google');
  ga('set', 'campaignMedium', 'cpc');
  //Set/override the optional parameters
  ga('set', 'campaignKeyword', 'Blue Shoes');
  ga('set', 'campaignContent', 'content');
  //send the pageview after variables are set
  ga('send', 'pageview');
} else {

}
*/