class User {
    constructor() {
        User.buildBase();
        this.load();
    }

    static buildBase() {
        console.log("Build is running.")
        let directionName = 'passwords_data'
        let dir = os.userInfo().homedir.replaceAll('\\', '/');
        let isOk, isFiles;
        isOk = true;
        isFiles = true;

        fs.readdir(`${dir}/Documents/Passwords Data`, (err, files) => {
            if(err) {
                isOk = false;
                logs.use(null, `Папка "${directionName}" найдена.`, 'success', false, '#c500c5')
            } else {
                isOk = true;
                logs.use(null, `Папка "${directionName}" не найдена.`, 'error', false, 'red')
            }
        });

        if(!isOk) return false;

        try {
            fs.mkdirSync(`${dir}/Documents/${directionName}`, (err, files) => {});
            logs.use(null, `Папка '${directionName}' создана.`, 'success', 'purple')
        } catch (e) {
            logs.errors(e);
        }
        try {
            [{
                name: "logs",
                type: "json",
                message: "logs.json"
            },{
                name: "user",
                type: "json",
                message: "user.json"
            },{
                name: "settings",
                type: "json",
                message: "settings.json"
            },{
                name: "passwords",
                type: "json",
                message: "passwords.json"
            }].forEach(file => {
                fs.readFile(`${dir}/Documents/${directionName}/${file.name}.${file.type}`, 'utf8', (err, data) => {
                    if(err) {
                        isFiles = false;
                        logs.use(null, `Файл "${file.message}" не найден`, 'error', false)
                        fs.writeFile(`${dir}/Documents/${directionName}/${file.name}.${file.type}`, JSON.stringify([]), (err) => {
                            // console.log(`Файл "${file.message}" добавлен`);
                            logs.use(null, `Файл "${file.message}" добавлен.`, 'success', false, 'skyblue')
                            if(err) throw err;
                        });
                    }
                    else if(!err) {
                        isFiles = true;
                        // `${dir}/Documents/${directionName}/${file.name}.${file.type}`
                        let stats = fs.statSync(`${dir}/Documents/${directionName}/${file.name}.${file.type}`)
                        let fileSizeInBytes = stats.size; // B
                        let fileSizeInMegabytes = fileSizeInBytes / (1024*1024); // MB
                        let fileSizeInKb = fileSizeInBytes / 1024; // MB
                        // console.log(fileSizeInMegabytes)
                        let sizeMb = "0." + String(Number(String(fileSizeInMegabytes).slice(2))).slice(0,4);
                        let sizeKb = String(Number(String(fileSizeInMegabytes).slice(2))).slice(0,4);

                        logs.use(null, `Файл "${file.message}" найден.<br>Размер файла: ${sizeMb}Mb.`, 'success', false)
                    }
                });
            })
        } catch (e) {
            logs.errors(e);
        }
    }

    getQuery(arg) {
        let elements = document.querySelectorAll(arg);
        return elements;
    }

    createUser() {
        let directionName = 'passwords_data';
        let dir = os.userInfo().homedir.replaceAll('\\', '/');

        let bufferData = fs.readFileSync(`${dir}/Documents/${directionName}/user.json`);
        let stData = bufferData.toString()
        let user = JSON.parse(stData)
        let isNone = typeof user == 'object';

        let readSettings = fs.readFileSync(`${dir}/Documents/${directionName}/settings.json`);
        let string = readSettings.toString();
        let parse = JSON.parse(string);
        let settingsClear = typeof parse == 'object';

        settingsCfg = {
            autoHideData: this.getQuery('.item')[0].childNodes[1].childNodes[1].checked,
            hideDataInTable: this.getQuery('.item')[2].childNodes[1].childNodes[1].checked
        }
        

        if(isNone) {
            logs.use(null, `Новый пользователь созадан.`, 'success', true);
            const user = {
                user: {
                    login: this.getQuery('#user-login-auth')[0].value || '',
                    password: this.getQuery('#user-password-auth')[0].value || '',
                    pincode: this.getQuery('#user-pincode-auth')[0].value || '',
                    uptime: [],
                    createdAt: new Date().toLocaleString(),
                    id: navigation.currentEntry.id,
                    ip: IP,
                    platform: {
                        name: os.hostname,
                        nick: os.userInfo().username,
                        sys: os.platform()
                    }
                },
                notifications: {
                    telegram_token: this.getQuery('#user-phone-auth')[0].value || '',
                    phone: ""
                },
                counter: {
                    fail_access: 0,
                    wrong_pass_count: 0,
                    wrong_login_count: 0,
                    wrong_pincode_count: 0,
                    login_times: 1
                }
            }
            fs.writeFileSync(`${dir}/Documents/${directionName}/user.json`, JSON.stringify(user, null, '\t'));
            if(settingsClear) {
                console.log('Create new settings config...')
                fs.writeFileSync(`${dir}/Documents/${directionName}/settings.json`, JSON.stringify(settingsCfg, null, '\t'));
            }
            content.load();
            return user;
        }
    }
    update() {
        fs.writeFileSync(`${dir}/Documents/${directionName}/user.json`, JSON.stringify(player, null, '\t'));
    }
    load() {
        let directionName = 'passwords_data';
        let dir = os.userInfo().homedir.replaceAll('\\', '/');
        let m_dir = `${dir}/Documents/${directionName}`

        let bufferData = fs.readFileSync(`${m_dir}/user.json`)
        let stData = bufferData.toString()
        let data = JSON.parse(stData)
        if(JSON.stringify(data) == '[]') {
            let win = document.querySelector(".auth-reg-bar");
            win.classList.remove('hidden-animation');
            return false;
        }
        player = data;
    }

    updateSettings() {
        fs.writeFileSync(`${dir}/Documents/${directionName}/settings.json`, JSON.stringify(settingsCfg, null, '\t'))
    }

    delete() {
        let confirmBtnAccept = document.querySelector("#confirm-accept");
        confirmBtnAccept.disabled = true;
        player = [];
        let directionName = 'passwords_data';
        let dir = os.userInfo().homedir.replaceAll('\\', '/');
        let m_dir = `${dir}/Documents/${directionName}`;
        fs.writeFileSync(`${m_dir}/user.json`, JSON.stringify(player, null, '\t'));
        logs.use(null, 'Пользователь успешно удален.', 'success');
        sendMessage(`Уведомлени системы\n\nПользователь был успешно удален.\nДата: ${new Date().toISOString()}\nIP: ${IP}`);
        notification.use('System', 'Перезагрузка.');
        setTimeout(() => {
            location.reload();
        }, 4000);
    }
}

const user = new User();
const join = document.querySelector(".register-confirm");
join.addEventListener("click", function() {
    player = user.createUser();
    location.reload();
})
