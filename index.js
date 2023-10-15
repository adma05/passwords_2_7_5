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
        ver: "2.2.1"
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



const user = fs.readFileSync(`${os.homedir().replaceAll("\\", "/")}/Documents/passwords_data/user.json`);
const array = JSON.parse(user);

const password = fs.readFileSync(`${os.homedir().replaceAll("\\", "/")}/Documents/passwords_data/passwords.json`)
const passArray = JSON.parse(password);

const settings = fs.readFileSync(`${os.homedir().replaceAll("\\", "/")}/Documents/passwords_data/settings.json`)
const settingsArray = JSON.parse(settings);

const TelegramBot = require('node-telegram-bot-api');
const token = array.notifications.telegram_token;
const bot = new TelegramBot(token, {polling: true})
const chat_id = "";
async function sendMessage(message = null) {
    if(!message) return;
    await bot.sendMessage(chat_id, message);
}
bot.on("polling_error", (msg) => console.log(msg));

bot.on('message', function(req) {
    /* 
    // your username
    if(req.from.username != "") {
        bot.sendMessage(chat_id, `Кто-то попытался воспользоваться вашим ботом\nID пользователя: @${req.from.username}`);
        return;
    } */

    let usrTime = {
        h: (array.user.uptime[0] < 9) ? '0' + array.user.uptime[0] : array.user.uptime[0],
        m: (array.user.uptime[1] < 9) ? '0' + array.user.uptime[1] : array.user.uptime[1],
        s: (array.user.uptime[2] < 9) ? '0' + array.user.uptime[2] : array.user.uptime[2]
    }
    
    switch(req.text) {
        case '/passwords':
            bot.sendDocument(chat_id, `${os.homedir().replaceAll("\\", "/")}/Documents/passwords_data/passwords.json`);
            break;

        case '/user':
            if(!settingsArray) {
                bot.sendMessage(chat_id, `Пользователь *${array.user.login}*\n\nТекущий IP: *${array.user.ip}*\nРгеистрация: *${array.user.createdAt}*\nПаролей: *авторизуйстесь*\nВремя проведённое в приложении: *${usrTime.h}:${usrTime.m}:${usrTime.s}*\n\nСчётчик:\nОшибок входа: ${array.counter.fail_access}\nАвторизаций: ${array.counter.login_times}`, {
                    parse_mode: 'Markdown'
                });
            } else {
                bot.sendMessage(chat_id, `Пользователь *${array.user.login}*\n\nТекущий IP: *${array.user.ip}*\nРгеистрация: *${array.user.createdAt}*\nПаролей: *${passArray.length}*\nВремя проведённое в приложении: *${usrTime.h}:${usrTime.m}:${usrTime.s}*\n\nСчётчик:\nОшибок входа: ${array.counter.fail_access}\nАвторизаций: ${array.counter.login_times}`, {
                    parse_mode: 'Markdown'
                });
            }
            break;

        case '/logs':
            bot.sendDocument(chat_id, `${os.homedir().replaceAll("\\", "/")}/Documents/passwords_data/logs.json`);
            break;

        case '/settings':
            if(!settingsArray) {
                bot.sendMessage(chat_id, `Авторизуйтесь для просмотра настроек`);
            } else {
                bot.sendMessage(chat_id, `Настройки\n\nСкрывать данные: *${settingsArray.autoHideData}*\nСкрывать данные в таблице: *${settingsArray.hideDataInTable}*`,{
                    parse_mode: 'Markdown'
                });
            }
            
            break;
    }
});