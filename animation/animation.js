const version = '1.7.5';
const { desktopCapturer } = require("electron");
const { writeSync, stat } = require("original-fs");

const closeCreatebarBtn = document.querySelector("#close-created-bar-btn");
const createBar = document.querySelector("#create-new-pass-bar");

closeCreatebarBtn.addEventListener("click", function() {
    createBar.classList.add("hidden-animation");
})


const addNewPasswordBtn = document.querySelector("#create-new-password");
addNewPasswordBtn.addEventListener("click", function() {
    createBar.classList.remove("hidden-animation");
})

const numbersBtns = document.querySelectorAll(".numbers div");
const numbersJoinBtns = document.querySelectorAll(".numbers-join div");
const userPincodeInput = document.querySelector("#user-pincode-auth");
const userPincodeAuthInput = document.querySelector("#user-pincode");
const nextBtns = document.querySelectorAll("#next");
for(let i = 0; i < numbersBtns.length; i++) {
    numbersBtns[i].addEventListener("click", function() {
        userPincodeInput.value += this.innerText;
        if(!(userPincodeInput.value.length < 4)) {
            let str = userPincodeInput.value.slice(0, 4);
            nextBtns[1].innerHTML = "Продолжить"
            userPincodeInput.value = str;
        } else {
            nextBtns[1].innerHTML = "Пропустить"
        }
    })
}
for(let i = 0; i < numbersBtns.length; i++) {
    numbersJoinBtns[i].addEventListener("click", function() {
        userPincodeAuthInput.value += this.innerText;
        if(userPincodeAuthInput.value.length >= 4) {
            let str = userPincodeAuthInput.value.slice(0, 4);
            userPincodeAuthInput.value = str;
        }
    })
}

// AUTH
let wrongCounter = 0;
const joinAccBtn = document.querySelector("#join-in-account");
const joinAccInput = document.querySelector("#user-pincode");
const loginAccBtn = document.querySelector("#wr-join-in-account");

function authRequest() {
    let win = document.querySelector(".pincode");
    let value = userPincodeAuthInput.value;
    if(wrongCounter == 3) {
        sendMessage(`Ошибка авторизации.\nIP: ${IP}\nДата: ${new Date().toISOString()}`);
        notification.use('#Auth_notification_code', 'Попробуйте другие способы.');
        let pinWin = document.querySelector(".main-content");
        let loginWin = document.querySelector(".main-content-login");
        loginWin.classList.remove("hidden-animation");
        pinWin.classList.add("hidden-animation");
        return;
    }
    
    if(player.user.pincode == value) {
        win.classList.add("hidden-animation");
        logs.use(null, `Успешная авторизация. IP: ${IP}`, 'success');
        sendMessage(`Успешная авторизация.\nIP: ${IP}\nДата: ${new Date().toISOString()}`);
        notification.use("System", `Вход в аккаунт\nIP: ${IP}\n\nДата: ${new Date().toLocaleString()}`);
        player.counter.login_times++;
        user.update();
        content.load(true);
    } else {
        player.counter.wrong_pincode_count++;
        player.counter.fail_access++;
        logs.use(null, `Неверный пин-код. IP: ${IP}`, 'error');
        value = '';
        user.update();
        wrongCounter++;
    }
}

joinAccBtn.addEventListener("click", function() {
    authRequest();
});

joinAccInput.addEventListener("keyup", function(e) {
    const k = e.key;
    if(k == 'Enter') {
        authRequest();
    }
});

let wrongCounter2 = 0;

loginAccBtn.addEventListener('click', function() {
    let login_v = document.querySelector("#wr-login");
    let pass_v = document.querySelector("#wr-password");
    let timer = document.querySelector(".timer");
    let h2Title = document.querySelector(".timer h2");

    if(wrongCounter2 >= 3) {
        login_v.disabled = true;
        pass_v.disabled = true;
        loginAccBtn.disabled = true;
        timer.classList.remove("hidden-animation");
        accesInit = setInterval(() => {
            accesInitTime--;
            h2Title.innerText = accesInitTime;
            if(accesInitTime  <= 0)  {
                timer.classList.add("hidden-animation");
                accesInitTime = 60;
                h2Title.innerText = accesInitTime;
                login_v.disabled = false;
                pass_v.disabled = false;
                loginAccBtn.disabled = false;
            }
        }, 1000);
    }
    if(!(login_v.value == player.user.login)) {
        player.counter.wrong_login_count++;
        player.counter.wrong_pass_count++;
        player.counter.fail_access++;
        logs.use(null, `Неверный логин или пароль. IP: ${IP}`, 'error');
        user.update();
        wrongCounter2++;
        console.log("Wrong login!");
        return;
    }
    
    if(pass_v.value == player.user.password) {
        let win = document.querySelector(".pincode");
        win.classList.add("hidden-animation");
        logs.use(null, `Успешная авторизация. IP: ${IP}. Способ: login_&_password`, 'success');
        sendMessage(`Успешная авторизация.\nIP: ${IP}.\nДата: ${new Date().toISOString()}\nСпособ: login_&_password`);
        notification.use("System", `Вход в аккаунт\nIP: ${IP}\n\nДата: ${new Date().toLocaleString()}`);
        player.counter.login_times++;
        user.update();
        content.load(true);
    } else {
        console.log("Wrong password!");
    }
})

