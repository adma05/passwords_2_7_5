const TelegramBot = require('node-telegram-bot-api');
const token = player.notifications.telegram_token;
const bot = new TelegramBot(token, {polling: true})
const chat_id = player.notifications.chat_id; // Bot chat ID
const userid = player.notifications.userid; // Your telegram ID
async function sendMessage(message = null) {
    if(!message) return;
    await bot.sendMessage(chat_id, message)
    .catch(e => {
        logs.use(null, `${e}`, 'error');
        notification.use('Token error', 'Ваш токен для телеграма не валиден, пожалуйста обновите его');
        let warningTxt = document.querySelectorAll(".warning-text");
        warningTxt.forEach(x => {
            x.classList.remove("active")
            x.innerText = 'Обновите токен'
        });
        logs.errors(e);
        return e;
    });
}


bot.on('message', function(req) {
    if(req.from.username != userid && userid != "") {
        bot.sendMessage(chat_id, `Кто-то попытался воспользоваться вашим ботом\nID пользователя: @${req.from.username}`);
        return;
    }

    let usrTime = {
        h: (player.user.uptime[0] < 9) ? '0' + player.user.uptime[0] : player.user.uptime[0],
        m: (player.user.uptime[1] < 9) ? '0' + player.user.uptime[1] : player.user.uptime[1],
        s: (player.user.uptime[2] < 9) ? '0' + player.user.uptime[2] : player.user.uptime[2]
    }
    
    switch(req.text) {
        case '/passwords':
            bot.sendDocument(chat_id, `${m_dir}/passwords.json`);
            break;

        case '/user':
            if(!settingsCfg) {
                bot.sendMessage(chat_id, `Пользователь *${player.user.login}*\n\nТекущий IP: *${player.user.ip}*\nРгеистрация: *${player.user.createdAt}*\nПаролей: *авторизуйстесь*\nВремя проведённое в приложении: *${usrTime.h}:${usrTime.m}:${usrTime.s}*\n\nСчётчик:\nОшибок входа: ${player.counter.fail_access}\nАвторизаций: ${player.counter.login_times}`, {
                    parse_mode: 'Markdown'
                });
            } else {
                bot.sendMessage(chat_id, `Пользователь *${player.user.login}*\n\nТекущий IP: *${player.user.ip}*\nРгеистрация: *${player.user.createdAt}*\nПаролей: *${passwords.length}*\nВремя проведённое в приложении: *${usrTime.h}:${usrTime.m}:${usrTime.s}*\n\nСчётчик:\nОшибок входа: ${player.counter.fail_access}\nАвторизаций: ${player.counter.login_times}`, {
                    parse_mode: 'Markdown'
                });
            }
            break;

        case '/logs':
            bot.sendDocument(chat_id, `${m_dir}/logs.json`);
            break;

        case '/settings':
            if(!settingsCfg) {
                bot.sendMessage(chat_id, `Авторизуйтесь для просмотра настроек`);
            } else {
                bot.sendMessage(chat_id, `Настройки\n\nСкрывать данные: *${settingsCfg.autoHideData}*\nСкрывать данные в таблице: *${settingsCfg.hideDataInTable}*`,{
                    parse_mode: 'Markdown'
                });
            }
            
            break;
    }
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Welcome, ${msg.from.first_name}`)
    .catch(e => {
        logs.use(null, `${e}`, 'error');
        notification.use('Token error', 'Ваш токен для телеграма не валиден, пожалуйста обновите его');
        let warningTxt = document.querySelectorAll(".warning-text");
        warningTxt.forEach(x => {
            x.classList.remove("active")
            x.innerText = 'Обновите токен'
        });
        logs.errors(e);
        return e;
    });
});


if(token != '') {
    let warningTxt = document.querySelectorAll(".warning-text");
    warningTxt.forEach(x => {
        x.classList.add("active")
        x.innerText = 'Токен действителен'
    });
}
