import type {FavouriteInput_TargetOf_author, FavouriteInput_TargetOf_book, FavouriteInput_TargetOf_issuer} from './';

export interface FavouriteInput {
    author?: FavouriteInput_TargetOf_author | undefined;
    book?: FavouriteInput_TargetOf_book | undefined;
    issuer?: FavouriteInput_TargetOf_issuer | undefined;
}
