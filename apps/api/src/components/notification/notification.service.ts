import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const TELEGRAM_MAX_LENGTH = 4000;

/** Sends notifications to the site owner. Never throws: a failed message must not break the request. */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly config: ConfigService) {}

  public async sendTelegram(text: string): Promise<void> {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
    if (!token || !chatId) return;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text.slice(0, TELEGRAM_MAX_LENGTH),
            disable_web_page_preview: true,
          }),
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!response.ok) {
        this.logger.error(`Telegram: HTTP ${response.status}`);
      }
    } catch (err) {
      this.logger.error(`Telegram: ${(err as Error).message}`);
    }
  }
}
