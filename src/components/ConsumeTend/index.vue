<template>
  <div>
    消费趋势
  </div>
</template>

<script>

export default {
  props: ['comments'],
  //这里的评论信息是为了你另一个图好做按照店铺分类的。你最好向我一样在public/mock中单独开一个python 程序统计好。然后我会帮你将数据传入到这个组件
  // 当然你在这里处理也可以，看你熟悉pyhton 还是 js 了
}
</script>

<style lang="sass" scoped>
div
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;

</style>
