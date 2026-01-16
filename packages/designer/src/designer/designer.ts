import { Component, ref } from 'vue';
import {
  IPublicModelEditor,
  IPublicTypeComponentMetadata,
  IShellModelFactory,
} from '@cc/lowcode-types';
import { IProject, Project } from '../project';

export interface IDesigner {
  readonly shellModelFactory: IShellModelFactory;
  readonly project: IProject;

  viewName: string | undefined;

  get editor(): IPublicModelEditor;
}

export interface DesignerProps {
  [key: string]: any;
  editor: IPublicModelEditor;
  className?: string;
  style?: object;
  viewName?: string;
  simulatorProps?: Record<string, any>;
  componentMetadatas?: IPublicTypeComponentMetadata[];
}

export class Designer implements IDesigner {
  readonly editor: IPublicModelEditor;
  readonly shellModelFactory: IShellModelFactory;
  readonly project: IProject;

  private props?: DesignerProps;
  private _simulatorComponent = ref<Component>();
  private _simulatorProps = ref<Record<string, any>>();

  viewName: string | undefined;

  get simulatorComponent(): Component | undefined {
    return this._simulatorComponent.value;
  }

  get simulatorProps(): Record<string, any> {
    if (typeof this._simulatorProps.value === 'function') {
      return this._simulatorProps.value(this.project);
    }
    return this._simulatorProps.value || {};
  }

  get projectSimulatorProps() {
    return {
      ...this.simulatorProps,
      project: this.project,
      designer: this,
    };
  }

  constructor(props: DesignerProps) {
    const { editor, viewName, shellModelFactory } = props;
    this.editor = editor;
    this.viewName = viewName;
    this.shellModelFactory = shellModelFactory;

    this.project = new Project(this, props.defaultSchema, viewName);
  }

  setProps(nextProps: DesignerProps) {
    const props = this.props ? { ...this.props, ...nextProps } : nextProps;
    if (this.props) {
      if (props.simulatorComponent !== this.props.simulatorComponent) {
        this._simulatorComponent.value = props.simulatorComponent;
      }
      if (props.simulatorProps !== this.props.simulatorProps) {
        this._simulatorProps.value = props.simulatorProps;
      }
    } else {
      if (props.simulatorComponent) {
        this._simulatorComponent.value = props.simulatorComponent;
      }
      if (props.simulatorProps) {
        this._simulatorProps.value = props.simulatorProps;
      }
    }
    this.props = props;
  }
}
