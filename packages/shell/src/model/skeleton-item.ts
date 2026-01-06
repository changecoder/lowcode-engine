import { IPublicModelSkeletonItem } from '@cc/lowcode-types';
import { Dock, IWidget, PanelDock, Widget } from '@cc/lowcode-editor-skeleton';
import { skeletonItemSymbol } from '../symbols';

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: IWidget | Widget | Dock | PanelDock;

  constructor(skeletonItem: IWidget | Widget | Dock | PanelDock) {
    this[skeletonItemSymbol] = skeletonItem;
  }

  get name() {
    return this[skeletonItemSymbol].name;
  }

  get visible() {
    return this[skeletonItemSymbol].visible;
  }

  disable() {
    this[skeletonItemSymbol].disable?.();
  }

  enable() {
    this[skeletonItemSymbol].enable?.();
  }

  hide() {
    this[skeletonItemSymbol].hide();
  }

  show() {
    this[skeletonItemSymbol].show();
  }

  toggle() {
    this[skeletonItemSymbol].toggle();
  }
}
