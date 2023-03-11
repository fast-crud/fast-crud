const http = require("axios")
const naive = "http://flow-openapi.aliyun.com/pipeline/webhook/Zm3TJyDtyFZgV4dtJiD1"
const doc = "http://flow-openapi.aliyun.com/pipeline/webhook/soOYdQ5sF3kLjTPJGmIO"
const antdv = "http://flow-openapi.aliyun.com/pipeline/webhook/HiL0uVYxfUnBzIMJZVXB"
const element = "http://flow-openapi.aliyun.com/pipeline/webhook/uFTI0XJ9RgqnofX7jpRD"

const webhooks = [doc,naive,antdv,element]

async function sleep(){
    return new Promise(resolve => {
        setTimeout(resolve,1000)
    })
}

async function trigger(){
    for (const webhook of webhooks) {
        await http({
            url:webhook,
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            data:{}
        })
        console.log(`webhook success:${webhook}`)
        await sleep()
    }

}

trigger()


/**
 * 打包前 修改 lerna
 * nodemodules里面搜索如下
 * return childProcess.exec("git", ["add", "--", ...files], execOpts);
 */
