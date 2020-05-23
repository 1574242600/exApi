const fetch = require("node-fetch");
const SocksProxyAgent = require('socks-proxy-agent');
const urlObj = {
    host: 'https://exhentai.org',
    indexPage: (page) => {
        return `${urlObj.host}/?page=${page}`;
    },
    gallery: (id, token, p, thumbnailsType) => {
        if (thumbnailsType !== -1) {
            let arr = ['ts_m', 'ts_l']
            thumbnailsType = `inline_set=${arr[thumbnailsType]}`;
        } else thumbnailsType = '';

        return `${urlObj.host}/g/${id}/${token}/?p=${p - 1}&${thumbnailsType}`
    },
    viewImg: (token, id) => {
        return `${urlObj.host}/s/${token}/${id}`
    },
    MPV: null,  //TODO 等我攒满300hath再说
    search: (searchConfig, p) => {
        const config = searchConfig;

        if (typeof (config) === 'string') return `${urlObj.host}/?f_search=${config}&page=${p}`;
        let str = '/?';  //查询字符串

        {//基础

            {// 页码
                str = str + `page=${p}`
            }

            {//类型
                const typeValueObj = {
                    'Doujinshi': 2,
                    'Manga': 4,
                    'Artist CG': 8,
                    'Game CG': 16,
                    'Western': 512,
                    'Non-H': 256,
                    'Image Set': 32,
                    'Cosplay': 64,
                    'Asian Porn': 128,
                    'Misc': 1
                };

                let typeValue = 1023;

                if (config.type instanceof Array && config.type.length !== 0) {
                    for (let typeStr of config.type) {
                        if (typeValueObj[typeStr] !== undefined) typeValue -= typeValueObj[typeStr];
                    }
                }

                str = str + `&f_cats=${typeValue}`
            }


            {// 搜索文本字符串
                let tagAllStr = '';
                let text = '';

                if (typeof (config.text) === 'string') text = config.text;
                //标签
                if (config.tag instanceof Object && Object.keys(config.tag).length !== 0) {
                    for (let key in config.tag) {
                        if (config.tag[key].length === 0) continue;
                        tagAllStr = tagAllStr + `${key}:`;
                        if (config.tag[key].length === 1) tagAllStr = tagAllStr + '"'; //某属性只有一个tag时

                        for (let tagStr of config.tag[key]) {
                            tagStr = tagStr.replace(/ /g, '+');
                            tagAllStr = tagAllStr + `${tagStr} `
                        }

                        tagAllStr = tagAllStr.trim() + '$ ';
                        if (config.tag[key].length === 1) tagAllStr = tagAllStr.trim() + '" '; //某属性只有一个tag时
                    }
                }

                str = str + `&f_search=${tagAllStr} ${text}`

            }
        }

        {
        } //todo 高级搜索

        return urlObj.host + str;
    }
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
        return await $fetch(urlObj.gallery(id, token, p, imgType))
    }

    static async getViewImg(href) {
        let token = href[0];
        let id = href[1];
        return await $fetch(urlObj.viewImg(token, id))
    }

    static async getSearch(searchConfig, p = 1) {
        return await $fetch(urlObj.search(searchConfig, p - 1))
    }
}

async function $fetch(url, config = {}) {
    config.method = 'GET';
    config.redirect = 'follow';
    config.headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
        'content-type': 'text/html,image/webp,*/*;q=0.8',
        'Cookie': ehHtml.userCookies,
        'Referer': urlObj.index
    }

    if (ehHtml.socks5proxy !== null) config.agent = new SocksProxyAgent(ehHtml.socks5proxy)

    let res = await fetch(url, config);

    return res.text();
}

function enCookies(cookiesObj) {
    let str = '';
    for (let key in cookiesObj) {
        str += `${key}=${cookiesObj[key]};`
    }
    return str;
}

module.exports = (userCookies, socks5proxy = null) => {
    ehHtml.userCookies = enCookies(userCookies);
    ehHtml.socks5proxy = socks5proxy;
    return ehHtml;
};