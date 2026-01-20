import { AssetLevel, AssetLevels, AssetList, AssetType } from '@cc/lowcode-types';

import { BuiltinSimulatorHost } from './host';
import { assetItem, isAssetBundle, isAssetItem, isCSSUrl } from '@cc/lowcode-utils';

export function createSimulator(
  host: BuiltinSimulatorHost,
  iframe: HTMLIFrameElement,
  vendors: AssetList = []
): Promise<any> {
  const win: any = iframe.contentWindow;
  const doc = iframe.contentDocument!;

  const innerPlugins = host.designer.editor.get('innerPlugins');

  win.CCLowCodeEngine = innerPlugins._getLowCodePluginContext({});
  win.LCSimulatorHost = host;
  win._ = window._;

  const styles: any = {};
  const scripts: any = {};
  AssetLevels.forEach(lv => {
    styles[lv] = [];
    scripts[lv] = [];
  });

  function parseAssetList(assets: AssetList, level?: AssetLevel) {
    for (let asset of assets) {
      if (!asset) {
        continue;
      }
      if (isAssetBundle(asset)) {
        if (asset.assets) {
          parseAssetList(
            Array.isArray(asset.assets) ? asset.assets : [asset.assets],
            asset.level || level
          );
        }
        continue;
      }
      if (Array.isArray(asset)) {
        parseAssetList(asset, level);
        continue;
      }
      if (!isAssetItem(asset)) {
        asset = assetItem(isCSSUrl(asset) ? AssetType.CSSUrl : AssetType.JSUrl, asset, level)!;
      }
      const id = asset.id ? ` data-id="${asset.id}"` : '';
      const lv = asset.level || level || AssetLevel.Environment;
      const scriptType = asset.scriptType ? ` type="${asset.scriptType}"` : '';
      if (asset.type === AssetType.JSUrl) {
        scripts[lv].push(`<script src="${asset.content}"${id}${scriptType}></script>`);
      } else if (asset.type === AssetType.JSText) {
        scripts[lv].push(`<script${id}${scriptType}>${asset.content}</script>`);
      } else if (asset.type === AssetType.CSSUrl) {
        styles[lv].push(`<link rel="stylesheet" href="${asset.content}"${id} />`);
      } else if (asset.type === AssetType.CSSText) {
        styles[lv].push(`<style type="text/css"${id}>${asset.content}</style>`);
      }
    }
  }

  parseAssetList(vendors);

  const styleFrags = Object.keys(styles)
    .map(key => {
      return `${styles[key].join('\n')}<meta level="${key}" />`;
    })
    .join('');
  const scriptFrags = Object.keys(scripts)
    .map(key => {
      return scripts[key].join('\n');
    })
    .join('');

  // 使用 DOM API 替代 document.write() 以避免浏览器警告
  doc.open();
  
  // 创建完整的 HTML 结构
  const html = doc.createElement('html');
  html.className = 'engine-design-mode';
  
  const head = doc.createElement('head');
  const metaCharset = doc.createElement('meta');
  metaCharset.setAttribute('charset', 'utf-8');
  head.appendChild(metaCharset);
  
  // 使用临时容器解析样式标签
  const styleContainer = doc.createElement('div');
  styleContainer.innerHTML = styleFrags;
  
  // 将样式和 meta 标签添加到 head
  Array.from(styleContainer.children).forEach(node => {
    head.appendChild(node);
  });
  
  // 创建 body
  const body = doc.createElement('body');
  
  // 使用临时容器解析脚本标签，需要重新创建以确保脚本执行
  const scriptContainer = doc.createElement('div');
  scriptContainer.innerHTML = scriptFrags;
  
  // 重新创建脚本元素以确保它们能够执行
  Array.from(scriptContainer.querySelectorAll('script')).forEach(oldScript => {
    const newScript = doc.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    if (oldScript.type) {
      newScript.type = oldScript.type;
    }
    if (oldScript.getAttribute('data-id')) {
      newScript.setAttribute('data-id', oldScript.getAttribute('data-id')!);
    }
    body.appendChild(newScript);
  });
  
  html.appendChild(head);
  html.appendChild(body);
  
  // 替换文档内容
  if (doc.documentElement) {
    doc.replaceChild(html, doc.documentElement);
  } else {
    doc.appendChild(html);
  }
  
  doc.close();

  return new Promise(resolve => {
    const renderer = win.SimulatorRenderer;
    if (renderer) {
      return resolve(renderer);
    }
    const loaded = () => {
      resolve(win.SimulatorRenderer || host.renderer);
      win.removeEventListener('load', loaded);
    };
    win.addEventListener('load', loaded);
  });
}
