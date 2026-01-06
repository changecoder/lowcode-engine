import {
  IPublicTypeDynamicSetter,
  IPublicTypeFieldExtraProps,
  IPublicTypeSetterType,
  IPublicTypeTitleContent,
} from '.';

/**
 * 属性面板配置
 */
export interface IPublicTypeFieldConfig extends IPublicTypeFieldExtraProps {
  /**
   * 面板配置隶属于单个 field 还是分组
   */
  type?: 'field' | 'group';
  name?: string | number;
  title?: IPublicTypeTitleContent;
  // 单个属性的setter设置
  setter?: IPublicTypeSetterType | IPublicTypeDynamicSetter;
  // type为group时，多个属性的设置
  items?: IPublicTypeFieldConfig[];
  extraProps?: IPublicTypeFieldExtraProps;
}
