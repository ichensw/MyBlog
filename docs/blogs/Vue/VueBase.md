---
title: 【Vue】基础
date: 2021-01-04
sidebar: 'auto'
categories:
- Vue
tags:
- Vue基础
publish: true
---

:::tip

该篇文章总结了Vue从零到Vue组件的所有知识点，如有更新，会及时补充。

:::

<!-- more -->

## Vue基础总结


### 	第一章：Vue入门

​	Vue支持插值表达式、三元运算符、数值运算功能

**示例：**

```vue
<body>
    <div id="app">
        <!-- Vue的插值表达式，把data中定义的数据显示到此处 -->
        {{message}}

        <!-- 三元运算符 -->
        {{ false ? "OK" : "NO" }}

        <!-- 可做数学运算 -->
        {{number-100}}

        <!--- 插值表达式不支持 -->
        <!--{{var a = 1;}}
            {{if(a=1){}}
        -->
	</div>
</body>
<script>
    //view model
    // 创建Vue对象
    new Vue({
        el:"#app", // 由vue接管id为app区域
        template:'<div>{{message}}</div>', // template可直接在构建vue时生成模板
        data:{
            message:"hello Vue!", // 注意：此处不要加分号
            number:100
        }
    });
</script>
```

### 	第二章：click鼠标点击事件

注意：vue中的v-on可简写成“@”、v-bind可简写成“:”

**示例：**

```vue
<body>
    <div id="app">
        {{message}}  
        <button @click="fun2('Vue v-on:click事件')">vue的点击事件</button>

        <button @click="fun1('Vue v-on:click事件')">vue的onclick</button>
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        data: {
            message: "hello Vue!"
        },
        methods:{
            fun1(msg){
                alert("测试");
            },
            fun2(msg){
                alert(msg);
                this.message = msg; // 将传入的值赋值给message 
            }
        }
    });
</script>
```

### 	第三章：keydown键盘按键事件

$event：事件对象

**示例：**

```vue
<body>
    <div id="app">
        Vue:<input type="text" @keydown="fun($event)">
        <hr>
        传统JS:<input type="text" onkeydown="showKeyCode()">
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        methods:{
            /* $event 它是vue中的事件对象  和传统js的event对象是一样的*/
            fun:function (event) {
                var keyCode = event.keyCode;
                if (keyCode > 57 || keyCode < 49) {
                    // 不让键盘的按键起作用
                    event.preventDefault();
                }
            }
        }
    })

    // 传统js的键盘按下事件
    function showKeyCode() {
        // event对象和我们的document对象以及window对象是一样的，可以不用定义直接使用
        var keyCode = event.keyCode;
        if (keyCode > 57 || keyCode < 49) {
            // 不让键盘的按键起作用
            event.preventDefault();
        }
        // alert(keyCode);
        // if (event.keyCode == 13){
        // 	alert("你按得是回车");
        // }
    }
</script>
```

### 	第四章：mouseover鼠标移动事件

此处充分体现了.stop事件的作用：当事件通过.stop修饰后，仅会触发到.stop事件为止，不会继续触发mouseover事件

**示例：**

```vue
<body>
    <div id="app">
        <div @mousemove="fun1" id="div">
            <textarea @mousemove.stop="fun2($event)">这是一个文件域</textarea>
        </div>

        <div onmousemove="divmouseover()" id="div">
			<textarea onmousemove="textareamouseover()">这是一个文件域</textarea>
		</div>
    </div>
</body>
<script>
    //view model
    new Vue({
        el: "#app",
        methods: {
            fun1() {
                alert("鼠标悬停在div上！");
            },
            fun2(event) {
                alert("鼠标悬停在textarea上！");
                event.stopPropagation();
            }
        }
    })

    // 传统的JS方式
    function divmouseover() {
        alert("鼠标移动到div上了");

    }

    function textareamouseover() {
        alert("鼠标移动到textarea上了");
        event.stopPropagation();
    }
</script>
```

### 	第五章：事件修饰符

