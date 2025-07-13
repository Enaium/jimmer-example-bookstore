import type {
    BookView_TargetOf_authors, 
    BookView_TargetOf_images, 
    BookView_TargetOf_issuer, 
    BookView_TargetOf_tags
} from './';

export interface BookView {
    id: string;
    name: string;
    edition: number;
    price: number;
    issuer: BookView_TargetOf_issuer;
    authors: Array<BookView_TargetOf_authors>;
    tags: Array<BookView_TargetOf_tags>;
    images: Array<BookView_TargetOf_images>;
    authorCount: number;
    commentCount: number;
    voteCount: number;
    favouriteCount: number;
}
