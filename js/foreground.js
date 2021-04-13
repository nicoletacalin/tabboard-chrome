
console.log("in folder hello world: ");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.message);
  if(request.message === "check the storage"){
    console.log("checking storage");
    chrome.storage.local.get("page_data", value => {
    console.log("page data", value);
    });
  }
});



