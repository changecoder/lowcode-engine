export interface IDataSourceRuntimeContext<
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  /** 当前数据源的内容 */
  state: TState;
  /** 设置状态(浅合并) */
  setState(state: Partial<TState>): void;
}

export interface RuntimeOptionsConfig {
  uri: string;
  api?: string;
  params?: Record<string, unknown>;
  method?: string;
  isCors?: boolean;
  timeout?: number;
  headers?: Record<string, unknown>;
  [option: string]: unknown;
}

export type RequestHandler<T = unknown> = (
  options: RuntimeOptionsConfig,
  context?: IDataSourceRuntimeContext
) => Promise<T>;

export type RequestHandlersMap<T = unknown> = Record<string, RequestHandler<T>>;
