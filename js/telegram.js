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