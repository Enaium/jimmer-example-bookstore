import type {CommentView_TargetOf_account, CommentView_TargetOf_images} from './';

export interface CommentView {
    id: string;
    account: CommentView_TargetOf_account;
    content: string;
    images: Array<CommentView_TargetOf_images>;
    commentCount: number;
    voteCount: number;
}
