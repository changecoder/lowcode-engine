import { IPublicModelSettingField } from '../model';

export interface IPublicTypeFieldExtraProps {
  // 是否必填参数
  isRequired?: boolean;
  defaultValue?: any;
  getValue?: (target: IPublicModelSettingField, fieldValue: any) => any;
  setValue?: (target: IPublicModelSettingField, value: any) => void;
  condition?: (target: IPublicModelSettingField) => boolean;
  ignoreDefaultValue?: (target: IPublicModelSettingField) => boolean;
  autorun?: (target: IPublicModelSettingField) => void;
  defaultCollapsed?: boolean;
  important?: boolean;
  forceInline?: number;
  // 是否支持变量配置
  supportVariable?: boolean;
  display?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry';
  onChange?: (value: any, field: IPublicModelSettingField) => void;
}
