import Joi from 'joi';

/** Optional in development, required in production. */
const requiredInProduction = (schema: Joi.StringSchema) =>
  schema.allow('').when('NODE_ENV', {
    is: 'production',
    then: schema.required(),
    otherwise: Joi.optional(),
  });

/**
 * Validates environment variables at startup.
 * The app refuses to boot if a required variable is missing or malformed.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(4000),
  APP_URL: Joi.string().uri().default('http://localhost:4000'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  MONGODB_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .required(),

  // Telegram notifications (bot from @BotFather)
  TELEGRAM_BOT_TOKEN: requiredInProduction(
    Joi.string().pattern(/^\d+:[A-Za-z0-9_-]{30,}$/),
  ),
  TELEGRAM_CHAT_ID: requiredInProduction(Joi.string().pattern(/^-?\d+$/)),
  /** Send a Telegram message for every new visitor (otherwise only in the daily report). */
  TELEGRAM_NOTIFY_NEW_VISITORS: Joi.boolean().default(false),
  /** Hour (0-23, Asia/Seoul) when the daily likes/visits report is sent. */
  DAILY_REPORT_HOUR: Joi.number().integer().min(0).max(23).default(21),

  // Email (Resend)
  RESEND_API_KEY: requiredInProduction(Joi.string().pattern(/^re_/)),
  MAIL_FROM: requiredInProduction(Joi.string()),
  MAIL_TO: requiredInProduction(Joi.string().email()),
});
