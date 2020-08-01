declare module 'exapi' {
    interface ApiCookies {
        ipb_member_id: number,
        ipb_pass_hash: string,
        igneous: string
    }

    interface SearchConfig {
        type: GalleryType[],
        tag?: { [T in TagNamespace]?: string[] },
        text?: string,
        advanced?: {
            enable?: { [T in AdvancedSearchEnable]?: boolean };
            show?: { [T in AdvancedSearchShow]?: boolean };
            rating?: number         //最低评分  应为 2 - 5 之间的整数
            between?: [number, number];    //介于 _ 和 _ 页  整数
            disableFilter?: { [T in AdvancedSearchDisableFilter]?: boolean };
        }
    }

    interface DownStatus {
        id: number;
        fileName: string;
        ok: boolean
    }

    type GalleryToken = [string, string];
    type ViewToken = [string, string];


    type AdvancedSearchEnable =
        'name' | //是否搜索画廊名称
        'tags' | //是否搜索标签
        'desc' | //是否搜索描述
        'torr' | //是否搜索种子文件名
        'dt1' | //是否搜索低权重标签
        'dt2'; //是否搜索投票移除了的标签

    type AdvancedSearchShow =
        'torr' | //是否只显示有种子的图库
        'delete'; //是否显示已删除的库

    type AdvancedSearchDisableFilter =
        'lang' |    //是否禁用语言过滤
        'uploader' |    //是否禁用上传者过滤
        'tags';    //是否禁用标签过滤


    type TagNamespace =
        'language' |
        'parody' |
        'character' |
        'group' |
        'artist' |
        'male' |
        'female' |
        'misc' |
        'reclass';

    type GalleryType =
        'Doujinshi' |
        'Manga' |
        'Artist CG' |
        'Game CG' |
        'Western' |
        'Non-H' |
        'Image Set' |
        'Cosplay' |
        'Asian Porn' |
        'Misc'

    type PartialGalleryInfo = {
        type: string,
        title: string,
        cover?: string,
        published: string,
        rating: number,
        length: number,
        uploader: string,
        href: GalleryToken
    }

    type GalleryInfo = {
        type: string,
        title: [string] | [string, string],
        cover: string,
        uploader: string,
        published: string,
        parent: string,
        visible: string,
        language: string,
        size: string,
        length: number,
        favorited: number,
        rating: {
            count: number,
            average: number
        },
        tag: { [T in TagNamespace]?: string[] }
    };

    type Comment = {
        isUploader: boolean,
        user: string,
        time: number,
        score: number,
        text: string
    }

    type ThumbnailsType = 0 | 1;

    export default class {
        constructor(cookies: ApiCookies, proxy?: string)

        getIndex(page: number): Promise<EhIndex>
        getGalleryInfo(gallery: GalleryToken, thumbnails_type?: ThumbnailsType): Promise<EhGallery>
        getImgUrl(token: ViewToken | ViewToken[]): Promise<string | string[]>
        search(search: string | SearchConfig | object): Promise<EhSearch>
        downloadGallery(href: GalleryToken, path?: string): Promise<DownStatus[]>
    }

    class EhIndex {
        pages: number;

        getAll(): PartialGalleryInfo[]
    }

    class EhSearch extends EhIndex {
        page: number;

        next(advance?: number): Promise<this | null>
    }

    class EhGallery {
        _info: GalleryInfo;
        _thumbnails: string[];
        _viewImgHref: ViewToken[];
        _comment: Comment[];
        _total: number;
        _getHtml: string;
        href: GalleryToken;
        page: number;
        pages: number;

        getAllInfo(): GalleryInfo
        getInfo<T extends keyof GalleryInfo>(key?: T): GalleryInfo[T]
        getThumbnails(): string[]
        getViewHref(): ViewToken[]
        getComment(): Comment[]
        next(advance?: number): Promise<this | null>
    }
}