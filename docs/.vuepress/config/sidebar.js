module.exports =
{
	// /blogs/Vue/：指向文件夹路径，此处需要与nav一一对应关联上，括号内的为子内容
	'/blogs/Vue/': [
		{
			title: "Vue",
			path: "",
			collapsable: false, // 开启折叠
			// collapsable: true, // 开启折叠
			children: [
				"VueBase",
				"VuePlus"
			]
		},
	],
	'/blogs/Storage/Spring/SpringSecurity/': [
		// 对象形式：分组显示，并且可折叠
		{
			title: "Spring Security",
			path: "",
			collapsable: false, // 开启折叠
			children: [
				'SpringSecurity'
			]
		},
	],
	'/blogs/Storage/Spring/SpringBoot/': [
		// 对象形式：分组显示，并且可折叠
		{
			title: "Spring Boot",
			path: "",
			collapsable: false, // 开启折叠
			children: [
				'SpringBootBase',
				'SpringBootPro',
				'SpringBootAndJDBC',
			]
		},
	],
	'/blogs/Storage/Spring/SpringCloud/': [
		// 对象形式：分组显示，并且可折叠
		{
			title: "Spring Cloud",
			path: "",
			collapsable: false, // 开启折叠
			children: [
				'Eureka',
				'Ribbon',
				'Hystrix',
				'Feign',
				'Zuul',
				'SpringCloud',
			]
		},
	],
	'/blogs/Storage/Docker/': [
		// 对象形式：分组显示，并且可折叠
		{
			title: "Docker",
			path: "",
			collapsable: false, // 开启折叠
			children: [
				"DockerUse",
			]
		},
	],
	'/blogs/Documents/': [
		{	
			title: "VuePress搭建博客",
			path: "VuepressUse"
		},{
			title: "VuePress部署到服务器",
			path: "BuildVuepress"
		}
	],
	'/blogs/IDEA/':	[
		{
			title: "IDEA中的Postman工具",
			path: "IDEAPostman"
		}
	],
	'/blogs/Others/Docker/': [
		{
			title: "Docker的使用",
			path: "DockerUse"
		}
	],
	'/blogs/Others/Linux/': [
		{
			title: "Linux基础命令",
			path: "LinuxBaseCMD"
		},
		{
			title: "Linux三剑客",
			path: "LinuxThreeTool"
		},
		{
			title: "Shell编程",
			path: "ShellProgram"
		}
	]
	
}