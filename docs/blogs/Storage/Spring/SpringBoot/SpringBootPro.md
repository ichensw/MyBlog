---
title: 【SpringBoot】实战基础
date: 2021-01-18
sidebar: 'auto'
categories:
- Spring
tags:
- SpringBoot
publish: true
---

## SpringBoot实战总结

### 	1. SpringBoot添加拦截器

​		1.1 编写拦截器类

```java
public class MyInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("前置方法正在执行。。。");
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("后置方法正在执行。。。");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("完成方法正在执行。。。");
    }
}

```

​		1.2 编写java配置类注入拦截器

```java
@Configuration
public class MvcWebConfiguration implements WebMvcConfigurer {

    @Autowired
    private MyInterceptor myInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(myInterceptor).addPathPatterns("/**");
    }

}
```

### 	2. SpringBoot集成JDBC连接池

:::tip	

tip：SpringBoot启动器spring-boot-starter-jdbc中默认使用了Hikari连接池。Hikari是日本开发的连接池，性能方面远超其他连接池。

:::

​		2.1 引入jdbc启动器

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
    <version>2.0.4.RELEASE</version>
</dependency>
```

​		2.2 配置properties文件

```properties
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:3306/leyou
jdbc.username=root
jdbc.password=root
```

​		2.3 引入通用mapper依赖

```xml
<!-- 通用mapper -->
<dependency>
    <groupId>tk.mybatis</groupId>
    <artifactId>mapper-spring-boot-starter</artifactId>
    <version>2.0.2</version>
</dependency>
```

​		2.4 创建实体类

```java

@Table(name = "tb_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;
    private String userName;
    private String upassword;
    // 省略get/set...
}
```

### 	3. SpringBoot集成Mybatis

#### 	3.1 mybatis

SpringBoot官方并没有提供Mybatis的启动器，不过Mybatis[官方](https://github.com/mybatis/spring-boot-starter)自己实现了：

```xml
<!--mybatis -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.2</version>
</dependency>
```

配置，基本没有需要配置的：

```properties
# mybatis 别名扫描
mybatis.type-aliases-package=cn.itcast.pojo
# mapper.xml文件位置,如果没有映射文件，请注释掉
mybatis.mapper-locations=classpath:mappers/*.xml
```

需要注意，这里没有配置mapper接口扫描包，因此我们需要给每一个Mapper接口添加`@Mapper`注解，才能被识别。

 ![5](http://gitee.com/ichensw/drawing-bed/raw/master/image/5.png)

```java
@Mapper
public interface UserMapper {
}
```

user对象参照课前资料，需要通用mapper的注解：

![6](http://gitee.com/ichensw/drawing-bed/raw/master/image/6.png)

接下来，就去集成通用mapper。



#### 	3.2 通用mapper

通用Mapper的作者也为自己的插件编写了启动器，我们直接引入即可：

```xml
<!-- 通用mapper -->
<dependency>
    <groupId>tk.mybatis</groupId>
    <artifactId>mapper-spring-boot-starter</artifactId>
    <version>2.0.2</version>
</dependency>
```

不需要做任何配置就可以使用了。

```java
@Mapper
public interface UserMapper extends tk.mybatis.mapper.common.Mapper<User>{
}
```



### 4. SpringBoot整合事务

其实，我们引入jdbc或者web的启动器，就已经引入事务相关的依赖及默认配置了

![7](https://gitee.com/ichensw/drawing-bed/raw/master/image/7.png)

至于事务，SpringBoot中通过注解来控制。就是我们熟知的`@Transactional`

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public User queryById(Long id){
        return this.userMapper.selectByPrimaryKey(id);
    }

    @Transactional
    public void deleteById(Long id){
        this.userMapper.deleteByPrimaryKey(id);
    }
}
```

### 5. SpringBoot整合Spring Data JPA

#### 	5.1 添加Spring Data JPA的起步依赖

```xml
<!-- springBoot JPA的起步依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

#### 	5.2 添加数据库驱动依赖

```xml
<!-- MySQL连接驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

#### 	5.3 在application.properties中配置数据库和jpa的相关属性

```properties
#DB Configuration:
spring.datasource.driverClassName=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=root

#JPA Configuration:
spring.jpa.database=MySQL
spring.jpa.show-sql=true
spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.naming_strategy=org.hibernate.cfg.ImprovedNamingStrategy
```

