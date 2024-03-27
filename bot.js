
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require("dotenv").config();


const API_KEY = process.env.API;



const TOKEN = process.env.TOKEN_BOT;


const bot = new TelegramBot(TOKEN, { polling: true });


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to WeatherBot! Use /weather <city> to get the current weather.');
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];

  try {
    const weatherData = await getWeather(city);
    bot.sendMessage(chatId, weatherData);
  } catch (error) {
    bot.sendMessage(chatId, 'Weather information not found for this city.');
  }
});

async function getWeather(city) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    const { weather, main } = response.data;
    const weatherInfo = `Weather in ${city}: ${weather[0].description}, Temperature: ${main.temp}°C`;
    return weatherInfo;
  } catch (error) {
    throw error;
  }
}
