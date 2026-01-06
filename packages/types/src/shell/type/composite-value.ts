import {
  IPublicTypeCompositeArray,
  IPublicTypeCompositeObject,
  IPublicTypeJSExpression,
  IPublicTypeJSFunction,
  IPublicTypeJSONValue,
  IPublicTypeJSSlot,
} from './value-type';

export type IPublicTypeCompositeValue =
  | IPublicTypeJSONValue
  | IPublicTypeJSExpression
  | IPublicTypeJSFunction
  | IPublicTypeJSSlot
  | IPublicTypeCompositeArray
  | IPublicTypeCompositeObject;
