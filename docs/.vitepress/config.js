module.exports = {
    title: 'FastCrud',
    description: '面向配置的CRUD编程.',
    head: [
        [
            'meta',
            {
                name: 'viewport',
                content:
                    'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
            },
        ],
        ['meta', {name: 'keywords', content: 'vite vui'}],
        ['link', {rel: 'icon', href: '/favicon.ico'}],
    ],
    themeConfig: {
        // search: true,
        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    children: [
                        {text: '介绍', link: '/guide/'},
                        {text: '启动示例', link: '/guide/start/demo'},
                        {text: '第一个CRUD', link: '/guide/start/first'},
                        {text: '集成到你的项目', link: '/guide/start/integration'}
                    ],
                },
                {
                    text: '进阶',
                    children: [
                        {text: '基于配置', link: '/guide/advance/options'},
                        {text: '组件配置', link: '/guide/advance/component'},
                        {text: '数据字典', link: '/guide/advance/dict'},
                        {text: '动态计算', link: '/guide/advance/compute'},
                        {text: '字段类型', link: '/guide/advance/types'},
                        {text: '插槽', link: '/guide/advance/slots'},
                        {text: '多级数据', link: '/guide/advance/nest-data'},
                    ],
                },
                {
                    text: '其他',
                    children: [
                        {text: '升级', link: '/guide/upgrade'},
                        {text: '常见问题', link: '/guide/questions'},
                        {text: '联系作者', link: '/guide/contact'},
                        {text: '捐赠', link: '/guide/donate'},
                    ],
                },
            ],
            '/api/': [
                {
                    text: 'options',
                    link: '/api/options'
                },
                {
                    text: '组件',
                    children: [
                        {
                            text: 'crud组件',
                            children: [
                                {text: 'fs-crud', link: "/api/components/crud/fs-crud"},
                                {text: 'fs-actionbar', link: "/api/components/crud/actionbar/index"},
                                {text: 'fs-search', link: "/api/components/crud/search/index"},
                                {text: 'fs-toolbar', link: "/api/components/crud/toolbar/index"},
                            ]
                        },
                        {text: '基础组件', link: '/api/components/basic'},
                        {text: '扩展组件', link: '/api/components/extends'},
                    ],
                }
            ]
        },
        author: 'Greper',
        nav: [
            {text: '首页', link: '/'},
            {text: '指南', link: '/guide/'},
            {text: 'API', link: '/api/'},
            {text: 'github', link: 'https://github.com/fast-crud/fast-crud'},
            {text: 'gitee', link: 'https://gitee.com/fast-crud/fast-crud'},
        ],
    },
}
7
