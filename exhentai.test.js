const cookies = {
    'ipb_member_id': 3512590,
    'ipb_pass_hash': 'cfb712ea2633f9894c5dae23146f78d0',
    'igneous': '322abe39d'
} //公共账号   来自https://ex.acg.uy/

const ehApi = require('./exApi').default;
//const socks5proxy = "socks5://127.0.0.1:1083";
const exapi = new ehApi(cookies);
jest.setTimeout(600000);

describe('测试exhentai', () => {

    describe('测试 Index', () => {
        it('getIndex()', () => {
            return exapi.getIndex().then(data => {
                expect(data.getAll().length > 0).toBe(true)
            })
        })
    })

    describe('测试 Gallery', () => {
        let Gallery;
        describe('getGalleryInfo', () => {
            beforeEach(async () => {
                Gallery = await exapi.getGalleryInfo(['627844', '39dbc33ad8'])
            });

            it('getAllInfo()', () => {
                const allInfo = Gallery.getAllInfo();
                expect(allInfo).toHaveProperty('type', 'Doujinshi')
            })

            it('getInfo()', () => {
                expect(Gallery.getInfo('type')).toBe('Doujinshi')
            })

            it('getThumbnails()', () => {
                expect(Gallery.getThumbnails().length > 0).toBe(true)
            })

            it('getViewHref()', () => {
                expect(Gallery.getViewHref().length > 0).toBe(true)
            })

            it('getComment()', () => {
                expect(Gallery.getComment().length >= 0).toBe(true)
            })
        })

        describe('next()', () => {
            beforeEach(async () => {
                await Gallery.next();
            });

            it('getThumbnails()', () => {
                expect(Gallery.getThumbnails().length > 0).toBe(true)
            })

            it('getViewHref()', () => {
                expect(Gallery.getViewHref().length > 0).toBe(true)
            })
        })

        describe('exapi.getimgUrl()', () => {
            beforeEach(async () => {
                Gallery.imgUrlArray = await exapi.getImgUrl(Gallery.getViewHref());
            });

            it('string', () => {
                const imgUrl = Gallery.imgUrlArray[0];
                expect(/^http(s?):\/\//.test(imgUrl)).toBe(true)
            })

            it('array', () => {
                const imgUrlArr = Gallery.imgUrlArray;
                expect(imgUrlArr.length > 0 && /^http(s?):\/\//.test(imgUrlArr[0])).toBe(true)
            })
        })
    })

    describe('测试 search', () => {
        it('string', async () => {
            const Search = await exapi.search('c97');
            expect(Search.getAll().length > 0).toBe(true)
        })

        it('tag', async () => {
            const searchConfig = {
                type: ['Doujinshi'],
                tag: {
                    artist: ['shouji ayumu'],
                    female: ['lolicon', 'sole female'],
                },
                text: '',
            }

            const Search = await exapi.search(searchConfig);
            expect(Search.getAll().length > 0).toBe(true)
        })

        it('advanced', async () => {
            const searchConfig = {
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

            const Search = await exapi.search(searchConfig);
            expect(Search.getAll().length > 0).toBe(true)
        })
    })
})
