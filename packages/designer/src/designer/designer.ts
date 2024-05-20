import { IPublicModelEditor, IPublicTypeAssetsJson } from '@cc/lowcode-types'
import { IProject, Project } from '../project'

import './designer.less'

export interface DesignerProps {
  [key: string]: any
  editor: IPublicModelEditor
}

export interface IDesigner { 
  get editor(): IPublicModelEditor

  simulatorComponent?: any

  loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void>
}

export class Designer implements IDesigner {
  readonly project: IProject
  readonly editor: IPublicModelEditor
  simulatorComponent?: any
  private simulatorProps?: Record<string, any> | ((project: IProject) => object)

  get projectSimulatorProps(): any {
    return {
      ...(this.simulatorProps || {})
    }
  }

  constructor(props: DesignerProps) {
    const { editor, defaultSchema } = props
    this.editor = editor
    this.project = new Project(this, defaultSchema)
    this.setProps(props)
  }

  async loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void> {
    
  }

  setProps(nextProps: DesignerProps) {
    this.simulatorComponent = nextProps.simulatorComponent
    this.simulatorProps = nextProps.simulatorProps
  }
}