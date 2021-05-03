console.log("background running");
const page_data = {};
let all_tabs = [];
let current_tab_id = 0;
let user_signed_in = false;
let user_id = "";

// const baseUrl = 'http://localhost:3000'
const baseUrl = 'https://taboard.herokuapp.com'

const CLIENT_ID = encodeURIComponent('971672027408-29haths710vq9bc08h76d34tk86ija2b.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token');
// COMMENT: OLD KEY BEFORE PUSHING ON CHROME WEB STORE
// const REDIRECT_URI = encodeURIComponent('https://bhkodjoknpgpkejmojjopomkndbcmhcf.chromiumapp.org');
const REDIRECT_URI = encodeURIComponent('https://nchjighemnpaocgbecjeokgejnjbhpgm.chromiumapp.org');
const STATE = encodeURIComponent('jfkls3n');
const SCOPE = encodeURIComponent('email');
const PROMPT = encodeURIComponent('consent');

function create_oauth2_url(){
  let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
  let url =
  `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&prompt=${PROMPT}&nonce=${nonce}`;
  console.log('URL', url);
  return url;
  // https://accounts.google.com/o/oauth2/v2/auth?
}


function is_user_signed_in(){
  return user_signed_in
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
    if(is_user_signed_in()) {
        console.log('User is already signed in.');
      } else {
        chrome.identity.launchWebAuthFlow({
          url: create_oauth2_url(),
          interactive: true
        }, function (redirect_url) {
          let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') + 9);
          id_token = id_token.substring(0, id_token.indexOf('&'));

          const user_info = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(id_token.split(".")[1]));
          console.log('USER INFO =', user_info)

          let body = {user: user_info};
          fetch(`${baseUrl}/users/login_from_ext?format=json`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
            .then(response => {
              console.log(response)
              return response.json()
            })
            .then((data)=>{
              console.log("api fetch response:", data);
              // user_id = data.id
              // chrome.storage.local.set({user_id});
              chrome.storage.local.set({token: data.token, email: data.user.email});
               // console.log('saved token:' + user_id)
              // chrome.storage.local.get(['user_id'], function(result) {
              //   console.log('USER_ID GET IS ' + result.user_id);
              //   });
            });

          if ((user_info.iss === 'https://accounts.google.com' || user_signed_in.iss === 'accounts.google.com')
            && user_info.aud ===  CLIENT_ID) {

              chrome.browserAction.setPopup({ popup: './popup.html'}, function (){
                user_signed_in = true;
                sendResponse('success');
              });
          } else {
            console.log(" Couldn't authenticate");
          }

        });

        return true;
    }
  } else if (request.message === 'logout'){
      chrome.browserAction.setPopup({ popup: './popup-sign-in.html'}, function (){
      user_signed_in = false;
      sendResponse('success');
  });
    return true;
  }
    else if (request.message === 'isUserSignedIn'){
      sendResponse(is_user_signed_in());
  }

});

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
