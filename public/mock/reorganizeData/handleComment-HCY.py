# _*_encoding=utf-8_*_
import json

Fres = open("useritem.json", encoding='utf-8')
comment = json.load(Fres)
Fres.close();
comments ={}
for item in comment['RECORDS']:
    id = item['item_id']
    try:
        a=comments[id]
    except:
        #定义属性
        comments[id]={'rating':0,'tast':0,'environment':0,'service':0,'comment_num':0,'monthly_comment_num':[],'monthly_score_num':[]}
        for i in range(12):
            comments[id]['monthly_comment_num'].append(0)
            comments[id]['monthly_score_num'].append(0)
    #加上评分
    comments[id]['rating'] += item['rating']
    comments[id]['tast'] += item['tast']
    comments[id]['environment'] += item['environment']
    comments[id]['service'] += item['service']
    #计算评论的每月份的评论数以及评分
    month = int(item['times'][0:2])
    if month > 12:
        month = int(item['times'][3:5])
    try:
        comments[id]['monthly_comment_num'][month-1] +=1
        comments[id]['monthly_score_num'][month - 1] += item['rating']
    except:
        print('出错啦！月份为:',item['times'])
    #此店的评论总数
    comments[id]['comment_num']+=1;

for item in comments:
    len = comments[item]['comment_num']
    comments[item]['rating'] = round(comments[item]['rating']/len,2)
    comments[item]['tast'] = round(comments[item]['tast']/len,2)
    comments[item]['environment'] = round(comments[item]['environment']/len,2)
    comments[item]['service'] = round(comments[item]['service']/len,2)
    for i in range(12):
        num = comments[item]['monthly_comment_num'][i]
        if num == 0:
            continue
        org = round(comments[item]['monthly_score_num'][i]/num,2)
        comments[item]['monthly_score_num'][i] = org

f = open("comment.json",'w',encoding='utf-8')
json.dump(comments,f,indent=1)
