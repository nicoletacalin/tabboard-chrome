document.querySelector('#sign-out').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'logout' }, function (response) {
        if (response === 'success') window.close();
    });
});

// document.querySelector('#test-btn').addEventListener('click', function () {
//   console.log('in test btn')
//     chrome.runtime.sendMessage({ message: 'isUserSignedIn' }, function (response) {
//         alert(response);
//     });
// });
