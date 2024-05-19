import { IPublicModelEditor, IPublicTypeAssetsJson } from '@cc/lowcode-types'
import { IProject, Project } from '../project'

export interface DesignerProps {
  [key: string]: any
  editor: IPublicModelEditor
}

export interface IDesigner { 
  get editor(): IPublicModelEditor

  loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void>
}

export class Designer implements IDesigner {
  readonly project: IProject
  readonly editor: IPublicModelEditor

  constructor(props: DesignerProps) {
    const { editor, defaultSchema } = props
    this.editor = editor
    this.project = new Project(this, defaultSchema)
  }

  async loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void> {
    
  }
}