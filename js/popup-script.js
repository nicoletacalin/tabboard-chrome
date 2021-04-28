document.querySelector('#sign-in').addEventListener('click', function () {
  console.log('in sign in')
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response === 'success') window.close();
    });
    // comment: opens a new tab (the webapp) upon sign in on extension for good ux
    var action_url = "https://taboard.herokuapp.com/users/sign_in";
    setTimeout(() => {
      chrome.tabs.create({ url: action_url });
    }, 2000);

});
// document.querySelector('#test-btn').addEventListener('click', function () {
//     console.log('in test btn')
//     chrome.runtime.sendMessage({ message: 'isUserSignedIn' }, function (response) {
//         alert(response);
//     });
// });
