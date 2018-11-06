# _*_encoding=utf-8_*_
import json
import jieba
from collections import Counter

def loadFont():
    f = open("../halfHandledComments.json", encoding='utf-8')  #设置以utf-8解码模式读取文件，encoding参数必须设置，否则默认以gbk模式读取文件，当文件中包含中文时，会报错
    return json.load(f)

comments = loadFont()

excludes=["今天","以为", "一个", "一份"]

for item in comments:
    words = jieba.cut(comments[item]['review'])
    counts={}
    for word in words:
        if len(word)==1:
            continue
        else:
            counts[word]=counts.get(word,0)+1
    for word in excludes:
        # print(counts)
        try:
            delattr(counts,word)
        except:
            continue
    words = list(counts.items())
    words.sort(key=lambda x:x[1],reverse=True)
    comments[item]['review'] = []
    count = 0
    for w in words:
        word = {}
        word['word']=  w[0]
        word['num'] = w[1]
        comments[item]['review'].append(word)
        count += 1
        if count == 20:
            break
            
f = open('../comments.json', 'w',encoding='utf-8')
json_str = json.dumps(comments, indent=2)
f.write(json_str)
f.close()