export interface IPublicTypePluginConfig {
  init(): Promise<void> | void
}
