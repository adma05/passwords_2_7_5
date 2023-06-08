const path = require("path");
const url = require("url");
const {app, BrowserWindow, Menu, Tray} = require("electron");
const fs = require("fs");
const os = require("os");
const username = os.hostname(); // PC Name
const nickname = os.userInfo().username; // Account name
const config = {
    app: {
        name: "Пароли",
        ver: "2.0.0"
    }
}
let appTray = null;
let trayMenuTemplate = [
    {
        label: "Выйти",
        click: function () {
            app.quit();
            app.quit();
        }
    }
];

function callOpen() {
    win = new BrowserWindow({
        resizable: true,
        width: 1920,
        height: 1080,
        autoHideMenuBar: true,
        icon: `${__dirname}/icon/icon.ico`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            __dirname: true
        },
        show: true
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));
    win.maximize();
    win.removeMenu();
    app.focus();
}

function createWindow() {
    callOpen();
    trayIcon = path.join(__dirname, 'icon');
    appTray = new Tray(path.join (trayIcon, 'icon.ico'));
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setToolTip(`${config.app.name} v${config.app.ver}`);
    appTray.setContextMenu(contextMenu);
    

    // win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });

    appTray.on('click',function(){
        callOpen();
    })
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {});