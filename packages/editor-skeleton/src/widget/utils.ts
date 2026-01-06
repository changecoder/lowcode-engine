import { isVNode } from 'vue';
import { IPublicTypeIconType, IPublicTypeTitleContent, TipContent } from '@cc/lowcode-types';
import { isI18nData, isTitleConfig } from '@cc/lowcode-utils';

export function composeTitle(
  title?: IPublicTypeTitleContent,
  icon?: IPublicTypeIconType,
  tip?: TipContent,
  tipAsTitle?: boolean,
  noIcon?: boolean
) {
  let _title: IPublicTypeTitleContent | undefined;
  if (!title) {
    _title = {};
    if (!icon || tipAsTitle) {
      _title = {
        label: tip,
      };
      tip = undefined;
    }
  } else {
    _title = title;
  }

  if (icon || tip) {
    if (typeof _title !== 'object' || isVNode(_title) || isI18nData(_title)) {
      if (isVNode(_title)) {
        if (_title.type === 'svg') {
          if (!icon) {
            icon = _title;
          }
        }
      }
      _title = {
        label: _title,
        icon,
        tip,
      };
    } else {
      _title = {
        ..._title,
        icon,
        tip,
      };
    }
  }
  if (isTitleConfig(_title) && noIcon) {
    if (!isVNode(_title)) {
      _title.icon = undefined;
    }
  }
  return _title;
}
