
import func from './vue-temp/vue-editor-bridge';
<template>
  <div class="wrapper">
    <ul id="types">
      <li
        type="all"
        @click="handleTypeClick"
        :class="['all'==restType ? '' : 'half-opacity']"
      >
        <span :style="{background: 'blue'}"></span> 全选
      </li>
      <li
        v-for="t in typeColor"
        :key="t.type"
        :type="t.type"
        @click="handleTypeClick"
        :class="[(t.type==restType || 'all'==restType) ? '' : 'half-opacity']"
      >
        <span :style="{background: t.color}"></span> {{t.type}}
      </li>
    </ul>
    <div
      id="mymap"
      ref="mymap"
    >
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
import styleJson from './styleJson.js'

export default {
  props: ['restaurants', 'restType', 'typeColor'],
  data () {
    return {
      map: null,
      allDataSet: null
    }
  },
  mounted () {
    this.drawMap();
  },
  watch: {
    restaurants: {
      deep: true,
      handler: function () {
        const data = this.getCurPoints();
        this.drawPoints(data);
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
     * 根据当前选中的餐厅类型获得mapv地图点的数组
     */
    getCurPoints () {
      const data = [];
      //瞄点
      for (let i in this.restaurants) {
        const { item_id, type, location: { lng, lat }, name } = this.restaurants[i];
        //当经纬度信息存在、餐厅类型等于当前想展示的餐厅类型或餐厅类型等于“all”
        if (lng && lat && (type === this.restType || this.restType === 'all')) {
          let index = this.typeColor.length;  //默认为其他类型
          //获取index为了做count值，用于颜色区分
          for (let j in this.typeColor) {
            if (this.typeColor[j].type === type) {
              index = parseInt(j) + 1;
              break;
            }
          }
          data.push({
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
              item_id,
              name,
              restType: type
            },
            count: index,
            size: 4
          });
        }
      }
      return data;
    },
    /**
     * 将所有点描在地图上，定义回调函数
     */
    drawPoints (data) {
      this.allDataSet = new mapv.DataSet(data);
      //求得色彩map
      const colorsMaps = { other: '#fff' };
      for (let i in this.typeColor) {
        colorsMaps[1 + parseInt(i)] = this.typeColor[i].color;
      }

      //tooltip
      var div = d3.select('body').append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("z-index", 1000)
        .style("position", 'absolute')
        .style("color", '#fff')
        .style("padding", '2px 6px')
        .style("border-radius", '3px')
        .style("text-align", 'center')
        .style("background-color", '#000')
        .style("top", 10 + "px");


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
          },
          mousemove: function (item, e) {
            if (item) {
              const { geometry: { name, restType } } = item;
              div.transition()
                .duration(500)
                .style("opacity", .9);
              div.html(name + '</br>' + restType)
                .style("top", (e.clientY - 40) + "px")
                .style("left", function () {
                  const divWidth = div._groups[0][0].offsetWidth
                  return e.clientX - divWidth / 2 + "px"
                });
            } else {
              div.transition()
                .duration(10)
                .style("opacity", 0);
            }
          }
        },
        max: _this.typeColor.length + 1,
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
