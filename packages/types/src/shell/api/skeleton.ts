import { IPublicModelSkeletonItem } from '../model';
import { IPublicTypeConfigTransducer, IPublicTypeSkeletonConfig } from '../type';

export interface IPublicApiSkeleton {
  /**
   * 增加一个面板实例
   * add a new panel
   * @param config
   * @param extraConfig
   * @returns
   */
  add(
    config: IPublicTypeSkeletonConfig,
    extraConfig?: Record<string, any>
  ): IPublicModelSkeletonItem | undefined;

  /**
   * 注册一个面板的配置转换器（transducer）
   */
  registerConfigTransducer(
    transducer: IPublicTypeConfigTransducer,
    level: number,
    id?: string
  ): void;
}
