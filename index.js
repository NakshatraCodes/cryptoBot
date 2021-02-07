const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config();
const token = process.env.TOKEN;

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

// Listener (handler) for telegram's /bookmark event
bot.onText(/\/watch/, (msg, match) => {
  console.log(msg, match);
  const chatId = msg.chat.id;
  const coin = match.input.split(" ")[1];
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  if (coin === undefined) {
    bot.sendMessage(chatId, "Please tell which currency to watch");
    return;
  }

  bot.sendMessage(
    chatId,
    `Now watching ${coin} for you, ${msg.chat.first_name}`
  );
});

bot.on("polling_error", (msg) => console.log(msg));
