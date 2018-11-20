
import func from './vue-temp/vue-editor-bridge';
<template>
  <div class="wrapper">
    <ul id="types">
      <li type="all" @click="handleTypeClick" :class="['all'==restType ? '' : 'half-opacity']">
        <span :style="{background: 'blue'}"></span> 全选
      </li>
      <li v-for="t in restTypes" :key="t.type" :type="t.type" @click="handleTypeClick" :class="[(t.type==restType || 'all'==restType) ? '' : 'half-opacity']">
        <span :style="{background: t.color}" ></span> {{t.type}}
      </li>
    </ul>
    <div id="mymap" ref="mymap">
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import styleJson from './styleJson.js'

export default {
  props: ['restaurants', 'restType'],
  data () {
    return {
      map: null,
      allDataSet: null,
      restTypes: [
        { color: '#f9c', type: '川菜' },
        { color: '#f66', type: '火锅' },
        { color: '#c60', type: '烧烤' },
        { color: '#ff3', type: '快餐简餐' },
        { color: '#fcc', type: '面包甜点' },
        { color: '#cf6', type: '小吃面食' },
        { color: '#c96', type: '咖啡厅' },
        { color: '#093', type: '茶馆' },
        { color: '#eee', type: '其他' }
      ]
    }
  },
  mounted () {
    this.drawMap();
  },
  watch: {
    restaurants: {
      deep: true,
      handler: function () {
        this.drawPoints();
      }
    },
    restType () {
      const data = this.getCurPoints();
      this.allDataSet.set(data);
    }
  },
  methods: {
    /**
     * 绘制地图
     */
    drawMap: function () {
      this.map = new BMap.Map("mymap", { enableMapClick: false });
      const point = new BMap.Point(104.74, 31.47);
      this.map.centerAndZoom(point, 15);
      this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      // 地图自定义样式
      this.map.setMapStyle({
        styleJson: styleJson
      });
    },
    /**
     * 获取需要展示的节点
     */
    getCurPoints() {
      const data = [];
      //瞄点
      for (let i in this.restaurants) {
        const { item_id, type, location: { lng, lat } } = this.restaurants[i];
        let index = 9;
        for (let j in this.restTypes) { //获取index为了做count值，用于颜色区分
          if (this.restTypes[j].type === type) {
            index = parseInt(j) +1;
            break;
          }
        }
        if (lng && lat && (type === this.restType  || this.restType === 'all')) {
          data.push({
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
              item_id
            },
            count: index,
            size: 4
          });
        }
      }
      return data;
    },
    /**
     * 根据餐厅类型类型描点
     */
    drawPoints () {
      const data = this.getCurPoints();
      this.allDataSet = new mapv.DataSet(data);
      //求得色彩map
      const colorsMaps = { other: '#fff' };
      for (let i in this.restTypes) {
        colorsMaps[1+parseInt(i)] = this.restTypes[i].color;
      }
      const _this = this;
      //点的设置
      const options = {
        splitList: colorsMaps,
        methods: {
          click: function (item) { // 点击事件，返回对应点击元素的对象值
            if (item.geometry) {
              _this.$emit('point-click', item.geometry.item_id)
              return false;
            }
          }
        },
        max: 10,
        draw: 'category'  //按种类来渲染点的色彩
      }
      const mapvLayer = new mapv.baiduMapLayer(this.map, this.allDataSet, options);
    },
    /**
     * 类型点击
     */
    handleTypeClick (e) {
      this.$emit('rest-type-change', e.target.type)
    }
  }
};

</script>

<style lang="sass" scoped>
.wrapper
  position: relative
  background-color: #071834
  #types
    position: absolute
    top: 30px
    left: 3px
    color: #fff
    z-index: 10
    li
      margin: 4px 2px;
      cursor: pointer
      span
        display: inline-block
        width: 22px
        height: 12px;
        border-radius: 2px
    .half-opacity
      opacity: 0.5  
  #mymap
    height: 100%;
    box-sizing: border-box;
    .BMap_cpyCtrl 
      display: none;
    .anchorBL 
      display: none;

</style>
