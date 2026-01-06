import { IPublicApiEvent } from '../../shell/api';

export interface IEventBus extends IPublicApiEvent {
  removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
  addListener(event: string | symbol, listener: (...args: any[]) => void): any;
  setMaxListeners(n: number): any;
  removeAllListeners(event?: string | symbol): any;
}
