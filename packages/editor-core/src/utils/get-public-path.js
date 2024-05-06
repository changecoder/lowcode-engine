const publicPath = document.currentScript?.src.replace(/^(.*\/)[^/]+$/, '$1')

export function getPublicPath() {
  return publicPath || ''
}