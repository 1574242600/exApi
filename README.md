# exApi
exHentai API 

## 安装
```bash
npm install exapi -save
```

## 使用方法
1. 一个可以进里区的账户  
2. 代理   （可选，exhentai没被墙）

```javascript
const exApi = require('exApi');

const cookies = {
    'ipb_member_id': *,
    'ipb_pass_hash': *,
    'igneous': *
}

const exapi = new exApi(cookies);

// 代理 const exapi = new exApi(cookies,"socks5://127.0.0.1:1083");
// 只能socks
```

### 首页
- exapi.getIndex(page)

```javascript
/*
@param Number page 页码
@return Class ehIndex
*/

let index = await exapi.getIndex(page);  
```  

- ehIndex.getAll()
```javascript
/*
@return Array 画廊列表
[
  {
     type: 'Manga',
     title: '[Akishiro Akino] Himitsu no Sensei (COMIC X-EROS #84) [Chinese] [希月学园汉化组] [Digital]',
     cover: 'https://exhentai.org/t/e0/22/e0221c8467b0b1a7ff128d8b34d5cf054e069924-1412189-1359-1920-jpg_250.jpg',
     published: '2020-05-17 10:13',
     rating: 4.5,   //评分
     length: 24,    //画廊总图片数
     uploader: 'cjzn',
     href: [ '1639060', 'ea57738e2a' ]
  },
 ...
]
*/

let list = index.getAll()
```

### 画廊
- exapi.getGalleryInfo(href, thumbnailsType = 1)

```javascript
/*
@param Array href id和token
@param Number thumbnailsType 可选 ，决定缩略图类型 1 多张缩略图  ， 2 单张缩略图（长图）
@return Class ehGallery
*/
let href = ['627844','39dbc33ad8'];  // https://exhentai.org/g/627844/39dbc33ad8/
let gallery = await exapi.getGalleryInfo(href)
```

- ehGallery.getAllInfo()

```javascript
/*
@return object info 画廊详细信息

{
  type: 'Doujinshi',
  title: [
    '(C84) [ASIANBOY (Hasemi Ryo)] Yoshino Date After (Date A Live)[chinese]【CE家族社】',
    '(C84) [ASIANBOY (長谷見亮)] 四糸乃デートアフター (デート・ア・ライブ) [中国翻訳]'
  ],
  cover: 'https://exhentai.org/t/ce/54/ce54a4fe717e7a3e83f2683716db03ff9bbdf2b5-2660441-1717-2400-jpg_250.jpg',
  uploader: 'cechinese',
  published: '2013-09-08 17:07',
  parent: 'None',
  visible: 'Yes',
  language: 'Chinese  TR',
  size: '21.50 MB',
  length: 24,   //画廊总图片数
  favorited: 358,   //收藏数
  rating: { count: 51, average: 4.54 }, //评分
  tag: {
    language: [ 'chinese', 'translated' ],
    parody: [ 'date a live' ],
    character: [ 'shido itsuka', 'yoshino' ],
    group: [ 'asianboy' ],
    artist: [ 'hasemi ryo' ],
    male: [ 'sole male' ],
    female: [ 'lolicon', 'sole female' ]
  }
}

*/

let info = gallery.getGalleryInfo(href)
```

- ehGallery.getInfo(key)
```javascript
/*
@param String key 画廊详细信息键值
@return info 指定画廊信息
*/

let type = gallery.getInfo('type') // "Doujinshi"
```
- ehGallery.getThumbnails()
```javascript
/*
@return Array 当前页码缩略图列表

[
  'https://exhentai.org/t/ce/54/ce54a4fe717e7a3e83f2683716db03ff9bbdf2b5-2660441-1717-2400-jpg_l.jpg',
  'https://exhentai.org/t/39/aa/39aad501beb5a937e6c23657e9096c38a0593fc2-1032774-1717-2400-jpg_l.jpg',
  'https://exhentai.org/t/96/92/96924bb151c9dc6d66395991b24a1ea9cf714721-1381157-1712-2400-jpg_l.jpg',
  'https://exhentai.org/t/11/a9/11a9a3441b7e1f488c6017bdd88f01f0fa259e81-856020-1708-2400-jpg_l.jpg',
  'https://exhentai.org/t/f8/d5/f8d5e9927005953afe9b4494f9f1377ca129631e-715835-1716-2400-jpg_l.jpg',
  'https://exhentai.org/t/8a/17/8a17c4d6007e4fcc7509b7ca2733b2c93b0d63c3-850649-1707-2400-jpg_l.jpg',
...
]
如果thumbnailsType为0，则只有一张长图
*/

let thumbnails = gallery.getThumbnails()
```

- ehGallery.getComment()
```javascript
/*
@return Array 画廊评论
[
  {
    isUploader: true,   //是否是上传者
    user: 'cechinese',
    time: 1378631220,   //单位s
    score: 0,       //点赞数
    text: '文本框的文字没有居中真是逼死强迫症啊……（这本都是我居中的，不会有错~）'
  },
  {
    isUploader: false,
    user: 'Dr.Lv',
    time: 1561857780,
    score: 5,
    text: '四糸乃啊啊啊啊prpr'
  },
 ...
]
*/
```


- ehGallery.next(i = 1) 
```javascript
/* 
下1页
@param Number i 可选,下i页
@return Class this
影响
ehGallery.getThumbnails()
ehGallery.getViewHref()
如果不存在，返回null
*/

await gallery.next()
// 或
gallery = await gallery.next()
```

### 画廊图片
- ehGallery.getViewHref()
```javascript
/*
@return Array hrefList 当前页码的 token和id的列表

[
  [ 'ce54a4fe71', '627844-1' ],     // https://exhentai.org/s/ce54a4fe71/627844-1
  [ '39aad501be', '627844-2' ],
  [ '96924bb151', '627844-3' ],
  [ '11a9a3441b', '627844-4' ],
  ...
]
*/

let hrefList = gallery.getViewHref()
```

- exapi.getImgUrl(list)
```javascript
/* 
@param Array list token和id 或 token和id的列表
@return String url 或 String[] urlList
网络不好时，可能会超时
*/

let imgUrl = await exapi.getImgUrl(hrefList[0]) // "https://*.jpg"

let imgUrlList = await exapi.getImgUrl(hrefList) 
//时间可能略长,异步也救不了
/*
[ 
    "https://*.jpg"
    "https://*.jpg"
    "https://*.jpg"
    ...
] 
*/


```

## 使用开源项目
Thx  
- [cheerio](https://github.com/cheeriojs/cheerio) - MIT
- [node-fetch](https://github.com/node-fetch/node-fetch) - MIT
- [node-socks-proxy-agent](https://github.com/TooTallNate/node-socks-proxy-agent) - MIT

## todo
- [ ] 搜索
- [ ] 下载
 
## License
MIT