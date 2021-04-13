// popup.js
console.log("popup.js running");
// document.addEventListener('DOMContentLoaded', function() {
//   var checkButton = document.getElementById('check');
//   checkButton.addEventListener('click', function() {
//    console.log("btn is working");
//    alert("Hey your button is working!");

//   }, false);
// }, false);

document.addEventListener('DOMContentLoaded', function() {
  var checkButton = document.getElementById('check');
  checkButton.addEventListener('click', function() {

    chrome.tabs.query({currentWindow: true}, currentTabs => {
    // data returns an array of current open tabs. URL in tab object
    console.log("current tabs", currentTabs);


});






  }, false);
}, false);
