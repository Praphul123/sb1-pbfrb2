import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
  port: process.env.PORT || 3001,
  webAppUrl: process.env.WEB_APP_URL || 'http://localhost:5173',
};

if (!config.telegramToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is required in .env file');
}