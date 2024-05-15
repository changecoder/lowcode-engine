import { createApp } from 'vue'

import { Workspace } from '@cc/lowcode-workspace'

export const init = (container: HTMLElement) => {
  const app = createApp(Workspace, {})
  app.mount(container)
}