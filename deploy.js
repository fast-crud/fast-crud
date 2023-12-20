const http = require("axios")
const exec = require('child_process').exec;
const fs = require("fs")

// 同步npmmirror的包
async function getPackages(directoryPath) {
    return new Promise((resolve, reject) => {
        // 读取目录下的文件和目录列表
        fs.readdir(directoryPath, {withFileTypes: true}, (err, files) => {
            if (err) {
                console.log('无法读取目录:', err);
                reject(err)
                return;
            }

            // 过滤仅保留目录
            const directories = files
                .filter(file => file.isDirectory())
                .map(directory => directory.name);

            console.log('目录列表:', directories);
            resolve(directories)
        });
    })

}

async function getAllPackages(){
    const base = ["fast-crud",'fast-extends']
    const ui =await getPackages("./packages/ui")

    return ui.concat(base)
}

async function sync(){
    const packages = await getAllPackages()
    for(const pkg of packages){
        await http({
            url: `http://registry-direct.npmmirror.com/@fast-crud/${pkg}/sync?sync_upstream=true`,
            method: 'PUT',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: {}
        })
        console.log(`sync success:${pkg}`)
        await sleep(10000)
    }
}




//builder
function execute(cmd){
    return new Promise((resolve,reject)=>{
        console.log("cmd executing: " + cmd)
        exec(cmd, function(error, stdout, stderr) {
            if(error){
                console.error(error);
                console.info(stderr)
                reject(error)
            }
            else{
                console.info(stdout)
                console.log("success");
                resolve(true)
            }
        });
    })
}

async function build(){
    await execute("cd ./packages/fast-admin/fs-admin-antdv/ && npm run build")
    await execute("cd ./packages/fast-admin/fs-admin-element/ && npm run build")
    await execute("cd ./packages/fast-admin/fs-admin-naive-ui/ && npm run build")
    await execute("npm run docs:build")
}



// trigger

const naive = "http://flow-openapi.aliyun.com/pipeline/webhook/Zm3TJyDtyFZgV4dtJiD1"
const doc = "http://flow-openapi.aliyun.com/pipeline/webhook/soOYdQ5sF3kLjTPJGmIO"
const antdv = "http://flow-openapi.aliyun.com/pipeline/webhook/HiL0uVYxfUnBzIMJZVXB"
const antdv4 = "http://flow-openapi.aliyun.com/pipeline/webhook/U6zdIwkJ56xWZvctCOkE"
const element = "http://flow-openapi.aliyun.com/pipeline/webhook/uFTI0XJ9RgqnofX7jpRD"

const webhooks = [doc,naive,antdv,antdv4,element]

async function sleep(time){
    return new Promise(resolve => {
        setTimeout(resolve,time)
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
        await sleep(10000)
    }

}

async function  start(){
    // await build()
    console.log("等待60秒")
    await sleep(60*1000)
    await sync()
    console.log("同步镜像完成，等待60秒")
    await sleep(160*1000)
    await trigger()
}

start()


/**
 * 打包前 修改 lerna
 * nodemodules @lerna-lite里面搜索如下
 * ('git', ['add', '--', ...files]
 * 改成 ('git', ['add', '.']
 */
