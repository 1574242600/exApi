const EhImg = require('./ehParse').EhImg;
const fs = require('fs');

class EhDownload extends EhImg {
    _info;
    _path;
    _getViewImg;
    _fetch;
    _retryNumber = {};  //重试次数

    constructor (info, getViewImg, fetch) {
        super();
        this._info = info;
        this._getViewImg = getViewImg;
        this._fetch = fetch;
    }

    async run(path) {
        let statusList = [];

        try {
            const info = this._info;
            this._path = path + `/${this._info.href[0]}/`;
            this._mkdir(path);
            fs.appendFileSync(this._path + 'info.json', JSON.stringify(info.getAllInfo()))

            let p = 0;
            let onePages; //单页图片数

            do {
                let imgHref = info.getViewHref()
                if (onePages === undefined) onePages = imgHref.length;

                let asyncList = imgHref.map((v, i) => {
                    return () => this._down(v, onePages * p + i);
                })

                statusList.push(...(await EhImg.all(asyncList, 1)));

                if (info.page !== info.pages) await info.next();
                p++;
            } while (p !== info.pages)

            this._logger('Note', `画廊下载完成`);
        } catch (e) {
            this._retryNumber.run === undefined ? this._retryNumber.run = 1 : this._retryNumber.run++;
            this._logger('Error', e.stack);
            this._logger('Note', `画廊下载失败 开始重试[${this._retryNumber.run}]`);
            if (this._retryNumber.run <= 2) return await this.run(path)
            this._logger('Note', `画廊下载失败`);
            return false;
        }

        return statusList;
    }

    async _down(imgHref, id) {
        try {
            let imgUrl = await this._getImgUrl(imgHref);
            let fileName = imgUrl.split('xres=')[1].split('/')[1];
            let imgBuffer = await this._fetch(imgUrl, {}, true);
            fs.appendFileSync(this._path + fileName, imgBuffer)

            this._logger('succeed', `id:${id} 图片下载完成`);
            return {
                id: id,
                fileName: fileName,
                ok: true
            };
        } catch (e) {
            this._retryNumber._down === undefined ? this._retryNumber._down = 1 : this._retryNumber._down++;
            this._logger('Error', e.stack);
            this._logger('Note', `id:${id} 图片下载失败, 开始重试[${this._retryNumber._down}]`);
            if (this._retryNumber._down <= 3) return this._down(imgHref, id);
            this._logger('Error', `id:${id} 图片下载失败`);
            return {
                id: id,
                fileName: fileName === undefined ? null : fileName,
                ok: false
            };
        }
    }

    async _getImgUrl(list) {
        return await EhImg.get(list, this._getViewImg)
    }

    _logger(mode = 'Error', msg) {
        const LOGPATH = this._path + 'download.log'
        let output = `\n[${mode}] ${timeSting()} ${msg}`;

        try {
            console.log(output);
            fs.appendFileSync(LOGPATH, output, 'utf8')
        } catch (e) {
            console.log(output);
            console.error(e.stack);
        }
    }

    _mkdir(path) {
        try {
            let stat = fs.statSync(path);
            stat = fs.statSync(this._path);
        } catch (e) {
            if (!fs.existsSync(path)) fs.mkdirSync(path);
            fs.mkdirSync(this._path);
            this._mkdir(path);
        }
    }
}

function timeSting() {
    const date = new Date();
    const Y = date.getFullYear();
    const M = date.getMonth();
    const D = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

module.exports = EhDownload;
