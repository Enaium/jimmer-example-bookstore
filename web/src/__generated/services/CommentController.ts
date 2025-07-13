import type {Executor} from '../';
import type {CommentInput, CommentView, Page} from '../model/static/';

export class CommentController {
    
    constructor(private executor: Executor) {}
    
    readonly delete: (options: CommentControllerOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/comments/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getComment: (options: CommentControllerOptions['getComment']) => Promise<
        CommentView | undefined
    > = async(options) => {
        let _uri = '/comments/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<CommentView | undefined>;
    }
    
    readonly getComments: (options: CommentControllerOptions['getComments']) => Promise<
        Page<CommentView>
    > = async(options) => {
        let _uri = '/comments';
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
        _value = options.parentId;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'parentId='
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
        _value = options.issuerId;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'issuerId='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<CommentView>>;
    }
    
    readonly save: (options: CommentControllerOptions['save']) => Promise<
        void
    > = async(options) => {
        let _uri = '/comments';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
}

export type CommentControllerOptions = {
    'getComments': {
        index?: number | undefined, 
        size?: number | undefined, 
        parentId?: string | undefined, 
        bookId?: string | undefined, 
        authorId?: string | undefined, 
        issuerId?: string | undefined
    }, 
    'getComment': {
        id: string
    }, 
    'save': {
        body: CommentInput
    }, 
    'delete': {
        id: string
    }
}
