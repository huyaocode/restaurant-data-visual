# _*_encoding=utf-8_*_
import json
Fres = open("item.json", encoding='utf-8')
res = json.load(Fres)
Fres.close();
F = open("comment.json", encoding='utf-8')
comment = json.load(F)
Fres.close();
tend={'川菜':{},'火锅':{},'烧烤':{},'快餐简餐':{},'面包甜点':{},'小吃面食':{},
 '咖啡厅':{},'茶馆':{},'其他':{}
}
for item in res['RECORDS']:
    str_name = item['item_info']
    name = str_name[0:str_name.find(' ')]
    id = item['item_id']
    obj ={'type_name':name}
    try:
       comment[id].update(obj)
    except:
       print("应该是店家没有评论信息吧")

for item in comment:
    name = comment[item]['type_name']

    obj={'monthly_num':comment[item]['monthly_comment_num']}
    try:
        tend[name].update(obj)
    except:
        tend['其他'].update(obj)

f = open("typeTend.json",'w',encoding='utf-8')
json.dump(tend,f,ensure_ascii=False,indent=1)


