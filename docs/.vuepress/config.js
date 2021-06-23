const pluginsConf = require('./config/plugins/index')
const headConfig = require('./config/head')
const themeConfig = require('./config/theme/index')

module.exports = {
	"title": "iChensw Blog",
	"description": "人活着总该干点什么事",
	"dest": "docs/.vuepress/dist",
	"port": "8182",
	// 头部
	"head": headConfig,
	// 引入主题皮肤
	"theme": "reco",
	// 配置主题
	"themeConfig": themeConfig,
	"markdown": {
		"lineNumbers": true
	},
	"locales": {
		'/': {
			lang: 'zh-CN',
		},
	},
	plugins: pluginsConf,
}
