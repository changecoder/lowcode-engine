import { Logger, Level } from '@cc/lowcode-utils';

export { Logger };

export function getLogger(config: { level: Level; bizName: string }): Logger {
  return new Logger(config);
}
