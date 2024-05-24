import { defineComponent, type PropType } from 'vue'
import TopArea from './top-area'
import LeftArea from './left-area'
import LeftFloatPane from './left-float-pane'
import MainArea from './main-area'
import { ISkeleton } from '../skeleton'

import './workbench.less'

export const Workbench = defineComponent({
  props: {
    className: String,
    skeleton: {
      type: Object as PropType<ISkeleton>,
      required: true
    },
    topAreaItemClassName: String
  },
  render() {
    const { className, topAreaItemClassName, skeleton } = this
    return <div class={['lc-workbench', className || '']}>
      <TopArea itemClassName={topAreaItemClassName} area={skeleton.topArea} />
      <div class="lc-workbench-body">
        <LeftArea area={skeleton.leftArea} />
        <LeftFloatPane area={skeleton.leftFloatArea as any} />
        <div class="lc-workbench-center">
          <MainArea area={skeleton.mainArea as any}/>
        </div>
    </div>
    </div>
  }
})