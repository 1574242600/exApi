//ghs
const ehFetch = require('./ehFetch');
const ehParse = require('./ehParse');
const ehDown = require('./ehDown');

class exApi {
    _ehHtml;
    constructor(userCookies, socks5proxy) {
        if (!(userCookies instanceof Object)) return 'userCookies null';
        this._ehHtml = ehFetch.ehHtml(userCookies, socks5proxy);
    }

    async getIndex(page){
        let html = await this._ehHtml.getIndex(page);
        return new ehParse.ehIndex(html);
    }

    async getGalleryInfo(href, thumbnailsType= 1){
        let html = await this._ehHtml.getGallery(href,0,thumbnailsType);

        const getHtml ={
            gallery: async (page) => {
                return await this._ehHtml.getGallery(href, page, -1)
            }
        }

        return new ehParse.ehGallery(html, getHtml, href)
    }

    async getImgUrl(list) {
        return await ehParse.ehImg.get(list, this._ehHtml.getViewImg)
    }

    async search(searchConfig) {
        let html = await this._ehHtml.getSearch(searchConfig);
        return new ehParse.ehSearch(html, searchConfig, this._ehHtml.getSearch)
    }

    async downloadGallery(href, path = './download') {
        //exHentai不支持直接获取画廊所有图片（MPV应该行，但我没300hath啊）,所以才有翻页这玩意
        //貌似js没得深拷贝,所以一键下载会影响ehGallery（因为next()）
        //不得不再请求一次

        let info = await this.getGalleryInfo(href);
        let down = new ehDown(info, this._ehHtml.getViewImg, ehFetch.fetch);
        return down.run(path);
    }
}

module.exports = exApi;