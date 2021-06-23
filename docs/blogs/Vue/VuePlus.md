---
title: 【Vue】进阶
date: 2021-01-05
sidebar: 'auto'
categories:
- Vue
tags:
- Vue高级
publish: true
---

:::tip

该篇文章总结了Vue的高阶知识，由于学习进度较慢，更新也会延迟。

:::

<!-- more -->

## Vue进阶

### 	第一章：Vue中的局部组件

> 我的理解：Vue是基于单页面应用，一个页面通过组件模块拼接而成，从而形成一个完整的页面，非常有效的解决了传统的iframe的代码冗余问题等。

组件：我认为总共分为3个点，声明、挂载、使用。

组件又分为：公共组件和局部组件。

公共组件的定义：直接挂载到Vue的实例对象上。

```vue
// 公共组件(全局组件)
// 第一个参数是组件的名字，第二个参数是options(对象)
Vue.component('Vbtn', {
    template: `
    	<button>按钮</button>
    `,
})
```

局部组件的定义：通常是定义在局部的变量上来使用。

**在使用脚手架构建时，局部组件和公共组件都是一个.vue文件，但是公共组件是挂载到Vue的实例上，局部组件则是直接引入到Vue原始实例上的。**

**示例：**

```vue
<body>
    <div id="app"></div>
</body>
<script>
    // 局部组件：声明子组件 挂载子组件 使用子组件

    // 公共组件(全局组件)
    // 第一个参数是组件的名字，第二个参数是options(对象)
    Vue.component('Vbtn', {
        template: `
        	<button>按钮</button>
        `,
    })


    // 侧边栏组件  
    var Vcontent = {
        template: `
        	<div class='content'>
        		我是内容组件<Vbtn/>
            </div>
        `
    }

    // 侧边栏组件
    var Vaside = {
        template: `
            <div class='aside'>
            	我是侧边栏组件<Vbtn/>
            </div>
        `
    }

    // 头部组件
    var Vheader = {
        template: `
       		<div class='head'>
        		我是头部组件<Vbtn/>
            </div>
        `
    }

    // 1.声明局部组件 App入口组件 (目的是降低代码耦合度)
    var App = {
        template: `
            <div class='main'>
            	<Vheader />
            	<div class='main2'>
                    <Vaside />
                    <Vcontent />
                </div>
            </div>
        `,
        data() {
            return {

            }
        },
        components: {
            Vheader,
            Vaside,
            Vcontent
        }
    };

    new Vue({
        el: '#app',
        template: `<App></App>`, <!--App为自定义标签-->
        data() {
        return {

        }
    },
        // 2.挂载组件
        components: {
            App
        }
    });
</script>
```

### 	第二章：父组件通信到子组件

个人总结：父子组件通信就两个要点。

1. 如何传递？

​		传递方式有两种：

​		1：传递字符串 xxx=""

​		2：传递变量（字符串、对象、列表、数组等）   :xxx="msg"

​	2、如何接收？

​		接收方式比较简单，只有一种方法，就是在组件中定义，props来接收。使用时直接通过vue的取值表达式等方式进行取值即可。

```vue
var Vaside = {
	template: `
        <div class='aside'>
            我是侧边栏组件
            <h4>{{ message }}</h4>
        </div>
    `,
	props:['message']
};
```

### 	第三章：子组件通信父组件

个人总结：子组件通信父组件的方式只有一种，就是通过事件的方式传递。

​	1、子组件：通过this.$emit('abc');触发父组件中的方法

​	2、父组件：通过<子组件名   @abc='自定义方法'/> 来绑定父组件中的自定义方法，从而触发父组件

注意：只允许父组件给子组件传值，但是不允许子组件给父组件传值，后续会有方法传，但此种方式做不到。

**示例：**

