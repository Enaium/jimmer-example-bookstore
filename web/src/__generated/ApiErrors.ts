export type AllErrors = {
        family: 'ACCOUNT', 
        code: 'USERNAME_DOES_NOT_EXIST'
    } | {
        family: 'ACCOUNT', 
        code: 'USERNAME_ALREADY_EXISTS'
    } | {
        family: 'COMMENT', 
        code: 'NOT_AUTHENTICATED'
    } | {
        family: 'COMMENT', 
        code: 'NOT_FOUND'
    } | {
        family: 'COMMENT', 
        code: 'NOT_AUTHORIZED'
    } | {
        family: 'IMAGE', 
        code: 'NOT_FOUND'
    } | {
        family: 'IMAGE', 
        code: 'NO_EXTENSION'
    } | {
        family: 'VOTE', 
        code: 'NOT_AUTHENTICATED'
    } | {
        family: 'VOTE', 
        code: 'NOT_FOUND'
    } | {
        family: 'VOTE', 
        code: 'NOT_AUTHORIZED'
    };
export type ApiErrors = {
    'authController': {
        'login': AllErrors & ({
                family: 'ACCOUNT', 
                code: 'USERNAME_DOES_NOT_EXIST', 
                readonly [key:string]: any
            }), 
        'register': AllErrors & ({
                family: 'ACCOUNT', 
                code: 'USERNAME_ALREADY_EXISTS', 
                readonly [key:string]: any
            })
    }, 
    'authorController': {
    }, 
    'bookController': {
    }, 
    'commentController': {
        'delete': AllErrors & ({
                family: 'COMMENT', 
                code: 'NOT_AUTHENTICATED', 
                readonly [key:string]: any
            } | {
                family: 'COMMENT', 
                code: 'NOT_FOUND', 
                readonly [key:string]: any
            } | {
                family: 'COMMENT', 
                code: 'NOT_AUTHORIZED', 
                readonly [key:string]: any
            })
    }, 
    'favouriteController': {
    }, 
    'imageController': {
        'findImage': AllErrors & ({
                family: 'IMAGE', 
                code: 'NOT_FOUND', 
                readonly [key:string]: any
            }), 
        'saveImages': AllErrors & ({
                family: 'IMAGE', 
                code: 'NO_EXTENSION', 
                readonly [key:string]: any
            })
    }, 
    'issuerController': {
    }, 
    'tagController': {
    }, 
    'voteController': {
        'delete': AllErrors & ({
                family: 'VOTE', 
                code: 'NOT_AUTHENTICATED', 
                readonly [key:string]: any
            } | {
                family: 'VOTE', 
                code: 'NOT_FOUND', 
                readonly [key:string]: any
            } | {
                family: 'VOTE', 
                code: 'NOT_AUTHORIZED', 
                readonly [key:string]: any
            })
    }
};