userPincodeInput.addEventListener("input", function(){
    if(!(this.value.length < 4)) {
        let str = this.value.slice(0, 4);
        nextBtns[1].innerHTML = "Продолжить"
        this.value = str;
    } else {
        nextBtns[1].innerHTML = "Пропустить"
    }
})


for(let k = 0; k < nextBtns.length; k++) {
    nextBtns[k].addEventListener("click", function() {
        let id = k;
        let inc = k + 1;
        inc = (inc > nextBtns.length) ? k : k + 1;
        let windows = document.querySelectorAll(".steps");
        windows[k].classList.add("hidden-animation");
        setTimeout(() => {
            try {
                windows[k].classList.add("hidden");
                windows[inc].classList.remove("hidden");
                windows[inc].classList.remove("hidden-animation");
            } catch (e) {
                logs.errors(e);
            }
        }, 250);
        if((k + 1) >= nextBtns.length) {
            let bar = document.querySelector(".auth-reg-bar");
            bar.classList.add("hidden-animation")
        }
    })
}

let btn = document.querySelector("#theme-btn");
let themeWin = document.querySelector(".theme-bar");
const openProfileWinBtn = document.querySelector("#m-open-profile-btn");
const settingsShortBtn = document.querySelector("#settings-btn");
const homeBtn = document.querySelector("#m-open-home-btn");
const settingsPage = document.querySelector(".settings-page");
const profileWin = document.querySelector(".profile-page");
const mainPage = document.querySelector(".passwords-page")
const editBar = document.querySelector(".edit-pass-bar")
btn.addEventListener("click", function() {
    themeWin.classList.toggle("hidden-animation");
})
window.addEventListener("keyup",  function(event) {
    let key = event.key;
    // console.log(`CTRL: ${event.ctrlKey} : KEY: ${key}`);
    // Escape helper for quick exit from window
    if(key == 'Escape') {
        if(!themeWin.classList.contains("hidden-animation")) {
            themeWin.classList.add("hidden-animation");
        }
        if(!consoleWin.classList.contains("hidden-animation")) {
            consoleWin.classList.add("hidden-animation");
        }
        if(!createBar.classList.contains("hidden-animation")) {
            createBar.classList.add("hidden-animation");
        }
        if(!editBar.classList.contains("hidden-animation")) {
            editBar.classList.add("hidden-animation");
        }
    }
    if(key == 'F7') {
        consoleWin.classList.remove("hidden-animation")
    }

    // HOME
    if(event.ctrlKey && (key == 'h' || key == 'H')) {
        profileWin.classList.add("hidden");
        settingsPage.classList.add("hidden");
        mainPage.classList.remove("hidden");
    }
    // SETTINGS
    if(event.ctrlKey && (key == 's' || key == 'S')) {
        profileWin.classList.add("hidden");
        mainPage.classList.add("hidden");
        settingsPage.classList.remove("hidden");
    }
    // PROFILE
    if(event.ctrlKey && (key == 'p' || key == 'P')) {
        profileWin.classList.remove("hidden");
        mainPage.classList.add("hidden");
        settingsPage.classList.add("hidden");
    }
})

openProfileWinBtn.addEventListener("click", function() {
    profileWin.classList.remove("hidden");
    mainPage.classList.add("hidden");
    settingsPage.classList.add("hidden");
})

homeBtn.addEventListener("click", function() {
    profileWin.classList.add("hidden");
    settingsPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
})

settingsShortBtn.addEventListener("click", function() {
    profileWin.classList.add("hidden");
    mainPage.classList.add("hidden");
    settingsPage.classList.remove("hidden");
})




