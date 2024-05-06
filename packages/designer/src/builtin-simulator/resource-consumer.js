export default class ResourceConsumer {
  _firstConsumed = false
  
  waitFirstConsume(){
    if (this._firstConsumed) {
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      this.resolveFirst = resolve
    })
  }
}