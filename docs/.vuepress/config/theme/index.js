const navConf = require('../nav')
const sidebarConf = require('../sidebar')

module.exports = {
    "lastUpdated": "上次更新时间", // string | boolean
    "type": "blog",
    // md文档标题最大为2级标题	
    "sidebarDepth": 2,
    // 默认情况下，侧边栏只会显示由当前活动页面的标题（headers）组成的链接，你可以将 themeConfig.displayAllHeaders 设置为 true 来显示所有页面的标题链接
    // "displayAllHeaders": true,
    "nav": navConf,
    "sidebar": sidebarConf,
    // 自动形成侧边栏导航
    "subSidebar": 'auto', // 在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    // 代码主题
    "codeTheme": 'tomorrow',
    "logo": "/img/avatar.jpg",
    //是否开启搜索
    "search": true,
    //最多的搜索建议条目
    "searchMaxSuggestions": 10,
    "author": "一条鱼",
    "authorAvatar": "/img/avatar.jpg",
    "record": '赣ICP备19013100号',
    "recordLink": 'https://beian.miit.gov.cn/',
    // 'cyberSecurityRecord': '公安部备案文案',
    // 'cyberSecurityLink': 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011002005177',
    "startYear": "2021",
    "valineConfig": {
        appId: 'Bq4aQ6EQfLokFLPhgYh24eqq-gzGzoHsz', // your appId
        appKey: 'HaieM93miBd53KRWktkw0Ldb', // your appKey
        placeholder: '来都来了，冒个泡再走呗...',
        visitor: true,
        recordIP: true
    },
    "blogConfig": {
            "tag": {
                "location": 2,
                "text": "标签"
            }
        },
        // 友链
        "friendLink": [{
            "title": "山岚",
            "desc": " Work in Home; Home is in 0713",
            "avatar": "https://blog.gobyte.cn//images/ha-002-small.png",
            "link": "https://blog.gobyte.cn/"
        },
        {
            "title": "vuepress-theme-reco",
            "desc": "A simple and beautiful vuepress Blog & Doc theme.",
            "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
            "link": "https://vuepress-theme-reco.recoluan.com"
        },
        {
            "title": "CHANX's Blog",
            "desc": "陈小白の博客",
            "avatar": "https://www.chanx.tech/avatar.png",
            "link": "https://www.chanx.tech"
        },
        {
            "title": "岛",
            "desc": "岛",
            "avatar": "https://shen-yu.gitee.io/images/ayer-side.svg",
            "link": "https://shen-yu.gitee.io/"
        },
        {
            "title": "君哥聊编程",
            "desc": "君哥聊编程、知码知天下",
            "avatar": "https://www.it235.com/avatar.png",
            "link": "https://www.it235.com/"
        },
        {
            "title": "XiaoCoder",
            "desc": "不是井里没有水，而是你挖的不够深",
            "avatar": "https://gitee.com/wyxhunk/blog-img/raw/2bdc9a4f5b067a8a57e39693f5ad9d38951a67f9/img/16096513318595.png",
            "link": "https://xyq0801.icu/"
        },
        {
            "title": "MyBird",
            "desc": "A simple blog, code repository, just keep blogging",
            "avatar": "https://mrbird.cc/images/blogImage.jpg",
            "link": "https://mrbird.cc/"
        },
		
		
		
    ],
}