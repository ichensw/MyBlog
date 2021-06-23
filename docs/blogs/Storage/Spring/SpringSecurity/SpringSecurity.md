---
title: 【SpringSecurity】基础
date: 2021-01-16
sidebar: 'auto'
categories:
- Spring
tags:
- SpringSecurity
publish: true
---

:::tip

Spring Security的基础使用，具体到导包使用类等。

:::

<!-- more -->

## SprintSecurity入门

### 一、基础操作(基于配置文件)

#### 	1. pom.xml导入依赖

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${spring.security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${spring.security.version}</version>
</dependency>
```

#### 	2. web.xml文件中创建filter

```xml
<!-- 全局监听器 -->
<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

<!-- 映射配置文件包路径 -->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:spring-security.xml</param-value>
</context-param>
<!-- 配置SpringSecurity的过滤器-->
<filter>
    <filter-name>springSecurityFilterChain</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>
<filter-mapping>
    <filter-name>springSecurityFilterChain</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

#### 	3. spring-security.xml核心配置文件配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:security="http://www.springframework.org/schema/security"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/security
                           http://www.springframework.org/schema/security/spring-security.xsd">        


    <!-- 配置不过滤的资源（静态资源及登录相关） -->
    <security:http security="none" pattern="/login.html" />
    <security:http security="none" pattern="/failer.html" />
    <security:http auto-config="true" use-expressions="false" >
        <!-- 配置资料连接，表示任意路径都需要ROLE_USER权限 -->
        <security:intercept-url pattern="/**" access="ROLE_USER" />
        <!-- 自定义登陆页面，login-page 自定义登陆页面 authentication-failure-url 用户权限校验失败之后才会跳转到这个页面，如果数据库中有这个用户则不会跳转到这个页面。
   default-target-url 登陆成功后跳转的页面。 注：登陆页面用户名固定 username，密码 password，action:login -->
        <security:form-login login-page="/login.html"
                             login-processing-url="/login" username-parameter="username"
                             password-parameter="password" authentication-failure-url="/failer.html"
                             default-target-url="/success.html" 
                             />
        <!-- 登出， invalidate-session 是否删除session logout-url：登出处理链接 logout-success-url：登出成功页面 
   注：登出操作 只需要链接到 logout即可登出当前用户 -->
        <security:logout invalidate-session="true" logout-url="/logout"
                         logout-success-url="/login.jsp" />
        <!-- 关闭CSRF,默认是开启的 -->
        <security:csrf disabled="true" />
    </security:http>
    <!-- 配置登录用户名和密码，以及自身权限 -->
    <security:authentication-manager>
        <security:authentication-provider>
            <security:user-service>
                <security:user name="user" password="{noop}user"
                               authorities="ROLE_USER" />
                <security:user name="admin" password="{noop}admin"
                               authorities="ROLE_ADMIN" />
            </security:user-service>
        </security:authentication-provider>
    </security:authentication-manager>
</beans>
```

### 二、使用数据库认证

#### 1. 基础讲解

​	在Spring Security中如果想要使用数据进行认证操作，有很多种操作方式，这里我们介绍使用UserDetails、UserDetailsService来完成操作。

**UserDetails**

```java
public interface UserDetails extends Serializable {
    Collection<? extends GrantedAuthority> getAuthorities();
    String getPassword();
    String getUsername();
    boolean isAccountNonExpired();
    boolean isAccountNonLocked();
    boolean isCredentialsNonExpired();
    boolean isEnabled();
}
```

​	UserDetails是一个接口，我们可以认为UserDetails作用是于封装当前进行认证的用户信息，但由于其是一个接口，所以我们可以对其进行实现，也可以使用Spring Security提供的一个UserDetails的实现类User来完成操作

以下是User类的部分代码

```java
public class User implements UserDetails, CredentialsContainer {
    private String password;
    private final String username;
    private final Set<GrantedAuthority> authorities;
    private final boolean accountNonExpired; //帐户是否过期
    private final boolean accountNonLocked; //帐户是否锁定
    private final boolean credentialsNonExpired; //认证是否过期
    private final boolean enabled; //帐户是否可用
    ｝
```

**UserDetailsService**

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

​	上面将UserDetails与UserDetailsService做了一个简单的介绍，那么我们具体如何完成Spring Security的数据库认证操作哪，我们通过用户管理中用户登录来完成Spring Security的认证操作。

#### 2. Spring Security认证操作

##### 	2.1 Spring Security框架代替了用户登录时的controller层，仅需在xml文件中配置即可。

##### 	2.2 Spring Security配置文件

​	想要链接数据库，则必须实现Spring Security自身的UserDetailsService业务层方法。

![90](https://gitee.com/ichensw/drawing-bed/raw/master/image/90.png) 

​	业务层实现后，通过实现类来调用数据库查询，并给角色赋予权限。

```java
@Service("userService")
@Transactional
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserInfo userInfo = null;
        try {
            userInfo = userDao.findByUsername(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 处理自己的用户对象封装成UserDetails
        //  User user=new User(userInfo.getUsername(),"{noop}"+userInfo.getPassword(),getAuthority(userInfo.getRoles()));
        
        // 当配置文件中未配置密码加密时，必须在密码前面加上“{noop}”，用于加密明文密码。
        return new User(userInfo.getUsername(), "{noop}" + userInfo.getPassword(), userInfo.getStatus() != 0, true, true, true, getAuthority(userInfo.getRoles()));
    }

    // 作用就是返回一个List集合，集合中装入的是角色权限
    public List<SimpleGrantedAuthority> getAuthority(List<Role> roles) {

        List<SimpleGrantedAuthority> list = new ArrayList<>();
        for (Role role : roles) {
            list.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName()));
        }
        return list;
    }
}
```

spring-security.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:security="http://www.springframework.org/schema/security"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd
          http://www.springframework.org/schema/security
          http://www.springframework.org/schema/security/spring-security.xsd">

	<!-- 配置不拦截的资源 -->
	<security:http pattern="/login.jsp" security="none"/>
	<security:http pattern="/failer.jsp" security="none"/>
	<security:http pattern="/css/**" security="none"/>
	<security:http pattern="/img/**" security="none"/>
	<security:http pattern="/plugins/**" security="none"/>

	<!--
        配置具体的规则
        auto-config="true"	不用自己编写登录的页面，框架提供默认登录页面
        use-expressions="false"	是否使用SPEL表达式（没学习过）
    -->
	<security:http auto-config="true" use-expressions="false">
		<!-- 配置具体的拦截的规则 pattern="请求路径的规则" access="访问系统的人，必须有ROLE_USER和ROLE_ADMIN的角色" -->
		<security:intercept-url pattern="/**" access="ROLE_USER,ROLE_ADMIN"/>

		<!-- 定义跳转的具体的页面 
			login-page  登录页面
			login-processing-url 登录页面跳转路径
			default-target-url 默认登录成功跳转页面
			authentication-failure-url 登录失败后跳转页面
			authentication-success-forward-url  登录成功跳转页面
		-->
		<security:form-login
				login-page="/login.jsp"
				login-processing-url="/login.do" 
				default-target-url="/index.jsp"
				authentication-failure-url="/failer.jsp"
				authentication-success-forward-url="/pages/main.jsp"
		/>

		<!-- 关闭跨域请求 -->
		<security:csrf disabled="true"/>

		<!-- 退出：将logout-url绑定到a标签链接，即可实现点击退出用户。 -->
		<security:logout invalidate-session="true" logout-url="/logout.do" logout-success-url="/login.jsp" />

	</security:http>

	<!-- 切换成数据库中的用户名和密码 -->
	<security:authentication-manager>
		<security:authentication-provider user-service-ref="userService">
			<!-- 配置加密的方式：当配置了加密方式时，解密也会使用同样的方式
 				当数据库密码不是加密类型时，此时会登录失败(一定要注意，此处由于手动录入数据库密码未加密导致无法登录，浪费了				  十多分钟！！！)-->
			<security:password-encoder ref="passwordEncoder"/>
		</security:authentication-provider>
	</security:authentication-manager>

	<!--配置密码加密对象（加密类型，可以不使用BCrypt，换做md5等加密算法也可以，具体要看自己存入数据库密码时使用的什么加密算		法，那么我们校验时要使用相同的加密算法）-->
	<bean id="passwordEncoder" class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder"/>

</beans>
```



