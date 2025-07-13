export const FavouriteType_CONSTANTS = [
    'ISSUER', 
    'BOOK', 
    'AUTHOR'
] as const;
export type FavouriteType = typeof FavouriteType_CONSTANTS[number];
