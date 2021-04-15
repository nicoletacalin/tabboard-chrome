// popup.js
console.log("popup.js running");

// variables
const active_tab_details = {};
let currentFolderId = 1;



//generic api post
apiPost = (out_data, item) => {
  console.log("out data deets", out_data);
  let attachUrl = "";
  let body = {};
  if(item === "new tab"){
    body = { tab: out_data };
    attachUrl = `${out_data.folder_id}/tabs`;
  }
  if(item === "new folder"){
    body = { folder: out_data };
    attachUrl = "";
  }

  // fetch("https://httpbin.org/post", {
  fetch(`http://localhost:3000/folders/${attachUrl}?format=json`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then((data) => {
    console.log("tab post return", data); // Look at local_names.default
  })
}


apiFetch = (fetchUrl) => {
  return new Promise ((resolve, reject) => {
    fetch(`http://localhost:3000/${fetchUrl}`)
    // fetch(`http://www.omdbapi.com/?s=matrix&apikey=adf1f2d7`)
    .then(response => response.json())
    .then((data)=>{
      console.log("api fetch response:", data);
      resolve(data);
    });
  });
}



// get folders when popup is clicked
console.log("getting folders");
let allFoldersData = apiFetch("folders.json");
allFoldersData.then(data => {
  data.forEach((folderData) => {
  //lists all folders from db
    let folderOption = document.createElement("option");
    folderOption.innerHTML = folderData.name

    folderOption.value = folderData.id;
    if (folderData.id !== 1) document.getElementById("select-folders").appendChild(folderOption);
  });
});

console.log("giving it a name :)");
chrome.tabs.query({currentWindow: true}, currentTabs => {
  currentTabs.forEach((tab) => {
    if(tab.active === true){
      document.getElementById('create-title-form').setAttribute("value", tab.title);
    }
  });


});




document.addEventListener('DOMContentLoaded', function() {
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

  const folderSelect = document.getElementById('select-folders');
  folderSelect.addEventListener('change', (folder)=>{

    // create a new folder
    if (folder.target.value === 'new-folder'){
      console.log("selected new folder");
      document.getElementById("new-folder-form").removeAttribute("class");
    }else{
      console.log("not new folder");
      document.getElementById("new-folder-form").setAttribute("class", "hidden");
    }

    // attach ID
    console.log("id: ", folder.target.value);
    currentFolderId = folder.target.value;
    console.log("current folder id: ", currentFolderId);

  });

  const folderCreate = document.getElementById('add-folder-btn');
  folderCreate.addEventListener('click', (folder)=>{
    const newFolder = {};
    newFolder.name = document.getElementById('create-folder').value;
    newFolder.user_id = 4;
    apiPost(newFolder, "new folder");
    console.log("folder created");

  });









  // save the tab to database
  const addTab = document.getElementById('add-tab-btn');
  addTab.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true}, currentTabs => {
    // data returns an array of current open tabs. URL in tab object
      console.log("current tabs", currentTabs);
      console.log("current folder id: ", currentFolderId);


      currentTabs.forEach((tab) => {
        if(tab.active === true)
        {


          active_tab_details.title = document.getElementById('create-title-form').value;
          active_tab_details.url = tab.url;
          active_tab_details.iconUrl = tab.favIconUrl;
          active_tab_details.folder_id = currentFolderId
          apiPost(active_tab_details, "new tab");
        }
      });
    });
  }, false);






}, false);







