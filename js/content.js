class Content {
    constructor() {
        console.log("Content loading...");
        this.load(false);
    }

    create(obj, update = true, index = 0) {
        const path = document.querySelector(".main-path");
        const item = document.createElement("div");
        item.setAttribute(`data-brain-index-${index}`, index)
        item.className = 'password-item';
        let type = (obj.type == 'app') ? 'fa fa-th-large' : 'fa fa-external-link';
        let typeContent = (obj.type == 'app') ? 'Приложение' : 'Веб-сайт';
        if(obj.source.indexOf('https') < 0 || obj.source.indexOf('http') < 0) {
            obj.source = `https://${obj.source}`;
        }
        let firstSymbolInPass = obj.password.slice(0,2);
        let firstSymbolInLog = obj.login.slice(0,2);
        let hidePass = `${firstSymbolInPass}*******`;
        let hideLog = `${firstSymbolInLog}*******`;

        let simpleSource = obj.source?.replace('https', '')?.replaceAll('/', '')?.replace(':', '')?.replace('http', '');
        item.innerHTML = 
        `
        <div class="type-icon">
            <span class="pass-type-icon app" style="color: royalblue; cursor: default;">
                <i class="${type}" aria-hidden="true"></i>
                ${typeContent}
            </span>
        </div>
        <div class="type-text">
            <span class="pass-type-text">
                <a href="${obj.source}" target="_blank">${simpleSource}</a>
            </span>
        </div>
        <div class="login-text" data-login="${obj.login}" ondblclick="showLogin(event)">
            <span class="login-content-text" data-login="${obj.login}">${hideLog}</span>
        </div>
        <div class="password-text" data-password="${obj.password}" ondblclick="showPasswrd(event)">
            <span class="password-content-text" data-password="${obj.password}">${hidePass}</span>
        </div>
        <div class="created-at">
            <span class="created-at-text" >${obj.createdAt}</span>
        </div>
        <div class="edit-pass" onclick="editCurrentPassword(event, id = ${index})">
            <span class="edit-pass-btn">Редактировать</span>
        </div>
        <div class="del-pass" onclick="deletePassowrd(event)" data-index="${index}">
            <span class="delete-pass-btn" data-index="${index}">Удалить</span>
        </div>
        `
        path.prepend(item);
        if(update) {
            passwords.push({
                type: obj.type,
                source: obj.source,
                login: obj.login,
                password: obj.password,
                createdAt: new Date().toLocaleString(),
                id: passwords.length
            })
            logs.use(null, `Новый пользователь добавлен!`, 'success', true);
            this.update();
        }
        removeBtns = document.querySelectorAll(".passwords .main-path .delete-pass-btn");
        passwordsList = document.querySelectorAll(".passwords .main-path .password-item");
    }

    update() {
        let directionName = 'passwords_data';
        let dir = os.userInfo().homedir.replaceAll('\\', '/');
        let m_dir = `${dir}/Documents/${directionName}`;
        passwords = passwords.filter(x => {
            return x != 'empty';
        })
        fs.writeFileSync(`${m_dir}/passwords.json`, JSON.stringify(passwords, null, '\t'));
    }

    load(login = false) {
        if(!login) return;
        console.log("Content created!");
        let directionName = 'passwords_data';
        let dir = os.userInfo().homedir.replaceAll('\\', '/');
        let m_dir = `${dir}/Documents/${directionName}`

        let bufferData = fs.readFileSync(`${m_dir}/passwords.json`);
        let stData = bufferData.toString();
        let data = JSON.parse(stData);
        passwords = data;

        let readSettings = fs.readFileSync(`${m_dir}/settings.json`);
        let string = readSettings.toString();
        let settingsConfig = JSON.parse(string);
        settingsCfg = settingsConfig;

        passwords.forEach((el, index) => {
            this.create({
                type: el.type,
                source: el.source,
                login: el.login,
                password: el.password,
                createdAt: el.createdAt
            }, false, index)
            passList.innerText = `${passwords.length}`;
        });
        let userCreatedAtTxt = document.querySelector("#user-were-created");
        userCreatedAtTxt.innerText = player.user.createdAt;
        time.h = player.user.uptime[0] || 0;
        time.m = player.user.uptime[1] || 0;
        time.s = player.user.uptime[2] || 0;
        time.h = (time.h < 10) ? '0' + time.h : time.h;
        time.m = (time.m < 10) ? '0' + time.m : time.m;
        time.s = (time.s < 10) ? '0' + time.s : time.s;
        recordUptime();
        if(!settingsCfg.autoHideData) {
            let checkbox = document.querySelector(".item label input");
            checkbox.checked = false;
            unlockData();
        } else {
            lockData();
        }
    }
}
const content = new Content();

const createBtn = document.querySelector("#confirm-new-passowrd");
const sourceOfEl = document.querySelector("#new-source-value");
const loginOfEl = document.querySelector("#new-login-value");
const passwordOfEl = document.querySelector("#new-password-value");
const typeOfEl = document.querySelector("#type");
const typeSelectOfEl = document.querySelectorAll("#type option");
createBtn.addEventListener("click", function() {
    let index = (passwords.length == 0) ? 0 : passwords.length - 1;
    content.create({
        type: (typeOfEl.selectedIndex == 1) ? 'app' : 'web',
        source: sourceOfEl.value,
        login: loginOfEl.value,
        password: passwordOfEl.value,
        createdAt: new Date().toLocaleString()
    }, true, index);
    passList.innerText = passwords.length;
    // console.log(passwords.length);
})

