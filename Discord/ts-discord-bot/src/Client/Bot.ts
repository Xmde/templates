import path from 'path';

import { Client } from 'discord.js';
import winston from 'winston';

export class Bot extends Client {
  // Singleton Instance
  private static instance: Bot;

  // Singleton Pattern to allow for only one instance of the bot
  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  // Logger Object
  public readonly logger: winston.Logger;

  private constructor() {
    // Calls the super constructor and Inits the bot
    // With the appropriate intents
    super({
      intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'
      ]
    });

    // Initialize logger Console logs are colorized and timestamped
    // File Logs are just timestamped
    this.logger = winston.createLogger({
      level: 'info',

      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),

      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple()
          )
        }),

        // Winston File Log is stored in the Root of the project
        // Called logs.log
        new winston.transports.File({
          filename: path.join(__dirname, '../../logs.log'),
          level: 'debug'
        })
      ]
    });

    // Logs in the Bot
    this.login(process.env.BOT_DISCORD_TOKEN);

    // Runs the default init function
    // This is used to allow for async functions to be used
    this.init();
  }

  // Init Function. Seperated from constructor to allow for async functions
  private async init(): Promise<void> {
    // Logs when the bot is ready
    this.on('ready', () => {
      this.logger.info(`Bot is ready! User: ${this.user?.tag}`);
    });
  }
}
