<template>
  <div id="app">
    <div class="left">
      <Map class="map" :restaurants=restaurants :rest-type=curRestType @point-click="handleRestClick" @rest-type-change="handleRestTypeChange" />
      <div class="bottom">
        <restaurant-detail class="restaurant-detail" :rest-detail="curRestDetail" :comment-list="curRestComments" />
        <ci-yun class="ci-yun" :comment-word-list="commentWordList" />
      </div>
    </div>
    <div class="right">
      <div class="chats">
        <consume-tend v-if="'consume-tend' === curSide" :comments="comments"/>
        <blocks v-else-if="'blocks' === curSide" />
        <category-stack v-else  :restaurants="restaurants"/>
      </div>
      <ul class="tabs">
        <li v-for="item of charts" :key="item.name" :class="{active: curSide === item.value}" @click="changeView(item.value)">
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
      curRestId: null,  //当前餐厅id
      curRestType: '川菜',  //当前地图上所展示的餐厅类型
      ak: 'Nh9SjwriMSkKr6cexzDTEKqfu9p7yNQp',
      //页面右下角的tabs
      curSide: 'blocks',
      charts: [{
        name: "各月消费情况",
        value: 'consume-tend'
      }, {
        name: "各类别消费情况",
        value: 'blocks'
      }, {
        name: "各区域消费情况",
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
  mounted () {
    this.loadData();
  },
  computed: {
    /**
     * 当前餐厅细节信息
     */
    curRestDetail: function () {
      if (this.curRestId) {
        for (let i in this.restaurants) {
          if (this.restaurants[i].item_id === this.curRestId) {
            return this.restaurants[i];
          }
        }
      }
    },
    /**
     * 当前餐厅的所有评论信息
     */
    curRestComments: function () {
      if (this.curRestId && this.comments["" + this.curRestId]) {
        return this.comments["" + this.curRestId]
      } else {
        return null;
      }
    },
    /**
     * 当前餐厅评论的热词，已经后台排好序
     */
    commentWordList: function () {
      if (this.curRestComments) {
        return this.curRestComments.review
      } else {
        return [];
      }
    }
  },
  methods: {
    /**
     * 加载数据
     */
    loadData () {
      axios.get('/api/restaurants.json').then(res => {
        this.restaurants = res.data;
        console.log("餐厅数据", res.data)
        console.log('餐厅数据数量', res.data.length)
      })
      axios.get('/api/comments.json').then(res => {
        this.comments = res.data;
        console.log('评论数据', res.data)
        console.log('评论数据数量', Object.keys[res.data])
      })
    },
    /**
     * 处理地图上餐厅的点击事件
     */
    handleRestClick (restId) {
      console.log(restId)
      this.curRestId = restId;
    },
    /**
     * 切换侧栏视图
     */
    changeView (value) {
      this.curSide = value;
    },
    /**
     * 餐厅类型切换
     */
    handleRestTypeChange (value) {
      this.curRestType = value;
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