```vue
<body>
    /**
    * 此处高亮说明：
        子组件只能通过事件给父组件发送消息
    */
    <div id="app"></div>
</body>
<script>
    // 侧边栏组件
    var Vaside = {
        template: `
            <div class='aside' @click='fun()'>
            	我是侧边栏组件
            </div>
        `,
        methods:{
            fun(){
                // 直接获取父组件的方法
                this.$emit('demo');
            }
        }
    }

    // 头部组件
    var Vheader = {
        template: `
        	<div class='head'>
                我是头部组件
                <button @click='changeFontSize'>字体变大</button>
            </div>
        `,
        methods:{
            changeFontSize(){
                // 触发父组件 中声明的自定义事件 vue $emit()
                // 第一个参数是触发自定义事件的名字  第二个参数就是传进去的值
                this.$emit('test')
            }
        }
    }

    // 1.声明局部组件 App入口组件 (目的是降低代码耦合度)
    /**
	* 1、@自定义属性名='自定义方法' 可以传递方法给子组件
	* 2、this.$emit('自定义属性名'); 出发父组件传入的值
	*/
    var App = {
        template: `
            <div class='main' :style='{fontSize:postFontSize+"em"}'>
                <Vheader @test='changeHandler'/>
                <div class='main2'>
                    <Vaside @demo='alertMsg'/>
                </div>
            </div>
        `,
        methods:{
            changeHandler(){
                this.postFontSize+=.1;
            },
            alertMsg(){
                alert(this.postFontSize);
            }
        },
        data() {
            return {
                posts:[
                    {id:1,title:"我的第一篇博客",content:"天王盖地虎"},
                    {id:2,title:"我的第二篇博客",content:"小鸡炖蘑菇"},
                    {id:3,title:"我的第三篇博客",content:"宝塔镇河妖"}
                ],
                postFontSize:1
            }
        },
        components: {
            Vheader,
            Vaside,
            Vcontent
        }
    };

    new Vue({
        el: '#app',
        template: `<App></App>`, <!--App为自定义标签-->
        data() {
        return {

        }
    },
        // 2.挂载组件
        components: {
            App
        }
    });
</script>
```

### 	第四章：全局组件的使用

个人总结：最重要的是`<slot></slot>`,此标签作为内容分发的出口。

注意：当给引入的组件添加事件的时候，需要加上修饰符.native才会生效。

**示例：**

```Vue
<body>
    <div id="app"></div>
</body>
<script>
    // 全局组件
    // slot标签元素作为承载分发内容的出口
    Vue.component('Vbtn', {
        template: `
            <button class='default' :class='type'>
            	<slot></slot>
            </button>
        `,
        props: ['type']
    });

    // 侧边栏组件  (子组件引用全局组件时，想要绑定点击事件就需要使用修饰符.native)
    var Vcontent = {
        template: `
            <div class='content'>
                我是内容组件
                <Vbtn @click.native = 'del'>删除</Vbtn>
                <ul>
                    <li v-for='(item,index) in value'>
                        <h3>{{item.title}}</h3>
                        <h4>{{item.content}}</h4>
                    </li>
                </ul>
            </div>
        `,
        props: ['value'],
        methods:{
            del(){
                alert(123);
            }
        }
    }

    // 侧边栏组件
    var Vaside = {
        template: `
            <div class='aside'>
                我是侧边栏组件（此处说明公共组件上可以直接加参数等）
                <Vbtn type='success'>播放</Vbtn>
            </div>
        `
    }

    // 头部组件
    var Vheader = {
        template: `
            <div class='head'>
            	我是头部组件
            	<button @click='changeFontSize'>字体变大</button>
            </div>
        `,
        methods: {
            changeFontSize() {

                // 触发父组件 中声明的自定义事件 vue $emit()
                // 第一个参数是触发自定义事件的名字  第二个参数就是传进去的值
                this.$emit('change')

            }
        }
    }

    // 1.声明局部组件 App入口组件 (目的是降低代码耦合度)
    var App = {
        template: `
        <div class='main' :style='{fontSize:postFontSize+"em"}'>
            <Vheader @change='changeHandler'/>
                <div class='main2'>
                    <Vaside />
                    <Vcontent :value='posts' />
                </div>
            </div>
        `,
        methods: {
            changeHandler() {
                this.postFontSize += .1;
            }
        },
        data() {
            return {
                posts: [{
                    id: 1,
                    title: "我的第一篇博客",
                    content: "天王盖地虎"
                },
                        {
                            id: 2,
                            title: "我的第二篇博客",
                            content: "小鸡炖蘑菇"
                        },
                        {
                            id: 3,
                            title: "我的第三篇博客",
                            content: "宝塔镇河妖"
                        }
                       ],
                postFontSize: 1
            }
        },
        components: {
            Vheader,
            Vaside,
            Vcontent
        }
    };

    new Vue({
        el: '#app',
        template: `<App></App>`, <!--App为自定义标签-->
        data() {
        return {

        }
    },
        // 2.挂载组件
        components: {
            App
        }
    });
</script>
```

