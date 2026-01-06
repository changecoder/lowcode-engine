import { IPublicTypeCompositeValue } from './composite-value';
import { IPublicTypeJSExpression, IPublicTypeJSFunction, IPublicTypeJSONValue } from './value-type';

export interface InterpretDataSource {
  list: InterpretDataSourceConfig[];
  dataHandler?: IPublicTypeJSFunction;
}

export interface InterpretDataSourceConfig {
  id: string;
  isInit?: boolean | IPublicTypeJSExpression;
  isSync?: boolean | IPublicTypeJSExpression;
  type?: string;
  requestHandler?: IPublicTypeJSFunction;
  dataHandler?: IPublicTypeJSFunction;
  errorHandler?: IPublicTypeJSFunction;
  willFetch?: IPublicTypeJSFunction;
  shouldFetch?: IPublicTypeJSFunction;
  options?: {
    uri: string | IPublicTypeJSExpression;
    api?: string | IPublicTypeJSExpression; // 兼容
    params?: IPublicTypeJSONValue | IPublicTypeJSExpression;
    method?: string | IPublicTypeJSExpression;
    isCors?: boolean | IPublicTypeJSExpression;
    timeout?: number | IPublicTypeJSExpression;
    headers?: IPublicTypeJSONValue | IPublicTypeJSExpression;
    [option: string]: IPublicTypeCompositeValue;
  };
  [otherKey: string]: IPublicTypeCompositeValue;
}
