<template>
  <div :class="`lc-workbench ${className || ''}`"></div>
</template>
<script>
import './workbench.less'
export default {
  name: 'Workbench',
  props: {
    className: String
  }
}
</script>