let init, h = 0, m = 0, s = 0, ms = 0;
function record(stop = false) {
    if(!stop) {
        init = setInterval(() => {
            ms++;
            if(ms >= 1000) {
                s = s + 1;
                ms = 0;
            }
        }, 1);
    } else {
        clearInterval(init);
        setTimeout(() => {
            h = 0
            m = 0;
            s = 0;
            ms = 0;
        }, 1);
        // console.log({h: h, m: m, s: s, ms: ms})
        return {h: h, m: m, s: s, ms: ms}
    }
}


function runCode(text) {
    if(text.trim() == '') return false;
    record(false); // start recording.
    setTimeout(() => {
        try {
            let command = eval(text);
            logs.use(null,"Выполнено.", 'success', true, null, text);
        } catch(e) {
            logs.use(null,`${e}`, 'error', true, null, text);
            logs.errors(e);
        }
    }, Math.floor(Math.random() * 250));
    
}



const codeArea = document.querySelector(".write textarea");
const codeSubmit = document.querySelector("#send-command");
codeSubmit.addEventListener("click", function() {
    runCode(codeArea.value);
})

function noConnection() {
    let status = document.querySelector("#internet-status");
    let buttons = document.querySelectorAll("button");
    let exitBtn = document.querySelector("#exit-btn");
    status.classList.remove("hidden");
    buttons.forEach(btn => {
        btn.disabled = true;
    });
    exitBtn.disabled = false;
}

let passList = document.querySelector("#passwords-length");
let loadToken = this.document.querySelector("#user-telegram-token");
window.addEventListener("load", function() {
    if(!this.navigator.onLine) return noConnection();
    let title = this.document.querySelector("title");
    title.innerText = `Passwords v${version}`;
    if(player.user.pincode != '') {
        let pinAuthBar = this.document.querySelector('.pincode');
        pinAuthBar.classList.remove('hidden-animation');
    } else {
        content.load(true);
    }
    logs.use(null, `Приложение 'Passwords v${version}' успешно запущено.`, "success", false);
    logList.forEach(object => {
        logs.use(object.createdAt, object.message, object.status || 'error', false);
    })
    removeBtns = this.document.querySelectorAll(".passwords .main-path .del-pass");
    passwordsList = this.document.querySelectorAll(".passwords .main-path .password-item");
    
    passList.innerText = passwords.length;
    

    if(player.notifications.telegram_token != '') {
        let length = player.notifications.telegram_token.length;
        let str = '';
        for(let i = 0; i < length - 5; i++) {
            str += '*';
        }
        loadToken.innerText = `${player.notifications.telegram_token.slice(0, 5)}${str}`;
    }
})

let showToken = true;
loadToken.addEventListener("click", function() {
    if(showToken) {
        this.innerText = player.notifications.telegram_token;
        this.classList.add("show");
        showToken = false;
    } else {
        let length = player.notifications.telegram_token.length;
        let str = '';
        for(let i = 0; i < length - 5; i++) {
            str += '*';
        }
        this.classList.remove("show");
        loadToken.innerText = `${player.notifications.telegram_token.slice(0, 5)}${str}`;
        showToken = true;
    }
})


function deletePassowrd(event) {
    event.stopPropagation();
    let index = Number(event.target.dataset.index);
    let id = document.querySelector(`[data-brain-index-${index}]`);
    let index2 = id.dataset[`brainIndex-${index}`];
    logs.use(null, `Пароль для "${passwords[index2].source}" удален`, 'success', true, null, null);
    sendMessage(`Удален пароль\nIP: ${IP}\nДата: ${new Date().toISOString()}\nИсточник: ${passwords[index2].source}\nЛогин: ${passwords[index2].login || 'N/A'}\nПароль: ${passwords[index2].password || 'N/A'}`)
    delete passwords[index2];
    id.remove();
    content.update();
    passList.innerText = passwords.length;
    passwordsList = document.querySelectorAll(".passwords .main-path .password-item");
    let passDelBtns = document.querySelectorAll(".passwords .main-path .password-item .del-pass");
    let passDelIcons = document.querySelectorAll(".passwords .main-path .password-item .delete-pass-btn");
    for(let i = 0; i < passwords.length; i++) {
        passwordsList[i].removeAttribute(`data-brain-index-${i}`);
        passwordsList[i].setAttribute(`data-brain-index-${i}`, i);
        passDelBtns[i].setAttribute('data-index', i);
        passDelIcons[i].setAttribute('data-index', i);
    }
}

