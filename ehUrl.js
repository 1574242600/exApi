class EhUrl {
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
        if (typeof (config) === 'string') return `${this.host}/?f_search=${searchConfig}&page=${p}`;
        let str = EhSearchQuery.getQueryStr(searchConfig, p);
        return this.host + str;
    }
}

class EhSearchQuery {
    static _queryStr = '/?'
    static _config;

    static getQueryStr(searchConfig, p) {
        this._config = searchConfig;
        this._basisSearch(p);
        this._advancedSearch();
        return this._queryStr;
    }

    static _basisSearch(p) {
        this._queryStr += `page=${p}` // 页码
        this._addType();
        this._addTagAndText();
    }
    
    static _advancedSearch() {
        let config = this._config;

        if (config.advanced instanceof Object && Object.keys(config.advanced).length !== 0) {
            this._queryStr += '&advsearch=1'
        }
    }

    static _addType() {
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

        if (this._config.type instanceof Array && this._config.type.length !== 0) {
            for (let typeStr of this._config.type) {
                if (typeValueObj[typeStr] !== undefined) typeValue -= typeValueObj[typeStr];
            }
        }

        this._queryStr += `&f_cats=${typeValue}`
    }

    static _addTagAndText() {
        let config = this._config;
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

        this._queryStr += `&f_search=${tagAllStr} ${text}`
    }
}

module.exports = EhUrl;