import type {
    VoteView_TargetOf_author, 
    VoteView_TargetOf_book, 
    VoteView_TargetOf_comment, 
    VoteView_TargetOf_issuer
} from './';

export interface VoteView {
    id: string;
    author?: VoteView_TargetOf_author | undefined;
    book?: VoteView_TargetOf_book | undefined;
    issuer?: VoteView_TargetOf_issuer | undefined;
    comment?: VoteView_TargetOf_comment | undefined;
    createdTime: string;
}
