SpringCloud和Alibaba的版本适配

![image-20210609212445360](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210609212445360.png)

1. 远程调用

   1. 使用RestTemplate

      在启动类上添加

      ```java
      @Bean
      public RestTemplate getTemplate(){
          return new RestTemplate();
      }
      ```

      在需要调用的地方通过@Autowired注入

      ```java
      @Autowired
      private RestTemplate restTemplate;
      ```

      通过restTmplate.getForObject()获取URL中的数据

      ```java
      Item item = restTmplate.getForObject("http://xxxx:xxx/item"+id,item.class);
      ```

      

   2. 使用Nacos

      通过Nacos的DiscoveryClient来获取服务的信息（主机地址和端口）

      ​	第一步：在启动类上添加@EnableDiscoveryClient注解

      ```
      @SpringBootApplication
      @EnableDiscoveryClient
      public class OrderApplication(){
      	......
      }
      
      ```

      

   3. 

2. 