import type {Executor} from '../';
import type {IssuerInput, IssuerView, Page} from '../model/static/';

export class IssuerController {
    
    constructor(private executor: Executor) {}
    
    readonly delete: (options: IssuerControllerOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/issuers/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    readonly getIssuer: (options: IssuerControllerOptions['getIssuer']) => Promise<
        IssuerView | undefined
    > = async(options) => {
        let _uri = '/issuers/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<IssuerView | undefined>;
    }
    
    readonly getIssuers: (options: IssuerControllerOptions['getIssuers']) => Promise<
        Page<IssuerView>
    > = async(options) => {
        let _uri = '/issuers';
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<IssuerView>>;
    }
    
    readonly save: (options: IssuerControllerOptions['save']) => Promise<
        void
    > = async(options) => {
        let _uri = '/issuers';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<void>;
    }
}

export type IssuerControllerOptions = {
    'getIssuers': {
        index?: number | undefined, 
        size?: number | undefined, 
        name?: string | undefined
    }, 
    'getIssuer': {
        id: string
    }, 
    'save': {
        body: IssuerInput
    }, 
    'delete': {
        id: string
    }
}
