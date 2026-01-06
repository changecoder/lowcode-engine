export interface IPublicApiLogger {
  debug(...args: any | any[]): void;
  info(...args: any | any[]): void;
  warn(...args: any | any[]): void;
  error(...args: any | any[]): void;
  log(...args: any | any[]): void;
}
