document.querySelector('#sign-in').addEventListener('click', function () {
  console.log('in sign in')
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response === 'success') window.close();
    });
});
document.querySelector('#test-btn').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'isUserSignedIn' }, function (response) {
        alert(response);
    });
});
