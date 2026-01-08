import { isVNode, h, cloneVNode, Component } from 'vue';
import { VueNode } from '@cc/lowcode-types';
import { isVueComponent } from './check-types';

export function createContent(content: VueNode, props?: Record<string, unknown>): VueNode {
  if (isVNode(content)) {
    return props ? cloneVNode(content, props) : content;
  }
  if (isVueComponent(content)) {
    return h(content as Component, props);
  }
  return content;
}
