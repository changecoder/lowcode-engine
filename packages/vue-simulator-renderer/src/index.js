import simulator from './simulator'

const win = window

if (typeof win !== 'undefined') {
  win.SimulatorRenderer = simulator
}

export default simulator