常用修饰符详解：(摘录自CSDN作者：[张兴华(MarsXH.Chang)](https://blog.csdn.net/q95548854))

.stop 是阻止冒泡行为,不让当前元素的事件继续往外触发,如阻止点击div内部事件,触发div事件

.prevent 是阻止事件本身行为,如阻止超链接的点击跳转,form表单的点击提交

.self 是只有是自己触发的自己才会执行,如果接受到内部的冒泡事件传递信号触发,会忽略掉这个信号

.capture 是改变js默认的事件机制,默认是冒泡,capture功能是将冒泡改为倾听模式

.once 是将事件设置为只执行一次,如 .click.prevent.once 代表只阻止事件的默认行为一次,当第二次触发的时候事件本身的行为会执行

.passive 滚动事件的默认行为 (即滚动行为) 将会立即触发，而不会等待 **onScroll** 完成。这个 .passive 修饰符尤其能够提升移动端的性能。


#### 事件修饰符需注意

**.passive 和 .prevent 不能一起使用:**

	.prevent 将会被忽略

**.self 和 .stop 区别:**

	self只响应当前元素自身触发的事件，不会响应经过冒泡触发的事件，并不会阻止冒泡继续向外部触发。
	stop是从自身开始不向外部发射冒泡信号

**示例：**

```vue
<body>
    <div id="app">
        <!--访问修饰符 .prevent 阻止事件-->
        <form @submit.prevent action="http://www.ichensw.cn" method="post">
            <input type="submit" value="提交">
        </form>
        <hr />
        <!--访问修饰符 .stop 停止事件（阻止继续渲染）-->
        <div @mousemove="fun1" id="div">
            <textarea @mousemove.stop="fun2($event)">这是一个文件域</textarea>
        </div>
        <!-- 访问修饰符 .once 仅执行一次 -->
        <a href="http://baidu.com" @click.prevent.once="linkClick">百度一下</a> 
        <!-- 传统JS方式 -->
        <form action="http://www.ichensw.cn" method="post" onsubmit="return checkForm()">
            <input type="submit" value="提交">
		</form>
    </div>
</body>
<script>
    //view model
    new Vue({
        el: "#app",
        methods: {
            fun1: function() {
                alert("鼠标悬停在div上！");
            },
            fun2: function(event) {
                alert("鼠标悬停在textarea上！");
            }
        }
    })

    // 传统js方式
    function checkForm() {
        alert(123);
        //表单验证必须有一个明确的boolean类型的返回值
        //在引用验证方法时必须加上 return 方法名称
        return false;
    }
</script>
```

### 	第六章：按键修饰符

几乎不会使用，知道就好

**示例：**

```vue
<body>
    <div id="app">
        <!-- 按键修饰符可在 @keydown后面直接点上需要绑定事件的按键名(忽略大小写) 例如 按A触发事件 则为：@keydown.a-->
        Vue:<input type="text" @keydown.A="fun1">
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        methods:{
            fun1:function () {
                alert("按下的是A！")
            }
        }
    })
</script>
```

### 第七章：v-html和v-text

**示例**

```vue
<body>
    <div id="app">
        <!-- Vue(v-text无法解析标签  v-html可解析标签) -->
        <div v-text="message"></div>
        <div v-html="message"></div>
        <div v-html="msg"></div>

        <!-- 传统js(innerText无法解析标签  innerHTML可解析标签) -->
		<div id="div1"></div>
		<div id="div2"></div>
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        data:{
            message:"<h1>Hello Vue</h1>",
            msg:"<div style='background:red;width:500px;height:500px;'>测试方块</div>"
        }
    })

    // 传统js的innerText和innerHTML
    window.onload=function () {
        document.getElementById("div1").innerHTML="<h1>Hello</h1>";
        document.getElementById("div2").innerText="<h1>Hello</h1>";
    }
</script>
```

### 	第八章：v-bind属性绑定

介绍：v-bind 主要用于属性绑定，比方你的class属性，style属性，value属性，href属性等等，只要是属性，就可以用v-bind指令进行绑定。

```vue
<body>
    <div id="app">
        <!-- v-bind的目的：给标签上的自带属性赋值。-->
        <!-- 冒号代表v-bind 如果不加v-bind无法获取data中的值-->
        <font size="5" :color="ys1">北京大学</font> 
        <!-- v-bind和v-for结合 -->
        <input type="text" :value="key+'-----'+value" v-for="(value,key) in product" :key="key"/>
        <!-- v-bind 用于添加属性 -->
        <font v-html="bo" :color="ys1"></font>
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        data:{
            bo:"斜体字",
            ys1:"red",
            product:{
                pid:1,
                pname:"笔记本"
            }
        }
    })
</script>
```

### 	第九章：v-model双向绑定

介绍：当修改v-model监听的值时，会将当前的数据统一修改，例如：当修改用户名时user.username会自动变更。

**示例**

```vue
<body>
    <div id="app">
        <form action="" method="post">
            <!-- v-model可获取JSON类型和类似的值  -->
            用户名：<input type="text" name="usename" v-model="user.username"> <br>
            密码：<input type="text" name="password" v-model="user.password"> <br>
		   {{user.username}}
            测试数据：<input type="text" name="tea" v-model="school.teacher" />
        </form>
    </div>
</body>
<script>
    //view model：用于提取对象类型的数据
    new Vue({
        el:"#app",
        data:{
            user: {
                username: "admin",
                password: 123
            },
            school: {
                teacher: "张老师",
                student: "小王"
            }
        }
    })
</script>
```

### 	第十章：v-for遍历

**当遍历数组和集合时，为v-for添加唯一标识:key，:key 中绑定的标识必须是不可变更的**

1.当遍历数据中有id主键列，建议使用id主键列作为key的值。

2.**key**的主要作用就是用来提高渲染性能的！

3.**key**属性可以避免数据混乱的情况出现 （如果元素中包含了有临时数据的元素，如果不用key就会产生数据混乱）

**示例(v-for遍历数组)：**

```vue
<body>
    <div id="app">
        <ul>
            <!-- item用于取出数组 index为索引  arr为数组-->
            <li v-for="(item,index) in arr" :key="index">{{item}}={{index}}</li>
            <br />
        </ul>
        <table border="1">
            <tr v-for="(value,index) in arr" :key="index">
                <td>{{index}}</td>
                <td>{{value}}</td>
            </tr>
        </table>
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        data:{
            arr:["测试一","测试二","测试三","测试四","测试五"]
        }
    })
</script>
```

**示例(遍历对象和集合)：**

```vue
<body>
    <div id="app">
        <ul>
            <!-- key对象中的键 value对象中的值  product为对象 -->
            <li v-for="(value,key) in product">{{key}}------{{value}}</li>
        </ul>

        <table border="1">
            <tr v-for="(paper,index) in paper" :key="paper.id">
                <td>{{paper.id}}</td>
                <td>{{paper.name}}</td>
                <td>{{paper.age}}</td>
            </tr>
        </table>
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        data:{
            product:{
                id:1,
                name:"笔记本",
                price:200.20
            },
            paper:[
                {id:1,name:'張三',age:25},
                {id:2,name:'里斯',age:18},
                {id:3,name:'王媽',age:21},
                {id:4,name:'小貝',age:27},
            ]
        }
    })

</script>
```

### 	第十一章：v-if和v-show

**示例：**

```vue
<body>
    <div id="app">
        <!-- v-if是控制节点的存在和消失 -->
        <div v-if="message">北京大学欢迎您！</div>

        <!-- v-show是控制节点的display样式的 none 和 block -->
        <div v-show="flag">华中师范大学欢迎您！</div>

        <button @click="toggle">切换</button>
    </div>
</body>
<script>
    //view model
    new Vue({
        el:"#app",
        data:{
            flag:false, // model
            message:false
        },
        methods:{
            toggle() {
                this.flag = !this.flag;
                this.message = !this.message;
            }
        }
    })
</script>
```

### 	第十二章：Vue的生命周期

#### 常用的生命周期函数

##### 1. created

  实例创建完成后调用，此阶段完成了数据的观测等，但尚未挂载， $el 还不可用。 需要初始化处理一些数据时会比较有用

##### 2. mounted

  el 挂载到实例上后调用，一般我们的第一个业务逻辑会在这里开始

##### 3. beforeDestroy

  实例销毁之前调用。主要解绑一些使用 addEventListener 监听的事件等。

```vue
<body>
    <div id="app">
        {{message}}
    </div>
</body>
<script>
    var vm = new Vue({
        el: "#app",
        data: {
            message: 'hello world'
        },
        beforeCreate: function() {
            console.log(this);
            showData('创建vue实例前', this);
        },
        created: function() {
            showData('创建vue实例后', this);
        },
        beforeMount: function() {
            showData('挂载到dom前', this);
        },
        mounted: function() {
            showData('挂载到dom后', this);
        },
        beforeUpdate: function() {
            showData('数据变化更新前', this);
        },
        updated: function() {
            showData('数据变化更新后', this);
        },
        beforeDestroy: function() {
            vm.test = "3333";
            showData('vue实例销毁前', this);
        },
        destroyed: function() {
            showData('vue实例销毁后', this);
        }
    });

    function realDom() {
        console.log('真实dom结构：' + document.getElementById('app').innerHTML);
    }

    function showData(process, obj) {
        console.log(process);
        console.log('data 数据：' + obj.message)
        console.log('挂载的对象：')
        console.log(obj.$el)
        realDom();
        console.log('----------------------------------------------------------------------------')
    }
    //vm.message = "good...";
    //vm.$destroy();
</script>
```

### 	第十三章：局部组件和公共组件

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

    // 1.声明局部组件(目的是降低代码耦合度)
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
        // 2.挂载总组件
        components: {
            App
        }
    });
