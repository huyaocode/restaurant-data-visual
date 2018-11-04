# restaurant-data-visual

## 项目第一次克隆下来需要运行以下代码以安装依赖
```
npm install
```

### 运行项目
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

# 开发文档

## 项目初始化
使用vue-cli3.0构建vue项目
添加sass与sass-loader

### 使用reset.css重置默认样式
因各浏览器的默认样式有一些细节上的差别，这里引用reset.css重置默认css，让项目再各浏览器上表现一致。
使用方法：
再src/assets/styles文件夹下存放reset.css 再src/main.js中使用

### vue-cli3搭建的项目中代理接口名
为了方便前端开发者能够模拟向后台发送数据，在public文件夹下添加 **mock**文件夹，存放mock数据。然后将所有访问**api**路径的请求转发到mock文件夹下。
vue-cli 3.+版本，安装完成之后也找不到config、build等目录。查看官方文档，发现已经被简化成使用vue.config.js来配置项目，可以使用了webpack-chain链式API的调用方式，简化了对webpack配置的修改。

## 页面布局

1. 在src/compoents/下创建页面所需的组件。
   一个组件一个文件夹，文件夹中index.vue向外暴露组件，并且每个文件夹下有README.MD文件, 方便队友写文档
```
    ├─Blocks           方块分割图
    ├─CategoryStack    堆叠条形图
    ├─CiYun            评价词云
    ├─ConsumeTend      消费趋势
    ├─Map              地图
    └─RestaurantDetail 餐厅细节
```
2. 在App.vue中进行布局
   ![layout](./IMG/layout.png)