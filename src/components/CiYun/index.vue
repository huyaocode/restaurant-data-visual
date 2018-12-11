<template>
  <div>
    <img
      ref="img"
      src="http://127.0.0.1:5000/static/zongpingfen.jpg"
      alt="该店没有评论"
      srcset=""
      id="ciyun"
    >
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: ['curRestId'],
  watch: {//  仅测试使用
    curRestId: {
      deep: true,
      handler: function () {
        this.$refs.img.src = "zongpingfen"
        try {
          axios.get(`ciyun?itemid=${this.curRestId}`).then(res => {
          const url = res.data
            this.$refs.img.src = `http://127.0.0.1:5000/${url}`
        }, err => {
        })
        } catch (e) {
        }
        
      }
    }
  }
}
</script>

<style lang="sass" scoped>

div
  font-size: 30px;
  padding: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  overflow: hidden;

#ciyun
  width: 100%;
  height: 105%;
  position: absolute;
  top: -5px;
  left: 0;

</style>
