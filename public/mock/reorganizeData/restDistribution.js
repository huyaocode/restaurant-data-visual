/**
 * 计算餐厅的分布情况及个数
 */

const fs = require('fs')

/**
 * 处理餐厅数据，
 * 统计各地区的各类型餐厅数量
 */
fs.readFile('../item.json', 'utf8', (err, res) => {
  restaurants = JSON.parse(res).RECORDS

  const restDistribute = {}
  //将数组整理为 {类型：{位置： 餐厅数}}
  for (let i in restaurants) {
    let item_info = restaurants[i].item_info

    const infos = item_info.split(' ')
    //根据原有属性计算得出新属性
    restaurants[i].type = infos[0]
    restaurants[i].street = infos[2]
    restaurants[i].review_count = restaurants[i].review_count.split(' ')[0]

    if (!restDistribute[restaurants[i].type]) {
      restDistribute[restaurants[i].type] = {}
    }
    const restType = restDistribute[restaurants[i].type]

    if (!restType[restaurants[i].street]) {
      restType[restaurants[i].street] = 0
    }
    restType[restaurants[i].street] += parseInt(restaurants[i].review_count)
  }

  //将嵌套的对象转换为嵌套的数组
  const array = Object.keys(restDistribute).map(typeKey => ({
    type: typeKey,
    size: Object.values(restDistribute[typeKey]).reduce((total, count) => {
      return total + count
    }, 0),
    streets: Object.keys(restDistribute[typeKey]).map(posKey => ({
      pos: posKey,
      size: restDistribute[typeKey][posKey]
    }))
  }))
  restsData = JSON.stringify(array)
  fs.writeFile('../type-position.json', restsData, () => console.log('succ'))
})
