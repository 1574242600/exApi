//ghs
const EhFetch = require('./ehFetch');
const EhParse = require('./ehParse');
const EhDown = require('./ehDown');

class ExApi {
    _EhHtml;
    constructor (userCookies, socks5proxy) {
        if (!(userCookies instanceof Object)) return 'userCookies null';
        this._EhHtml = EhFetch.EhHtml(userCookies, socks5proxy);
    }

    async getIndex(page) {
        let html = await this._EhHtml.getIndex(page);
        return new EhParse.EhIndex(html);
    }

    async getGalleryInfo(href, thumbnailsType = 1) {
        let html = await this._EhHtml.getGallery(href, 0, thumbnailsType);

        const getHtml = {
            gallery: async (page) => {
                return await this._EhHtml.getGallery(href, page, -1)
            }
        }

        return new EhParse.EhGallery(html, getHtml, href)
    }

    async getImgUrl(list) {
        return await EhParse.EhImg.get(list, this._EhHtml.getViewImg)
    }

    async search(searchConfig) {
        let html = await this._EhHtml.getSearch(searchConfig);
        return new EhParse.EhSearch(html, searchConfig, this._EhHtml.getSearch)
    }

    async downloadGallery(href, path = './download') {
        //exHentai不支持直接获取画廊所有图片（MPV应该行，但我没300hath啊）,所以才有翻页这玩意
        //貌似js没得深拷贝,所以一键下载会影响ehGallery（因为next()）
        //不得不再请求一次

        let info = await this.getGalleryInfo(href);
        let down = new EhDown(info, this._EhHtml.getViewImg, EhFetch.fetch);
        return down.run(path);
    }
}

module.exports = { default: ExApi }
