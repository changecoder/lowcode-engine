import renderer from './renderer'
import './index.less'

const win = window as any

if (typeof win !== 'undefined') {
  win.SimulatorRenderer = renderer
}

export default renderer