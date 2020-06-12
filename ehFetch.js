const fetch = require("node-fetch");
const ehUrl = require("./ehUrl");
const SocksProxyAgent = require('socks-proxy-agent');

async function $fetch(url, config = {}, isImg = false) {
    config.method = 'GET';
    config.redirect = 'follow';
    config.headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
        'content-type': 'text/html,image/webp,*/*;q=0.8',
        'Cookie': isImg ? '' : ehHtml.userCookies,
        'Referer': ehUrl.host
    }

    if (ehHtml.socks5proxy !== null) config.agent = new SocksProxyAgent(ehHtml.socks5proxy)

    let res = await fetch(url, config);

    return isImg ? res.buffer() : res.text();
}

function enCookies(cookiesObj) {
    let str = '';
    for (let key in cookiesObj) {
        str += `${key}=${cookiesObj[key]};`
    }
    return str;
}

class ehHtml {
    static socks5proxy = null;
    static userCookies = null;

    static async getIndex(page = 0) {
        return await $fetch(ehUrl.indexPage(page))
    }

    static async getGallery(href, p, imgType = -1) {
        let id = href[0];
        let token = href[1];
        return await $fetch(ehUrl.gallery(id, token, p, imgType))
    }

    static async getViewImg(href) {
        let token = href[0];
        let id = href[1];
        return await $fetch(ehUrl.viewImg(token, id))
    }

    static async getSearch(searchConfig, p = 1) {
        return await $fetch(ehUrl.search(searchConfig, p - 1))
    }
}

module.exports = {
    ehHtml: (userCookies, socks5proxy = null) => {
        ehHtml.userCookies = enCookies(userCookies);
        ehHtml.socks5proxy = socks5proxy;
        return ehHtml;
    },

    fetch: $fetch
}