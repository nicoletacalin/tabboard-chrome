# TaBoard Chrome Extension 

This is a final project for Le Wagon Bootcamp (Batch #573).

This chrome extension enables you to save one or all your open tabs in TaBoard web application. 
TaBoard Chrome Extension is developed with HTML, CSS and JavaScript.

## Features

- Login with Google Oauth2
- Save the current tab
- Save all tabs open in your browser
- Select a specific folder to save your tab
- Create a folder and save your tab(s)

## Screenshot
![Extension screenshot](https://res.cloudinary.com/xiway/image/upload/v1621088058/Extension_rfyciq.gif)

## Setup 

Start by cloning the repository: 

```
git clone git@github.com:nicoletacalin/tabboard_chrome.git
```

On your chrome browser, go on ```chrome://extensions```

Enable the developer mode and click on ```Load Unpacked```

<img src="https://res.cloudinary.com/xiway/image/upload/v1621088980/Load_unpacked_copie_qvkpzo.png" width="500" height="340">

Select the TaBoard Chrome extension repository.

## Structure

- All JavaScript code is in ```js``` folder: 
  - Sign in function: ```js/popup-script.js```
  - Sign out function: ```js/popup-signed-in-script.js```
  - Google Oauth2 function: ```js/background.js```
  - Save tabs functions: ```js/popup.js```
  
- HTML code: 
  - Sign-in page: ```popup-sign-in.html```
  - Save tabs page: ```popup.html```
  
- All CSS is in ```style.css```

## Usage 

For every code change from your code editor, you will need to reload the chrome extension in ```chrome://extensions``` developer mode. 

For debugging, you can have access to the console by clicking on ```background page```

<img src="https://res.cloudinary.com/xiway/image/upload/v1621088987/Load_unpacked_debogging_syltxh.png" width="500" height="340">

You can use the WebApp for further testings [here](https://github.com/XiwayB/TabBoard)

## Project Status

Project is: _complete_ ✅

Some refactoring needs to be done 🤓

## Acknowledgements
- This application is developed by those amazing developers 🙌🏻: 
  - [Desmond](https://github.com/barrrricade), [Kevin](https://github.com/kkurcz), [Marshall](https://github.com/Marshall-Hao), [Nico](https://github.com/nicoletacalin) and [Xiway](https://github.com/XiwayB)

## Contributions / Contact
The chrome extension depends on the web application. The later is still in an early stage, if you would like to contribute to it, feel free to contact me first: [![Gmail Badge](https://img.shields.io/badge/xiway.banh-D14836?style=flat-square&logo=Gmail&logoColor=white&link=mailto:xiway.banh@gmail.com)](mailto:xiway.banh@gmail.com) 
