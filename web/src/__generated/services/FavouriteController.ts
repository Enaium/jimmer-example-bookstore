import type {Executor} from '../';
import type {FavouriteType} from '../model/enums/';
import type {FavouriteInput, FavouriteView, Page} from '../model/static/';

export class FavouriteController {
    
    constructor(private executor: Executor) {}
    
    readonly delete: (options: FavouriteControllerOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/favourites/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getFavourites: (options: FavouriteControllerOptions['getFavourites']) => Promise<
        Page<FavouriteView>
    > = async(options) => {
        let _uri = '/favourites';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.index;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'index='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.size;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'size='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.type;
        _uri += _separator
        _uri += 'type='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<FavouriteView>>;
    }
    
    readonly save: (options: FavouriteControllerOptions['save']) => Promise<
        void
    > = async(options) => {
        let _uri = '/favourites';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
    
    readonly state: (options: FavouriteControllerOptions['state']) => Promise<
        FavouriteView | undefined
    > = async(options) => {
        let _uri = '/favourites/state';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.issuerId;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'issuerId='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.bookId;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'bookId='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.authorId;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'authorId='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<FavouriteView | undefined>;
    }
}

export type FavouriteControllerOptions = {
    'getFavourites': {
        index?: number | undefined, 
        size?: number | undefined, 
        type: FavouriteType
    }, 
    'state': {
        issuerId?: string | undefined, 
        bookId?: string | undefined, 
        authorId?: string | undefined
    }, 
    'save': {
        body: FavouriteInput
    }, 
    'delete': {
        id: string
    }
}
