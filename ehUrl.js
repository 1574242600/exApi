class ehUrl {
    static host = 'https://exhentai.org'

    static indexPage(page) {
        return `${this.host}/?page=${page}`;
    }

    static gallery(id, token, p, thumbnailsType) {
        if (thumbnailsType !== -1) {
            let arr = ['ts_m', 'ts_l']
            thumbnailsType = `inline_set=${arr[thumbnailsType]}`;
        } else thumbnailsType = '';

        return `${this.host}/g/${id}/${token}/?p=${p - 1}&${thumbnailsType}`
    }

    static viewImg(token, id) {
        return `${this.host}/s/${token}/${id}`
    }

    //static MPV(){}
    //TODO 等我攒满300hath再说

    static search(searchConfig, p) {
        const config = searchConfig;

        if (typeof (config) === 'string') return `${this.host}/?f_search=${config}&page=${p}`;
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

        return this.host + str;
    }
}

module.exports = ehUrl;