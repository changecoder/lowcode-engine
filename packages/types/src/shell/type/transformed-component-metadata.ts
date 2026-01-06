import { IPublicTypeComponentMetadata, IPublicTypeConfigure, IPublicTypeFieldConfig } from '.';

export interface IPublicTypeTransformedComponentMetadata extends IPublicTypeComponentMetadata {
  configure: IPublicTypeConfigure & { combined?: IPublicTypeFieldConfig[] };
}
