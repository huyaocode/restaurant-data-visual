<template>
  <div>
    方块分割图
  </div>
</template>

<script>
import axios from 'axios'
import splitBlock from './splitBlock'
export default {
  mounted () {
    this.loadData();
  },
  methods: {
    loadData () {
      const _this = this;
      axios.get('/api/type-position.json').then(
        res => {
          _this.drawBlocks(res.data);
        }
      ).catch(err => {
        console.log('没有获取到type-position.json！')
      })
    },
    drawBlocks(arr) {
      const blocks = splitBlock(arr, 1000, 1000);
      console.log('方块信息',blocks)
    }
  }
}
</script>

<style lang="sass" scoped>

div
  font-size: 30px;
  padding: 30px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  padding: 20px;
</style>
