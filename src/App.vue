<template>
  <div id="app">
    <div class="left">
      <Map class="map" :restaurants=restaurants :rest-type=curRestType :type-color=typeColor @point-click="handleRestClick" @rest-type-change="handleRestTypeChange" />
      <div class="bottom">
        <restaurant-detail class="restaurant-detail" :rest-detail="curRestDetail" :comment-list="curRestComments" />
        <ci-yun class="ci-yun" :cur-rest-id="curRestId" />
      </div>
    </div>
    <div class="right">
      <div class="chats">
        <consume-tend v-if="'consume-tend' === curSide" :typeTend="typeTend"/>
        <blocks v-else-if="'blocks' === curSide" :type-color=typeColor :rest-type=curRestType />
        <category-stack v-else :restaurants="restaurants" />
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
import * as d3 from 'd3'
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
      typeTend:null,
      curRestType: 'all',  //当前地图上所展示的餐厅类型
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
      }],
      typeColor: [
        { color: '#fc0', type: '川菜' },
        { color: '#f66', type: '火锅' },
        { color: '#c60', type: '烧烤' },
        { color: '#c9c', type: '自助餐' },
        { color: '#ff3', type: '快餐简餐' },
        { color: '#ffc', type: '面包甜点' },
        { color: '#c03', type: '西餐' },
        { color: '#39c', type: '韩国料理' },
        { color: '#a2a', type: '日本料理' },
        { color: '#cf6', type: '小吃面食' },
        { color: '#c96', type: '咖啡厅' },
        { color: '#093', type: '东南亚菜' },
        { color: '#6cc', type: '粤菜' },
        { color: '#cc6', type: '江浙菜' },
        { color: '#cff', type: '酒吧' },
        { color: '#ccc', type: '其他' }
      ]
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
    this.addTooltip();
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
    addTooltip() {
       let tooltip = d3.select("body").append("span")
          .attr("class","tooltip")
          .style("width","100px")
          .style("height","auto")
          .style("border","1px soild red")
          .style("text-align","center")
          .style("padding","10px")
          .style("line-height","24px")
          .style("border-radius","5px")
          .style("background-color","#FFF") //提示框背景颜色
          .style("position","absolute")
          .style("opacity",0.0)
          .style("z-index",-111)
          .style("top", 10 + "px");
    },
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
      axios.get('/api/typeTend.json').then(res => {
        this.typeTend = res.data;      
        console.log("数据", this.typeTend) 
      })
    },
    /**
     * 处理地图上餐厅的点击事件
     */
    handleRestClick (restId) {
      console.log('restId', restId)
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
    position: relative
    // background-color: #071834;
    background-color: #333;
    overflow: hidden;

.anchorBL 
    display: none;

.tooltip
  position: absolute;
  top: 0

.RD-tooltip
  position: absolute;
  top: 0

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
  .bottom
    height: 30%;
    display: flex;
    .ci-yun
      width: 45%;
      border: 1px solid #fff;
    .restaurant-detail
      width: 55%;
      min-width: 500px;
      border: 1px solid #fff;
.right
  position: relative;
  width: 38%;
  min-width: 400px;
  border-left: 1px solid #fff;
  .tabs
    position: absolute;
    display: flex;
    bottom: 0px;
    width: 100%;
    height: 40px;
    background-color: #044064;
    li
      width: 33%;
      padding: 0 5px;
      line-height: 40px;
      text-size: 18px;
      color: #fff;
      border-right: 1px solid #fff;
      cursor: pointer;
      text-align: center;
      &:hover, &.active
        background: #ccc;
        color: #333;
</style>
