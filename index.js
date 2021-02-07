const TelegramBot = require("node-telegram-bot-api");
const crypto = require("./crypto");

require("dotenv").config();
const token = process.env.TOKEN;

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true,
});

// Listener (handler) for telegram's /bookmark event
bot.onText(/\/watch/, async (msg, match) => {
  // console.log(msg, match);
  const chatId = msg.chat.id;
  const coin = match.input.split(" ")[1];
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const { data } = await crypto.get("/coins/markets", {
    params: { vs_currency: "inr", ids: coin },
  });

  console.log(data[0].symbol, data[0].current_price);
  const symbol = data[0].symbol.toUpperCase();

  if (coin === undefined) {
    bot.sendMessage(chatId, "Please tell which currency to watch");
    return;
  }

  bot.sendMessage(
    chatId,
    `${symbol} is currently valued at <b>${data[0].current_price}</b> INR`,
    {
      parse_mode: "HTML",
    }
  );
});

// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>CryptoBot</b>, thank you for using my service
      Available commands:
      /watch <b>cryptoName</b> - Watch cryptocurrency for you
      `,
    {
      parse_mode: "HTML",
    }
  );
});

bot.on("polling_error", (msg) => console.log(msg));
