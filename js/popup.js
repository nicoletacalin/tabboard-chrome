// Chrome Extension for TABBOARD
// Devs: Xiway, Nico, Desmond, Marshal, Kevin
// start date: 12/4/21

// Tabboard - A productive tab management
// Chrome extension

// start of INITIALIZATIONS
  // popup.js
    console.log("popup.js running");

    let token, email;
    const baseUrl = 'https://taboard.herokuapp.com'
    // const baseUrl = 'http://localhost:3000'

    chrome.storage.local.get(['token', 'email'], function(result) {
      token = result.token
      email = result.email
      console.log({token});
      console.log({email});
    });

  // variables
    const active_tab_details = {};
    let currentFolderId;

  // flags for status checks
    let creatingFolder = false;

  //Debug variables
    let isSuccess = false;
// end of INITIALIZATIONS

// ----------------------- main -------------------------
// Execute tasks once the extension popup is loaded
document.addEventListener('DOMContentLoaded', function() {

  getFolders();                 // get folders from db when popup is clicked
  generateTitleForm();          // Auto fills title of form to current titile

  // When "+new folder" is selected, show the form to create a folder
  const folderSelect = document.getElementById('select-folders');
  folderSelect.addEventListener('change', (folder)=>{ showNewFolderForm(folder); });

  // ----------- start of: addTab event listener----------------
  // save the tab to database
  // getElementById can be buggy. switched to query selector
  // const addTab = document.getElementById('add-tab-btn');
  const addTab = document.querySelector('.add-tab-btn');
  addTab.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true}, currentTabs => {
      console.log("current tabs", currentTabs);

      // If "+new folder" is selected and submitted, POST new folder
      // Then POST tab to new folder
      // Else POST tab to selected folder
      if(creatingFolder){
        console.log("creating folder: ", creatingFolder);
        const newFolder = {};
        newFolder.name = document.getElementById('create-folder').value;
        const confirmedNewFolder = apiPost(newFolder, "new folder");

        // --------------------DEBUG--------------------
        // console.log("new folder?", confirmedNewFolder);
        // allFoldersData = apiFetch("folders.json");
        // ---------------------------------------------

        // after new folder is created then POST new tab
        // into created folder
        // Display Success popup if successful
        confirmedNewFolder.then(data=>{
          // call the addNewTab() function
          console.log("data:", data);
          const newFolderId = data.folder.id;
          console.log('inside confirmed new folder,new id:', newFolderId);
          isSuccess = addNewTab(currentTabs, newFolderId);
          if(isSuccess) document.getElementById("success-popup").removeAttribute("class");
        });
      }else{
        // add tab to folders, show success popup on success
        console.log('create tab on existing folder');
        isSuccess = addNewTab(currentTabs, currentFolderId);
        document.getElementById("success-popup").removeAttribute("class");
      }
    });
  }, false);
  // ------------- end of: addTab event listener----------------

  // hides the popup "sucessful popup" on btn click
  // const closePopupBtn = document.querySelector('.close-sucess-popup');
  const closePopupBtn = document.getElementById('close-success-popup');
  closePopup(closePopupBtn);

  // button saves ALL tabs to unsavded folder
  // Saved tabs only got to the default unsaved tabs folder
  const masterSaveBtn = document.getElementById("master-save-tabs-btn");
  masterSave(masterSaveBtn);

  const closeExtensionPopup = document.getElementById("close-success-popup");
  closePopup(closeExtensionPopup);

  //unknown bug keep ID and class
  const goHome = document.querySelector(".goHome");
  const goHome1 = document.getElementById("goHome");
  goToTaboard(goHome);
  goToTaboard(goHome1);
}, false);
// --------------------end of main ------------------------



// ---------------------- functions -----------------------
const masterSave = (masterSaveBtn) => {
  console.log({masterSaveBtn}); // aggy's debug
  if (masterSaveBtn) {
    masterSaveBtn.addEventListener('click', ()=>{
      isSuccess = saveAllTabs();
      if(isSuccess) document.getElementById("success-popup").removeAttribute("class");
    });
  }
}

const closePopup = (closePopupBtn) => {
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", ()=>{
      isSuccess = false;    // for debug
      window.close();
    });
  }
}

const goToTaboard = (home) => {
  if (home) {
    home.addEventListener('click', ()=>{
      console.log("clicking");
      chrome.tabs.create({url: baseUrl}, ()=>{console.log("opened");});
    });
  }
}

// collects all the tabs in window and Formats the data for POST
// calls apiPostAllTabs() for POST
const saveAllTabs = () => {
  let folderId;
  const folder = document.getElementById('select-folders')
  console.log(111111, folder.value)
  if (folder && folder.value == 'new-folder') {
    console.log('creating new folder in saveAllTabs')
    const newFolder = {};
    newFolder.name = document.getElementById('create-folder').value;

    apiPost(newFolder, "new folder").then(data=>{
      folderId = data.folder.id
      console.log({folderId})
      consolidateAllTabsToBody(folderId);
    });
  } else {
    folderId = currentFolderId
    console.log({folderId})
    consolidateAllTabsToBody(folderId);
  }
  return true
}

