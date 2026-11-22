import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const TELEGRAM_MAX_LENGTH = 4000;
const TIMEOUT_MS = 10_000;

export interface EmailInput {
  subject: string;
  text: string;
  /** "Reply" in the mail app answers this address. */
  replyTo?: string;
}

/**
 * Sends notifications to the site owner (Telegram, email).
 * Never throws: returns null on success, or a short error text.
 * A failed notification must not break the visitor's request.
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly config: ConfigService) {}

  public async sendTelegram(text: string): Promise<string | null> {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
    if (!token || !chatId) return 'Telegram is not configured';

    return await this.post(
      'Telegram',
      `https://api.telegram.org/bot${token}/sendMessage`,
      {},
      {
        chat_id: chatId,
        text: text.slice(0, TELEGRAM_MAX_LENGTH),
        disable_web_page_preview: true,
      },
    );
  }

  public async sendEmail(input: EmailInput): Promise<string | null> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('MAIL_FROM');
    const to = this.config.get<string>('MAIL_TO');
    if (!apiKey || !from || !to) return 'Email is not configured';

    return await this.post(
      'Email',
      'https://api.resend.com/emails',
      { authorization: `Bearer ${apiKey}` },
      {
        from,
        to: [to],
        subject: input.subject,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      },
    );
  }

  /*** HELPERS ***/

  private async post(
    name: string,
    url: string,
    headers: Record<string, string>,
    body: unknown,
  ): Promise<string | null> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (response.ok) return null;

      const error = `${name}: HTTP ${response.status}`;
      this.logger.error(error);
      return error;
    } catch (err) {
      const error = `${name}: ${(err as Error).message}`;
      this.logger.error(error);
      return error;
    }
  }
}
