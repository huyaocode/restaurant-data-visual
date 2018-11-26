<template>
  <div id="blocks" ref="block">
    <svg width="570" height="670" ref="svg"></svg>
  </div>
</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
import splitBlock from './splitBlock'
export default {
  props: ['typeColor'],
  data () {
    return {

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
          _this.drawBlocks(res.data);
        }
      ).catch(err => {
        console.log('没有获取到type-position.json或操作时抛出异常！')
      })
    },
    drawBlocks (arr) {
      try {
        var svg = d3.select(this.$refs.svg);
        console.log('svg', svg)
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
            for (let i in _this.typeColor) {
              if (d.info.type === _this.typeColor[i].type) {
                return _this.typeColor[i].color
              }
            }
            return '#aaa'
          })
          .on("mousemove", function (d) {
            div.transition()
              .duration(10)
              .style("opacity", .9);
            div.html(d.info.type + '</br>' + d.info.size + '</br>' + Math.round(((d.pos.w * d.pos.h) / (width * height)) * 10000) / 100 + '%')
              .style("top", (d3.event.pageY) + "px");

            if (d3.event.pageX > window.innerWidth - 70) {
              div.style("left", (d3.event.pageX - 70) + "px")
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
            return d.pos.w / 2 - 16 * d.info.type.length / 2;
          })
          .attr("dy", function (d) {
            return d.pos.h / 2 + 6;
          })
          .html(function (d) {
            if (d.pos.w > 36)
              return d.info.type;
          })
          .on("mousemove", function (d) {
            div.transition()
              .duration(10)
              .style("opacity", .9);
            div.html(d.info.type + '</br>' + d.info.size + '</br>' + Math.round(((d.pos.w * d.pos.h) / (width * height)) * 10000) / 100 + '%')
              .style("top", (d3.event.pageY) + "px");
            if (d3.event.pageX > window.innerWidth - 70) {
              div.style("left", (d3.event.pageX - 70) + "px")
            } else {
              div.style("left", (d3.event.pageX + 10) + "px")
            }
          })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="sass" scoped>

#blocks
  font-size: 16px;
  padding: 10px 0;
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
