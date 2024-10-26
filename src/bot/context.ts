import TelegramBot from 'node-telegram-bot-api';
import { Server } from 'socket.io';
import { BotState } from './types';

export class BotContext {
  private states = new Map<number, BotState>();

  constructor(
    public readonly bot: TelegramBot,
    public readonly io: Server
  ) {}

  setState(chatId: number, state: BotState): void {
    this.states.set(chatId, state);
  }

  getState(chatId: number): BotState | undefined {
    return this.states.get(chatId);
  }

  clearState(chatId: number): void {
    this.states.delete(chatId);
  }
}