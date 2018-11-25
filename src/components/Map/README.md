# 地图

## 在 Vue 项目中使用百度地图

第一步，在 public 文件夹下的 index.html 中添加百度地图的 script

```
<script type="text/javascript" src="https://api.map.baidu.com/getscript?v=3.0&ak=您的密钥></script>
```

这里需要**尤其注意**，官方默认给你的标签是：

```
<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=您的密钥"></script>
```

但是这种连接方法会导致浏览器报以下警告信息：

> A parser-blocking, cross site (i.e. different eTLD+1) script, https://api.map.baidu.com/getscript?v=3.0&ak=密钥密钥密钥密钥&services=&t=20181029164750, is invoked via document.write. The network request for this script MAY be blocked by the browser in this or a future page load due to poor network connectivity. If blocked in this page load, it will be confirmed in a subsequent console message. See https://www.chromestatus.com/feature/5718547946799104 for more details.

在 srcipt 标签中改用 getcript 方式解决了这个问题

## 地图自定义样式

通过 map.setMapStyle 传入控制样式的 JSON 文件即可修改样式。
[样式文件来源](https://mapv.baidu.com/examples/#baidu-map-point-time1.html)

```
map.setMapStyle({
  styleJson: styleJson
});
```

## 根据当前选中的餐厅类型获得地图点对象的数组

将父组件传递过来的餐厅数据按照当前类型进行筛选。
当经纬度信息存在、餐厅类型等于当前想展示的餐厅类型或餐厅类型等于“all”时，计算该餐厅类型在 restTypes 中的索引位置，用来当该餐厅的颜色值。用餐厅 id 和经纬度信息还有颜色 count 值构成一个 mapv 的点对象，加入到展示点的数组中。

## 绘制所有点

获取点对象数组，求得地图上点颜色的对应关系（splitList），定义点的回调函数，使用 mapv.baiduMapLayer 这个 API 来构建图层，完成绘制。

## 点的筛选

使用了 mapv，可以实现在不刷新地图 canvas 的情况下重新描点。
实现方法： 当监听到餐厅类型变化时，先使用 getCurPoints 函数获得需要展示的点，然后调用 allDataSet.set(data);这个 api 充绘点，allDataSet 指对象：`new mapv.DataSet(data)`
