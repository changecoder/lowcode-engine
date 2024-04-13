import TopArea from './top-area'
import LeftArea from './left-area'

import './workbench.less'

export default {
  name: 'Workbench',
  props: {
    className: String,
    skeleton: Object,
    topAreaItemClassName: String
  },
  render() {
    const { className, skeleton, topAreaItemClassName } = this
    return (
      <div class={`lc-workbench ${className || ''}`}>
        <TopArea area={skeleton.topArea} itemClassName={topAreaItemClassName} />
        <div class='lc-workbench-body'>
          <LeftArea area={skeleton.leftArea} />
        </div>
      </div>
    )
  }
}