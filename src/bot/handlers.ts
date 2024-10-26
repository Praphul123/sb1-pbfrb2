import { Message } from 'node-telegram-bot-api';
import { parse, format, isValid } from 'date-fns';
import { BotState } from './types';
import { BotContext } from './context';

export class MessageHandlers {
  constructor(private ctx: BotContext) {}

  async handleStart(msg: Message): Promise<void> {
    const chatId = msg.chat.id;
    await this.ctx.bot.sendMessage(
      chatId,
      'Welcome to Team Task Calendar Bot! 📅\n\nUse /book to schedule a new task.'
    );
  }

  async handleBook(msg: Message): Promise<void> {
    const chatId = msg.chat.id;
    this.ctx.setState(chatId, {
      step: 'awaitingTitle',
      taskData: {},
    });
    await this.ctx.bot.sendMessage(chatId, '📝 Please enter the task title:');
  }

  async handleMessage(msg: Message): Promise<void> {
    const chatId = msg.chat.id;
    const state = this.ctx.getState(chatId);
    
    if (!state || !msg.text) return;

    try {
      await this.processStateStep(chatId, state, msg.text);
    } catch (error) {
      await this.ctx.bot.sendMessage(
        chatId,
        '❌ An error occurred. Please try again or use /book to start over.'
      );
    }
  }

  private async processStateStep(chatId: number, state: BotState, text: string): Promise<void> {
    switch (state.step) {
      case 'awaitingTitle':
        state.taskData.title = text;
        state.step = 'awaitingDescription';
        await this.ctx.bot.sendMessage(chatId, '📋 Please enter the task description:');
        break;

      case 'awaitingDescription':
        state.taskData.description = text;
        state.step = 'awaitingAssignee';
        await this.ctx.bot.sendMessage(chatId, '👤 Please enter the assignee name:');
        break;

      case 'awaitingAssignee':
        state.taskData.assignee = text;
        state.step = 'awaitingDate';
        await this.ctx.bot.sendMessage(
          chatId,
          '📅 Please enter the date (YYYY-MM-DD):\nExample: 2024-03-20'
        );
        break;

      case 'awaitingDate':
        const date = parse(text, 'yyyy-MM-dd', new Date());
        if (!isValid(date)) {
          throw new Error('Invalid date');
        }
        state.taskData.date = date;
        state.step = 'awaitingTime';
        await this.ctx.bot.sendMessage(
          chatId,
          '🕒 Please enter the time (HH:mm):\nExample: 09:00'
        );
        break;

      case 'awaitingTime':
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(text)) {
          await this.ctx.bot.sendMessage(
            chatId,
            '❌ Invalid time format. Please use HH:mm format (e.g., 09:00).'
          );
          return;
        }

        state.taskData.timeSlot = text;
        await this.completeTaskCreation(chatId, state);
        break;
    }
  }

  private async completeTaskCreation(chatId: number, state: BotState): Promise<void> {
    const task = {
      ...state.taskData,
      id: Math.random().toString(36).substr(2, 9),
    };

    this.ctx.io.emit('newTask', task);

    await this.ctx.bot.sendMessage(
      chatId,
      '✅ Task scheduled successfully!\n\n' +
      `📝 Title: ${task.title}\n` +
      `📋 Description: ${task.description}\n` +
      `👤 Assignee: ${task.assignee}\n` +
      `📅 Date: ${format(task.date as Date, 'yyyy-MM-dd')}\n` +
      `🕒 Time: ${task.timeSlot}`
    );

    this.ctx.clearState(chatId);
  }
}