<template>
  <div class="fs-container">
    <div class="box">
      <div class="inner">
        <div class="header">
          <slot name="header"></slot>
        </div>
        <div class="body">
          <slot></slot>
        </div>
        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import traceUtil from '../../utils/util.trace'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'fs-container',
  setup () {
    traceUtil.trace('fs-container')
  }
})
</script>

<style lang="less">
.fs-container{
  &.compact{
    padding:0;
  }
  padding:0 20px;
  height: 100%;

  .box {
    height: 100%;
    width: 100%;
    position: relative;
    .inner{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .header{
        flex-shrink: 0;
      }
      .body{
        overflow-y: auto;
        flex:1
      }
      .footer{
        flex-shrink: 0;
      }
    }

  }
}

</style>
