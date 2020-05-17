//ghs
const ehHtml = require('./ehHtml');
const ehParse = require('./ehParse');

class exApi {
    _ehHtml;
    constructor(userCookies, socks5proxy) {
        if (!(userCookies instanceof Object)) return 'userCookies null';
        this._ehHtml = ehHtml(userCookies,socks5proxy);
    }

    async getIndex(page){
        let html = await this._ehHtml.getIndex(page);
        return new ehParse.ehIndex(html);
    }

    async getGalleryInfo(href, thumbnailsType= 1){
        let html = await this._ehHtml.getGallery(href,0,thumbnailsType);

        const getHtml ={
            gallery: async (page) => {
                return await this._ehHtml.getGallery(href,page,-1)
            }
        }

        return new ehParse.ehGallery(html, getHtml);
    }

    async getImgUrl(list){
        return await ehParse.ehImg.get(list,this._ehHtml.getViewImg)
    }
}

module.exports = exApi;