import type {Executor} from '../';
import type {AccountInput, AuthResponse} from '../model/static/';

export class AuthController {
    
    constructor(private executor: Executor) {}
    
    readonly login: (options: AuthControllerOptions['login']) => Promise<
        AuthResponse
    > = async(options) => {
        let _uri = '/auth/login';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<AuthResponse>;
    }
    
    readonly register: (options: AuthControllerOptions['register']) => Promise<
        void
    > = async(options) => {
        let _uri = '/auth/register';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<void>;
    }
}

export type AuthControllerOptions = {
    'login': {
        body: AccountInput
    }, 
    'register': {
        body: AccountInput
    }
}
