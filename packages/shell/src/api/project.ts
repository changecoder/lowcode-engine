import { IProject as InnerProject } from '@cc/lowcode-designer';
import {
  IPublicApiProject,
  IPublicModelDocumentModel,
  IPublicTypeProjectSchema,
} from '@cc/lowcode-types';

import { DocumentModel as ShellDocumentModel } from '../model';
import { projectSymbol } from '../symbols';

const innerProjectSymbol = Symbol('innerProject');

export class Project implements IPublicApiProject {
  private readonly [innerProjectSymbol]: InnerProject;

  get [projectSymbol](): InnerProject {
    return this[innerProjectSymbol];
  }

  get currentDocument(): IPublicModelDocumentModel | null {
    return this.getCurrentDocument();
  }

  get documents(): IPublicModelDocumentModel[] {
    return this[projectSymbol].documents.map(doc => ShellDocumentModel.create(doc)!);
  }

  constructor(project: InnerProject) {
    this[innerProjectSymbol] = project;
  }

  static create(project: InnerProject) {
    return new Project(project);
  }

  importSchema(schema?: IPublicTypeProjectSchema): void {
    this[projectSymbol].load(schema, true);
  }

  getCurrentDocument(): IPublicModelDocumentModel | null {
    return ShellDocumentModel.create(this[projectSymbol].currentDocument);
  }
}
