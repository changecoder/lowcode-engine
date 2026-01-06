import { IntlMessageFormat } from 'intl-messageformat';
import { IPublicTypeI18nData, VueNode } from '@cc/lowcode-types';
import { isI18nData } from '@cc/lowcode-utils';
import { globalLocale } from './global-locale';

const injectVars = (msg: string, params: any, locale: string): string => {
  if (!msg || !params) {
    return msg;
  }
  const formater = new IntlMessageFormat(msg, locale);
  return formater.format(params as any) as string;
};

const generateTryLocales = (locale: string) => {
  const tries = [locale, locale.replace('-', '_')];
  if (locale === 'zh-TW' || locale === 'en-US') {
    tries.push('zh-CN');
    tries.push('zh_CN');
  } else {
    tries.push('en-US');
    tries.push('en_US');
    if (locale !== 'zh-CN') {
      tries.push('zh-CN');
      tries.push('zh_CN');
    }
  }
  return tries;
};

export function intl(data: IPublicTypeI18nData | string, params?: object): VueNode {
  if (!isI18nData(data)) {
    return data;
  }
  if (data.intl) {
    return data.intl;
  }
  const locale = globalLocale.getLocale();
  const tries = generateTryLocales(locale);
  let msg: string | undefined;
  for (const lan of tries) {
    msg = data[lan];
    if (msg != null) {
      break;
    }
  }
  if (msg == null) {
    return `##intl@${locale}##`;
  }
  return injectVars(msg, params, locale);
}
