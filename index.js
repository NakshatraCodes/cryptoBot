const TelegramBot = require("node-telegram-bot-api");
const crypto = require("./crypto");
const mongoose = require("mongoose");

require("./models/Users");

require("dotenv").config();
const token = process.env.TOKEN;

const User = mongoose.model("users");

mongoose.connect(
  process.env.MONGO_URI,
  {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to DB Servers");
  }
);

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
bot.onText(/\/start/, async (msg) => {
  const userID = msg.chat.id;

  const existingUser = await User.findOne({ userID });

  if (existingUser) {
    bot.sendMessage(userID, `Welcome back ${existingUser.name}!`);
  } else {
    const response = await new User({
      userID,
      name: `${msg.chat.first_name} ${msg.chat.last_name}`,
      coins: [],
      notify: false,
    }).save();
    bot.sendMessage(
      userID,
      `Welcome at <b>CryptoBot</b>, thank you for registering ${response.name}`,
      {
        parse_mode: "HTML",
      }
    );
    console.log(response);
  }
});

bot.on("polling_error", (msg) => console.log(msg));
