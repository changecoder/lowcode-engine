import simulator from './simulator'
import './index.less'

const win = window as any

if (typeof win !== 'undefined') {
  win.SimulatorRenderer = simulator
}