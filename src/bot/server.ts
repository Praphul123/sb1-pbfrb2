import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import { BotContext } from './context';
import { MessageHandlers } from './handlers';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.webAppUrl,
    methods: ['GET', 'POST'],
  },
});

const bot = new TelegramBot(config.telegramToken, { polling: true });
const context = new BotContext(bot, io);
const handlers = new MessageHandlers(context);

// Bot command handlers
bot.onText(/\/start/, handlers.handleStart.bind(handlers));
bot.onText(/\/book/, handlers.handleBook.bind(handlers));
bot.on('message', handlers.handleMessage.bind(handlers));

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

server.listen(config.port, () => {
  console.log(`🤖 Bot server is running on port ${config.port}`);
});