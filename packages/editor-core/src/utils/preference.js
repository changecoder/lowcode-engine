import store from 'store'

const STORAGE_KEY_PREFIX = 'ale'

export default class Preference {
  getStorageKey(key, module) {
    const moduleKey = module || '__inner__'
    return `${STORAGE_KEY_PREFIX}_${moduleKey}.${key}`
  }

  set(key, value, module) {
    if (!key || typeof key !== 'string' || key.length === 0) {
      console.error('Invalid key when setting preference', key)
      return
    }
    const storageKey = this.getStorageKey(key, module)
    console.debug('storageKey:', storageKey, 'set with value:', value)
    store.set(storageKey, value)
  }

  get(key, module) {
    if (!key || typeof key !== 'string' || key.length === 0) {
      console.error('Invalid key when getting from preference', key)
      return
    }
    const storageKey = this.getStorageKey(key, module)
    const result = store.get(storageKey)
    console.debug('storageKey:', storageKey, 'get with result:', result)
    return result
  }

  contains(key, module) {
    if (!key || typeof key !== 'string' || key.length === 0) {
      console.error('Invalid key when getting from preference', key)
      return false
    }
    const storageKey = this.getStorageKey(key, module)
    const result = store.get(storageKey)

    return !(result === undefined || result === null)
  }
}