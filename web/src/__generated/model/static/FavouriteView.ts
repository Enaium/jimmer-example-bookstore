import type {FavouriteView_TargetOf_author, FavouriteView_TargetOf_book, FavouriteView_TargetOf_issuer} from './';

export interface FavouriteView {
    id: string;
    author?: FavouriteView_TargetOf_author | undefined;
    book?: FavouriteView_TargetOf_book | undefined;
    issuer?: FavouriteView_TargetOf_issuer | undefined;
    createdTime: string;
}
