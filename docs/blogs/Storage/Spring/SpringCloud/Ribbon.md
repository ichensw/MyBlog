---
title: Ribbon笔记
date: 2021-01-20
sidebar: 'auto'
categories:
- SpringCloud
tags:
- SpringCloud
- Ribbon
publish: true
---

:::tip

​	SpringCloud组件之一：Ribbon负载均衡，用于实现服务分发的负载均衡，配合Eureka实现性能最大化。由于Eureka本身自带Ribbon的LoadBalance包，所以使用时仅需在消费者的启动类的RestTemplate配置方法上，加上@LoadBalanced注解即可。

:::

<!-- more -->

# Ribbon负载均很

## 1.启动两个服务实例

首先参照itcast-eureka启动两个ItcastServiceProviderApplication实例，一个8081，一个8082。

![25](https://gitee.com/ichensw/drawing-bed/raw/master/image/25.png)

Eureka监控面板：

![26](https://gitee.com/ichensw/drawing-bed/raw/master/image/26.png)



## 2.开启负载均衡

因为Eureka中已经集成了Ribbon，所以我们无需引入新的依赖，直接修改代码。

修改itcast-service-consumer的引导类，在RestTemplate的配置方法上添加`@LoadBalanced`注解：

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```



修改调用方式，不再手动获取ip和端口，而是直接通过服务名称调用：

```java
@Controller
@RequestMapping("consumer/user")
public class UserController {

    @Autowired
    private RestTemplate restTemplate;

    //@Autowired
    //private DiscoveryClient discoveryClient; // 注入discoveryClient，通过该客户端获取服务列表

    @GetMapping
    @ResponseBody
    public User queryUserById(@RequestParam("id") Long id){
        // 通过client获取服务提供方的服务列表，这里我们只有一个
        // ServiceInstance instance = discoveryClient.getInstances("service-provider").get(0);
        String baseUrl = "http://service-provider/user/" + id;
        User user = this.restTemplate.getForObject(baseUrl, User.class);
        return user;
    }

}
```

访问页面，查看结果：

![27](https://gitee.com/ichensw/drawing-bed/raw/master/image/27.png)

完美！



## 3.源码跟踪

为什么我们只输入了service名称就可以访问了呢？之前还要获取ip和端口。

显然有人帮我们根据service名称，获取到了服务实例的ip和端口。它就是`LoadBalancerInterceptor`

在如下代码打断点：

![28](https://gitee.com/ichensw/drawing-bed/raw/master/image/28.png)

一路源码跟踪：RestTemplate.getForObject --> RestTemplate.execute --> RestTemplate.doExecute：

![29](https://gitee.com/ichensw/drawing-bed/raw/master/image/29.png)

点击进入AbstractClientHttpRequest.execute --> AbstractBufferingClientHttpRequest.executeInternal --> InterceptingClientHttpRequest.executeInternal --> InterceptingClientHttpRequest.execute:

![30](https://gitee.com/ichensw/drawing-bed/raw/master/image/30.png)

继续跟入：LoadBalancerInterceptor.intercept方法

![31](https://gitee.com/ichensw/drawing-bed/raw/master/image/31.png)

继续跟入execute方法：发现获取了8082端口的服务

![32](https://gitee.com/ichensw/drawing-bed/raw/master/image/32.png)

再跟下一次，发现获取的是8081：

![33](https://gitee.com/ichensw/drawing-bed/raw/master/image/33.png)



## 4.负载均衡策略

Ribbon默认的负载均衡策略是简单的轮询，我们可以测试一下：

编写测试类，在刚才的源码中我们看到拦截中是使用RibbonLoadBalanceClient来进行负载均衡的，其中有一个choose方法，找到choose方法的接口方法，是这样介绍的：

 ![98](https://gitee.com/ichensw/drawing-bed/raw/master/image/98.png)

现在这个就是负载均衡获取实例的方法。

我们注入这个类的对象，然后对其测试：

 ![34](https://gitee.com/ichensw/drawing-bed/raw/master/image/34.png)

测试内容：

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ItcastServiceConsumerApplication.class)
public class LoadBalanceTest {

    @Autowired
    private RibbonLoadBalancerClient client;

    @Test
    public void testLoadBalance(){
        for (int i = 0; i < 100; i++) {
            ServiceInstance instance = this.client.choose("service-provider");
            System.out.println(instance.getHost() + ":" +instance.getPort());
        }
    }
}

```

结果：

![35](https://gitee.com/ichensw/drawing-bed/raw/master/image/35.png)

符合了我们的预期推测，确实是轮询方式。

我们是否可以修改负载均衡的策略呢？

它有以下实现：

![36](https://gitee.com/ichensw/drawing-bed/raw/master/image/36.png)

SpringBoot也帮我们提供了修改负载均衡规则的配置入口，在itcast-service-consumer的application.yml中添加如下配置：

```yaml
server:
  port: 80
spring:
  application:
    name: service-consumer
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
service-provider:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
```

格式是：`{服务名称}.ribbon.NFLoadBalancerRuleClassName`，值就是IRule的实现类。

```yml
#服务名
<client-name>:
  ribbon:
    #配置Ribbon负载均衡规则:IRule
    NFLoadBalancerRuleClassName: com.ley.springcloud.client.rule.MyRoundRobinRule
    #配置Ribbon实例检查策略:IPing
    NFLoadBalancerPingClassName:
    #配置负载均衡器:ILoadBalancer
    NFLoadBalancerClassName:
    #配置服务实例清单维护机制:ServerList
    NIWSServerListClassName:
    #配置服务清单过滤机制:ServerListFilter
    NIWSServerListFilterClassName:
```

## 5.参数配置

对于Ribbon参数配置通常有两种方式:全局配置以及客户端配置

 全局配置:`ribbon.<key>=<value>`

 指定客户端配置:`<client>.ribbon.<key>=<value>`格式进行配置,client可以理解为服务名

 对于Ribbon参数的key以及value类型定义,可以查看com.netflix.client.config.CommonClientConfigKey类获取更为详细的配置内容

 没有服务治理框架的帮助,需要为该客户端指定具体的实例清单,指定具体的服务名来做详细的配置

```properties
 <service-name>.ribbon.listOfServers=localhost:8001,localhost:8002,localhost:8003
```

## 6.与Eureka结合

###  1:变化

![37](https://gitee.com/ichensw/drawing-bed/raw/master/image/37.png)

###  2:禁用Eureka对Ribbon服务实例的维护实现

 ```properties
 ribbon.eureka.enabled=false
 ```

## 7.Ribbon重试机制

 从Camden SR2版本开始,Spring Cloud整合Spring Retry来增强RestTemplate的重试能力。通过RestTemplate实现的服务访问就会自动根据配置来实现重试机制

 配置示例

 ```yml
 spring:
   cloud:
     loadbalancer:
       retry:
         enabled: true #开启重试机制
 #ribbon配置,key-value配置类:CommonClientConfigKey
 #need add spring retry
 #服务名
 eureka-provider:
   ribbon:
     ConnectTimeout: 250 #单位ms,请求连接超时时间
     ReadTimeout: 1000 #单位ms,请求处理的超时时间
     OkToRetryOnAllOperations: true #对所有操作请求都进行重试
     MaxAutoRetriesNextServer: 2 #切换实例的重试次数
     MaxAutoRetries: 1 #对当前实例的重试次数
 ```

 POM添加·

 ```xml
<!--spring retry(let ribbon retry) need add spring boot aop starter-->
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
</dependency>

<!--spring boot starter aop-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>

 ```

 启动类加上@EnableRetry注解。