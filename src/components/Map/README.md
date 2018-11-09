# 地图

### 在Vue项目中使用百度地图
第一步，在public文件夹下的index.html中添加百度地图的script
```
<script type="text/javascript" src="https://api.map.baidu.com/getscript?v=3.0&ak=您的密钥></script>
```
这里需要尤其注意，官方默认给你的标签是：
```
<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=您的密钥"></script>
```
但是这种连接方法会导致浏览器报以下警告信息：
>A parser-blocking, cross site (i.e. different eTLD+1) script, https://api.map.baidu.com/getscript?v=3.0&ak=密钥密钥密钥密钥&services=&t=20181029164750, is invoked via document.write. The network request for this script MAY be blocked by the browser in this or a future page load due to poor network connectivity. If blocked in this page load, it will be confirmed in a subsequent console message. See https://www.chromestatus.com/feature/5718547946799104 for more details.

在srcipt标签中改用getcript方式解决了这个问题 