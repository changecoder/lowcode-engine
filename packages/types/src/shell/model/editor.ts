import { EventEmitter } from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'

import * as GlobalEvent from '../../event'
import { IPublicTypeAssetsJson } from '../type'
import { IPublicApiEvent } from '..'

export interface IPublicModelEditor extends StrictEventEmitter<EventEmitter, GlobalEvent.EventConfig> {

  get: (keyOrType: any) => any

  set: (key: any, data: any) => void | Promise<void>
  
  get eventBus(): IPublicApiEvent
  
  setAssets(assets: IPublicTypeAssetsJson): void
}