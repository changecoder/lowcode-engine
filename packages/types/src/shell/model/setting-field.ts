import { IPublicModelComponentMeta, IPublicModelNode, IPublicModelSettingTopEntry } from '.';
import {
  IPublicTypeCompositeValue,
  IPublicTypeCustomView,
  IPublicTypeDisposable,
  IPublicTypeFieldConfig,
  IPublicTypeFieldExtraProps,
  IPublicTypeSetterType,
  IPublicTypeSetValueOptions,
} from '../type';

export interface IBaseModelSettingField<SettingTopEntry, SettingField, ComponentMeta, Node> {
  /**
   * 获取设置属性的父设置属性
   */
  readonly parent: SettingTopEntry | SettingField;
  get isGroup(): boolean;
  get id(): string;
  get name(): string | number | undefined;
  get key(): string | number | undefined;
  get path(): (string | number)[];
  get title(): string;
  get setter(): IPublicTypeSetterType | null;
  get expanded(): boolean;
  get extraProps(): IPublicTypeFieldExtraProps;
  get props(): SettingTopEntry;
  /**
   * 获取设置属性对应的节点实例
   */
  get node(): Node | null;
  /**
   * 获取顶级设置属性
   */
  get top(): SettingTopEntry;
  /**
   * 是否是 SettingField 实例
   */
  get isSettingField(): boolean;
  get componentMeta(): ComponentMeta | null;
  get items(): Array<SettingField | IPublicTypeCustomView>;
  setKey(key: string | number): void;
  setValue(val: IPublicTypeCompositeValue, extraOptions?: IPublicTypeSetValueOptions): void;
  setPropValue(propName: string | number, value: any): void;
  clearPropValue(propName: string | number): void;
  getDefaultValue(): any;
  getValue(): any;
  getPropValue(propName: string | number): any;
  /**
   * 获取顶层附属属性值
   */
  getExtraPropValue(propName: string): any;
  /**
   * 获取设置属性集
   * @returns
   */
  getProps(): SettingTopEntry;
  /**
   * 是否绑定了变量
   * @returns
   */
  isUseVariable(): boolean;
  /**
   * 设置绑定变量
   * @param flag
   */
  setUseVariable(flag: boolean): void;
  /**
   * 创建一个设置 field 实例
   * @param config
   * @returns
   */
  createField(config: IPublicTypeFieldConfig): SettingField;
  /**
   * 获取值，当为变量时，返回 mock
   * @returns
   */
  getMockOrValue(): any;
  /**
   * 销毁当前 field 实例
   */
  purge(): void;
  /**
   * 移除当前 field 实例
   */
  remove(): void;
  /**
   * 设置 autorun
   * @param action
   * @returns
   */
  onEffect(action: () => void): IPublicTypeDisposable;
}

export interface IPublicModelSettingField extends IBaseModelSettingField<
  IPublicModelSettingTopEntry,
  IPublicModelSettingField,
  IPublicModelComponentMeta,
  IPublicModelNode
> {}
