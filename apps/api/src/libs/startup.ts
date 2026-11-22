/**
 * Coloured startup messages.
 * Imported FIRST in main.ts, so even errors thrown while modules load
 * (e.g. a missing .env value) are printed in red.
 */

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

export const printStartupSuccess = (lines: string[]): void => {
  const [title, ...details] = lines;
  process.stdout.write(
    `\n${GREEN}${BOLD}✔ ${title}${RESET}\n` +
      details.map((line) => `${GREEN}  ${line}${RESET}\n`).join('') +
      '\n',
  );
};

export const printStartupError = (error: unknown): void => {
  const message = error instanceof Error ? error.message : String(error);
  const stack =
    error instanceof Error && error.stack
      ? error.stack.split('\n').slice(1, 6).join('\n')
      : '';
  process.stderr.write(
    `\n${RED}${BOLD}✖ Backend failed to start${RESET}\n` +
      `${RED}  ${message}${RESET}\n` +
      (stack ? `${RED}${stack}${RESET}\n` : '') +
      '\n',
  );
};

const fail = (error: unknown): void => {
  printStartupError(error);
  process.exit(1);
};

process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);
