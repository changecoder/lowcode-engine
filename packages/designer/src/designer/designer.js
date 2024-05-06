import { Project } from '../project'

export class Designer {

  get simulatorProps() {
    if (typeof this._simulatorProps === 'function') {
      return this._simulatorProps(this.project)
    }
    return this._simulatorProps || {}
  }

  get projectSimulatorProps() {
    return {
      ...this.simulatorProps,
      project: this.project,
      designer: this,
      onMount: (simulator) => {
        this.project.mountSimulator(simulator)
        this.editor.set('simulator', simulator)
      }
    }
  }

  constructor(props) {
    const { editor, viewName } = props
    this.props = props
    this.editor = editor
    this.viewName = viewName
    this.setProps(props)

    this.project = new Project(this, props.defaultSchema, viewName)
  }

  setProps(nextProps) {
    const props = this.props ? { ...this.props, ...nextProps } : nextProps
    if (this.props) {
      if (props.simulatorProps !== this.props.simulatorProps) {
        this._simulatorProps = props.simulatorProps
        // 重新 setupSelection
        if (props.simulatorProps?.designMode !== this.props.simulatorProps?.designMode) {
          this.setupSelection()
        }
      }
    } else {
      if (props.simulatorProps) {
        this._simulatorProps = props.simulatorProps
      }
    }
    this.props = props
  }

  setupSelection = () => {
    
  }
}