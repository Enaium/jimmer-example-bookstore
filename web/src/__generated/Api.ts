import type {Executor} from './';
import {
    AuthController, 
    AuthorController, 
    BookController, 
    CommentController, 
    FavouriteController, 
    ImageController, 
    IssuerController, 
    TagController, 
    VoteController
} from './services/';

export class Api {
    
    readonly authController: AuthController
    
    readonly authorController: AuthorController
    
    readonly bookController: BookController
    
    readonly commentController: CommentController
    
    readonly favouriteController: FavouriteController
    
    readonly imageController: ImageController
    
    readonly issuerController: IssuerController
    
    readonly tagController: TagController
    
    readonly voteController: VoteController
    
    constructor(executor: Executor) {
        this.authController = new AuthController(executor);
        this.authorController = new AuthorController(executor);
        this.bookController = new BookController(executor);
        this.commentController = new CommentController(executor);
        this.favouriteController = new FavouriteController(executor);
        this.imageController = new ImageController(executor);
        this.issuerController = new IssuerController(executor);
        this.tagController = new TagController(executor);
        this.voteController = new VoteController(executor);
    }
}