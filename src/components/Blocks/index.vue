<template>
  <div
    id="blocks"
    ref="block"
  >
    <h2>{{title}}</h2>
    <svg
      width="570"
      height="570"
      ref="svg"
    ></svg>
  </div>
</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
import splitBlock from './splitBlock'
export default {
  props: ['typeColor', 'restType'],
  data () {
    return {
      allDataSet: null
    }
  },
  watch: {
    //监听 餐厅类型的改变
    restType () {
      if (!this.allDataSet) {
        return null;
      }
      //如果不是展示所有类型，那么就展示当前类型存在的街道
      if (this.restType !== 'all') {
        const blockArr = this.allDataSet.filter(e =>
          e.name === this.restType
        )[0].streets;
        this.drawBlocks(blockArr)
      } else {
        this.drawBlocks(this.allDataSet)
      }
    }
  },
  computed: {
    title () {
      return this.restType === 'all' ? "绵阳市各类型餐厅比例" : this.restType + "在绵阳市分布情况"
    }
  },
  mounted () {
    this.loadData();
  },
  methods: {
    loadData () {
      const _this = this;
      axios.get('/api/type-position.json').then(
        res => {
          _this.allDataSet = res.data;
          _this.drawBlocks(res.data);
        }
      ).catch(err => {
        console.log('没有获取到type-position.json或操作时抛出异常！')
      })
    },
    color () {
      const colorList = ['#2ec7c9', '#b6a2de', '#5ab1ef',  '#d87a80', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#756bb1', '#9e9ac8', '#bcbddc'];
      const colorLen = colorList.length;
      return colorList[parseInt(Math.random() * colorLen)];
    },
    drawBlocks (arr) {

      var svg = d3.select(this.$refs.svg);
      d3.select(this.$refs.svg).selectAll("rect").remove();
      d3.select(this.$refs.svg).selectAll("text").remove();
      var width = +svg.attr('width');
      var height = +svg.attr('height');
      const dataset = splitBlock(arr, width, height, true);
      const _this = this;
      const blocks = d3.select(this.$refs.block)
      //tooltip
      var div = d3.select('body').append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("z-index", 1333)
        .style("position", 'absolute')
        .style("color", '#000')
        .style("padding", '6px 12px')
        .style("border-radius", '3px')
        .style("text-align", 'center')
        .style("background-color", '#fff')
        .style("line-height", '18px')
        .style("top", 10 + "px");
      //添加矩形元素
      var rects = svg.selectAll(".MyRect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "MyRect")
        .attr("x", function (d) {
          return d.pos.x;
        })
        .attr("y", function (d) {
          return d.pos.y
        })
        .attr("width", function (d) {
          return d.pos.w
        })
        .attr("height", function (d) {
          return d.pos.h
        })
        .attr("fill", function (d, i) {
          if (_this.restType !== 'all') {
            return _this.color();
          }
          for (let i in _this.typeColor) {
            if (d.info.name === _this.typeColor[i].type) {
              return _this.typeColor[i].color
            }
          }
          return '#aaa'
        })
        .style("stroke", '#fff')
        .on("mousemove", function (d) {
          div.transition()
            .duration(10)
            .style("opacity", 1);
          div.html(d.info.name + '</br> 店家数量：' + d.info.size + '</br> 所占比例：' + Math.round(((d.pos.w * d.pos.h) / (width * height)) * 13330) / 100 + '%')
            .style("top", (d3.event.pageY) + "px");
          const divWidth = div._groups[0][0].offsetWidth
          if (d3.event.pageX > window.innerWidth - divWidth) {
            div.style("left", (d3.event.pageX - divWidth) + "px")
          } else {
            div.style("left", (d3.event.pageX + 10) + "px")
          }
        })
        .on("mouseout", function (d) {
          div.transition()
            .duration(10)
            .style("opacity", 0);
        })

      //添加文字元素
      var texts = svg.selectAll(".myText")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "myText")
        .attr("x", function (d, i) {
          return d.pos.x;
        })
        .attr("y", function (d) {
          return d.pos.y;
        })
        .attr("dx", function (d) {
          return d.pos.w / 2 - 16 * d.info.name.length / 2;
        })
        .attr("dy", function (d) {
          return d.pos.h / 2 + 6;
        })
        .text(function (d) {
          if (d.pos.w > 16 * d.info.name.length && d.pos.h > 16) {
            return d.info.name;
          }
        })
        .style('fill', function () {
          if (_this.restType !== 'all') {
            return '#fff'
          } else {
            return '#333'
          }
        })
        .on("mousemove", function (d) {
          if (_this.restType !== 'all') {
            // d3.select(this).attr('fill', '#09c')
          }
          div.transition()
            .duration(10)
            .style("opacity", 1);
          div.html(d.info.name + '</br> 店家数量：' + d.info.size + '</br> 所占比例：' + Math.round(((d.pos.w * d.pos.h) / (width * height)) * 13330) / 100 + '%')
            .style("top", (d3.event.pageY) + "px");
          const divWidth = div._groups[0][0].offsetWidth
          if (d3.event.pageX > window.innerWidth - divWidth) {
            div.style("left", (d3.event.pageX - divWidth) + "px")
          } else {
            div.style("left", (d3.event.pageX + 10) + "px")
          }
        })
    }
  }
}
</script>

<style lang="sass" scoped>

#blocks
  font-size: 16px;
  padding: 0;
  width: 500px;
  height: 500px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  padding: 40px 5px;
  h2
    font-size: 24px;
    padding: 5px;
    font-weight: bold;
    color: #FFF;
    padding-left: 80px;
  
  svg
    .MyRect
      background-color: orange;
    .myText
      color: #fff;

</style>
