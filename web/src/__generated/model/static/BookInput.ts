import type {
    BookInput_TargetOf_authors, 
    BookInput_TargetOf_images, 
    BookInput_TargetOf_issuer, 
    BookInput_TargetOf_tags
} from './';

export interface BookInput {
    id?: string | undefined;
    name: string;
    edition: number;
    price: number;
    issuer: BookInput_TargetOf_issuer;
    authors: Array<BookInput_TargetOf_authors>;
    tags: Array<BookInput_TargetOf_tags>;
    images: Array<BookInput_TargetOf_images>;
}
