import type {Executor} from '../';
import type {BookInput, BookView, Page} from '../model/static/';

export class BookController {
    
    constructor(private executor: Executor) {}
    
    readonly delete: (options: BookControllerOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/books/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getBook: (options: BookControllerOptions['getBook']) => Promise<
        BookView | undefined
    > = async(options) => {
        let _uri = '/books/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<BookView | undefined>;
    }
    
    readonly getBooks: (options: BookControllerOptions['getBooks']) => Promise<
        Page<BookView>
    > = async(options) => {
        let _uri = '/books';
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
        _value = options.keywords;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'keywords='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<BookView>>;
    }
    
    readonly save: (options: BookControllerOptions['save']) => Promise<
        void
    > = async(options) => {
        let _uri = '/books';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
}

export type BookControllerOptions = {
    'getBooks': {
        index?: number | undefined, 
        size?: number | undefined, 
        keywords?: string | undefined
    }, 
    'getBook': {
        id: string
    }, 
    'save': {
        body: BookInput
    }, 
    'delete': {
        id: string
    }
}
