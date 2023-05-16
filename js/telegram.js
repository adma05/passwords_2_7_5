const TelegramBot = require('node-telegram-bot-api');
const token = player.notifications.telegram_token;
const bot = new TelegramBot(token, {polling: true})
const chat_id = "";
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
    switch(req.text) {
        case '/passwords':
            bot.sendDocument(chat_id, `${m_dir}/passwords.json`);
            break;

        case '/user':
            bot.sendMessage(chat_id, `Пользователь *${player.user.login}*\n\nТекущий IP: *${player.user.ip}*\nРгеистрация: *${player.user.createdAt}*`, {
                parse_mode: 'Markdown'
            });
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