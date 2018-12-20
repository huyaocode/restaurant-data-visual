<template>
  <div id="single">

  </div>

</template>

<script>

import * as d3 from 'd3';
import axios from 'axios';

export default {
  props: ['restDetail', 'commentList'],
  watch: {
    restDetail: {
      deep: true,
      handler: function () {
        this.changeInfo(); //如果店铺发生改变，重新绘图
      }
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    //初始化信息
    init () {
      let name = "店名"
      let service = 'null', tast = 'null', envir = 'null'
      let position = "null"

      var box = document.getElementById("single");
      box.style.textAlign = 'center';

      //添加店名标签
      let res_name = document.createElement("p");
      res_name.style.fontWeight = 'strong'
      res_name.style.fontSize = '20px'
      res_name.style.padding = '3px'
      res_name.style.color = "#FFF"
      res_name.setAttribute("id", 'RD-name')
      box.appendChild(res_name);
      res_name.innerHTML = name
      //添加店铺信息标签
      let res_info = document.createElement("p");
      res_info.style.fontSize = '14px'
      res_info.id = 'RD-info'
      res_info.style.fontWeight = 'strong'
      res_info.style.lineHeight = '20px'
      res_info.style.color = "#FFF"
      box.appendChild(res_info);
      var str = "服务评分：" + service + "\t味道评分：" + tast + "\t环境评分："
        + envir + "<br>位置信息：" + position;
      res_info.innerHTML = str;

    },
    //店铺信息发生变化
    changeInfo () {
      let res_info = document.getElementById('RD-info')
      let res_name = document.getElementById('RD-name')

      let name = "店名"
      let service = 'null', tast = 'null', envir = 'null'
      let position = "null"
      if (this.restDetail) {
        name = this.restDetail.name;
        tast = this.restDetail.tast;
        service = this.restDetail.service;
        envir = this.restDetail.environment;
        position = this.restDetail.position
      }
      var str = "服务评分：" + service + "\t味道评分：" + tast + "\t环境评分："
        + envir + "<br>位置信息：" + position;
      res_name.innerHTML = name
      res_info.innerHTML = str

      //删除原来的svg和评论标签
      if (d3.select(".RD-svg")) {
        d3.select(".RD-svg").remove();      }
      if (d3.select(".commentListNull")) {
        d3.select(".commentListNull").remove();
      }

      //若此店家存在评论信息
      if (this.commentList) {
        //各月份的评论数
        let comment_datas = this.commentList.monthly_comment_num;
        //各月份的评分数
        let score_datas = this.commentList.monthly_score_num;
        //绘制柱状图
        this.draw(comment_datas, score_datas)
        //添加提示框
        this.addTooltips(comment_datas, score_datas)
      }
      else {
        console.log("暂无评论信息");
        let msg = d3.select("#single")
          .append("span")
          .attr("class", "commentListNull")
          .style("height", "60px")
          .html("暂无评论信息")
          .style("font-size", "50px")
          .style("color", "#A8A8A8")
          .style("opacity", 0.8);

      }
    },
    //绘制柱状图
    draw (datas, score) {
      let width = 500; //画布宽度
      let height = 150;//画布高度
      let svg = d3.select("#single")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RD-svg");

      //画布周边的空白 right包含右边线性颜色rect宽度
      let padding = { left: 30, right: 100, top: 20, bottom: 20 };

      //定义坐标轴比例尺
      //x,y轴比例尺
      let ranges = d3.range(datas.length)//ranges是datas数组下标集合的一个数组
      let xScale = d3.scaleBand()
        .domain(ranges)
        .range([0, width - padding.left - padding.right])
      let min = d3.min(datas);
      let max = d3.max(datas);
      let yScale = d3.scaleLinear()
        .domain([0, max])
        .range([height - padding.top - padding.bottom, 0]);

      //定义坐标轴
      let xAxis = d3.axisBottom(xScale);
      let yAxis = d3.axisLeft(yScale);

      //矩形之间的空白
      let rectPadding = 4;

      //颜色插值
      var a = d3.rgb(255, 255, 255); //白色
      var b = d3.rgb(0, 102, 180);     //蓝色
      var compute = d3.interpolate(a, b);
      let smin = d3.min(score);
      let smax = d3.max(score)
      var scalelinear = d3.scaleLinear()
        .domain([smin, smax])
        .range([0.2, 1]);

      //添加矩形元素
      let rects = svg.selectAll(".RD-Rect")
        .data(datas)
        .enter()
        .append("rect")
        .attr("class", "RD-Rect")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("x", function (d, i) {
          return xScale(i) + rectPadding / 2;
        })
        .attr("y", function (d) {
          return yScale(d);
        })
        .attr("width", xScale.bandwidth() - rectPadding)
        .attr("height", function (d) {
          return height - padding.top - padding.bottom - yScale(d);
        })
        .attr("fill", function (d, i) { //矩形颜色
          return compute(scalelinear(score[i]));
        });

      //添加文字元素
      let texts = svg.selectAll(".RD-Text")
        .data(datas)
        .enter()
        .append("text")
        .attr("class", "RD-Text")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("x", function (d, i) {
          return xScale(i) + rectPadding / 2;
        })
        .attr("y", function (d) {
          return yScale(d);
        })
        .attr("dx", function () {
          return (xScale.bandwidth() - rectPadding * 5) / 2;
        })
        .attr("dy", function (d) {
          return 0;
        })
        .text(function (d) {
          return d;
        })
        .style("fill", "#FFF")
        .style("opacity", 0.8)

      //添加X,Y轴
      let xBar = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis)
        .style("fill", "#FFF")
        .style("opacity", 0.8)
      xBar.selectAll("text").text(function (d, i) {
        return i + 1 + "月";      })
        .style("fill", "#FFF")
      let yBar = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis)
        .style("fill", "#FFF")
        .style("opacity", 0.8)
      yBar.selectAll("text").style("fill", "#FFF");

      //添加颜色渐变矩形以及渐变说明
      this.addColorInfo(a, b, width, padding.right);
    },
    //添加颜色渐变说明
    addColorInfo (a, b, w, p) {
      let rectW = 60; //矩形宽度
      let rectH = 10; //矩形高度
      let box = d3.select(".RD-svg");
      let defs = box.append("defs");

      let linearGradient = defs.append("linearGradient")
        .attr("id", "RD-linearColor")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
      var stop1 = linearGradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", a.toString());
      var stop2 = linearGradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", b.toString());
      let colorRect = box.append("rect")
        .attr("x", w - p + 16)
        .attr("y", 10)
        .attr("width", rectW)
        .attr("height", rectH)
        .style("fill", "url(#RD-linearColor)");

      let textRect = box.append("text")
        .attr("x", w - p + 20)
        .attr("y", 32 + rectH)
        .html("各月评分")
        .style("font-size", "12px")
        .style("fill", "#FFF")

      let rectInfo1 = box.append("text")
        .attr("x", w - p)
        .attr("y", 20)
        .html("低")
        .style("font-size", "12px")
        .style("fill", "#FFF")

      let rectInfo2 = box.append("text")
        .attr("x", w - 18)
        .attr("y", 20)
        .html("高")
        .style("font-size", "12px")
        .style("fill", "#FFF")
    },
    //添加tooltips
    addTooltips (comment, score) {
      if (d3.select(".RD-svg")) {
        let rects = d3.selectAll(".RD-Rect");
        let tooltip = d3.select(".tooltip");

        //颜色插值
        var a = d3.rgb(255, 255, 255); //白色
        var b = d3.rgb(0, 102, 180);     //蓝色
        var compute = d3.interpolate(a, b);
        let smin = d3.min(score);
        let smax = d3.max(score)
        var scalelinear = d3.scaleLinear()
          .domain([smin, smax])
          .range([0.2, 1]);

        rects.on("mousemove", function (d, i) {
          //悬浮框内文字
          let innerHtml = (i + 1) + "月<br>评论数:" + comment[i] + "<br>评分为：" + score[i];
          tooltip.html(innerHtml)
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 80) + "px")
            .style("opacity", 0.8)
            .style("z-index", 111)

          d3.select(this).style("opacity", 1.0)

        })
          .on("mouseout", function (d) {
            tooltip.style("opacity", 0.0)
              .style("z-index", -111);
            d3.select(this).style("opacity", 0.8)

          })
      }
    },
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
