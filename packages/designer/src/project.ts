export class Project {
  private data = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: []
  }
  private documentsMap = new Map<string, any>()
  documents: any[] = []

  constructor(readonly designer: any, schema?: any) {
    this.designer = designer
    this.load(schema)
  }

  load(schema: any) {
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      ...schema
    }
  }
}