---
title: 【SpringBoot】基础
date: 2021-01-17
sidebar: 'auto'
categories:
- Spring
tags:
- SpringBoot
publish: true

---

## 一、基础Java工程搭建方法

​	1. 在pom.xml中导入父工程

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.4.RELEASE</version>
</parent>
```

​	2. 导入web工程需要的jar包(即可完成配置)
​	

```xml
<dependencies>
    <!-- 引入web工程需要的所有jar包 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

​	3. 创建一个main方法，类上加上注解@SpringBootApplication即可测试SpringBoot的web框架

```java
@SpringBootApplication
public class BootDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(BootDemoApplication.class,args);
    }
}
```



## 二、SpringBoot的配置

### 	2.1. 传统是Spring配置类注入DataSource的方式

​		注意：Spring3.0后全部使用的都是Java配置类的方式进行配置

#### 			1. 传统的Spring配置类注入方式 

​			首先：创建一个Java类，加上@Configuration注解使其变成配置类

​		**[JdbcConfig.java]**		


```java
@Configuration
@PropertySource("classpath:db.properties")
public class JdbcConfig {
    @Value("${jdbc.driverClassName}")
    private String driverClassName;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String username;
    @Value("${jdbc.password}")
    private String password;
    @Bean
    public DataSource dataSource(){
        DruidDataSource druidDataSource = new DruidDataSource(); 	
      	druidDataSource.setDriverClassName(driverClassName);
        druidDataSource.setUrl(url);
        druidDataSource.setUsername(username);
        druidDataSource.setPassword(password);
        return druidDataSource;
    }
}

```
**[db.properties]**

```properties
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/yun1
jdbc.username=root
jdbc.password=root
```

### 	2.2. SpringBoot的配置注入DataSource的方式

#### 			1.SpringBoot的属性注入方式（此方式适用于需要重用JdbcProperties配置类中属性时）

​		第一步：将db.properties配置文件改名为 application.properties

​		第二步：创建JdbcProperties.java配置类

​			[JdbcProperties.java]

```java
@ConfigurationProperties(prefix = "jdbc") // prefix指定前缀
@Data // lombok自动生成get/set等方法，在编译时自动生成
public class JdbcProperties {
    private String driverClassName;
    private String url;
    private String username;
    private String password;

}
```

​		第三步：在JdbcConfig配置类上加上注解

​			目的是用于引入JdbcProperties配置类，从而使用类中的属性

​			@EnableConfigurationProperties(JdbcProperties.class) // 方法一：@EnableConfigurationProperties() 启用配置属性

​		第四步：在本类中注入JdbcProperties.java配置类，直接使用配置文件中的属性

```java
// 此处是直接在形参列表中行进注入调用
@Bean
public DataSource dataSource(JdbcProperties prop){
    DruidDataSource druidDataSource = new DruidDataSource();
    druidDataSource.setDriverClassName(prop.getDriverClassName());
    druidDataSource.setUrl(prop.getUrl());
    druidDataSource.setUsername(prop.getUsername());
    druidDataSource.setPassword(prop.getPassword());
    return druidDataSource;
}
```


​		**[JdbcConfig.java]**
```java
@Configuration
@EnableConfigurationProperties(JdbcProperties.class) // 方法一：@EnableConfigurationProperties() 启用配置属性
public class JdbcConfig {
    @Autowired
    private JdbcProperties prop;
    @Bean
    public DataSource dataSource(){
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName(prop.getDriverClassName());
        druidDataSource.setUrl(prop.getUrl());
        druidDataSource.setUsername(prop.getUsername());
        druidDataSource.setPassword(prop.getPassword());
        return druidDataSource;
    }
}
```

#### 	2、SpringBoot最简洁的注入方式（无需重用配置中属性即可使用此方法）

​		第一步：将db.properties配置文件改名为 application.properties

​		第二步：直接在方法上加@ConfigurationProperties注解，SpringBoot会自动查找前缀为jdbc的属性值		

​		**[JdbcConfig.java]**	

```java
@Configuration
public class JdbcConfig {
    @Bean
    @ConfigurationProperties(prefix = "jdbc")
    public DataSource dataSource(){
        return new DruidDataSource();
    }
}
```

​		

## 三、yaml配置文件

​	1. 创建application.yaml或yml文件

​	2. yml方式的写法为：

```yaml
jdbc:
    driverClassName: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/yun1
    username: root
    password: root
    user:
        name: jack
        age: 20
        language:
            - java
            - php
            - ios
            - phython
            - scala
```

​	3. 调用类可直接写成这样（更加的灵活多变）

```java
@Data // lombok自动生成get/set等方法，在编译时自动生成
public class JdbcProperties {
    private String driverClassName;
    private String url;
    private String username;
    private String password;
    User user = new User();
}
public class User{
    private String name;
    private int age;
    private List<String> language;
}
```

:::tip

注意：如果application.properties和application.yml同时存在，则会取出他们的并集。当属性名冲突时，会以properties的属性为准

:::	



​	
​	


​		
​		
​		