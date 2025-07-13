import type {
    CommentInput_TargetOf_author, 
    CommentInput_TargetOf_book, 
    CommentInput_TargetOf_images, 
    CommentInput_TargetOf_issuer, 
    CommentInput_TargetOf_parent
} from './';

export interface CommentInput {
    content: string;
    author?: CommentInput_TargetOf_author | undefined;
    book?: CommentInput_TargetOf_book | undefined;
    parent?: CommentInput_TargetOf_parent | undefined;
    issuer?: CommentInput_TargetOf_issuer | undefined;
    images: Array<CommentInput_TargetOf_images>;
}
