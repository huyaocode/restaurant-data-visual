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
        // this.$refs.img.src = "zongpingfen"
        this.$refs.img.src = `http://127.0.0.1:5000/static/loading.png`
        if(this.curRestId == null) {
          this.$refs.img.src = "http://127.0.0.1:5000/static/zongpingfen.jpg";
          return;
        }
        try {
          axios.get(`ciyun?itemid=${this.curRestId}`).then(res => {
            const url = res.data
            if(url == "no matching itemid, please check your itemid"){
              this.$refs.img.src ="http://127.0.0.1:5000/static/noComment.png"
            } else {
              this.$refs.img.src = `http://127.0.0.1:5000/${url}`
            } 
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
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

</style>
