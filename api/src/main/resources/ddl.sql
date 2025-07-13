-- issuer table
create table issuer
(
    id            uuid primary key,
    name          text      not null,
    website       text,
    created_time  timestamp not null,
    modified_time timestamp not null,
    constraint business_key_issuer unique (name)
);

-- book table
create table book
(
    id            uuid primary key,
    name          text           not null,
    edition       integer        not null,
    price         numeric(10, 2) not null,
    issuer_id     uuid references issuer (id),
    created_time  timestamp      not null,
    modified_time timestamp      not null,
    constraint business_key_book unique (name, edition)
);

-- author table
create table author
(
    id            uuid primary key,
    first_name    text      not null,
    last_name     text      not null,
    gender        char(1)   not null check (gender in ('M', 'F')),
    created_time  timestamp not null,
    modified_time timestamp not null,
    constraint business_key_author unique (first_name, last_name)
);

-- book-author mapping table (many-to-many)
create table book_author_mapping
(
    book_id   uuid not null references book (id) on delete cascade,
    author_id uuid not null references author (id) on delete cascade,
    primary key (book_id, author_id)
);

-- account table
create table account
(
    id            uuid primary key,
    username      text      not null unique,
    password      text      not null,
    role          text      not null check (role in ('MODERATOR', 'USER')) default 'USER',
    created_time  timestamp not null,
    modified_time timestamp not null
);

-- profile table
create table profile
(
    id            uuid primary key,
    account_id    uuid unique not null references account (id) on delete cascade,
    first_name    text,
    last_name     text,
    phone         text,
    address       text,
    created_time  timestamp   not null,
    modified_time timestamp   not null
);

-- comment table
create table comment
(
    id            uuid primary key,
    account_id    uuid      not null references account (id) on delete cascade,
    issuer_id     uuid      references issuer (id) on delete set null,
    book_id       uuid      references book (id) on delete set null,
    author_id     uuid      references author (id) on delete set null,
    parent_id     uuid      references comment (id) on delete set null,
    content       text      not null,
    created_time  timestamp not null,
    modified_time timestamp not null,
    constraint at_least_one_target_comment check (
        (issuer_id is not null):: int +
        (book_id is not null):: int +
        (author_id is not null):: int +
        (parent_id is not null):: int
            = 1)
);

-- vote table
create table vote
(
    id            uuid primary key,
    account_id    uuid      not null references account (id) on delete cascade,
    issuer_id     uuid      references issuer (id) on delete set null,
    book_id       uuid      references book (id) on delete set null,
    author_id     uuid      references author (id) on delete set null,
    comment_id    uuid      references comment (id) on delete set null,
    created_time  timestamp not null,
    modified_time timestamp not null,
    constraint at_least_one_target_vote check (
        (issuer_id is not null):: int +
        (book_id is not null):: int +
        (author_id is not null):: int +
        (comment_id is not null):: int = 1
        ),
    constraint unique_vote_per_target unique (account_id, issuer_id, book_id, author_id, comment_id)
);

-- announcement table
create table announcement
(
    id            uuid primary key,
    title         text      not null,
    content       text      not null,
    created_time  timestamp not null,
    modified_time timestamp not null
);

-- tag table
create table tag
(
    id         uuid primary key,
    name       text not null unique,
    account_id uuid not null references account (id) on delete cascade
);

-- book-tag mapping table (many-to-many)
create table book_tag_mapping
(
    book_id uuid not null references book (id) on delete cascade,
    tag_id  uuid not null references tag (id) on delete cascade,
    primary key (book_id, tag_id)
);

-- image table
create table image
(
    id            uuid primary key,
    hash          text      not null,
    extension     text      not null,
    created_time  timestamp not null,
    modified_time timestamp not null,
    constraint unique_hash unique (hash)
);

-- book-image mapping table (many-to-many)
create table book_image_mapping
(
    book_id  uuid not null references book (id) on delete cascade,
    image_id uuid not null references image (id) on delete cascade,
    primary key (book_id, image_id)
);

-- comment-image mapping table (many-to-many)
create table comment_image_mapping
(
    comment_id uuid not null references comment (id) on delete cascade,
    image_id   uuid not null references image (id) on delete cascade,
    primary key (comment_id, image_id)
);

-- favourite table
create table favourite
(
    id            uuid primary key,
    account_id    uuid      not null references account (id) on delete cascade,
    issuer_id     uuid      references issuer (id) on delete set null,
    book_id       uuid      references book (id) on delete set null,
    author_id     uuid      references author (id) on delete set null,
    created_time  timestamp not null,
    modified_time timestamp not null,
    constraint at_least_one_target_favourite check (
        (issuer_id is not null)::int +
        (book_id is not null)::int +
        (author_id is not null)::int = 1
        ),
    constraint unique_favourite_per_target unique (account_id, issuer_id, book_id, author_id)
);

