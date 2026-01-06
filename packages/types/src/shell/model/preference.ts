export interface IPublicModelPreference {
  set(key: string, value: any, module?: string): void;
  get(key: string, module: string): any;
  contains(key: string, module: string): boolean;
}