let editObj = null;
function editCurrentPassword(event, id) {
    let win = document.querySelector(".edit-pass-bar");
    let souurce = document.querySelector("#edit-source");
    let login = document.querySelector("#edit-login");
    let password = document.querySelector("#edit-password");
    let createdAt = document.querySelector(".log-data .createdAt");
    let icon = document.querySelector("#main-edit-page .top-bar button");
    win.classList.remove("hidden-animation");
    let counter = 0; // index from -1
    for(let i = passwords.length - 1; i >= 0; i--) {
        if(counter == id) {
            editObj = {
                type: passwords[counter].type,
                source: passwords[counter].source,
                login: passwords[counter].login,
                password: passwords[counter].password,
                createdAt: passwords[counter].createdAt,
                old_login: passwords[counter].login,
                old_password: passwords[counter].password
            }
            break;
        }
        counter++;
    }
    souurce.value = editObj.source;
    createdAt.innerText = editObj.createdAt;
    icon.innerHTML = (editObj.type == 'web') ? '<i class="fa fa-external-link"></i>' : '<i class="fa fa-th-large"></i>'
}
let confirmUpdate = document.querySelector("#save-this-password");
confirmUpdate.addEventListener("click", function() {
    if(!editObj) return;
    let source = document.querySelector("#edit-source").value.trim();
    let login = document.querySelector("#edit-login").value.trim();
    let password = document.querySelector("#edit-password").value.trim();
    let date = editObj.createdAt;
    for(let i = 0; i < passwords.length; i++) {
        if(editObj.login == passwords[i].login && editObj.password == passwords[i].password) {
            if(date == passwords[i].createdAt) {
                passwords[i].login = (login == "") ? editObj.old_login : login;
                passwords[i].password = (password == "") ? editObj.old_password : password;
                passwords[i].source = (source == "") ? editObj.source : source;
                notification.use('System', 'Данные пользователя изменены.');
                content.update();
                let win = document.querySelector(".edit-pass-bar");
                win.classList.add("hidden-animation");
            }
        }
    }
    editObj = null;
})


const unlockBtn = document.querySelector(".unlock-pass");
const lockBtn = document.querySelector(".lock-pass");
unlockBtn.addEventListener("click", unlockData);
lockBtn.addEventListener("click", lockData);


function lockData() {
    if(passwordsList.length == 0) return;
    let loginTxt = document.querySelectorAll(".main-path .login-content-text");
    let passTxt = document.querySelectorAll(".main-path .password-content-text");
    let counter = 0;
    for(let i = passwords.length - 1; i >= 0; i--) {
        loginTxt[i].innerText = `${passwords[counter].login.slice(0,2)}*******`;
        passTxt[i].innerText = `${passwords[counter].password.slice(0,2)}*******`;
        counter++;
    }
}

function unlockData() {
    if(passwordsList.length == 0) return;
    let loginTxt = document.querySelectorAll(".main-path .login-content-text");
    let passTxt = document.querySelectorAll(".main-path .password-content-text");
    let counter = 0;
    try {
        for(let i = passwords.length - 1; i >= 0; i--) {
            loginTxt[i].innerText = passwords[counter].login;
            passTxt[i].innerText = passwords[counter].password;
            counter++;
        }
    } catch (e) {
        logs.errors(e);
    }
}

time.h = (time.h < 10) ? '0' + time.h : time.h;
time.m = (time.m < 10) ? '0' + time.m : time.m;
time.s = (time.s < 10) ? '0' + time.s : time.s;
function recordUptime() {
    time.s++;
    time.s = (time.s < 10) ? '0' + time.s : time.s;
    if(time.s >= 60) {
        time.s = 0;
        time.m++;
        time.m = (time.m < 10) ? '0' + time.m : time.m;
    }
    if(time.m >= 60) {
        time.m = 0;
        time.h++;
        time.h = (time.h < 10) ? '0' + time.h : time.h;
    }
    setTimeout(recordUptime, 1000);
    // console.warn(`Uptime: ${time.h}:${time.m}:${time.s}`);
    player.user.uptime[0] = Number(time.h);
    player.user.uptime[1] = Number(time.m);
    player.user.uptime[2] = Number(time.s);
    user.update();

    let status = document.querySelector("#user-uptime-status");
    status.innerText = `${time.h}:${time.m}:${time.s}`;
}

