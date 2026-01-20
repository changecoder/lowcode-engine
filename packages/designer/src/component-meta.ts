import {
  IPublicModelComponentMeta,
  IPublicTypeComponentMetadata,
  IPublicTypeDisposable,
} from '@cc/lowcode-types';
import { INode } from './document';

export interface IComponentMeta extends IPublicModelComponentMeta<INode> {
  prototype?: any;
  get rootSelector(): string | undefined;
  setMetadata(metadata: IPublicTypeComponentMetadata): void;
  onMetadataChange(fn: (args: any) => void): IPublicTypeDisposable;
}
