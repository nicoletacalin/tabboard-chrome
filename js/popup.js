// popup.js
console.log("popup.js running");
document.addEventListener('DOMContentLoaded', function() {
  var checkButton = document.getElementById('check');
  checkButton.addEventListener('click', function() {
   console.log("btn is working");
   alert("Hey your button is working!");

  }, false);
}, false);
