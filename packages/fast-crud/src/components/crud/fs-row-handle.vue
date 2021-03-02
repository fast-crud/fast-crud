<template>
  <div class="fs-row-handle">
    <template  v-for="(item, index) in computedHandleBtns" :key="index">
      <fs-button v-if="item.show!==false"
                 class="row-handle-btn"
                 @click.stop="item.doClick(item,index)"
                 v-bind="item"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import FsButton from '../basic/fs-button'
import _ from 'lodash-es'
import traceUtil from '../../utils/util.trace'
import { useI18n } from '../../local'
export default defineComponent({
  name: 'fs-row-handle',
  emits: ['handle'],
  components: {
    // eslint-disable-next-line vue/no-unused-components
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
    traceUtil.trace('fs-row-handler')
    const { t } = useI18n()
    const doClick = (item) => {
      const e = { key: item.key, btn: item, ...props.scope }
      if (item.click) {
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
          text: t('fs.rowHandle.view.text')
        },
        edit: {
          key: 'edit',
          type: 'primary',
          doClick,
          order: 2,
          text: t('fs.rowHandle.edit.text')
        },
        remove: {
          key: 'remove',
          type: 'danger',
          doClick,
          order: 3,
          text: t('fs.rowHandle.remove.text')
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
})
</script>

<style lang="less">
.fs-row-handle{
  .row-handle-btn{
    margin-top:2px;
    margin-bottom: 2px;
  }
  .ant-btn{
    margin-left:2px;
    margin-right:2px;
  }
}
</style>
