import { isObject } from '.'

export function isJSExpression(data: any): boolean {
  if (!isObject(data)) {
    return false
  }
  return data.type === 'JSExpression' && data.extType !== 'function'
}