</script>
```

### 	第十四章：v-bind和v-model的区别

```vue
<body>
    <div id="app">

        <!-- v-bind和v-model都可以取值，
        v-bind是单向绑定无法跟随页面数据改变而改变，
        而v-model绑定的数据,页面数据的改变,vue对象中的数据也会跟着改变-->

        <h1>需求:使用vue赋值json数据，并显示到页面的输入框中（表单回显）。
            点击提交按钮，改变json数据，验证同时输入框的内容也发生改变。
        </h1>
        插值表达式:  {{user.username}} ,{{user.password}}  <br>

        v-model 双向绑定,输入的值会改变模型的值:<input type="text" v-model="user.username"> <br>
        v-bind 单向绑定,输入的值不会改变模型的值:<input type="text" v-bind:value="user.username"> <br>

        v-model 密码:<input type="text" v-model="user.password"> <br>
        <input type="button" @click="fun()" value="按钮(改变模型的值)"> <br>
    </div>
</body>
<script>
    var vm = new Vue({
        el:"#app",
        data:{
            user:{
                username:"路飞",
                password:"123456"
            }
        },
        methods:{
            fun:function () {
                alert(this.user.username+"   "+this.user.password);
                this.user.username="佐助";
                this.user.password="666666";
            }
        }
    });
</script>
```
