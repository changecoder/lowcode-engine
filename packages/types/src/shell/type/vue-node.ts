import { Component, FunctionalComponent, VNode } from 'vue';

export type VueNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | VNode
  | Component
  | FunctionalComponent
  | (() => VueNode)
  | VueNode[];
