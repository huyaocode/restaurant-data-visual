<template>
  <div id="tend">
    <p class="title">一年各类型的消费趋势</p>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
var box = document.getElementById("tend");
// box.style.height="660px";
export default {
  props: ['typeTend'],
  data () {
    return  {
      nowLines:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      lineColor: [
        { color: '#f9c', type: '川菜' },
        { color: '#f66', type: '火锅' },
        { color: '#c60', type: '烧烤' },
        { color: '#ff3', type: '快餐简餐' },
        { color: '#fcc', type: '面包甜点' },
        { color: '#cf6', type: '小吃面食' },
        { color: '#c96', type: '咖啡厅' },
        { color: '#093', type: '茶馆' },
        { color: '#eee', type: '其他' }
      ]
    }   
  },
  watch:{
    // nowLines:{
    //   deep: true,
    //   handler: function () {
    //     console.log("*****")
    //     this.changeLines()
    //   }
    // },
  },
  mounted() {
    this.init();
  },
  methods:{   
    //初始化  
    init(){
      var me = this;
      // 传入的数据
      let lineNames=[]
      let datas = []
      for(var name in me.typeTend){
        lineNames.push(name)      
        datas.push(me.typeTend[name].monthly_num)
      } 

      //线条的颜色数组
      let line_color = []
      for(var i=0;i< me.lineColor.length;i++){
        line_color.push(me.lineColor[i].color)  
      }
        
      //绘制折线图
      this.draw(datas,lineNames,line_color); 
      //添加提示框
      this.addTooltips(datas,lineNames);
      //添加图例 (580 500为svg的宽高)
      this.addlegend(lineNames,line_color,580,500);
      //点击图例
      this.clickLegend();
    },

    //改变线条
    changeLines(){
      var me = this;
      let lineNames=[];
      let datas = [];
      let res = me.typeTend;
      
      for(var name in res){
        lineNames.push(name) 
        datas.push(this.typeTend[name].monthly_num)
      } 
    },
    //绘制图形
    draw(datas,lineNames,line_color){
      let w = 580;
      let h = 500;
      let lpadding=45; 
      let padding=20;
      let head_height = 10;  //标题高度
      let legend_height = 50;//图例高度
      //定义画布
      let svg = d3.select("#tend")
          .append("svg")
          .attr("width",w)
          .attr("height",h+lpadding)
          .attr("class","CT-svg")

      //添加背景
			svg.append("g")
				.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", w)
				.attr("height", h+lpadding)
        // .style("fill", "#333")
				.style("stroke-width", 1)
				.style("stroke", "#E7E7E7");
     
      //x轴比例尺
      let xScale = d3.scaleLinear()
                     .domain(d3.extent(datas[datas.length-1], (d, i) => i))
                     .range([lpadding, w - padding])
      //y轴比例尺
      let yScale = d3.scaleLinear()
                     .range([h - legend_height, head_height])
                     .domain([0,this.findMaxData(datas)])
      //定义添加横轴
      let xAxis = d3.axisBottom(xScale);
      let xBar = svg.append("g")
          .attr("class","axis")
          .attr("transform","translate(0,"+(h-legend_height)+")")
          .call(xAxis)
      xBar.selectAll("text").text(function(d,i){
          return i+1+"月";
      })
          .style("fill", "#FFF")
      //定义添加纵轴
      let yAxis = d3.axisLeft(yScale);
      let yBar = svg.append("g")
          .attr("class","axis")
          .attr("transform","translate(" + lpadding + ",0)")
          .call(yAxis)
      yBar.selectAll("text").style("fill", "#FFF")
                            .text(function(d,i){
                                return d+"单";
                            });

      //定义添加横轴网格线
      var xInner = d3.axisBottom(xScale)
        .tickSize(-(h - head_height - legend_height), 0, 0)
        .tickFormat("")
				.ticks(datas[0].length);
      var xInnerBar = svg.append("g")
				.attr("class", "x-inner-line")
        .attr("transform", "translate(0," + (h -legend_height) + ")")
        .attr("color",'#E7E7E7')
        .call(xInner)
           
      //横轴悬浮框触发器
      var xInner = d3.axisBottom(xScale)
        .tickSize(-(h - head_height - legend_height), 0, 0)
        .tickFormat("")
				.ticks(datas[0].length);
      var xInnerBar = svg.append("g")
				.attr("class", "x-inner")
        .attr("transform", "translate(0," + (h -legend_height) + ")")
        .attr("color",'#FFF')
        .call(xInner)
        .style("stroke-width", 25)
        .style("opacity",0.0)
			
  
      
      //定义添加纵轴网格线
      var yInner = d3.axisLeft(yScale)
				.tickSize(-(w - lpadding - padding), 0, 0)
        .ticks(datas[0].length)
        .tickFormat("");
      var yInnerBar = svg.append("g")
				.attr("class", "y-inner-line")
        .attr("transform", "translate(" + lpadding + ",0)")
        .attr("color",'#E7E7E7')
				.call(yInner);
     
      //添加折线
      let newLine = new LineObj();
      for(let i=0;i<=datas.length-1;i++){
            newLine.init(i); 
      }
      //定义折线类
      function LineObj(){
        this.group = null;
        this.init = function(id){
          this.group = svg.append("g");
          var data = datas[id];
          var line = d3.line().x(function(d,i){ 
                                return xScale(i); })
                              .y(function(d){
                                return yScale(d); });
          //添加折线
          this.group.append("path")
              .attr('d',line(data))
              .attr('x',lpadding)
              .attr('y',h-lpadding)
              .style("fill", "none")
              .style("stroke-width", 2)
              .style("stroke", line_color[id])     //线条颜色
              .style("stroke-opacity", 0.9);

          //添加小圆点
          this.group.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d, i) {
                      return xScale(i);
                    })
                    .attr("cy", function(d) {
                      return yScale(d);
                    })
                    .attr("r", 3)
                    .attr("fill", line_color[id]);
        }
      }
        
    },
    //鼠标滑过 添加tooltips
    addTooltips(datas,lineNames){
      let x_line=d3.select(".x-inner");
      let x_lines=x_line.selectAll(".tick");
      let tooltip = d3.select(".tooltip")


      x_lines.on("mousemove",function(d,i){ 
        //悬浮框内文字
        let innerHtml = ""
        for(var i=0;i<datas.length;i++)  {
            innerHtml += lineNames[i] + ": "+ datas[i][d]+"<br>"
        }    
        tooltip.html(innerHtml)
          .style("left",(d3.event.pageX+10 )+"px")
          .style("top",(d3.event.pageY+10)+"px")        
          .style("opacity",1.0)
          .style("z-index",111)
        if(d3.event.pageX > window.innerWidth -150 ){
          tooltip .style("left",(d3.event.pageX-150 )+"px")     
        }
    
      })   
      .on("mouseout",function(d){
          tooltip.style("opacity",0.0)
                 .style("z-index",-111);
      })  
    },
    //找出数据中最大值并返回
    findMaxData(datas){
        let max=0;
        for(let i = 0;i< datas.length;i++)
        {
          if(max<d3.max(datas[i])){
            max=d3.max(datas[i]);
          }
        }
        return max;
      },
    //添加图例
    addlegend(lineNames,line_color,w,h){     
      let legend = d3.select(".CT-svg").append("g");
      //文本信息
      let legendGroup = legend.selectAll("text").data(lineNames);
      legendGroup.exit().remove;
      legend.selectAll("text")
            .data(lineNames)
            .enter()
            .append("text")
            .text(function(d){ return d;})
            .attr("class","legend")
            .attr("x",function(d,i){
              if(i<5)  return i*100;
              else     return (i-5)*100
              })
            .attr("y",function(d,i){
              if(i<5)  return 0;
              else     return 25;
            })
            .attr("fill",function(d,i){ return line_color[i]})
            
      //小方块
      let rectGroup = legend.selectAll("rect").data(lineNames);
      rectGroup.exit().remove();
      legend.selectAll("rect")
        .data(lineNames)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
          if(i<5)  return i*100-20;
          else     return (i-5)*100-20;
         })
        .attr("y",function(d,i){
              if(i<5)  return -12;
              else     return 15;
            })
        .attr("width", 12)
        .attr("class","legend_rect")
        .attr("height", 12)
        .attr("fill", function(d, i) { 
          return line_color[i]; });

      //图例移动到表格下方
      legend.attr("transform", "translate(" + 50 + "," + (h - 10) + ")");
    },
    //点击图例
    clickLegend(){
      var me = this;
      let legends_txt = d3.selectAll(".legend");
      // let legends_txt = document.querySelectorAll(".legend")
      // let legends_rect = d3.selectAll(".legends_rect")
      legends_txt.on("click",function(d,i){
        //此线条已显示
        if(me.nowLines[i]==1){
          me.nowLines[i] = 0;
        }
        //此线条未显示
        else{
          me.nowLines[i] = 1;
        }
         console.log('**',i,d,me.nowLines)
      })
     
    },
    
 }
}
</script>

<style scoped>
div{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  padding-top: 40px;
}

.title{
  font-size: 24px;
  padding: 5px;
  font-weight: bold;
  color: #FFF;
}

</style>
