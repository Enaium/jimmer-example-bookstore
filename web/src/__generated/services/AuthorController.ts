import type {Executor} from '../';
import type {AuthorInput, AuthorView, Page} from '../model/static/';

export class AuthorController {
    
    constructor(private executor: Executor) {}
    
    readonly delete: (options: AuthorControllerOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/authors/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getAuthor: (options: AuthorControllerOptions['getAuthor']) => Promise<
        AuthorView | undefined
    > = async(options) => {
        let _uri = '/authors/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<AuthorView | undefined>;
    }
    
    readonly getAuthors: (options: AuthorControllerOptions['getAuthors']) => Promise<
        Page<AuthorView>
    > = async(options) => {
        let _uri = '/authors';
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
        _value = options.name;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'name='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<AuthorView>>;
    }
    
    readonly save: (options: AuthorControllerOptions['save']) => Promise<
        void
    > = async(options) => {
        let _uri = '/authors';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
}

export type AuthorControllerOptions = {
    'getAuthors': {
        index?: number | undefined, 
        size?: number | undefined, 
        name?: string | undefined
    }, 
    'getAuthor': {
        id: string
    }, 
    'save': {
        body: AuthorInput
    }, 
    'delete': {
        id: string
    }
}
