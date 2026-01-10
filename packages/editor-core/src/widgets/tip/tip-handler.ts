import { IEventBus, IPublicTypeTipConfig } from '@cc/lowcode-types';
import { createModuleEventBus } from '../../event-bus';
import { ref } from 'vue';

export interface TipOptions extends IPublicTypeTipConfig {
  target: HTMLElement;
}

const tipsMap = new Map<string, IPublicTypeTipConfig>();

export function postTip(id: string, props: IPublicTypeTipConfig | null) {
  if (props) {
    tipsMap.set(id, props);
  } else {
    tipsMap.delete(id);
  }
}

const findTip = (target: HTMLElement | null): TipOptions | null => {
  if (!target) {
    return null;
  }
  let loopupLimit = 10;
  while (target && loopupLimit-- > 0) {
    if (target.dataset && target.dataset.tip) {
      return {
        children: target.dataset.tip,
        direction: (target.dataset.direction || target.dataset.dir) as any,
        theme: target.dataset.theme,
        target,
      };
    }

    let child: HTMLElement | null = target.lastElementChild as HTMLElement;

    while (child) {
      if (child.dataset && child.dataset.role === 'tip') {
        const { tipId } = child.dataset;
        if (!tipId) {
          return null;
        }
        const tipProps = tipsMap.get(tipId);
        if (!tipProps) {
          return null;
        }
        return {
          ...tipProps,
          target,
        };
      }
      child = child.previousElementSibling as HTMLElement;
    }

    target = target.parentNode as HTMLElement;
  }

  return null;
};

class TipHandler {
  private emitter: IEventBus = createModuleEventBus('TipHandler');
  private _tip = ref<TipOptions | null>(null);
  private showDelay: number | null = null;
  private hideDelay: number | null = null;

  get tip() {
    return this._tip.value;
  }

  setTarget(target: HTMLElement) {
    const tip = findTip(target);
    if (tip) {
      if (this.tip) {
        if ((this.tip as any).target === (tip as any).target) {
          this._tip.value = tip;
          return;
        }
        if (this.showDelay) {
          clearTimeout(this.showDelay);
          this.showDelay = null;
          this._tip.value = null;
        } else {
          if (this.hideDelay) {
            clearTimeout(this.hideDelay);
            this.hideDelay = null;
          }
          this._tip.value = tip;
          this.emitter.emit('tipchange');
          return;
        }
      }

      this._tip.value = tip;
      if (this.hideDelay) {
        clearTimeout(this.hideDelay);
        this.hideDelay = null;
        this.emitter.emit('tipchange');
      } else {
        this.showDelay = setTimeout(() => {
          this.showDelay = null;
          this.emitter.emit('tipchange');
        }, 350) as any;
      }
    } else {
      if (this.showDelay) {
        clearTimeout(this.showDelay);
        this.showDelay = null;
      } else {
        this.hideDelay = setTimeout(() => {
          this.hideDelay = null;
        }, 100) as any;
      }
      this._tip.value = null;
      this.emitter.emit('tipchange');
    }
  }

  hideImmediately() {
    if (this.hideDelay) {
      clearTimeout(this.hideDelay);
      this.hideDelay = null;
    }
    if (this.showDelay) {
      clearTimeout(this.showDelay);
      this.showDelay = null;
    }
    this._tip.value = null;
    this.emitter.emit('tipchange');
  }

  onChange(func: () => void) {
    this.emitter.on('tipchange', func);
    return () => {
      this.emitter.removeListener('tipchange', func);
    };
  }
}

export const tipHandler = new TipHandler();
