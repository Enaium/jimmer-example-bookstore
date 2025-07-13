import type {Executor} from '../';
import type {VoteType} from '../model/enums/';
import type {Page, VoteInput, VoteView} from '../model/static/';

export class VoteController {
    
    constructor(private executor: Executor) {}
    
    readonly delete: (options: VoteControllerOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/votes/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getVotes: (options: VoteControllerOptions['getVotes']) => Promise<
        Page<VoteView>
    > = async(options) => {
        let _uri = '/votes';
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<VoteView>>;
    }
    
    readonly save: (options: VoteControllerOptions['save']) => Promise<
        void
    > = async(options) => {
        let _uri = '/votes';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
    
    readonly state: (options: VoteControllerOptions['state']) => Promise<
        VoteView | undefined
    > = async(options) => {
        let _uri = '/votes/state';
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
        _value = options.commentId;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'commentId='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<VoteView | undefined>;
    }
}

export type VoteControllerOptions = {
    'getVotes': {
        index?: number | undefined, 
        size?: number | undefined, 
        type: VoteType
    }, 
    'state': {
        issuerId?: string | undefined, 
        bookId?: string | undefined, 
        authorId?: string | undefined, 
        commentId?: string | undefined
    }, 
    'save': {
        body: VoteInput
    }, 
    'delete': {
        id: string
    }
}
