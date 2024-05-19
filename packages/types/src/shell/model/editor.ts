import { EventEmitter } from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'

import * as GlobalEvent from '../../event'
import { IPublicTypeAssetsJson } from '../type'

export interface IPublicModelEditor extends StrictEventEmitter<EventEmitter, GlobalEvent.EventConfig> {

  get: (keyOrType: any) => any

  setAssets(assets: IPublicTypeAssetsJson): void
}