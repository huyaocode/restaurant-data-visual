<template>
  <div id="app">
    <div class="left">
      <Map class="map" />
      <div class="bottom">
        <restaurant-detail class="restaurant-detail" />
        <ci-yun class="ci-yun" />
      </div>
    </div>
    <div class="right">
      <div class="chats">
        <consume-tend v-if="'consume-tend' === curSide" />
        <blocks v-else-if="'blocks' === curSide" />
        <category-stack v-else />
      </div>
      <ul class="tabs">
        <li 
          v-for="item of charts" 
          :key="item.name"
          :class="{active: curSide === item.value}"
          @click="changeView(item.value)"
        >
          {{item.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Map from './components/Map'
import RestaurantDetail from './components/RestaurantDetail'
import CiYun from './components/CiYun'
import ConsumeTend from './components/ConsumeTend'
import Blocks from './components/Blocks'
import CategoryStack from './components/CategoryStack'

export default {
  name: 'app',
  data () {
    return {
      restaurants: null,  //所有餐厅信息
      comments: null, //该餐厅的评论
      curRest: null,  //当前餐厅
      //页面右下角的tabs
      curSide: 'blocks',
      charts: [{
        name: "各月消费情况",
        value: 'consume-tend'
      }, {
        name: "各区域消费情况",
        value: 'blocks'
      }, {
        name: "各类别消费情况",
        value: 'category-stack'
      }]
    }
  },
  components: {
    Map,
    Blocks,
    CategoryStack,
    CiYun,
    ConsumeTend,
    RestaurantDetail
  },
  mounted() {
    this.loadData();
  },
  methods: {
    changeView(value) {
      this.curSide = value;
    },
    loadData(){
      axios.get('/api/restaurants.json').then(res => {
        this.restaurants = res.data;
        console.log(res.data)
      })
      axios.get('/api/comments.json').then(res => {
        this.comments = res.data;
         console.log(res.data)
      })
    }
  }
}
</script>

<style lang="sass">
html
  height: 100%;
  body
    height: 100%;
    margin: 0px;
    padding: 0px;

#app
  display: flex;
  height: 100%;
  overflow: hidden;

.left 
  width: 62%;
  min-width: 800px;
  height: 100%;
  .map
    height: 70%;
    min-height: 500px;
    border: 1px solid #000;
  .bottom
    height: 30%;
    display: flex;
    .ci-yun
      width: 45%;
      border: 1px solid blue;
    .restaurant-detail
      width: 55%;
      min-width: 500px;
      border: 1px solid red;
.right
  position: relative;
  border: 1px solid orange;
  width: 38%;
  min-width: 400px;
  .chats
    border: 1px solid red;
  .tabs
    position: absolute;
    display: flex;
    bottom: 0px;
    width: 100%;
    height: 40px;
    background-color: #888;
    li
      width: 33%;
      padding: 0 5px;
      line-height: 40px;
      text-size: 18px;
      color: #fff;
      border-right: 1px solid #eee;
      cursor: pointer;
      text-align: center;
      &:hover, &.active
        background: #f9f9f9;
        color: #333;
</style>
