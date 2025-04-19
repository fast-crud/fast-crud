module.exports = {
    // vite:{
    //     ssr: {
    //         noExternal: ['segmentit']
    //     }
    // },
    sitemap: {
        hostname: 'http://fast-crud.docmirror.cn'
    },
    title: 'FastCrud',
    description: '面向配置的CRUD编程.',
    //Add a wildcard at the end of the search
    wildcard: false,
    //The length of the result search preview item
    previewLength: 62,
    head: [
        [
            'meta',
            {
                name: 'viewport',
                content:
                    'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
            },
        ],
        ['meta', {name: 'keywords', content: 'fast-crud、fs-admin'}],
        ['link', {rel: 'icon', href: '/favicon.ico'}],
    ],

    themeConfig: {
        logo: '/images/logo.svg',
        search: {
            provider: 'local',
            options: {
                detailedView: true,
                translations: {
                    button: {
                        buttonText: '搜索文档',
                        buttonAriaLabel: '搜索文档'
                    },
                    modal: {
                        noResultsText: '无法找到相关结果',
                        resetButtonTitle: '清除查询条件',
                        footer: {
                            selectText: '选择',
                            closeText: '关闭',
                            navigateText: '切换'
                        }
                    }
                }
            }
        },
        // algolia: {
        //     appId: 'MS0LML0LJG',
        //     apiKey: 'f84fe913d9e34f1c1427e69a64152c2d',
        //     indexName: 'crawler_fast-crud',
        //     schedule: 'every 1 day at 3:00 pm',
        // },
        // search: true,
        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    items: [
                        {text: '介绍', link: '/guide/'},
                        {text: '启动示例', link: '/guide/start/demo'},
                        {text: '第一个CRUD', link: '/guide/start/first'},
                        {text: '集成到你的项目', link: '/guide/start/integration'},
                        {text: '国际化', link: '/guide/start/i18n'},
                        {text: '图标', link: '/guide/start/icon'},
                        {text: '新手必看', link: '/guide/start/grow'},
                        {text: '通用规则', link: '/guide/start/tenet'},
                        {text: '常见需求', link: '/guide/start/useful'}
                    ],
                },
                {
                    text: '进阶',
                    items: [
                        {text: '基于配置', link: '/guide/advance/options'},
                        {text: '配置总览', link: '/guide/advance/struct'},
                        {text: '配置覆盖', link: '/guide/advance/cover'},
                        {text: '字段配置', link: '/guide/advance/component'},
                        {text: '字段类型', link: '/guide/advance/column-type'},
                        {text: '数据字典', link: '/guide/advance/dict'},
                        {text: '动态计算', link: '/guide/advance/compute'},
                        {
                            text: '表单用法',
                            link: '/guide/advance/form'
                        },
                        {text: '自定义组件', link: '/guide/advance/custom-component'},
                        {text: '自定义布局', link: '/guide/advance/layout'},
                        {text: '插槽', link: '/guide/advance/slots'},
                        {text: '扩展', link: '/guide/advance/extends'},
                        {text: '权限控制', link: '/guide/advance/permission'},

                        {text: '入门常见问题', link: '/guide/advance/improve'},
                        {text: 'Element虚拟表格', link: '/guide/advance/el-table-v2'},
                    ],
                },
                {
                    text: '其他',
                    items: [
                        {text: '升级', link: '/guide/other/upgrade'},
                        {text: '贡献代码', link: '/guide/other/contribution'},
                        {text: 'changelogs', link: '/guide/other/changelogs/index'},
                        {text: '问AI', link: '/guide/other/helper'},
                        {text: '其他疑难问题', link: '/guide/other/questions'},
                        {text: '联系作者', link: '/guide/other/contact'},
                        {text: '捐赠', link: '/guide/other/donate'}
                    ],
                },
                {
                    text: 'ChangeLogs',
                    items: [
                        {text: 'main', link: '/guide/other/changelogs/CHANGELOG'},
                        {text: 'fast-crud', link: '/guide/other/changelogs/packages/fast-crud/CHANGELOG'},
                        {
                            text: 'fast-extends',
                            link: '/guide/other/changelogs/packages/extends/fast-extends/CHANGELOG'
                        },
                        {text: 'ui-antdv', link: '/guide/other/changelogs/packages/ui/ui-antdv/CHANGELOG'},
                        {text: 'ui-element', link: '/guide/other/changelogs/packages/ui/ui-element/CHANGELOG'},
                    ],
                },
            ],
            '/api/': [
                {
                    text: "配置",
                    items: [
                        {
                            text: 'InstallOptions',
                            link: '/api/install-options'
                        },
                        {
                            text: 'Use',
                            link: '/api/use'
                        },
                        {
                            text: 'CrudOptions',
                            items: [
                                {text: '概览', link: '/api/crud-options/index'},
                                {text: 'request', link: '/api/crud-options/request'},
                                {
                                    text: 'columns',
                                    items: [
                                        {text: "字段复合配置", link: '/api/crud-options/columns/self'},
                                        {text: "column", link: '/api/crud-options/columns/column'},
                                        {text: "search", link: '/api/crud-options/columns/search'},
                                        {text: "form", link: '/api/crud-options/columns/form'},
                                        {text: "viewForm", link: '/api/crud-options/columns/viewForm'},
                                        {text: "addForm", link: '/api/crud-options/columns/addForm'},
                                        {text: "editForm", link: '/api/crud-options/columns/editForm'},
                                    ]
                                },
                                {text: 'form', link: '/api/crud-options/form'},
                                {text: 'search', link: '/api/crud-options/search'},
                                {text: 'actionbar', link: '/api/crud-options/actionbar'},
                                {text: 'toolbar', link: '/api/crud-options/toolbar'},
                                {text: 'tabs', link: '/api/crud-options/tabs'},
                                {text: 'viewForm', link: '/api/crud-options/viewForm'},
                                {text: 'addForm', link: '/api/crud-options/addForm'},
                                {text: 'editForm', link: '/api/crud-options/editForm'},
                                {text: 'table', link: '/api/crud-options/table'},
                                {text: 'rowHandle', link: '/api/crud-options/rowHandle'},
                                {text: 'pagination', link: '/api/crud-options/pagination'},
                                {text: 'container', link: '/api/crud-options/container'},
                                {text: 'settings', link: '/api/crud-options/settings'},
                            ]
                        },
                        {
                            text: 'CommonOptions',
                            link: '/api/common-options',
                        },
                        {
                            text: 'crudExpose',
                            link: '/api/expose'
                        },
                        {
                            text: 'Dict数据字典',
                            link: '/api/dict'
                        },
                        {
                            text: '官方字段类型列表',
                            link: '/api/types'
                        },

                    ]
                },
                {
                    text: '组件',
                    items: [
                        {
                            text: '基础组件', items: [
                                {text: 'fs-page', link: "/api/components/crud/container/fs-page"},
                                {text: 'fs-container', link: "/api/components/crud/container/fs-container"},
                                {text: 'fs-layout-default', link: "/api/components/crud/container/fs-layout-default"},
                                {text: 'fs-layout-card', link: "/api/components/crud/container/fs-layout-card"},
                                {text: 'fs-button', link: "/api/components/crud/basic/fs-button"},
                                {text: 'fs-icon', link: "/api/components/crud/basic/fs-icon"},
                                {text: 'fs-iconify', link: "/api/components/crud/basic/fs-iconify"},
                                {text: 'fs-icon-svg', link: "/api/components/crud/basic/fs-icon-svg"},
                                {text: 'fs-loading', link: "/api/components/crud/basic/fs-loading"},
                                {text: 'fs-label', link: "/api/components/crud/basic/fs-label"},
                                {text: 'fs-render', link: "/api/components/crud/render/fs-render"},
                                {text: 'fs-slot-render', link: "/api/components/crud/render/fs-slot-render"},
                                {text: 'fs-component-render', link: "/api/components/crud/render/fs-component-render"},
                            ]
                        },
                        {
                            text: 'crud组件',
                            items: [
                                {text: 'fs-crud', link: "/api/components/crud/fs-crud"},
                                {text: 'fs-actionbar', link: "/api/components/crud/actionbar/index"},
                                {text: 'fs-search', link: "/api/components/crud/search/index"},
                                {text: 'fs-search-layout-default', link: "/api/components/crud/search/layout-default"},
                                {text: 'fs-toolbar', link: "/api/components/crud/toolbar/index"},
                                {
                                    text: 'fs-table-columns-filter',
                                    link: "/api/components/crud/toolbar/fs-table-columns-filter/index"
                                },
                                {text: 'fs-toolbar', link: "/api/components/crud/toolbar/index"},
                                {text: 'fs-table', link: "/api/components/crud/crud/fs-table"},
                                {text: 'fs-row-handle', link: "/api/components/crud/crud/fs-row-handle"},
                                {text: 'fs-form-wrapper', link: "/api/components/crud/crud/fs-form-wrapper"},
                                {text: 'fs-form-provider', link: "/api/components/crud/crud/fs-form-provider"},
                                {text: 'fs-form', link: "/api/components/crud/crud/fs-form"},
                                {text: 'fs-form-item', link: "/api/components/crud/crud/fs-form-item"},
                                {text: 'fs-form-helper', link: "/api/components/crud/crud/fs-form-helper"},
                                {text: 'fs-cell', link: "/api/components/crud/crud/fs-cell"},
                                {text: 'fs-editable-cell', link: "/api/components/crud/crud/editable/fs-editable-cell"},
                            ]
                        },
                        {
                            text: '业务组件', items: [
                                {text: 'fs-date-format', link: "/api/components/crud/extends/fs-date-format"},
                                {text: 'fs-dict-cascader', link: "/api/components/crud/extends/fs-dict-cascader"},
                                {
                                    text: 'fs-dict-cascader-format',
                                    link: "/api/components/crud/extends/fs-dict-cascader-format"
                                },
                                {text: 'fs-dict-checkbox', link: "/api/components/crud/extends/fs-dict-checkbox"},
                                {text: 'fs-dict-radio', link: "/api/components/crud/extends/fs-dict-radio"},
                                {text: 'fs-dict-select', link: "/api/components/crud/extends/fs-dict-select"},
                                {text: 'fs-dict-switch', link: "/api/components/crud/extends/fs-dict-switch"},
                                {text: 'fs-dict-tree', link: "/api/components/crud/extends/fs-dict-tree"},
                                {text: 'fs-values-format', link: "/api/components/crud/extends/fs-values-format"},
                                {text: 'fs-table-select', link: "/api/components/crud/extends/fs-table-select"},
                                {text: 'fs-editable-select', link: "/api/components/crud/extends/fs-editable-select"},
                                {text: 'fs-icon-selector', link: "/api/components/crud/extends/fs-icon-selector/"},
                            ]
                        },
                        {
                            text: '扩展组件', items: [
                                {
                                    text: '上传组件', items: [
                                        {
                                            text: "fs-cropper",
                                            link: '/api/components/extends/uploader/components/fs-cropper'
                                        },
                                        {
                                            text: "fs-cropper-uploader",
                                            link: '/api/components/extends/uploader/components/fs-cropper-uploader'
                                        },
                                        {
                                            text: "fs-file-uploader",
                                            link: '/api/components/extends/uploader/components/fs-file-uploader'
                                        },
                                        {
                                            text: "fs-images-format",
                                            link: '/api/components/extends/uploader/components/fs-images-format'
                                        },
                                        {
                                            text: "fs-files-format",
                                            link: '/api/components/extends/uploader/components/fs-files-format'
                                        },
                                        {
                                            text: "FsUploaderForm",
                                            link: '/api/components/extends/uploader/components/fs-uploader-form'
                                        },
                                        {
                                            text: "FsUploaderCos",
                                            link: '/api/components/extends/uploader/components/fs-uploader-cos'
                                        },
                                        {
                                            text: "FsUploaderAlioss",
                                            link: '/api/components/extends/uploader/components/fs-uploader-alioss'
                                        },
                                        {
                                            text: "FsUploaderQiniu",
                                            link: '/api/components/extends/uploader/components/fs-uploader-qiniu'
                                        },
                                        {
                                            text: "FsUploaderS3",
                                            link: '/api/components/extends/uploader/components/fs-uploader-s3'
                                        }
                                    ]
                                },
                                {
                                    text: '富文本编辑器', items: [
                                        {
                                            text: "fs-editor-wang",
                                            link: '/api/components/extends/editor/components/fs-editor-wang/index'
                                        }, {
                                            text: "fs-editor-wang5",
                                            link: '/api/components/extends/editor/components/fs-editor-wang5/index'
                                        }
                                    ]
                                },
                                {
                                    text: 'JsonEditor', items: [
                                        {
                                            text: "fs-json-editor",
                                            link: '/api/components/extends/json/components/fs-json-editor'
                                        }
                                    ]
                                },
                                {
                                    text: 'Copyable', items: [
                                        {
                                            text: "fs-copyable",
                                            link: '/api/components/extends/copyable/components/fs-copyable'
                                        }
                                    ]
                                },
                                {
                                    text: 'Time', items: [
                                        {
                                            text: "fs-time-humanize",
                                            link: '/api/components/extends/time/components/fs-time-humanize'
                                        }
                                    ]
                                },
                                {
                                    text: '输入', items: [
                                        {
                                            text: "fs-phone-input",
                                            link: '/api/components/extends/input/components/fs-phone-input/fs-phone-input'
                                        }
                                    ]
                                }
                            ]
                        },
                    ],
                }
            ]
        },
        author: 'Greper',
        nav: [
            {text: '首页', link: '/'},
            {text: '指南', link: '/guide/'},
            {text: 'API', link: '/api/'},
            {text: "d.ts", link: "http://fast-crud.docmirror.cn/d.ts/modules.html"},
            {text: 'FsAdmin', link: '/admin/'},
            {text: '示例', link: '/demo/'},
            {text: 'github', link: 'https://github.com/fast-crud/fast-crud'},
            {text: 'gitee', link: 'https://gitee.com/fast-crud/fast-crud'},
        ],
    },
}