const consolidateAllTabsToBody = (folderId) => {
  let allTabsArray = [];

  chrome.tabs.query({currentWindow: true}, currentTabs => {
    console.log("current tabs: ", currentTabs);
    currentTabs.forEach((tab) => {
      const singleTab = {};
      singleTab.url = tab.url;
      singleTab.title = tab.title;
      singleTab.icon = tab.favIconUrl;
      singleTab.folder_id = folderId;
      allTabsArray.push(singleTab);
    });
    apiPostAllTabs(allTabsArray, folderId).then(res=> {
      allTabsArray = [];
      return true;
    })
  });
  // flush array to avoid stacking data

}

// Receives formatted data and POST to a non-rails-default route
// saveall. Saved tabs only got to the default unsaved tabs folder
// function is only called by saveAllTabs()
const apiPostAllTabs = (out_data, folder_id) => {
  return new Promise ((resolve, reject) => {
    // console.log("out data deets", out_data);
    let attachUrl = "";
    let body = {};
    // create tabs or folders?
    body = { tabs: {content: out_data} };
    console.log("body", body);
    // fetch("https://httpbin.org/post", {
    fetch(`${baseUrl}/folders/${folder_id}/saveall?format=json`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email,
        'X-User-Token': token
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log("post return", data); // Look at local_names.default
        resolve(data);
      });
  });
}

// function formats current tab for posts then calls apiPost
const addNewTab = (currentTabs, currentFolderId) => {
  console.log('inside addNewTab function')
  const active_tab_details = {};
  currentTabs.forEach((tab) => {
    if(tab.active === true){
      active_tab_details.title = document.getElementById('create-title-form').value;
      active_tab_details.url = tab.url;
      active_tab_details.icon = tab.favIconUrl;
      active_tab_details.folder_id = currentFolderId
      apiPost(active_tab_details, "new tab");
    }
  });
  return true;
}


// posts either a creation of a new tab or a new folder
apiPost = (out_data, item) => {
  return new Promise ((resolve, reject) => {
    console.log("out data deets", out_data);
    let attachUrl = "";
    let body = {};
    console.log("body", body);
    // create tabs or folders?
    if(item === "new tab"){
      body = { tab: out_data };
      attachUrl = `${out_data.folder_id}/tabs`;
    }
    if(item === "new folder"){
      body = { folder: out_data };
      attachUrl = "";
    }

    // fetch("https://httpbin.org/post", {
    fetch(`${baseUrl}/folders/${attachUrl}?format=json`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email,
        'X-User-Token': token
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log("post return", data); // Look at local_names.default
        resolve(data);
      });
  });
}


// Calls apiFetch() then lists the folders for user selection
// INCOMPLETE: fetch folders from authorized user only
getFolders=()=>{
  console.log("getting folders");
  let allFoldersData = apiFetch("folders.json");
  const folderWrapper = document.getElementById("select-folders");
  let optionsStr = '';
  allFoldersData.then(data => {
    console.log(123456, data)
    data.forEach((folderData, index) => {
    //lists all folders from db
      // Aggy: simplify code by appending all the options to a string
      if (index === 0) {
        currentFolderId = folderData.id
        console.log({currentFolderId})
        optionsStr += `<option selected value='${folderData.id}'>${folderData.name}</option>`
      } else {
        optionsStr += `<option value='${folderData.id}'>${folderData.name}</option>`
      }
    });
    console.log({optionsStr})
    folderWrapper.insertAdjacentHTML('beforeend', optionsStr)
  });
}

// Fetches all the folders available from DB
// function is only called by getFolders()
apiFetch = (fetchUrl) => {
  return new Promise ((resolve, reject) => {
    fetch(`${baseUrl}/${fetchUrl}`, {
      headers: {
        'X-User-Email': email,
        'X-User-Token': token
      }
    })
    // fetch(`http://www.omdbapi.com/?s=matrix&apikey=adf1f2d7`)
    .then(response => response.json())
    .then((data)=>{
      console.log("api fetch response:", data);
      resolve(data);
    });
  });
}

// When "➕ New Folder" is selected the new folder form is shown
showNewFolderForm = (folder) => {
    // create a new folder
    if (folder.target.value === 'new-folder'){
      document.getElementById("new-folder-form").removeAttribute("class");
      creatingFolder = true;
    }else{
      document.getElementById("new-folder-form").setAttribute("class", "hidden");
      creatingFolder = false;
    }

    // attach ID
    currentFolderId = folder.target.value;
    console.log("current folder id: ", currentFolderId);
}

// Sets the default title for POSTing which can be overwritten
generateTitleForm = () =>{
  chrome.tabs.query({currentWindow: true}, currentTabs => {
    currentTabs.forEach((tab) => {
      // selects current tab only
      if(tab.active === true){
        document.getElementById('create-title-form').setAttribute("value", tab.title);
      }
    });
  });
}

