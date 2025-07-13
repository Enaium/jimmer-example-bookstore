import type {Executor} from '../';

export class ImageController {
    
    constructor(private executor: Executor) {}
    
    readonly findImage: (options: ImageControllerOptions['findImage']) => Promise<
        void
    > = async(options) => {
        let _uri = '/images/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<void>;
    }
    
    readonly saveImages: (options: ImageControllerOptions['saveImages']) => Promise<
        Array<string>
    > = async(options) => {
        let _uri = '/images';
        const _formData = new FormData();
        const _body = options.body;
        for (const file of _body.file) {
            _formData.append("file", file);
        }
        return (await this.executor({uri: _uri, method: 'POST', body: _formData})) as Promise<Array<string>>;
    }
}

export type ImageControllerOptions = {
    'findImage': {
        id: string
    }, 
    'saveImages': {
        body: {
            file: Array<File>
        }
    }
}
