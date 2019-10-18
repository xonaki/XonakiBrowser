const fs = require('fs');
const path = require('path');

const appName = "XonakiBrowser"
const appDataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share");
const databaseFilepath = path.join(appDataFolder,appName,"data/db/xonaki.browser.db");

function createFile(filename) {
    fs.open(filename,'r',function(err, fd){
      if (err) {
        fs.writeFile(filename, '', function(err) {
            if(err) {
                console.log(err);
            }
            console.log("The file was saved!");
        });
      } else {
        console.log("The file exists!");
      }
    });
};

module.exports =  Object.freeze({
    AppTitle: "Xonaki Browser",
    AppName: appName,
    DatabaseFilePath: databaseFilepath,
    AppDataFolder: appDataFolder,
    ModalWindowOption : {
        center: true,    
        maximizable: true,
        parent: null,
        modal: true,
        alwaysOnTop: true,
        width: 500,
        height: 300,
        minHeight: 300,
        minWidth: 300,
        setMenuBarVisibility: false,    
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            allowRunningInsecureContent: true,
            webSecurity: true      
        },
        icon: __dirname + '/../resources/app.ico'
    },
    FrameLessWindowOption : {
        center:true,    
        maximizable:true, 
        frame:false,   
        minHeight: 300,
        minWidth: 300,
        webPreferences: {
            nodeIntegration: true,
            webviewTag:true,
            allowRunningInsecureContent:true,
            webSecurity:true      
        },
        icon: __dirname + '/../resources/app.ico'
    },
    get_domain_from_url: function (url) {
        var result
        var match
        if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
            result = match[1]
            if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
                result = match[1]
            }
        }
        return result
    },
    get_current_date_time: function(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
    },
    createFile: function(fileName){ createFile(fileName); },
    setupEnvironment: function(){
        var appDataFolder =  process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share");
        var dbFolder = path.join(appDataFolder,appName,"data","db");
        
        if ( fs.existsSync(dbFolder) == false){
            fs.mkdirSync(dbFolder,{ recursive: true });
        }

        if(fs.existsSync(databaseFilepath) == false){
            createFile(databaseFilepath);
        }
    }
});