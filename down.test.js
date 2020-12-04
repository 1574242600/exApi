const cookies = {
    'ipb_member_id': 3512590,
    'ipb_pass_hash': 'cfb712ea2633f9894c5dae23146f78d0',
    'igneous': '322abe39d'
} //公共账号   来自https://ex.acg.uy/

const ehApi = require('./exApi').default;
const exapi = new ehApi(cookies);
jest.setTimeout(600000);

it('测试 download', () => {
    return exapi.downloadGallery(['627844', '39dbc33ad8']).then(statusList => {
        expect(statusList).not.toBe(false);
    });
})