const cheerio = require('cheerio');

class ehIndex {
    _list = [];
    pages = 1;  //总页码

    constructor(html) {
        this._parseTable(html);
    }

    getAll() {
        return this._list;
    }

    _parseTable(html) {
        let $ = cheerio.load(html);
        let table = $("table[class='itg gltc']").find('tr');

        this._list = [];
        table.each((i, element) => {
            if (i === 0) return 1;
            //console.log($(element).html());
            let index = i - 1;
            this._list[index] = {};

            {
                const rating = (div) => {
                    const style = div.find("div>div[class='ir']").attr('style');
                    let px = [];
                    let flag = 0;
                    for (let i = 0; i < style.length; i++){
                        if(flag === 2 ) break;
                        let now = style[i];
                        let next = style[i + 1]
                        if(now + next === 'px'){
                            let l = [];
                            if(!isNaN(Number(style[i  - 2]))){
                                l[0] = style[i - 2];
                            }

                            if(!isNaN(Number(style[i  - 1]))){
                                l[1] = style[i - 1];
                            }
                            px[flag] = Number(l.join(''));
                            flag++;
                        }
                    }

                    if(isNaN(px[0])) return 5;

                    let value = 0;
                    if(px[1] === 21) value = 0.5;
                    return 5 - value - px[0] / 16
                }


                {   //类型,标题,封面,上传时间,评分,页数，上传者
                    this._list[index].type = $(element).find("td[class='gl1c glcat']>div").text();

                    let g12c = $(element).find("td[class='gl2c']");
                    let glthumb = g12c.find("div[class='glthumb']").find("div");
                    let img = $(glthumb[0]).find("img");

                    this._list[index].title = img.attr('title');
                    this._list[index].cover = img.attr('data-src');

                    let div = $(g12c.find("div")[3]);
                    this._list[index].published = div.find('div>div[onclick^=pop]').text();
                    this._list[index].rating = rating(div);

                    div = $(element).find("td[class='gl4c glhide']").find("div");
                    this._list[index].length = parseInt($(div[1]).text())
                    this._list[index].uploader = $(div[0]).find("a").text()
                }

                {   //链接
                    let href = $(element).find("td[class='gl3c glname']>a").attr('href');
                    let match = href.match(/([0-9]+)\/([0-9a-z]+)\//)
                    this._list[index].href = [match[1], match[2]];
                }
            }
            //console.log(this._list);
        });

        {  //总页码
            let total = $(".ptt").find("tr>td");
            let index = total.length - 2;
            this.pages = Number($(total[index]).find("a").text())
        }
    }
}

class ehSearch extends ehIndex {
    searchConfig;
    getSearch;
    page = 1;

    constructor(html, searchConfig, getSearch) {
        super(html);
        this.searchConfig = searchConfig;
        this.getSearch = getSearch;
    }

    async next(i = 1) {
        let p = this.page + i;
        if (p > super.pages || p < 1) {
            return null;
        }
        this.page = p;

        let html = await this.getSearch(this.searchConfig, p);
        super._parseTable(html);
        return this;
    }
}


class ehGallery {
    _info = {};
    _thumbnails = [] //缩略图
    _viewImgHref = [];
    _comment = [];
    _total = 0;  //当前页,图数量
    _page = 1;  //当前页码
    _pages = 1;  //总页码
    _getHtml;

    constructor(html, getHtml) {
        let Info = this._parseGalleryInfo(html);
        let Thumbnails = this._parseGalleryThumbnails(html)
        let Img = this._parseGalleryViewImg(html);
        let Comment = this._parseGalleryComment(html);
        this._getHtml = getHtml;
        Promise.all([Info,Thumbnails,Img,Comment])
    }

    getInfo(key = 'type'){
        return this._info[key];
    }

    getAllInfo(){
        return this._info;
    }

    getThumbnails(){
        return this._thumbnails;
    }

    getViewHref(){
        return this._viewImgHref;
    }

    getComment(){
        return this._comment;
    }

    async next(i = 1){
        let p = this._page + i;
        if (p > this._pages || p < 1){
            return null;
        }
        this._page = p;

        let html = await this._getHtml.gallery(p);
        let thumb = this._parseGalleryThumbnails(html);
        let img = this._parseGalleryViewImg(html);
        await Promise.all([thumb,img])

        return this;
    }

