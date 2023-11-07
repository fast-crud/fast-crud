<script setup lang="ts">
import {uiContext, useUi} from "@fast-crud/ui-interface";
import UiLabel from "@/components/ui-label.vue";
import {computed, ref} from "vue";
import UiAntdv4 from '@fast-crud/ui-antdv4'
import UiElement from '@fast-crud/ui-element'
import UiNaive from '@fast-crud/ui-naive'
import UiRender from "@/components/ui-render";
import {useDialog, useMessage, useNotification} from "naive-ui";
import {message as aMessage} from 'ant-design-vue'
const ui = computed(() => {
  const {ui} = useUi()
  return ui
})

const current = ref("antdv4")

const message = useMessage();
const notification = useNotification();
const messageBox = useDialog();


function currentChanged(val) {
  current.value = val
  if (val === 'antdv4') {
    const ui = UiAntdv4.set()
    ui.notification.info({message:"已切换到antdv4"})
    aMessage.info("已切换到antdv4")
  } else if (val === 'naive') {
    const ui = UiNaive.set()
    // @ts-ignore
    ui.init({ message, notification, messageBox });
    ui.notification.info({message:"已切换到naive ui"})

  } else {
    const ui = UiElement.set()
    ui.notification.info({message:"已切换到element"})
  }
}

const selectRef = ref()

const buttonRender = ()=>{
  return ui.value.button.render({
    props:{
      onClick(){
        console.log('clicked')
        ui.value.message.info({message:'点击按钮',content:'点击按钮 antdv'})
      },
    },
    slots:{default:()=> 'render测试' }
  })
}
const radioRender = ()=>{
  return ui.value.radioGroup.render({
    vModel:{
      ref:selectRef,
      key:'value'
    },
    slots:{default:()=> {
        return [
          ui.value.radio.render({value:'1',slots:{default:()=>'1'}}),
          ui.value.radio.render({value:"2",slots:{default:()=>'2'}})
        ]
      } }
  })
}

const radioButtonRender = ()=>{
  return ui.value.radioGroup.render({
    vModel:{
      ref:selectRef,
      key:'value'
    },
    slots:{default:()=> {
        return [
          ui.value.radioButton.render({value:"1",slots:{default:()=>'1'}}),
          ui.value.radioButton.render({value:"2",slots:{default:()=>'2'}})
        ]
      } }
  })
}

const buttonGroupRender = ()=>{
  return ui.value.buttonGroup.render({
    slots:{default:()=> {
        return [
          ui.value.button.render({slots:{default:()=>'按钮1'}}),
          ui.value.button.render({slots:{default:()=>'按钮2'}})
        ]
      } }
  })
}
</script>

<template>
  <div class="page-demo">
    <div class="demo-action">
      <ui-label label="当前ui">
        {{ current }}
      </ui-label>
      <ui-label label="切换ui">
        <component :is="ui.button.name" @click="currentChanged('antdv4')">Antdv4</component>
        <component :is="ui.button.name" @click="currentChanged('naive')">NaiveUi</component>
        <component :is="ui.button.name" @click="currentChanged('element')">ElementPlus</component>
      </ui-label>
    </div>
    <hr style="margin:5px"/>
    <div class="demo-list">
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>组件</th>
            <th>is写法</th>
            <th>render写法</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>button</td>
          <td>
            <component :is="ui.button.name">按钮</component>
          </td>
          <td>
            <ui-render :render-func="buttonRender"></ui-render>
          </td>
        </tr>
        <tr>
          <td>radio</td>
          <td>
            <component :is="ui.radioGroup.name" v-model:[ui.radioGroup.modelValue]="selectRef">
              <component :is="ui.radio.name" :[ui.radio.value]="'1'">1</component>
              <component :is="ui.radio.name" :[ui.radio.value]="'2'">2</component>
            </component>
          </td>
          <td>
            <ui-render :render-func="radioRender"></ui-render>
          </td>
        </tr>
        <tr>
          <td>radioButton</td>
          <td>
            <component :is="ui.radioGroup.name" v-model:[ui.radioGroup.modelValue]="selectRef">
              <component :is="ui.radioButton.name" :[ui.radioButton.value]="'1'">1</component>
              <component :is="ui.radioButton.name" :[ui.radioButton.value]="'2'">2</component>
            </component>
          </td>
          <td>
            <ui-render :render-func="radioButtonRender"></ui-render>
          </td>
        </tr>
        <tr>
          <td>buttonGroup</td>
          <td>
            <component :is="ui.buttonGroup.name">
              <component :is="ui.button.name" >按钮1</component>
              <component :is="ui.button.name" >按钮2</component>
            </component>
          </td>
          <td>
            <ui-render :render-func="buttonGroupRender"></ui-render>
          </td>
        </tr>

        </tbody>
      </n-table>
    </div>

  </div>
</template>

<style lang="less">
.page-demo {
  width: 100%;
  height: 100%;

  .demo-list{
    width:100%;
    table{
      width:100%;
    }
  }
}

</style>
