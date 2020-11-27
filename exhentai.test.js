const cookies = {
    'ipb_member_id': 3512590,
    'ipb_pass_hash': 'cfb712ea2633f9894c5dae23146f78d0',
    'igneous': '322abe39d'
} //公共账号   来自https://ex.acg.uy/

const ehApi = require('./exApi').default;
//const socks5proxy = "socks5://127.0.0.1:1083";
const exapi = new ehApi(cookies);
jest.setTimeout(60000);

(async () => {

    describe('测试getIndex', () => {
        it('getIndex()', () => {
            return exapi.getIndex().then(data => {
                expect(data.getAll().length > 0).toBe(true)
            })
        })

        it('next()', () => {
            return exapi.getIndex().then(data => {
                return data.next().then(data2 => {
                    expect(data2.getAll().length > 0).toBe(true)
                })
            })
        })
    })
    const gallery = await exapi.getGalleryInfo(['627844', '39dbc33ad8']);

    describe('测试 getGalleryInfo', () => {

        it('getAllInfo()', () => {
            const allInfo = gallery.getAllInfo();
            expect(allInfo).toHaveProperty('type', 'Doujinshi')
        })

        it('getInfo()', () => {
            expect(gallery.getInfo('type')).toBe('Doujinshi')
        })

        it('getThumbnails()', () => {
            expect(gallery.getThumbnails().length > 0).toBe(true)
        })

        it('getViewHref()', () => {
            expect(gallery.getViewHref().length > 0).toBe(true)
        })

        it('gallery.getComment()', () => {
            expect(gallery.getComment().length >= 0).toBe(true)
        })
    })

    await gallery.next();

    describe('getGalleryInfo.next()', async () => {

        it('getThumbnails()', () => {
            expect(gallery.getThumbnails().length > 0).toBe(true)
        })

        it('getViewHref()', () => {
            expect(gallery.getViewHref().length > 0).toBe(true)
        })
    })
})()



async function main() {


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
            log(search.getAll(), 'String search.getAll()')
            await search.next()
            log(search.getAll(), 'String search.next()')
        }

        {//tag
            let searchConfig = {
                type: ['Doujinshi'],
                tag: {
                    artist: ['shouji ayumu'],
                    female: ['lolicon', 'sole female'],
                },
                text: '',
            }

            let search = await exapi.search(searchConfig)
            log(search.getAll(), 'Tag search.getAll()')
            await search.next()
            log(search.getAll(), 'Tag search.next()')
        }

        {//高级
            let searchConfig = {
                type: ['Doujinshi'],
                tag: {
                    artist: ['shouji ayumu'],
                    female: ['lolicon'],
                },
                text: '',
                advanced: { //高级搜索设置   详情请查看index.d.ts
                    enable: { name: true, tags: true },
                    show: { delete: true },
                    rating: 5,
                    between: [1, 20],
                    disableFilter: {
                        lang: true
                    }
                }
            }

            let search = await exapi.search(searchConfig)
            log(search.getAll(), 'Advanced search.getAll()')
            await search.next()
            log(search.getAll(), 'Advanced search.next()')
        }

    }

    {   //下载
        exapi.downloadGallery(['627844', '39dbc33ad8']).then(statusList => {
            console.log(statusList)
        });

    }

}
