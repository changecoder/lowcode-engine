import { IPublicTypeCompositeValue } from './composite-value';

export type IPublicTypePropsList = Array<{
  spread?: boolean;
  name?: string;
  value: IPublicTypeCompositeValue;
}>;
