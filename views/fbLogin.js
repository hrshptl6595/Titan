window.fbAsyncInit = function() {
  FB.init({
    appId: '393929487483387',
    xfbml: true,
    version: 'v2.3'
  });
  FB.getLoginStatus(function(response){
    if(response.status === "connected")
      console.log("connected!");
    else if(response.status === "not_authorized")
      console.log("not authorized!");
    else if(response.status === "unknown")
      console.log("unknown!");
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
