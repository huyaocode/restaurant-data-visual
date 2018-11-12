const fs = require('fs');
 
/**
 * 处理餐厅数据
 */
fs.readFile('../item.json', 'utf8', (err, res) => {
  data = JSON.parse(res).RECORDS;
  const restaurants = [];
  for (let i in data) {
    let item_info = data[i].item_info;
    const infos = item_info.split(' ');
    //根据原有属性计算得出新属性
    data[i].type = infos[0];
    data[i].street = infos[2];
    data[i].position = infos[2] + infos[3];
    data[i].review_count = data[i].review_count.split(' ')[0];
    //删除冗余的和无效的属性
    delete data[i].item_info;
    delete data[i].item_pic;
    delete data[i].item_key_word;
  }
  let restsData = JSON.stringify(data);
  fs.writeFile('../halfHandledRestaurants.json', restsData, () => console.log('succ'));
});

/**
 * 处理评论数据, 对评论部分未处理，该部分使用python处理
 */
fs.readFile('../useritem.json', 'utf8', (err, res) => {
  data = JSON.parse(res).RECORDS;
  const comments = {};
  for (let c of data) {
    const {times,rating, tast, environment,service, item_id:id, review} = c;
    if (!comments[id]) {
      comments[id] = {};
      //定义属性
      comments[id].avg_rating = 0;
      comments[id].avg_tast = 0;
      comments[id].avg_environment = 0;
      comments[id].avg_service = 0;
      // comments[id].review = "";
      // comments[id].words = [];
      comments[id].details = [];
    }
    //求和
    comments[id].avg_rating += rating;
    comments[id].avg_tast += tast;
    comments[id].avg_environment += environment;
    comments[id].avg_service += service;
    // comments[id].review += (review + ' ');
    //添加单条评论的属性，因为有的属性用不着
    comments[id].details.push({
      times,
      rating,
      tast,
      environment,
      service
    })
  }
  //对求和后的个评分取均值
  for(let c in comments){
    const item =  comments[c];
    const len = item.details.length
    item.avg_rating /= len;
    item.avg_tast /= len;
    item.avg_environment /= len;
    item.avg_service /= len;
  }
  fs.writeFile('../comments.json', JSON.stringify(comments), () => console.log('succ'));
});
