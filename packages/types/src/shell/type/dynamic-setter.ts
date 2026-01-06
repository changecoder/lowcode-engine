import { IPublicTypeCustomView, IPublicTypeSetterConfig } from '.';
import { IPublicModelSettingField } from '..';

export type IPublicTypeDynamicSetter = (
  target: IPublicModelSettingField
) => string | IPublicTypeSetterConfig | IPublicTypeCustomView;
