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
        advanced?: {[]}
    }

    interface DownStatus {
        id: number;
        fileName: string;
        ok: boolean
    }

    type GalleryToken = [string, string];
    type ViewToken = [string, string];

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

    type  ThumbnailsType = 0 | 1 ;

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