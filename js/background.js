console.log("background running");
const page_data = {};
let all_tabs = [];
let current_tab_id = 0;
let user_signed_in = false;

const CLIENT_ID = encodeURIComponent('971672027408-2usnplb9rd47i5h70cfngfv3de7qu9p5.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token');
const REDIRECT_URI = encodeURIComponent('http://localhost:3000/omniauth/google_oauth2/callback');
const STATE = encodeURIComponent('jfkls3n');
const SCOPE = encodeURIComponent('openid');
const PROMPT = encodeURIComponent('consent');

function create_oauth2_url(){
  let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
  let url =
  `https://accounts.google.com/o/oauth2/v2/auth
  ?client_id=${CLIENT_ID}
  &response_type${RESPONSE_TYPE}
  &redirect_uri=${REDIRECT_URI}
  &state=${STATE}
  &scope=${SCOPE}
  &prompt=${PROMPT}
  &nonce=${nonce}`
  ;
  console.log('URL', url);
  return url;
}

function is_user_signed_in(){
  return user_signed_in
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
    if(is_user_signed_in()) {
        console.log('User is already signed in.');
      } else {
        chrome.identity.getAuthToken({
    interactive: true
}, function(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    var x = new XMLHttpRequest();
    x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    x.onload = function() {
        alert(x.response);
    };
    x.send();
});
        // chrome.identity.launchWebAuthFlow({
        //   url: create_oauth2_url(),
        //   interactive: true
        // }, function (redirect_url){
        //   console.log(redirect_url);
        //   sendResponse('Success');
        // });

        return true;
      }
  } else if (resquest.message === 'logout'){

  }
  else if (resquest.message === 'isUserSignedIn'){

  }
})

apiFetch = () =>{
    fetch(`http://www.omdbapi.com/?s=matrix&apikey=adf1f2d7`)
    .then(response => response.json())
    .then((data)=>{
      console.log("api fetch response:", data);
    });
}

apiPost = (outbound_data) => {
  fetch("https://httpbin.org/post", {
    method: "POST",
    body: JSON.stringify({"data obj": outbound_data})
  })
    .then(response => response.json())
    .then((data) => {
    console.log("post return", data); // Look at local_names.default
  });
}


chrome.tabs.query({currentWindow: true}, currentTabs => {
// data returns an array of current open tabs. URL in tab object
  console.log("current tabs", currentTabs);


});


chrome.tabs.onCreated.addListener(newTab => {
  console.log("new tab:", newTab);

});

chrome.tabs.onUpdated.addListener(updatedTab => {
  console.log("updated tab:", updatedTab);

});

// chrome.identity.getAuthToken({
//     interactive: true
// }, function(token) {
//     if (chrome.runtime.lastError) {
//         alert(chrome.runtime.lastError.message);
//         return;
//     }
//     var x = new XMLHttpRequest();
//     x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
//     x.onload = function() {
//         alert(x.response);
//     };
//     x.send();
// });




// chrome.tabs.onUpdated.addListener(tab => {
//   console.log(tab); // gets the tab id and window id of tab
//   chrome.tabs.get(tab.tabId, current_tab_info => {    //pass the id into get to get the info
//     // console.log(current_tab_info);
//     console.log(current_tab_info);
//     console.log("tab.tabId", tab.tabId);
//     current_tab_id = tab.tabId;

//     page_data.url = current_tab_info.url;
//     page_data.title = current_tab_info.title;
//     chrome.tabs.executeScript(null, {file: "js/foreground.js"}, () => {
//       console.log("executing script");
//       console.log("setting data.");
//       chrome.storage.local.set({"page_data": page_data.title});

//       console.log("sending message")
//       chrome.tabs.sendMessage(current_tab_id, {message: "check the storage"});
//     });
//   });
// });
