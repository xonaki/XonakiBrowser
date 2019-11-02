const {
  app,
  BrowserWindow,
  ipcMain,
  protocol 
} = require('electron');

const path = require('path');
var Common = require("./lib/common");
Common.setupEnvironment();

var db = require("./lib/db");

const {autoUpdater} = require("electron-updater");
const BrowserPageUrl = `file:///${__dirname}/views/browser.html`;
const UpdateTabPage = `file:///${__dirname}/views/updateBrowser.html`;
const AboutWindowPage = `file:///${__dirname}/views/about.html`;

let mainWindow;
let modalWindow;

app.on('ready', () => {

  db.setup();  
  
  autoUpdater.checkForUpdates();
  mainWindow = new BrowserWindow(Common.FrameLessWindowOption);

  mainWindow.hide();
  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);
  mainWindow.show();
  mainWindow.loadURL(BrowserPageUrl);
  mainWindow.on('close', () => { mainWindow = null });
  
  protocol.registerFileProtocol('xonaki', (request, callback) => {
    const url = request.url.substr(9);  
    //mainWindow.webContents.send("enable-node", url);    
    callback({ path: path.normalize(`${__dirname}/views/internal/${url}.int.html`) });
  }, (error) => {    
    if (error){ 
      console.error('Failed to register protocol')
    }    
  });
  
  Common.loadGlobalCache(db);

});

ipcMain.on('close-me', (evt, arg) => {
  app.quit();
});

ipcMain.on('update-history-cache', (evt, arg) => {
  Common.loadGlobalCache(db);
});

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 24 * 60 * 60 * 1000);

autoUpdater.on('update-downloaded', (info) => {
  console.log("update found");  
  
  modalWindow = new BrowserWindow(Common.ModalWindowOption);
  modalWindow.on('close', () => { modalWindow = null });
  modalWindow.setMenuBarVisibility(false);
  modalWindow.loadURL(UpdateTabPage);
});

ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
});

ipcMain.on("go-to-home", (event, arg) => {
  mainWindow.loadURL(BrowserPageUrl);  
});

ipcMain.on("show-about-window", (event, arg) => {
  Common.ModalWindowOption.parent = mainWindow;
  Common.ModalWindowOption.width = 600;
  var aboutWindow = new BrowserWindow(Common.ModalWindowOption);
  aboutWindow.on('close', () => { aboutWindow = null });
  aboutWindow.setMenuBarVisibility(false);
  aboutWindow.loadURL(AboutWindowPage);
  aboutWindow.show();  
});

