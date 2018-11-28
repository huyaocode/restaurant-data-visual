<template>
  <div
    id="blocks"
    ref="block"
  >
    <svg
      width="570"
      height="670"
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
        .style("z-index", 1000)
        .style("position", 'absolute')
        .style("color", '#fff')
        .style("padding", '2px 6px')
        .style("border-radius", '3px')
        .style("text-align", 'center')
        .style("background-color", '#000')
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
        .attr("fill", function (d) {
          if(_this.restType !== 'all'){
            return '#044064'
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
            .style("opacity", .9);
          div.html(d.info.name + '</br>' + d.info.size + '</br>' + Math.round(((d.pos.w * d.pos.h) / (width * height)) * 10000) / 100 + '%')
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
          if (d.pos.w > 16 * d.info.name.length && d.pos.h > 16 ){
            return d.info.name;
          }
        })
        .style('fill', function(){
          if(_this.restType !== 'all'){
            return '#fff'
          } else {
            return '#000'
          }
        })
        .on("mousemove", function (d) {
          div.transition()
            .duration(10)
            .style("opacity", .9);
          div.html(d.info.name + '</br>' + d.info.size + '</br>' + Math.round(((d.pos.w * d.pos.h) / (width * height)) * 10000) / 100 + '%')
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
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  
  svg
    .MyRect
      background-color: orange;
    .myText
      color: #fff;

</style>
