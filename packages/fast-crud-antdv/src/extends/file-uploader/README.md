
## file-uploader  文件上传组件
目前支持腾讯云cos、七牛、阿里云oss等三种对象存储的web端直传
#### 准备
 1. 创建相应的bucket，配置跨域访问等
 2. 生产环境还需配置获取相应的授权(以各平台上java为例)：
 * <a target="_blank" href="https://cloud.tencent.com/document/product/436/14048">腾讯云临时密钥</a>
 * <a target="_blank" href="https://help.aliyun.com/document_detail/100624.html">阿里云的sts</a>
 * <a target="_blank" href="https://developer.qiniu.com/kodo/sdk/1239/java#simple-uptoken">七牛获取token</a>
 * 后端实现参考：https://github.com/greper/d2-crud-plus-server.git
#### 引入
```javascript
import Vue from 'vue'
import d2Crud from 'd2-crud-x'
import { d2CrudPlus } from '../utils/d2-crud-plus'
import { D2pFileUploader } from 'd2p-extends'  //组件支持懒加载
import { request } from '@/api/service'
// 引入d2Crud
Vue.use(d2Crud)
// 引入d2CrudPlus
Vue.use(d2CrudPlus)

// 安装文件上传扩展插件
Vue.use(D2pFileUploader, {
  d2CrudPlus,
  defaultType: 'cos', //默认类型为腾讯云上传，可选值：【cos、qiniu、alioss】
  cos: {
    domain: 'https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com',
    bucket: 'd2p-demo-1251260344',
    region: 'ap-guangzhou',
    secretId: '', //
    secretKey: '', // 传了secretKey 和secretId 代表使用本地签名模式（不安全，生产环境不推荐）
    getAuthorization  (custom,context) { // 不传secretKey代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
      return request({ //请求后端获取sts授权
        url: '/upload/cos/getAuthorization',
        method: 'get'
      }).then(ret => {
        // 返回结构如下
        // ret.data:{
        //   TmpSecretId,
        //   TmpSecretKey,
        //   XCosSecurityToken,
        //   ExpiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
        // }
        return ret.data
      })
    }
  },
  alioss: {
    domain: 'https://d2p-demo.oss-cn-shenzhen.aliyuncs.com',
    bucket: 'd2p-demo',
    region: 'oss-cn-shenzhen',
    accessKeyId: '',
    accessKeySecret: '',
    getAuthorization  (custom, context) { // 不传accessKeySecret代表使用临时签名模式,此时此参数必传（安全，生产环境推荐）
      return request({ //请求后端获取sts授权
        url: '/upload/alioss/getAuthorization',
        method: 'get'
      }).then(ret => {
       // ret.data:{
       //   securityToken,
       //   accessKeySecret,
       //   accessKeyId,
       //   expiration
       // }
        return ret.data
      })
    }
  },
  qiniu: {
    bucket: 'd2p-demo',
    getToken (custom) {
      return request({ //请求后端获取token
        url: '/upload/qiniu/getToken',
        method: 'get'
      }).then(ret => {
        return ret.data // {token:xxx,expires:xxx}
      })
    },
    domain: 'http://pzrsldiu3.bkt.clouddn.com'
  }
})

```
#### 使用
配置type=avatar-uploader 即可   
type可选值：【avatar-uploader（头像上传） / image-uploader（多图片上传） / file-uploader（多文件上传）】

```javascript
export const crudOptions = {
  columns: [
    {
      title: '头像',
      key: 'avatar',
      type: 'avatar-uploader'
    }
  ]
}
```
#### 参数说明

```javascript
export const crudOptions = {
    columns: [
    {
      title: '图片',
      key: 'image',
      type: 'image-uploader',
      width: 200,
      form: {
        component: {
          props: {
            btnSize: 'small', // type=file-uploader时按钮的大小
            btnName: '选择文件',// type=file-uploader时按钮文字
            accept: '.png', // 接受的文件后缀类型
            suffix: '!200_200', //url后缀，用于图片样式处理，需要到对象存储平台配置样式
            type: 'cos', // 当前使用哪种存储后端【cos/qiniu/alioss】
            custom:{}, //自定义参数，可以在获取token、sts时传入不同的参数给后端
            elProps: { // 与el-uploader配置一致
              limit: 1 // 限制上传文件数量
            }
          }
        }
      }
    }  
  ]
 }
```

