<template>
  <div id="wrapper">
    <div
      id="categorystack"
      ref="categorystack"
    >
      堆叠条形图
    </div>
  </div>

</template>

<script>

export default {
  props: ['restaurants'],
  mounted () {
    var mychart = echarts.init(this.$refs.categorystack);

    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        // 餐厅种类
        data: ['川菜', '火锅', '烧烤', '自助餐', '快餐简餐', '面包甜点', '西餐', '韩国料理', '日本料理',
          '小吃面食', '咖啡厅', '东南亚菜', '粤菜', '江浙菜', '酒吧', '其他'],
        textStyle:{
          color: '#fff'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color:'#fff'
          }
        },
      },
      yAxis: {
        type: 'category',
        // 这里放地区种类
        data: ['人民公园', '圆艺山', '六里村', '安县', '江油市中心城区', '涪城万达广场', '高水', '南河', '高新区', '三台县中心城区', '凯德广场', '芙蓉汉城', '御营坝', '西科大'],
        type: 'category',
        nameTextStyle: {
          color:'#fff',
          fontSize:'16'
        },
        axisLine: {
          lineStyle: {
            color:'#fff'
          }
        },
      },
      series: [
        {
          name: '川菜',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [6, 19, 10, 0, 18, 27, 30, 31, 11, 18, 12, 21, 21, 13]
        },
        {
          name: '火锅',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [8, 23, 19, 0, 61, 31, 42, 40, 15, 46, 12, 15, 38, 10]
        },
        {
          name: '烧烤',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [0, 2, 1, 0, 14, 5, 8, 7, 2, 8, 5, 6, 4, 3]
        },
        {
          name: '自助餐',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [2, 1, 2, 0, 2, 5, 3, 0, 1, 5, 2, 2, 1, 3]
        },
        {
          name: '快餐简餐',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [17, 4, 12, 0, 12, 18, 14, 17, 7, 18, 5, 2, 11, 18]
        },
        {
          name: '面包甜点',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [17, 6, 8, 0, 34, 29, 11, 14, 1, 26, 32, 1, 9, 8]
        },
        {
          name: '西餐',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [6, 3, 0, 0, 4, 3, 1, 0, 0, 5, 2, 1, 1, 2]
        },
        {
          name: '韩国料理',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [3, 0, 0, 0, 0, 3, 1, 4, 1, 0, 4, 0, 0, 2]
        },
        {
          name: '日本料理',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [0, 1, 0, 0, 1, 1, 0, 1, 0, 5, 2, 0, 0, 1]
        },
        {
          name: '小吃面食',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [11, 3, 6, 0, 17, 24, 15, 16, 7, 10, 17, 0, 8, 14]
        },
        {
          name: '咖啡厅',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [14, 1, 2, 0, 7, 7, 0, 7, 1, 3, 2, 4, 3, 2]
        },
        {
          name: '东南亚菜',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: '粤菜',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [2, 0, 0, 0, 1, 2, 1, 1, 0, 1, 3, 0, 0, 0]
        },
        {
          name: '江浙菜',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1]
        },
        {
          name: '酒吧',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [4, 1, 0, 0, 3, 2, 1, 4, 0, 2, 3, 3, 1, 1]
        },
        {
          name: '其他',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [4, 8, 3, 0, 21, 18, 8, 7, 6, 7, 9, 5, 9, 2]
        },
      ]
    };
    mychart.setOption(option);

  }

}
</script>

<style scoped>
#wrapper {
  height: 700px;
  overflow-y: scroll;
  /* background-color: #333; */
  color: #fff;
}
#categorystack {
  height: 1200px;
}

.axis path,
.axis line {
  fill: none;
  stroke: #888;
  shape-rendering: crispEdges;
  color: #ccc !important;
}

.bar {
  fill: steelblue;
  color: #ccc !important;
}

.x.axis path {
  display: none;
  color: #ccc !important;
}

.fd {
  width: 18px;
  height: 1px;
  margin-top: 2px;
  background-color: green;
}
#container {
  background: #143948;
  width: 1050px;
  color: #ccc !important;
}
</style>