    async _parseGalleryInfo(html){
        let $ = cheerio.load(html);
        // console.log(html);

        {
            this._info.type = $(".cs,.ct2").text();
            this._info.title = [];
            this._info.title[0] = $("#gn").text();
            this._info.title[1] = $("#gj").text();
            this._info.cover = $("#gd1>div").attr("style").match(/url\((.*?)\)/)[1]
            this._info.uploader = $("#gdn>a").text();

            {   //如name[] 所示
                let name = ['published','parent','visible','language','size','length','favorited'];
                $("#gdd>table").find("tr").each((i,element) => {
                    let data = $(element).find(".gdt2").text();
                    if ( i > 4) data = parseInt(data);

                    this._info[name[i]] = data;
                });
            }

            { //评分
                this._info.rating = {};
                this._info.rating.count = Number($("#rating_count").text());
                this._info.rating.average = parseFloat($("#rating_label").text().slice(9));
            }

        }

        {   //标签
            let tr = $("#taglist>table").find("tr");
            this._info.tag = {};

            tr.each((_,element)=> {
                let td = $(element).find("td");
                let attr =  $(td[0]).text().slice(0,-1);

                this._info.tag[attr] = [];

                let div = $(td[1]).find("div");
                div.each((i,element2) =>{
                    this._info.tag[attr][i] = $(element2).find("a").text();
                })
            });
        }

        {  //总页码
            let total = $(".ptb").find("tr>td");
            let index = total.length - 2;
            this._pages = Number($(total[index]).find("a").text())
        }
    }

    async _parseGalleryThumbnails(html){
        let $ = cheerio.load(html)
        let flag = $("#gdo4>div[class='ths nosel']").text();
        this._thumbnails = [];

        {   //缩略图
            if(flag === "Normal"){
                let list = $("#gdt").find("div[class='gdtm']").find("div");
                this._total = list.length;
                this._thumbnails[0] = $(list[0]).attr('style').match(/url\((.*?)\)/)[1]
            } else {
                let list = $("#gdt").find("div[class='gdtl']").find("a>img");
                this._total = list.length;
                list.each((i,element) => {
                    this._thumbnails[i] = $(element).attr("src");
                })
            }
        }
    }

    async _parseGalleryViewImg(html){
        let $ = cheerio.load(html)
        this._viewImgHref = [];

        let a = $("#gdt").find("div[class^='gdt']").find("a");
        a.each((i, element) => {
            let href = $(element).attr("href").match(/s\/([0-9a-z]+)\/(.*?)$/);
            this._viewImgHref[i] = [];
            this._viewImgHref[i][0] = href[1]
            this._viewImgHref[i][1] = href[2]
        })
    }

    async _parseGalleryComment(html){
        let $ = cheerio.load(html);
        let list = $("#cdiv").find("div[class='c1']");

        let monthArr = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12',
        };

        const dateParse = (str) => {

            let arr = str.split(" ");
            if(arr[2][0] === 0) delete arr[2][0];
            let day = arr[2];
            let month = monthArr[arr[3]];
            let year = arr[4].slice(0,-1);
            arr = arr[5].split(":");
            let h = arr[0];
            let m = arr[1];

            //console.log(`${year}-${month}-${day} ${h}:${m}`)
            return new Date(`${year}-${month}-${day} ${h}:${m}`);
        }

        {
            list.each((i, element) => {
                let c3 = $(element).find(".c3");
                this._comment[i] = {};
                this._comment[i].isUploader = ($(element).find(".c4,.nosel").text() === 'Uploader Comment');
                this._comment[i].user = c3.find("a").text();
                this._comment[i].time = dateParse(c3.text()).getTime() / 1000;
                let score = parseInt($(element).find("span[id^='comment_score']").text());
                this._comment[i].score = isNaN(score) ? 0 : score;
                this._comment[i].text = $(element).find(".c6").text();
            })
        }
    }
}


class ehImg {

     static async get(list = undefined, getViewImg) {
        if(list === undefined || list[0] === undefined) return null;

        if(list[0] instanceof Array){
            let urlArr = [];
            let asyncList = [];

            for (let i in list){
                asyncList[i] = ehImg._getUrl(list[i],getViewImg);
            }

            await Promise.all([...asyncList]).then(v => {
                urlArr = v;
            });

            return urlArr;
        }

        return await ehImg._getUrl(list,getViewImg);
    }

    static async _getUrl(href,getViewImg){
         let html = await getViewImg(href);
         return await ehImg. _parseGalleryImgUrl(html)
    }

    static async _parseGalleryImgUrl(html){
        let $ = cheerio.load(html);
        return $("#img").attr('src');
    }
}

module.exports = {
    ehIndex: ehIndex,
    ehGallery: ehGallery,
    ehSearch: ehSearch,
    ehImg: ehImg
}