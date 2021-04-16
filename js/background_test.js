const page_data = {};
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

console.log("background running");
chrome.tabs.onActivated.addListener(tab => {
  console.log(tab); // gets the tab id and window id of tab
  chrome.tabs.get(tab.tabId, current_tab_info => {    //pass the id into get to get the info
    // console.log(current_tab_info);
    console.log(current_tab_info);
    console.log("tab.tabId", tab.tabId);
    current_tab_id = tab.tabId;

    page_data.url = current_tab_info.url;
    page_data.title = current_tab_info.title;
    chrome.tabs.executeScript(null, {file: "js/foreground.js"}, () => {
      console.log("setting data.");
      chrome.storage.local.set({"page_data": page_data.title});


      chrome.tabs.sendMessage(current_tab_id, {message: "check the storage"});
      console.log("executing script");
    });



    apiFetch();
    console.log("posting");
    apiPost(page_data);


  });
});


//get tab information
chrome.tabs.query({active: false}, function(tab) {
  // console.log(tab);
  // chrome.tabs.sendMessage(tab.id, { }, function(response) {
  //   console.log(response);
  // });
});





//aggy's code
// console.log('hello from first extension')
// var contextMenus = {};
// contextMenus.sayHello =
//     chrome.contextMenus.create(
//         {
//           "id": "sayHelloMenu",
//           "title":"Say Hello 👋"
//         },
//         function (){
//             if(chrome.runtime.lastError){
//                 console.error(chrome.runtime.lastError.message);
//             }
//         }
//     );
// chrome.contextMenus.onClicked.addListener(contextMenuHandler);
// function contextMenuHandler(info, tab){
//     console.log("info: ", info)
//     console.log("tab: ", tab)
//     if(info.menuItemId===contextMenus.sayHello){
//       // chrome.scripting.executeScript({
//       //   code: `window.prompt("Hello 👋");`
//       // })
//       // const tabId = getTabId();
//       const tabURL = tab.url;

//       console.log("got the url", tabURL);
//       chrome.tabs.executeScript({
//             file: 'foreground.js'
//           });
//     }
// }
