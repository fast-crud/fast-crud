<template>
  <div class="fs-row-handle">
    <template  v-for="(item, index) in computedHandleBtns">
      <fs-button :key="index"
                 v-if="item.show!==false"
                 class="row-handle-btn"
                 @click.stop="item.doClick(item,index)"
                 v-bind="item"
      />
    </template>
  </div>
</template>
<script>
import { computed } from 'vue'
import FsButton from '../basic/fs-button'
import _ from 'lodash-es'
export default {
  name: 'fs-row-handle',
  emits: ['handle'],
  components: {
    FsButton
  },
  props: {
    modelValue: {},
    view: {
      type: Object
    },
    edit: {
      type: Object
    },
    remove: {
      type: Object
    },
    custom: {
      type: Array
    },
    scope: {}
  },
  setup (props, ctx) {
    const doClick = (item) => {
      const e = { key: item.key, btn: item, ...props.scope }
      if (item?.click) {
        return item.click(e)
      }
      ctx.emit('handle', e)
    }
    const computedHandleBtns = computed(() => {
      const defBtns = {
        view: {
          key: 'view',
          doClick,
          order: 1,
          text: '查看'
        },
        edit: {
          key: 'edit',
          type: 'primary',
          doClick,
          order: 2,
          text: '编辑'
        },
        remove: {
          key: 'remove',
          type: 'danger',
          doClick,
          order: 3,
          text: '删除'
        }
      }
      const mergedBtns = _.merge(defBtns, { view: props.view, edit: props.edit, remove: props.remove })
      const btns = [
        mergedBtns.view,
        mergedBtns.edit,
        mergedBtns.remove
      ]

      if (props.custom && props.custom.length > 0) {
        for (const item of props.custom) {
          btns.push({
            doClick,
            order: 4,
            ...item
          })
        }
      }
      btns.sort((a, b) => { return a.order - b.order })
      return btns
    })

    return {
      computedHandleBtns
    }
  }
}
</script>

<style lang="less">
.fs-row-handle{
  .row-handle-btn{
    margin-top:2px;
    margin-bottom: 2px;
  }
}
</style>
