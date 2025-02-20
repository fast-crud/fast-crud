# 新手必看

本章写给不是很熟悉`vue3`、`useFs`的小伙伴

## 一、index.vue和crud.tsx之间如何传值

很多新手不是很明白`index.vue`和`crud.tsx`之间如何传值，以下是两种传值方法，注意看示例代码中的`fooRef`、`callback`

###  1. index.vue 之间互传 crud.tsx

`index.vue 中创建ref`

```vue

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useFs} from "./@fast-crud/fast-crud";
import createCrudOptions from "./crud";
const props =defineProps({...})
const fooRef = ref(0)
const context: any = {
  fooRef //将fooRef 通过context传递给crud.tsx
  props,
};
const {crudRef, crudBinding, crudExpose} = useFs({createCrudOptions, context});

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
  // 这里可以调用从crud.tsx传递过来的callback
  context.callback()
});

</script>

```

`crud.ts`中使用`fooRef`
```tsx
import {CreateCrudOptionsProps, CreateCrudOptionsRet, dict} from "@fast-crud/fast-crud";
import {addRequest, delRequest, editRequest, pageRequest} from "./api";

export default function ({crudExpose, context}: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const {fooRef, props} = context  //从context中获取fooRef
    
    //这里可以放一个callback给index.vue
    context.callback = function () {
        console.log('callback, from crud.tsx')
    }
    return {
        crudOptions: {
            columns: {
                test: {
                    title: 'foo',
                    valueChange(scope) {
                        // 使用或者修改 fooRef
                        console.log(fooRef.value)
                        fooRef.value = scope.value
                    }
                }
            }
        }
    }
}
```


###  2. 直接将crud.tsx写在index.vue中

就没有什么传值的问题了，直接正常使用ref即可

```vue

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {CreateCrudOptionsProps, CreateCrudOptionsRet, useFs} from "@fast-crud/fast-crud";

const fooRef = ref(0)

function createCrudOptions({crudExpose}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      ...
      //使用或者修改 fooRef
    }
  }
}

const {crudRef, crudBinding, crudExpose} = useFs({createCrudOptions});
// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});

</script>
```
## 二、其他入门常见问题

[入门常见问题](../advance/improve.md)
