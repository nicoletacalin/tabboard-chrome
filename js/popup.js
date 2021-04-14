// popup.js
console.log("popup.js running");

// variables
const active_tab_details = {};




// document.addEventListener('DOMContentLoaded', function() {
//   var checkButton = document.getElementById('check');
//   checkButton.addEventListener('click', function() {
//    console.log("btn is working");
//    alert("Hey your button is working!");

//   }, false);
// }, false);
// url: out_data.url, title: out_data.title, icon: out_data.iconUrl

apiPost = (out_data) => {
  console.log("out data deets", out_data);
  const body = { tab: out_data }
  // fetch("https://httpbin.org/post", {
  fetch("http://localhost:3000/folders/1/tabs?format=json", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then((data) => {
    console.log("post return", data); // Look at local_names.default
  })
}

document.addEventListener('DOMContentLoaded', function() {
  var checkButton = document.getElementById('add-tab-btn');
  // var login = document.getElementById('login-btn');

  // if (login) {
  //   login.addEventListener('click', () => {
  //     fetch("http://localhost:3000/users/auth/google_oauth2", {
  //       method: 'POST'
  //     }).then(res => {
  //       console.log(11111, res)
  //     })
  //   })
  // }

  checkButton.addEventListener('click', function() {

    chrome.tabs.query({currentWindow: true}, currentTabs => {
    // data returns an array of current open tabs. URL in tab object
      console.log("current tabs", currentTabs);

      currentTabs.forEach((tab) => {
        if(tab.active === true)
        {
          active_tab_details.url = tab.url;
          active_tab_details.title = tab.title;
          active_tab_details.iconUrl = tab.favIconUrl;
          apiPost(active_tab_details);

        }

      });

    });



  }, false);
}, false);