### 	第五章：具名插槽(全局组件的升级)

个人总结：具名插槽简单来说就是全局组件为了满足更多的需求而诞生的。

具名插槽：简单来说就是在slot标签上添加name属性，用于区分分发内容的出口，例：`<slot name='one'></slot>`。

```vue
<body>
    <div id="app"></div>
</body>
<script type="text/javascript">
    // slot标签元素作为承载分发内容的出口
    Vue.component('demoSlot',{
        template:`
        <div>
            测试
            <slot name='test'></slot>
    	</div>
    `
    });
    Vue.component('mySlot', {
        template: `
        <li>
            预留的第一个坑
            <slot name='one'></slot>
            预留的第二个坑
            <slot name='two'></slot>
            预留的第三个坑
            <slot name='three'></slot>
            </li>
        `
    }); 

    var App = {
        template: `
            <div>
                <ul>
                    <demoSlot>
                    <h1 slot='test'>一个萝卜一个坑</h1>
                        </demoSlot>
                    <mySlot>
                    <h2 slot='one'>我是第一个坑</h2>
                    <h3 slot='two'>我是第二个坑</h3>
                    <h4 slot='three'>{{demo}}</h4>
                    </mySlot>
                </ul>					
            </div>
        `,
        props:['demo']
    };

    new Vue({
        el: '#app',
        template: `<App :demo='msg'/>`, <!--App为自定义标签-->
        data:{
        msg:"爆粗了"
    },
            // 2.挂载组件
            components: {
            App
            }
    });
</script>
```

### 	第五章：过滤器

​	Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化。注：过滤器实质不改变原始数据，只是对数据进行加工处理后返回过滤后的数据再进行调用处理。

#### 1. Vue过滤器的基本使用

​	过滤器可以用在两个地方：双花括号插值和 v-bind 表达式 (后者从 2.1.0+ 开始支持)。过滤器应该被添加在 JavaScript 表达式的尾部，由“|”符号指示：

**示例：**

```vue
<!-- 在双花括号中 -->
<div>{{ message | capitalize }}</div>

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

#### 2.Vue过滤器的全局过滤器和局部过滤器

##### 	a. 局部过滤器

​	在组件内写

```vue
<template>
<div>
    <p>电脑价格：{{price | addPriceIcon}}</p>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                price:200
            }
        },
        filters: {
            //处理函数
            addPriceIcon(value){
                console.log(value)//200
                return '¥' + value
            }
        }
    };
</script>

```



##### 	b.全局过滤器

​	在mian.js中

```javascript
// 全局过滤器使用：Vue.filter( filterName，( )=>{ return // 数据处理结果 } ) 
// 参数一：过滤器名字   参数二：回调函数
// 过滤出来的数据加上 ¥ 

Vue.filter("addCurrencyTag",function(value){
    // var tempPrice = parseFloat(value).toFixed(2) // 保留两位小数
    return `¥ ${value}`
})

