const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const ethers = require('ethers')

require('dotenv').config()

// at 7am every morning TH timezone, bot makes GET request to SOLA API to retrieve a list of events for the day
// send message to the group everyday at the same time.


// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.token;

const bot = new TelegramBot(token, { polling: true });

async function main(resp, chatId, bot) {
  const response = await axios.get('https://api.giphy.com/v1/gifs/random?api_key=aM1XI4UOAHmlPkSLlTPnq83HPShIeSaQ&tag=&rating=g')
  console.log(response)
  bot.sendMessage(chatId, `User is verified`);
}

// Matches /gif
bot.onText(/\/gif/, async function onGifText(msg) {
  // main(msg.chat.id)
  const response = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.giphy_api_key}&tag=&rating=g`)
  console.log(response.data.data.images)
  return bot.sendAnimation(msg.chat.id, response.data.data.images.downsized.url)
});

// Matches /audio
bot.onText(/\/audio/, function onAudioText(msg) {
  // From HTTP request
  const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
  const audio = request(url);
  bot.sendAudio(msg.chat.id, audio);
});


// Matches /love
bot.onText(/\/love/, function onLoveText(msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ['Yes, you are the bot of my life ❤'],
        ['No, sorry there is another one...']
      ]
    })
  };
  bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});


// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function onEchoText(msg, match) {
  const resp = match[1];
  bot.sendMessage(msg.chat.id, resp);
});

// Matches /today
bot.onText(/\/today/, function onTodayText(msg) {
  bot.sendMessage(msg.chat.id, "Here's a list of all the events today.... enjoy! :)");
  // TODO: get API from Jiang
});

// Matches /photo
bot.onText(/\/photo/, function onPhotoText(msg) {
  // From file path
  const photo = `${__dirname}/../test/data/photo.gif`;
  bot.sendPhoto(msg.chat.id, photo, {
    caption: "I'm a bot!"
  });
});

// Matches /editable
bot.onText(/\/editable/, function onEditableText(msg) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Edit Text',
            // we shall check for this value when we listen
            // for "callback_query"
            callback_data: 'edit'
          }
        ]
      ]
    }
  };
  bot.sendMessage(msg.from.id, 'Original Text', opts);
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'edit') {
    text = 'Edited Text';
  }

  bot.editMessageText(text, opts);
});

// Matches /wallet
bot.onText(/\/wallet/, function onEditableText(msg) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Create Wallet',
            // we shall check for this value when we listen
            // for "callback_query"
            callback_data: 'create_wallet'
          }
        ]
      ]
    }
  };
  bot.sendMessage(msg.from.id, 'Original Text', opts);
});

// Handle callback queries
bot.on('create_wallet', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'edit') {
    text = 'Edited Text';
  }

  bot.editMessageText(text, opts);
});

bot.on('polling_error', (error) => {
  console.log(error.code);  // => 'EFATAL'
});

bot.on('webhook_error', (error) => {
  console.log(error.code);  // => 'EPARSE'
});