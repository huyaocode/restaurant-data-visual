<template>
  <div>
    单店营业情况
  </div>
</template>

<script>

export default {
  props: ['restDetail', 'commentList'],
  watch: {//  仅测试使用
    restDetail: {
      deep: true,
      handler: function () {
        console.log('单店营业情况', this.restDetail, this.commentList)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
div
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;

</style>
