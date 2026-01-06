import { Component } from 'vue';
import { IPublicTypeI18nData } from '../type';

export interface IPublicApiCommonUtils {
  /**
   * i18n 转换方法
   */
  intl(data: IPublicTypeI18nData | string, params?: object): string;
}

export interface IPublicApiCommonSkeletonCabin {
  /**
   * 编辑器框架 View
   * get Workbench Component
   */
  get Workbench(): Component;
}

export interface IPublicApiCommon {
  get utils(): IPublicApiCommonUtils;
  get skeletonCabin(): IPublicApiCommonSkeletonCabin;
}