const oldPinInput = document.querySelector("#new-user-pin");
oldPinInput.addEventListener("input", function() {
    let old_pin = player.user.pincode;
    let old_pin_value = document.querySelector('#old-user-pin').value;
    console.log(old_pin_value)
    if(old_pin_value == old_pin) {
        if(this.value.length >= 4) {
            this.value = this.value.slice(0,4)
            player.user.pincode = this.value;
            let saveNotif = document.querySelector(".load-pin-save");
            if(saveRecorder != null) clearTimeout(saveRecorder);
            saveRecorder = setTimeout(function() {
                saveNotif.classList.add("active");
                user.update();
            }, 2000)
            setTimeout(() => {
                saveNotif.classList.remove("active");
            }, 4000);
        }
    }
})

const writeOAuth = document.querySelector("#oauth-vk-token");
writeOAuth.addEventListener("input", function() {
    let saveNotif = document.querySelector(".load-oauth-save");
    setTimeout(() => {
        saveNotif.classList.add("active");
        player.notifications.telegram_token = this.value;
    }, 2000);
    setTimeout(() => {
        saveNotif.classList.remove("active");
    }, 4000);
})


const oldUserPass = document.querySelector("#new-user-pass");
oldUserPass.addEventListener("input", function() {
    let old_pass = player.user.password;
    let old_pass_value = document.querySelector('#old-user-pass').value;
    if(old_pass == old_pass_value) {
        player.user.password = this.value;
        logs.use(null, 'Пароль успешно изменён.', 'success');
        notification.use("Аккаунт", 'Пароль успешно изменён.');
        sendMessage(`Изменения в аккаунте\nДата: ${new Date().toISOString()}\nIP: ${IP}\nПароль успешно изменён.`)

        let saveNotif = document.querySelector(".load-pass-save");
        user.update();
        setTimeout(() => {
            saveNotif.classList.add("active");
        }, 2000);
        setTimeout(() => {
            saveNotif.classList.remove("active");
        }, 4000);
    }
})


let reqMessageTxt = document.querySelector("#req-message-txt");
const items = document.querySelectorAll('.item label input');
const soundEffect = document.querySelector("#sound-notification");
items.forEach((element, index) => {
    element.addEventListener("click", function() {
        let checked = this.checked;
        let key = this.dataset.key;
        settingsCfg[key] = checked;
        user.updateSettings();
        let timeout = null;
        reqMessageTxt.classList.add("active");
        if(timeout != null) clearTimeout(timeout);
        timeout = setTimeout(() => {
            reqMessageTxt.classList.remove("active");
        }, 3000);
        soundEffect.play();
    })
});


const deleteAccBtn = document.querySelector("#delete-account-btn");
deleteAccBtn.addEventListener("click", function() {
    let confirmMenu = document.querySelector(".confirm-menu");
    let confirmMenuTxt = document.querySelector(".confirm-menu #confirm-content");
    confirmMenu.classList.remove("hidden-animation");
    confirmMenuTxt.innerText = 'Вы действительно хотите удалить аккаунт?';

    let confirmBtnAccept = document.querySelector("#confirm-accept");
    confirmBtnAccept.onclick = user.delete;
})


const hideConfirmMenuBtn = document.querySelector("#confirm-decline");
hideConfirmMenuBtn.addEventListener("click", function() {
    let confirmMenu = document.querySelector(".confirm-menu");
    confirmMenu.classList.add("hidden-animation");
})


const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", function() {
    let items = document.querySelectorAll(".main-path .password-item");
    if(items.length == 0) return;
    let source = document.querySelectorAll(".main-path .password-item .pass-type-text a");
    let login = document.querySelectorAll(".main-path .password-item .login-text .login-content-text");
    let v = this.value.trim();
    for(let i = 0; i < items.length; i++) {
        try {
            if(source[i].innerText.indexOf(v) > -1 || login[i].innerText.indexOf(v) > -1) {
                items[i].classList.remove("hidden");
            } else {
                items[i].classList.add("hidden");
            }
        } catch(e){
            logs.errors(e);
        }
    }
    if(v == '') {
        items.forEach(item => {
            item.classList.remove("hidden");
        })
    }
})

function showLogin(event) {
    event.stopPropagation();
    event.preventDefault();
    let target = event.target;
    target.innerText = (target.innerText == target.dataset.login) ? `${target.dataset.login.slice(0,2)}********` : target.dataset.login;
}


function showPasswrd(event) {
    event.stopPropagation();
    event.preventDefault();
    let target = event.target;
    target.innerText = (target.innerText == target.dataset.password) ? `${target.dataset.password.slice(0,2)}********` : target.dataset.password;
}

