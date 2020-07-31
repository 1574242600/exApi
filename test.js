const cookies = {
    'ipb_member_id': 3512590,
    'ipb_pass_hash': 'cfb712ea2633f9894c5dae23146f78d0',
    'igneous': '322abe39d'
} //公共账号   来自https://ex.acg.uy/

const ehApi = require('../exApi').default;
const socks5proxy = "socks5://127.0.0.1:1083";

const log = (data,msg) => {
    console.log(msg + ": \n");
    console.log(data);
    console.log("----------------------------------------\n");
}

async function main() {
    let exapi = new ehApi(cookies);


    {   //首页
        let list = await exapi.getIndex(0);
        log(list.getAll(), 'getIndex')
    }


    {   //画廊
        let gallery = await exapi.getGalleryInfo(['627844', '39dbc33ad8']);
        //log(gallery, 'getGallery')
        log(gallery.getAllInfo(), 'getAllInfo')
        log(gallery.getInfo('type'), 'getInfo')
        log(gallery.getThumbnails(), 'getThumbnails')
        log(gallery.getViewHref(), 'getViewUrl')
        log(gallery.getComment(), 'getComment')


        {
            let imgUrl = await exapi.getImgUrl(gallery.getViewHref()[0]);
            log(imgUrl, 'getImgUrl a')
            let imgUrlArr = await exapi.getImgUrl(gallery.getViewHref());
            log(imgUrlArr, 'getImgUrl arr')
        }


        await gallery.next();

        //log(gallery.getAllInfo(),'getAllInfo')
        //log(gallery.getInfo('type'),'getInfo')
        log(gallery.getThumbnails(), 'getThumbnails')
        log(gallery.getViewHref(), 'getViewUrl')
        //log(gallery, 'getGallery2')
    }

    {// 搜索

        {//字符串
            let search = await exapi.search('c97')
            log(search.getAll(), 'string search.getAll()')
            await search.next()
            log(search.getAll(), 'string search.next()')
        }

        {//tag
            let searchConfig = {
                type: ['Doujinshi'],
                tag: {
                    artist: ['shouji ayumu'],
                    female: ['lolicon'],
                },
                text: ''
            }

            let search = await exapi.search(searchConfig)
            log(search.getAll(), 'tag search.getAll()')
            await search.next()
            log(search.getAll(), 'tag search.next()')
        }

    }

    {   //下载
        exapi.downloadGallery(['627844', '39dbc33ad8']).then(statusList => {
            console.log(statusList)
        });

    }
}



main();