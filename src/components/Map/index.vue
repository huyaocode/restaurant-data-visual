
<template>
  <div id="mymap" ref="mymap">
  </div>
</template>

<script>

export default {
  mounted () {
    this.ready();
  },
  methods: {
    ready: function () {
      var map = new BMap.Map("mymap");
      var point = new BMap.Point(104.73, 31.47);
      map.centerAndZoom(point, 14);
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
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
