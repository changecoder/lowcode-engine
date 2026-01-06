import {
  IPublicApiCommon,
  IPublicApiCommonSkeletonCabin,
  IPublicApiCommonUtils,
  IPublicTypeI18nData,
} from '@cc/lowcode-types';
import {
  Skeleton as InnerSkeleton,
  Workbench as InnerWorkbench,
} from '@cc/lowcode-editor-skeleton';
import { Editor, intl as innerIntl } from '@cc/lowcode-editor-core';
import { skeletonSymbol } from '../symbols';

class SkeletonCabin implements IPublicApiCommonSkeletonCabin {
  private readonly [skeletonSymbol]: InnerSkeleton;

  constructor(skeleton: InnerSkeleton) {
    this[skeletonSymbol] = skeleton;
  }

  get Workbench(): any {
    const innerSkeleton = this[skeletonSymbol];
    return (props: any) => <InnerWorkbench {...props} skeleton={innerSkeleton} />;
  }
}

class Utils implements IPublicApiCommonUtils {
  intl(data: IPublicTypeI18nData | string, params?: object): any {
    return innerIntl(data, params);
  }
}

export class Common implements IPublicApiCommon {
  private readonly __utils: Utils;
  private readonly __skeletonCabin: any;

  constructor(editor: Editor, skeleton: InnerSkeleton) {
    this.__skeletonCabin = new SkeletonCabin(skeleton);
    this.__utils = new Utils();
  }

  get utils(): any {
    return this.__utils;
  }

  get skeletonCabin(): any {
    return this.__skeletonCabin;
  }
}
