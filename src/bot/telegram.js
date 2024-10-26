import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { config } from 'dotenv';
import { parse, format } from 'date-fns';

config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const userStates = new Map();

const initialState = {
  step: 'initial',
  taskData: {}
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to Team Task Calendar Bot! Use /book to schedule a new task.');
});

bot.onText(/\/book/, (msg) => {
  const chatId = msg.chat.id;
  userStates.set(chatId, { ...initialState, step: 'awaitingTitle' });
  bot.sendMessage(chatId, 'Please enter the task title:');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userState = userStates.get(chatId);

  if (!userState) return;

  switch (userState.step) {
    case 'awaitingTitle':
      userState.taskData.title = msg.text;
      userState.step = 'awaitingDescription';
      bot.sendMessage(chatId, 'Please enter the task description:');
      break;

    case 'awaitingDescription':
      userState.taskData.description = msg.text;
      userState.step = 'awaitingAssignee';
      bot.sendMessage(chatId, 'Please enter the assignee name:');
      break;

    case 'awaitingAssignee':
      userState.taskData.assignee = msg.text;
      userState.step = 'awaitingDate';
      bot.sendMessage(chatId, 'Please enter the date (YYYY-MM-DD):');
      break;

    case 'awaitingDate':
      try {
        const date = parse(msg.text, 'yyyy-MM-dd', new Date());
        userState.taskData.date = date;
        userState.step = 'awaitingTime';
        bot.sendMessage(chatId, 'Please enter the time (HH:mm):');
      } catch (error) {
        bot.sendMessage(chatId, 'Invalid date format. Please use YYYY-MM-DD format.');
      }
      break;

    case 'awaitingTime':
      try {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(msg.text)) {
          throw new Error('Invalid time format');
        }

        userState.taskData.timeSlot = msg.text;
        
        // Emit the new task to connected web clients
        io.emit('newTask', {
          ...userState.taskData,
          id: Math.random().toString(36).substr(2, 9)
        });

        bot.sendMessage(
          chatId,
          'Task scheduled successfully!\n\n' +
          `Title: ${userState.taskData.title}\n` +
          `Description: ${userState.taskData.description}\n` +
          `Assignee: ${userState.taskData.assignee}\n` +
          `Date: ${format(userState.taskData.date, 'yyyy-MM-dd')}\n` +
          `Time: ${userState.taskData.timeSlot}`
        );

        userStates.delete(chatId);
      } catch (error) {
        bot.sendMessage(chatId, 'Invalid time format. Please use HH:mm format (e.g., 09:00).');
      }
      break;
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});