```

​	在Home,vue中

```vue
<template>
	<div>
    	<p>价格：{{price | addCurrencyTag}}</p>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                price:200
            }
        }
</script>

```

### 	第六章：watch监听器

​	一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。（由此得出，watch是用来监听属性的）

​	watch分为简单监听和深度监听，深度监听用于监听对象等属性，简单监听仅用于监听单个的字符串或数字属性。

**简单监听：**

```vue
<body>
    <div id="app">
        <input type="text" v-model="num">
    </div>
    <script src="vue.js"></script>
    <script>
        new Vue({
            el: '#app',
            data: {
                num: ''
            },
            watch: {
                num(newVal, oldVal) {
                    // 监听 num 属性的数据变化
                    // 作用 : 只要 num 的值发生变化,这个方法就会被调用
                    // 第一个参数 : 新值
                    // 第二个参数 : 旧值,之前的值
                    console.log('oldVal:',oldVal)
                    console.log('newVal:',newVal)
                }
            }
        })
    </script>
</body>

```

**深度监听：**

```vue
<body>
    <div id="app">
        <input type="button" value="更改名字" @click="change">
    </div>
    <script src="vue.js"></script>
    <script>
        new Vue({
            el: '#app',
            data: {
                food: {
                    id: 1,
                    name: '冰激凌'
                }
            },
            methods: {
                change() {
                    this.food.name = '棒棒糖'
                }
            },
            watch: {
                // 第一种方式：监听整个对象，每个属性值的变化都会执行handler
                // 注意：属性值发生变化后，handler执行后获取的 newVal 值和 oldVal 值是一样的
                food: {
                    // 深度监听 属性的变化
                    deep: true
                    // 每个属性值发生变化就会调用这个函数
                    handler(newVal, oldVal) {
                        console.log('oldVal:', oldVal)
                        console.log('newVal:', newVal)
                    },
                    // 立即处理 进入页面就触发
                    immediate: true,
                },
                // 第二种方式：监听对象的某个属性，被监听的属性值发生变化就会执行函数
                // 函数执行后，获取的 newVal 值和 oldVal 值不一样
                'food.name'(newVal, oldVal) {
                    console.log('oldVal:', oldVal)   // 冰激凌
                    console.log('newVal:', newVal)   // 棒棒糖
                }
            }
        })
    </script>
</body>

```

### 	第七章：computed监听器

​	Watch和computed的区别

**Watch**

    watch用于观察和监听页面上的vue实例，当你需要在数据变化响应时，执行异步操作，或高性能消耗的操作，那么watch为最佳选择

**computed**

    可以关联多个实时计算的对象，当这些对象中的其中一个改变时都会触发这个属性
    具有缓存能力，所以只有当数据再次改变时才会重新渲染，否则就会直接拿取缓存中的数据。

**音乐播放器示例**

```vue
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <script type="text/javascript" src="js/vue.min.js"></script>
        <style type="text/css">
            *{
                padding: 0;
                margin: 0;
            }
            ul{
                list-style: none;
            }
            ul li{
                margin: 20px;
                padding: 10px;
                border-radius: 8px;
            }
            ul li.active{
                background-color: #66FFFF;
            }

        </style>
    </head>
    <body>
        <div id="app">
            <audio :src='getCurrentHandler' autoplay controls></audio>
            <ul>
                <li v-for="(item,index) in musicData" :class="{active:currentIndex==index}" @click="change(index)">
                    <h3>{{item.id}}-歌名:{{item.name}}</h3>
                    <p>歌手:{{item.author}}</p>
                </li>				
            </ul>
        </div>
    </body>
    <script>

        var musicData = [
            {id:1,name:'于荣光 - 少林英雄',author:'于荣光',songSrc:'./static/于荣光 - 少林英雄.mp3'},
            {id:2,name:'Joel Adams - Please Dont Go',author:'Joel Adams',songSrc:'./static/Joel Adams - Please Dont Go.mp3'},
            {id:3,name:'MKJ - Time',author:'MKJ',songSrc:'./static/MKJ - Time.mp3'},
            {id:4,name:'Russ - Psycho (Pt. 2)',author:'Russ',songSrc:'./static/Russ - Psycho (Pt. 2).mp3'}
        ];

        new Vue({
            el:"#app",
            data:function(){
                return {
                    musicData:musicData,
                    currentIndex:0
                }
            },
            computed:{
                // 实时监听着 musicData和currentIndex还有songSrc 多个属性，只要有一个变动，就会触发此方法。
                getCurrentHandler(){
                    return this.musicData[this.currentIndex].songSrc;
                }
            },
            methods:{
                change(index){
                    // 修改currentIndex，同时触发了getCurrentHandler()方法
                    this.currentIndex=index;
                }
            }
        })
    </script>
