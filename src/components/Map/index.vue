
import func from './vue-temp/vue-editor-bridge';
<template>
  <div id="mymap" ref="mymap">
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['restaurants', 'restType'],
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.drawMap();
  },
  watch: {
    restaurants: {
      deep: true,
      handler: function() {
        this.drawPoints();
      }
    }
  },
  methods: {
    /**
     * 绘制地图
     */
    drawMap: function () {
      this.map = new BMap.Map("mymap");
      var point = new BMap.Point(104.73, 31.47);
      this.map.centerAndZoom(point, 14);
      this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    },
    /**
     * 根据餐厅类型类型描点
     */
    drawPoints () {
      const bounds = this.map.getBounds();
      for (let i in this.restaurants) {
        const { item_id, type, location: {lng, lat}  } = this.restaurants[i];
        if (type == this.restType ) {
          const point = new BMap.Point(lng, lat);
          const marker = new BMap.Marker(point);
          marker.restId = item_id;
          marker.addEventListener("click", this.clickPoint); 
          this.map.addOverlay(marker);
        }
      }
    },
    /**
     * 地图上点被点击的事件
     */
    clickPoint(e) {
      const restId = e.target.restId
      this.$emit('point-click', restId)
    }
  }
};

</script>

<style lang="sass" scoped>
#mymap
  box-sizing: border-box;
  .BMap_cpyCtrl 
    display: none;
  .anchorBL 
      display: none;
      
</style>
