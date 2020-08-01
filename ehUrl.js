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
        if (typeof (searchConfig) === 'string') return `${this.host}/?f_search=${encodeURIComponent(searchConfig)}&page=${p}`;
        let str = (new EhSearchQuery).getQueryStr(searchConfig, p);

        return this.host + str;
    }
}

class EhSearchQuery {
    _queryStr = '/?'
    _config;

    getQueryStr(searchConfig, p) {
        this._config = searchConfig;
        this._basisSearch(p);
        this._advancedSearch();
        return this._queryStr;
    }

    _basisSearch(p) {
        this._queryStr += `page=${p}` // 页码
        this._addType();
        this._addTagAndText();
    }

    _advancedSearch() {
        let config = this._config;

        if (config.advanced instanceof Object && Object.keys(config.advanced).length !== 0) {
            this._queryStr += '&advsearch=1';
            this._addAdvancedEnable();
            this._addAdvancedShow();
            this._addAdvancedRating();
            this._addAdvancedBetween();
            this._addAdvancedDisableFilter();
        }
    }

    _addType() {
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

    _addTagAndText() {
        let config = this._config;
        let tagAllStr = '';
        let text = (typeof (config.text) === 'string' && config.text.length > 0)
            ? encodeURIComponent(config.text) : undefined;

        //标签
        if (config.tag instanceof Object && Object.keys(config.tag).length !== 0) {
            for (let key in config.tag) {
                let length = config.tag[key].length;

                if (length === 0) continue;
                if (tagAllStr !== '') tagAllStr += '+'

                tagAllStr = tagAllStr + `${key}%3A`;
                if (length === 1) tagAllStr = tagAllStr + '%22'; //某属性只有一个tag时

                for (let i in config.tag[key]) {
                    let tagStr = config.tag[key][i];
                    
                    //eh的搜索有点迷
                    //属性中只有一个tag时, 如果tag不是单个单词时,用+连接
                    //如果有多个tag, 不同tag间用+连接, tag不是单个单词时,用%2B连接
                    //不然用高级搜索时,会没有结果

                    if (i != 0) tagAllStr += '+';    
                    let replace = length > 1 ? '%2B' : '+';
                    tagStr = tagStr.replace(/ /g, replace);
                    tagAllStr += `${tagStr}`
                }

                tagAllStr = tagAllStr.trim() + '%24';
                if (length === 1) tagAllStr = tagAllStr.trim() + '%22'; //某属性只有一个tag时
            }
        }

        if (text !== undefined && tagAllStr !== '') text = ' +' + text;
        this._queryStr += `&f_search=${tagAllStr}${text ? text : ''}`
    }

    _addAdvancedEnable() {
        let advancedConfig = this._config.advanced;
        if (advancedConfig.enable instanceof Object && Object.keys(advancedConfig.enable).length !== 0) {
            let enableConfig = advancedConfig.enable;
            if (enableConfig['name']) this._queryStr += '&f_sname=on';  //是否搜索画廊名称
            if (enableConfig['tags']) this._queryStr += '&f_stags=on';  //是否搜索标签
            if (enableConfig['desc']) this._queryStr += '&f_sdesc=on';  //是否搜索描述
            if (enableConfig['torr']) this._queryStr += '&f_storr=on';  //是否搜索种子文件名
            if (enableConfig['dt1']) this._queryStr += '&f_sdt1=on';    //是否搜索低权重标签
            if (enableConfig['dt2']) this._queryStr += '&f_sdt2=on';    //是否搜索投票移除了的标签
        } else {
            this._queryStr += '&f_sname=on&f_stags=on';
        }
    }

    _addAdvancedShow() {
        let advancedConfig = this._config.advanced;
        if (advancedConfig.show instanceof Object && Object.keys(advancedConfig.show).length !== 0) {
            let showConfig = advancedConfig.show;
            if (showConfig['torr']) this._queryStr += '&f_sto=on'; //是否只显示有种子的图库
            if (showConfig['delete']) this._queryStr += '&f_sh=on'  //是否显示已删除的库
        }
    }

    _addAdvancedRating() {
        let rating = this._config.advanced.rating;
        if (Number.isInteger(rating) && rating > 1 && rating <= 5) this._queryStr += `&f_sr=on&f_srdd=${rating}`;
    }

    _addAdvancedBetween() {
        let advancedConfig = this._config.advanced;
        if (advancedConfig.between instanceof Array && Object.keys(advancedConfig.show).length == 2) {
            let between = advancedConfig.between;
            if (Number.isInteger(between[0]) && Number.isInteger(between[1])) {
                this._queryStr += `&f_sp=on&f_spf=${between[0]}&f_spt=${between[1]}`
            }
        }
    }

    _addAdvancedDisableFilter() {
        let advancedConfig = this._config.advanced;
        if (advancedConfig.disableFilter instanceof Object && Object.keys(advancedConfig.disableFilter).length !== 0) {
            let disableFilterConfig = advancedConfig.disableFilter;
            if (disableFilterConfig['lang']) this._queryStr += '&f_sfl=on';     //是否禁用语言过滤
            if (disableFilterConfig['uploader']) this._queryStr += '&f_sfu=on'  //是否禁用上传者过滤
            if (disableFilterConfig['tags']) this._queryStr += '&f_sft=on';     //是否禁用标签过滤
        }
    }
}

module.exports = EhUrl;