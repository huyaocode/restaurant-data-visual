const fs = require('fs');
var baiduMap = require('baidumap');
var bdmap = baiduMap.create({ ak: 'DvEMxCLAyfaUOv9xBb5e55Ewc2YDPT0c' });

fs.readFile('../halfHandledRestaurants.json', 'utf-8', (err, res) => {
  data = JSON.parse(res);
  const promiseList = [];
  let index = 0;
  const timer = setInterval(function() {
    let temp = index;
    promiseList.push(
      new Promise((resolve, reject) => {
        let geocoderOption = {
          address: data[temp].position,
          city: '绵阳市',
          callback: 'showMap'
        };
        bdmap.geocoder(geocoderOption, function(err, reuslt) {
          if (err) {
            reject(err);
          }
          reuslt = reuslt.replace('showMap&&showMap(', '');
          reuslt = reuslt.replace(')', '');
          console.log(reuslt);
          let poi = JSON.parse(reuslt).result;
          if(poi) {
            data[temp].location = poi.location;
          } else {
            data[temp].location = {
              "lng": NaN,
              "lat": NaN
            }
          }
          resolve(data[temp]);
        });
      })
    );
    index++;
    if (index == data.length) {
      clearInterval(timer);
      Promise.all(promiseList)
        .then(res => {
          let resdata = JSON.stringify(res);
          console.log(res);
          fs.writeFile('../restaurants.json', resdata, () => console.log('succ'));
        })
        .catch(e => console.log(e));
    }
  }, 50);
});
