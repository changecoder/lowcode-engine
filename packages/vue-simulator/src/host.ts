export class SimulatorHost {
  iframe: HTMLIFrameElement

  mountFrame(iframe: HTMLIFrameElement) {
    this.iframe = iframe

    this.load()

    this.bindEvents()
  }

  load() {

  }
  
  bindEvents() {
    const doc = this.iframe.contentDocument
    const mouseDown = (e: MouseEvent) => {
      console.log(e)
    }
    doc?.addEventListener('mousedown', mouseDown)
  }
}