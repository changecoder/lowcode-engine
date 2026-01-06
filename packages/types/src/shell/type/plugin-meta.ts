import { IPublicTypePluginDeclaration } from './plugin-declaration';

export interface IPublicTypePluginMeta {
  /**
   * 定义插件所依赖的依赖项
   */
  dependencies?: string[];
  /**
   * 指定哪个引擎版本与插件兼容
   */
  engines?: {
    lowcodeEngine?: string;
  };
  preferenceDeclaration?: IPublicTypePluginDeclaration;
  eventPrefix?: string;
  /**
   * 如果要使用 command 注册命令，需要在插件 meta 中定义 commandScope
   */
  commandScope?: string;
}