</html>

```

### 	第八章：组件的生命周期

​	记住关键点，组件是在挂载DOM之后才生成的。

​	当元素被干掉(抹除)时，会激活deactivated()方法，当元素生成时会激活activated()方法；

**示例：**

```vue
<body>
    <div id="app">
        <App></App>
    </div>
</body>
<script>
    var Demo = {
        template: `
            <div>
                <div>{{msg}}</div>
                <button @click='changeHandler'>改变</button>
            </div>
        `,
        methods:{
            changeHandler(){
                this.msg = this.msg+'哈哈哈'
            }
        },
        data: function (){
            return {
                msg: "hello world",
            }
        },
        beforeCreate() {
            // 组件创建之前
            console.log('创建vue实例前' + this.msg);
        },
        created() {
            // 组件创建之后

            // 使用该组件，就会调用created方法
            // 在created这个方法中可以操作后端的数据，数据响应试图
            // 应用：发送ajax请求
            console.log('创建vue实例后' + this.msg);
            this.msg="改变了吧";
        },
        beforeMount(){
            // 挂载数据到DOM之前会调用
            console.log("挂载到DOM前")
            console.log(document.getElementById('app'));
        },
        mounted(){
            // 挂载数据到DOM之后会调用 可以操作 Vue 作用以后的DOM
            console.log("挂载到DOM后")
            console.log(document.getElementById('app'));
        },
        beforeUpdate(){
            // 在更新DOM之前 调用此钩子函数 应用 ：可以获取原始的DOM
            console.log("更新DOM之前");
            console.log(document.getElementById('app').innerHTML);
        },
        updated(){
            // 在更新DOM之后 调用此钩子函数 应用 ：可以获取最新的DOM
            console.log("更新DOM之后")
            console.log(document.getElementById('app').innerHTML);
        },
        beforeDestroy(){
            // 销毁之前
            console.log('beforeDestroy');
        },
        destroyed(){
            // 销毁之后
            console.log('destroy');
        },
        activated(){
            console.log('组件被激活了')
        },
        deactivated(){
            console.log('组件被停用了')
        }
    }

    var App = {
        data: function (){
            return {
                isShow:true,
                flag:true
            }
        },
        // Vue的内置组件，能在组件的切换过程中将状态保留在内存中防止重复渲染DOM
        template: `
<div>
<keep-alive>
<Demo v-if='isShow'/>
    </keep-alive>
<keep-alive>
<Demo v-show='flag' />
    </keep-alive>
<button @click='toggle'>改变生死</button>
    </div>
`,
        methods:{
            toggle:function(){
                this.flag = !this.flag
            }
        },
        components: {
            Demo
        }
    }

    new Vue({
        el: "#app",
        data: {

        },
        components:{
            App
        }
    });
</script>
```

### 	第九章：computed中的get/set

​	1、get：获取值，可理解为给计算属性赋值

​	2、set：值改变时触发。可以做一些操作

![97](https://gitee.com/ichensw/drawing-bed/raw/master/image/97.png)



