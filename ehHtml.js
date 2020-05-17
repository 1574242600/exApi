const fetch = require("node-fetch");
const SocksProxyAgent = require('socks-proxy-agent');
const urlObj = {
    host: 'https://exhentai.org',
    indexPage: (page) => { return `${urlObj.host}/?page=${page}`; },
    gallery: (id, token, p, thumbnailsType) => {
        if (thumbnailsType !== -1){
            let arr = ['ts_m','ts_l']
            thumbnailsType = `inline_set=${arr[thumbnailsType]}`;
        } else thumbnailsType = '';

        return `${urlObj.host}/g/${id}/${token}/?p=${p - 1}&${thumbnailsType}`
    },
    viewImg: (token,id) => {return `${urlObj.host}/s/${token}/${id}`},

    viewImgAll: null //等我攒满300hath再说
}


async function $fetch (url,config = {}) {
    config.method = 'GET';
    config.redirect = 'follow';
    config.headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
        'content-type': 'text/html,image/webp,*/*;q=0.8',
        'Cookie': ehHtml.userCookies,
        'Referer': urlObj.index
    }

    if (ehHtml.socks5proxy !== null) config.agent = new SocksProxyAgent(ehHtml.socks5proxy)

    let res = await fetch(url,config);

    return res.text();
}

function enCookies (cookiesObj) {
    let str = '';
    for (let key in cookiesObj){
        str += `${key}=${cookiesObj[key]};`
    }
    return str;
}

class ehHtml {
    static socks5proxy = null;
    static userCookies = null;

    static async getIndex (page= 0) {
        return await $fetch(urlObj.indexPage(page))
    }

    static async getGallery(href,p,imgType=-1) {
        let id = href[0];
        let token = href[1];
        return await $fetch(urlObj.gallery(id,token,p,imgType))
    }

    static async getViewImg(href) {
        let token = href[0];
        let id = href[1];
        return await $fetch(urlObj.viewImg(token,id))
    }
}


module.exports = (userCookies,socks5proxy = null) => {
    ehHtml.userCookies = enCookies(userCookies);
    ehHtml.socks5proxy = socks5proxy;
    return ehHtml;
};