### 三、BCryptPasswordEncoder加密类

#### 	基础介绍  

​		每次生成时，前面一段是需要加密的字符串，后面一段会拼接盐（一个随机生成的key，每次都会不一样）。

​	使用之前在配置文件配置这段bean即可使用

```java
<!--配置密码加密对象（加密类型，可以不使用BCrypt，换做md5等加密算法也可以，具体要看自己存入数据库密码时使用的什么加密算		法，那么我们校验时要使用相同的加密算法）-->
    <bean id="passwordEncoder" class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder"/>
```

### 四、服务器端权限控制（通过注解控制权限）

​	Spring Security在方法的权限控制上支持三种类型的注解，JSR-250注解、@Secured注解和支持表达式的注解，这三种注解默认都是没有启用的，需要单独通过global-method-security元素的对应属性进行启用

#### 	1. JSR-250注解使用介绍

##### 	第一步：需要在spring-security.xml中开启	

```xml
// 开启jsr250注解
<security:global-method-security jsr250-annotations="enabled"/>
```

#####  	第二步：在指定的方法上使用

![91](https://gitee.com/ichensw/drawing-bed/raw/master/image/91.png)

##### 	第三步：导入pom.xml依赖

![92](https://gitee.com/ichensw/drawing-bed/raw/master/image/92.png)



#### 	2. @Secured注解使用介绍

##### 		第一步：spring-security.xml中开启使用

```xml
<security:global-method-security secured-annotations="enabled"/>
```

##### 		第二步：在指定方法上使用

​	**注意：**此处的权限名必须加上前缀ROLE_否则全部拦截。

![93](https://gitee.com/ichensw/drawing-bed/raw/master/image/93.png)

##### 	JSR-250和@Secured的区别

	1. JSR-250使用的是外部引用的类，需要pom.xml导入依赖，而@Secured使用的是Spring Security自带的类，无需导入依赖。
	2. JSR-250使用@RolesAllowed()注解并且可以缩写角色名称，而@Secured使用的@Secured()注解，必须写全角色名称。**例：**全名称为：USER_ADMIN 缩写：ADMIN

#### 3. 支持表达式的注解权限控制

##### 	第一步：spring-security.xml中开启

```xml
<security:global-method-security pre-post-annotations="enabled"/>
```

##### 	第二步：指定方法上使用

![94](https://gitee.com/ichensw/drawing-bed/raw/master/image/94.png)

##### 	归总：支持表达式的常用的注解

​	**@PreAuthorize** 在方法调用之前,基于表达式的计算结果来限制对方法的访问
​	**示例：**

```java
@PreAuthorize("#userId == authentication.principal.userId or hasAuthority('ADMIN')")
void changePassword(@P("userId") long userId ){ }
```

​	这里表示在changePassword方法执行之前，判断方法参数userId的值是否等于principal中保存的当前用户的userId，或者当前用户是否具有ROLE_ADMIN权限，两种符合其一，就可以访问该方法。
​	**@PostAuthorize** 允许方法调用,但是如果表达式计算结果为false,将抛出一个安全性异常

​	**示例：**

```java
@PostAuthorize
User getUser("returnObject.userId == authentication.principal.userId or hasPermission(returnObject, 'ADMIN')");
```

​	**@PostFilter** 允许方法调用,但必须按照表达式来过滤方法的结果
​	**@PreFilter** 允许方法调用,但必须在进入方法之前过滤输入值

##### 	补充：权限控制时常用的Spring EL表达式

​	Spring Security允许我们在定义URL访问或方法访问所应有的权限时使用Spring EL表达式，在定义所需的访问权限时如果对应的表达式返回结果为true则表示拥有对应的权限，反之则无。Spring Security可用表达式对象的基类是SecurityExpressionRoot，其为我们提供了如下在使用Spring EL表达式对URL或方法进行权限控制时通用的内置表达式。

| **表达式**                     | **描述**                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| hasRole([role])                | 当前用户是否拥有指定角色。                                   |
| hasAnyRole([role1,role2])      | 多个角色是一个以逗号进行分隔的字符串。如果当前用户拥有指定角色中的任意一个则返回true。 |
| hasAuthority([auth])           | 等同于hasRole                                                |
| hasAnyAuthority([auth1,auth2]) | 等同于hasAnyRole                                             |
| Principle                      | 代表当前用户的principle对象                                  |
| authentication                 | 直接从SecurityContext获取的当前Authentication对象            |
| permitAll                      | 总是返回true，表示允许所有的                                 |
| denyAll                        | 总是返回false，表示拒绝所有的                                |
| isAnonymous()                  | 当前用户是否是一个匿名用户                                   |
| isRememberMe()                 | 表示当前用户是否是通过Remember-Me自动登录的                  |
| isAuthenticated()              | 表示当前用户是否已经登录认证成功了。                         |
| isFullyAuthenticated()         | 如果当前用户既不是一个匿名用户，同时又不是通过Remember-Me自动登录的，则返回true。 |



### 五、页面端权限控制

#### 	第一步：引入pom.xml依赖

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-taglibs</artifactId>
    <version>${spring.security.version}</version>
</dependency>
```

#### 	第二步：在jsp页面导入

```jsp
<%@taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
```

#### 	第三步：在页面上使用

- ​		authentication 获取当前正在操作的用户信息

```jsp
<!-- 注意：principal可以用于获取userDetails中的信息 -->
<security:authentication property="principal.username"/>
```

- ​		authorize 用于控制页面上某些标签是否可以显示



#### 	页面端使用表达式的方法

##### 	1. 在sprint-security.xml配置文件中开启SPEL表达式

​	**在开启完成后还必须注意：** 开启后，所有的访问角色都必须使用表达式来赋值，不可直接使用字符串赋值。

![95](https://gitee.com/ichensw/drawing-bed/raw/master/image/95.png)

##### 	2. 在spring-security.xml配置文件中配置bean

​	在配置文件中加入这个bean即可支持页面端的SPEL表达式，**并且后端可以不使用SPEL表达式**！！！

```xml
<bean id="webexpressionHandler" class="org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler" />
```

#### 	最后的补充

​	以下是页面端常用的SPEL表达式以及解释

1.  authentication

   ```jsp
   <security:authentication property="" htmlEscape="" scope="" var=""/>
   ```

   ​	property： 只允许指定Authentication所拥有的属性，可以进行属性的级联获取，如“principle.username”，不允许直接通过方法进行调用

   ​	htmlEscape：表示是否需要将html进行转义。默认为true。

   ​	scope：与var属性一起使用，用于指定存放获取的结果的属性名的作用范围，默认我pageContext。Jsp中拥有的作用范围都进行进行指定

   ​	var： 用于指定一个属性名，这样当获取到了authentication的相关信息后会将其以var指定的属性名进行存放，默认是存放在pageConext中

2. authorize

   ​	authorize是用来判断普通权限的，通过判断用户是否具有对应的权限而控制其所包含内容的显示

   ```jsp
   <security:authorize access="" method="" url="" var=""></security:authorize>
   ```

   ​	access： 需要使用表达式来判断权限，当表达式的返回结果为true时表示拥有对应的权限

   ​	method：method属性是配合url属性一起使用的，表示用户应当具有指定url指定method访问的权限，

   ​	method的默认值为GET，可选值为http请求的7种方法

   ​	url：url表示如果用户拥有访问指定url的权限即表示可以显示authorize标签包含的内容

   ​	var：用于指定将权限鉴定的结果存放在pageContext的哪个属性中

3.  accesscontrollist

   ​	accesscontrollist标签是用于鉴定ACL权限的。其一共定义了三个属性：hasPermission、domainObject和var，
   其中前两个是必须指定的

   ```jsp
   <security:accesscontrollist hasPermission="" domainObject="" var=""></security:accesscontrollist>
   ```

   ​	hasPermission：hasPermission属性用于指定以逗号分隔的权限列表

   ​	domainObject：domainObject用于指定对应的域对象

   ​	var：var则是用以将鉴定的结果以指定的属性名存入pageContext中，以供同一页面的其它地方使用
   北京

## 二、SpringAOP日志

​		通过SpringAOP的前置通知和后置通知来获取到日志所需的所有信息，从而生成日志记录并存储到数据库中。

​	**日志需要的信息：**

![96](https://gitee.com/ichensw/drawing-bed/raw/master/image/96.png)

### 	1. 访问时间

​	前置通知一开始即为访问时间，所以可以这样写。

```java
// 前置通知：主要获取开始时间，执行的具体类，执行的具体方法
@Before("execution(* cn.ichensw.controller.*.*(..))")
public void doBefore(JoinPoint jp) throws NoSuchMethodException {
    // 1. 当前时间就是开始访问时间
    visitTime = new Date();
}
```

### 	2. 访问方法

​	注意：此处获取有参数方法时，args是对象类型的，所以在Controller传参时，所有都必须为包装类型（对象类型）的基础类型。

```java
private Class clazz; // 访问的类

// 前置通知：主要获取开始时间，执行的具体类，执行的具体方法
@Before("execution(* cn.ichensw.controller.*.*(..))")
public void doBefore(JoinPoint jp) throws NoSuchMethodException {
    // 2. 获取当前具体访问的类
    clazz = jp.getTarget().getClass();
    // 3. 获取访问的方法名称
    String methodName = jp.getSignature().getName();
    Object[] args = jp.getArgs();// 获取访问的方法的参数
    // 判断方法是否有参数
    if (args == null || args.length == 0){
        // 只能获取无参数的方法
        method = clazz.getMethod(methodName);
    } else {
        // 获取有参数的方法
        Class[] classArgs = new Class[args.length];
        for (int i=0; i<args.length; i++) {
            classArgs[i] = args[i].getClass();
        }
        method = clazz.getMethod(methodName,classArgs);
    }

}
```

### 	3. 访问时长

​	后置通知创建时间减去前置通知开始时间，即为访问时长

```java
private Date visitTime; // 开始时间
// 后置通知
@After("execution(* cn.ichensw.controller.*.*(..))")
public void doAfter(JoinPoint jp) {
    // 4. 获取访问的时长
    long time = new Date().getTime() - visitTime.getTime();
}
```

### 	4. 获取url

​	此处通过反射获取的

```java
// 后置通知
@After("execution(* cn.ichensw.controller.*.*(..))")
public void doAfter(JoinPoint jp) {
    // 5. 获取url
    String url = "";
    if (clazz!=null&&method!=null&&clazz != LogAop.class) {
        // 1. 获取类上的@RequestMapping("/xxx")
        RequestMapping classAnnotation = (RequestMapping) clazz.getAnnotation(RequestMapping.class);
        if (classAnnotation!=null) {
            String[] classValue = classAnnotation.value();

            // 2.获取方法上的@RequestMapping("xxx")
            RequestMapping methodAnnotation = (RequestMapping) clazz.getAnnotation(RequestMapping.class);
            if (methodAnnotation!=null) {
                String[] methodValue = methodAnnotation.value();
                url = classValue[0]+methodValue[0];
            }
        }
    }
}
```

### 	5. 获取访问的ip地址

​		第一步：web.xml中配置监听类

```xml
<!-- 配置监听器，监听request域对象的创建和销毁的 -->
<listener>
    <listener-class>org.springframework.web.context.request.RequestContextListener</listener-class>
</listener>
```

​		第二步：获取spring容器中的HttpServletRequest对象

```java
@Autowired
private HttpServletRequest request;
```

​		第三步：直接通过getRemoteAddr()方法获取

```java
 // 6. 获取访问的ip地址
 String ip = request.getRemoteAddr();
```

### 	6. 获取当前操作用户

​		通过Spring Security提供的类来获取。

```java
// 7. 如何获取当前操作的用户
SecurityContext context = SecurityContextHolder.getContext(); 
// 从上下文中获取当前登录的用户信息
User user = (User) context.getAuthentication().getPrincipal();
String username = user.getUsername();
```



