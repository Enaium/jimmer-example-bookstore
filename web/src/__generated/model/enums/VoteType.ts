export const VoteType_CONSTANTS = [
    'ISSUER', 
    'BOOK', 
    'AUTHOR', 
    'COMMENT'
] as const;
export type VoteType = typeof VoteType_CONSTANTS[number];
