console.log("background running");
const page_data = {};
let all_tabs = [];
let current_tab_id = 0;

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
