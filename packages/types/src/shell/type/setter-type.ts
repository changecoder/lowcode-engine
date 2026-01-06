import { IPublicTypeCustomView, IPublicTypeSetterConfig } from '.';

export type IPublicTypeSetterType =
  | IPublicTypeSetterConfig
  | IPublicTypeSetterConfig[]
  | string
  | IPublicTypeCustomView;
