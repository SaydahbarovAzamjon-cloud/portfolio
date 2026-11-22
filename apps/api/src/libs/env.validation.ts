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

  // Authentication
  /** Signs access tokens. Long random string, generate with: openssl rand -base64 48 */
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  ACCESS_TOKEN_TTL_MINUTES: Joi.number().integer().min(1).default(15),
  REFRESH_TOKEN_TTL_DAYS: Joi.number().integer().min(1).default(7),
  /** Max login attempts per IP within LOGIN_RATE_TTL_SECONDS. */
  LOGIN_RATE_LIMIT: Joi.number().integer().min(1).default(5),
  LOGIN_RATE_TTL_SECONDS: Joi.number().integer().min(1).default(60),
  /** Used only by `pnpm seed:admin` to create the single admin account. */
  ADMIN_EMAIL: Joi.string().email().allow(''),
  ADMIN_PASSWORD: Joi.string().min(12).allow(''),

  // Telegram notifications (bot from @BotFather)
  TELEGRAM_BOT_TOKEN: requiredInProduction(
    Joi.string().pattern(/^\d+:[A-Za-z0-9_-]{30,}$/),
  ),
  TELEGRAM_CHAT_ID: requiredInProduction(Joi.string().pattern(/^-?\d+$/)),
  /** Send a Telegram message when someone starts a visit (bots and the logged-in admin are skipped). */
  TELEGRAM_NOTIFY_VISITS: Joi.boolean().default(true),
  /** Hour (0-23, Asia/Seoul) when the daily likes/visits report is sent. */
  DAILY_REPORT_HOUR: Joi.number().integer().min(0).max(23).default(21),

  // Uploads: folder on disk (VPS: e.g. /var/www/portfolio/uploads), served at APP_URL/uploads
  UPLOAD_DIR: Joi.string().default('uploads'),

  // Email (Resend)
  RESEND_API_KEY: requiredInProduction(Joi.string().pattern(/^re_/)),
  MAIL_FROM: requiredInProduction(Joi.string()),
  MAIL_TO: requiredInProduction(Joi.string().email()),
});
