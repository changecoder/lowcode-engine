export default class LowcodeOluginContext {
  constructor (options, contextApiAssembler) {
    const { pluginName = 'anonymous' } = options
    contextApiAssembler.assembleApis(this, pluginName)
  }
}