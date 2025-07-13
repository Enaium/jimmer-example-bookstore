import type {Executor} from '../';
import type {Page, TagInput, TagView} from '../model/static/';

export class TagController {
    
    constructor(private executor: Executor) {}
    
    readonly delete: (options: TagControllerOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/tags/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getTag: (options: TagControllerOptions['getTag']) => Promise<
        TagView | undefined
    > = async(options) => {
        let _uri = '/tags/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<TagView | undefined>;
    }
    
    readonly getTags: (options: TagControllerOptions['getTags']) => Promise<
        Page<TagView>
    > = async(options) => {
        let _uri = '/tags';
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<TagView>>;
    }
    
    readonly save: (options: TagControllerOptions['save']) => Promise<
        void
    > = async(options) => {
        let _uri = '/tags';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
}

export type TagControllerOptions = {
    'getTags': {
        index?: number | undefined, 
        size?: number | undefined, 
        name?: string | undefined
    }, 
    'getTag': {
        id: string
    }, 
    'save': {
        body: TagInput
    }, 
    'delete': {
        id: string
    }
}
