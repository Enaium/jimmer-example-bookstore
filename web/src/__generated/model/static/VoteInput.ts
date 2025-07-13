import type {
    VoteInput_TargetOf_author, 
    VoteInput_TargetOf_book, 
    VoteInput_TargetOf_comment, 
    VoteInput_TargetOf_issuer
} from './';

export interface VoteInput {
    author?: VoteInput_TargetOf_author | undefined;
    book?: VoteInput_TargetOf_book | undefined;
    issuer?: VoteInput_TargetOf_issuer | undefined;
    comment?: VoteInput_TargetOf_comment | undefined;
}
