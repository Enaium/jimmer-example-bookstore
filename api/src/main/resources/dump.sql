--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: bookstore; Type: SCHEMA; Schema: -; Owner: root
--

CREATE SCHEMA bookstore;


ALTER SCHEMA bookstore OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.account (
    id uuid NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'USER'::text NOT NULL,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL,
    CONSTRAINT account_role_check CHECK ((role = ANY (ARRAY['MODERATOR'::text, 'USER'::text])))
);


ALTER TABLE bookstore.account OWNER TO root;

--
-- Name: announcement; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.announcement (
    id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL
);


ALTER TABLE bookstore.announcement OWNER TO root;

--
-- Name: author; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.author (
    id uuid NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    gender character(1) NOT NULL,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL,
    CONSTRAINT author_gender_check CHECK ((gender = ANY (ARRAY['M'::bpchar, 'F'::bpchar])))
);


ALTER TABLE bookstore.author OWNER TO root;

--
-- Name: book; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.book (
    id uuid NOT NULL,
    name text NOT NULL,
    edition integer NOT NULL,
    price numeric(10,2) NOT NULL,
    issuer_id uuid,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL
);


ALTER TABLE bookstore.book OWNER TO root;

--
-- Name: book_author_mapping; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.book_author_mapping (
    book_id uuid NOT NULL,
    author_id uuid NOT NULL
);


ALTER TABLE bookstore.book_author_mapping OWNER TO root;

--
-- Name: book_image_mapping; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.book_image_mapping (
    book_id uuid NOT NULL,
    image_id uuid NOT NULL
);


ALTER TABLE bookstore.book_image_mapping OWNER TO root;

--
-- Name: book_tag_mapping; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.book_tag_mapping (
    book_id uuid NOT NULL,
    tag_id uuid NOT NULL
);


ALTER TABLE bookstore.book_tag_mapping OWNER TO root;

--
-- Name: comment; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.comment (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    issuer_id uuid,
    book_id uuid,
    author_id uuid,
    parent_id uuid,
    content text NOT NULL,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL,
    CONSTRAINT at_least_one_target_comment CHECK ((((((issuer_id IS NOT NULL))::integer + ((book_id IS NOT NULL))::integer) + ((author_id IS NOT NULL))::integer) = 1))
);


ALTER TABLE bookstore.comment OWNER TO root;

--
-- Name: comment_image_mapping; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.comment_image_mapping (
    comment_id uuid NOT NULL,
    image_id uuid NOT NULL
);


ALTER TABLE bookstore.comment_image_mapping OWNER TO root;

--
-- Name: favourite; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.favourite (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    issuer_id uuid,
    book_id uuid,
    author_id uuid,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL,
    CONSTRAINT at_least_one_target_favourite CHECK ((((((issuer_id IS NOT NULL))::integer + ((book_id IS NOT NULL))::integer) + ((author_id IS NOT NULL))::integer) = 1))
);


ALTER TABLE bookstore.favourite OWNER TO root;

--
-- Name: image; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.image (
    id uuid NOT NULL,
    hash text NOT NULL,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL,
    extension text NOT NULL
);


ALTER TABLE bookstore.image OWNER TO root;

--
-- Name: issuer; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.issuer (
    id uuid NOT NULL,
    name text NOT NULL,
    website text,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL
);


ALTER TABLE bookstore.issuer OWNER TO root;

--
-- Name: profile; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.profile (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    first_name text,
    last_name text,
    phone text,
    address text,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL
);


ALTER TABLE bookstore.profile OWNER TO root;

--
-- Name: tag; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.tag (
    id uuid NOT NULL,
    name text NOT NULL,
    account_id uuid NOT NULL,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone
);


ALTER TABLE bookstore.tag OWNER TO root;

--
-- Name: vote; Type: TABLE; Schema: bookstore; Owner: root
--

CREATE TABLE bookstore.vote (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    issuer_id uuid,
    book_id uuid,
    author_id uuid,
    comment_id uuid,
    created_time timestamp without time zone NOT NULL,
    modified_time timestamp without time zone NOT NULL,
    CONSTRAINT at_least_one_target_vote CHECK (((((((issuer_id IS NOT NULL))::integer + ((book_id IS NOT NULL))::integer) + ((author_id IS NOT NULL))::integer) + ((comment_id IS NOT NULL))::integer) = 1))
);


ALTER TABLE bookstore.vote OWNER TO root;

--
-- Data for Name: account; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.account (id, username, password, role, created_time, modified_time) FROM stdin;
c52cb33c-d957-428b-a768-818544982c7f	enaium	$2a$10$DGvo6tsg6cQt/se8iEil6.4LoZ4fE1BlzfS/uoehI51XAAGWZ2rW2	MODERATOR	2025-07-12 14:42:33.533617	2025-07-12 14:42:33.533617
\.


--
-- Data for Name: announcement; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.announcement (id, title, content, created_time, modified_time) FROM stdin;
\.


--
-- Data for Name: author; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.author (id, first_name, last_name, gender, created_time, modified_time) FROM stdin;
d9c0a88a-48c9-48f3-afd0-6b4524728b9f	V.Scott	Gordon	M	2025-07-13 20:09:27.205551	2025-07-13 20:10:16.661904
8b613f41-28f9-423d-bb98-9012f2541cda	John	Clevenger	M	2025-07-13 20:10:16.661904	2025-07-13 20:14:17.933307
\.


--
-- Data for Name: book; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.book (id, name, edition, price, issuer_id, created_time, modified_time) FROM stdin;
b350b63a-ec73-43ac-aa1e-45ffd7e54016	Computer Graphics Programming in OpenGL Using C++	3	1.00	db8822d9-4ab1-4862-8569-397ae0999232	2025-07-12 21:05:25.653628	2025-07-13 20:10:16.653543
\.


--
-- Data for Name: book_author_mapping; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.book_author_mapping (book_id, author_id) FROM stdin;
b350b63a-ec73-43ac-aa1e-45ffd7e54016	d9c0a88a-48c9-48f3-afd0-6b4524728b9f
b350b63a-ec73-43ac-aa1e-45ffd7e54016	8b613f41-28f9-423d-bb98-9012f2541cda
\.


--
-- Data for Name: book_image_mapping; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.book_image_mapping (book_id, image_id) FROM stdin;
b350b63a-ec73-43ac-aa1e-45ffd7e54016	8cd43dfb-ac36-4834-a1cb-6746f33afa09
\.


--
-- Data for Name: book_tag_mapping; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.book_tag_mapping (book_id, tag_id) FROM stdin;
b350b63a-ec73-43ac-aa1e-45ffd7e54016	0bea2bfe-c17d-48a6-8190-9c9f0c82f79e
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.comment (id, account_id, issuer_id, book_id, author_id, parent_id, content, created_time, modified_time) FROM stdin;
c1ad3d1d-998f-4d8f-bbc0-48938da245bc	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	asdasdadasda	2025-07-13 12:07:20.727524	2025-07-13 12:07:20.726281
0d81051a-6a08-4824-bf36-34b6b5dbf90f	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	11111	2025-07-13 12:07:33.696722	2025-07-13 12:07:33.696722
b7606487-c000-46b2-9402-02f69f8abd60	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	66666666666	2025-07-13 12:15:17.852373	2025-07-13 12:15:17.852373
d0c4f9ec-c2aa-4068-8f79-36d5136aa95c	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	0d81051a-6a08-4824-bf36-34b6b5dbf90f	6666666666	2025-07-13 16:20:30.527522	2025-07-13 16:20:30.527522
297dc2f1-81e0-4a45-af6a-b019fd3e7ee4	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	121212	2025-07-13 17:46:30.706562	2025-07-13 17:46:30.706562
2eb6958e-e465-426b-9b28-f6c16ad7fc66	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	1231231	2025-07-13 17:46:31.998969	2025-07-13 17:46:31.998969
7f663216-31f6-4f02-8d42-41b248ec3e82	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	1231231	2025-07-13 17:46:33.343397	2025-07-13 17:46:33.343397
cb617171-c52b-472b-9f67-e1bed81dc83e	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	1231231	2025-07-13 17:46:34.36413	2025-07-13 17:46:34.36413
17c5c940-ff45-4d61-b0d8-79c3a5f5cdc4	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	1231231	2025-07-13 17:46:35.453187	2025-07-13 17:46:35.453187
bb37578f-8b9e-4e0f-9902-afb8cb6888d8	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	123131	2025-07-13 17:46:36.547541	2025-07-13 17:46:36.547541
a9e8d513-02aa-4c19-ae95-2ec1fabfee3b	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	1231231	2025-07-13 17:46:37.662345	2025-07-13 17:46:37.662345
4fda19a1-7598-4a09-964d-e213cfaeafc9	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	123131	2025-07-13 17:46:38.627001	2025-07-13 17:46:38.627001
186609d8-bf7f-432a-aba8-b249924c4ad9	c52cb33c-d957-428b-a768-818544982c7f	\N	\N	d9c0a88a-48c9-48f3-afd0-6b4524728b9f	\N	6666	2025-07-13 20:21:23.773807	2025-07-13 20:21:23.773807
c04cc333-d9b6-4017-88b8-f5c3175c6cea	c52cb33c-d957-428b-a768-818544982c7f	\N	\N	8b613f41-28f9-423d-bb98-9012f2541cda	\N	43423424234324242	2025-07-13 20:25:32.89484	2025-07-13 20:25:32.89484
\.


--
-- Data for Name: comment_image_mapping; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.comment_image_mapping (comment_id, image_id) FROM stdin;
b7606487-c000-46b2-9402-02f69f8abd60	8cd43dfb-ac36-4834-a1cb-6746f33afa09
\.


--
-- Data for Name: favourite; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.favourite (id, account_id, issuer_id, book_id, author_id, created_time, modified_time) FROM stdin;
3dd9302d-eb0a-4755-ad1f-875fe792db74	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	2025-07-13 19:51:29.543646	2025-07-13 19:51:29.543646
63a2dde0-4c67-47e9-a254-0afd2f65a125	c52cb33c-d957-428b-a768-818544982c7f	db8822d9-4ab1-4862-8569-397ae0999232	\N	\N	2025-07-13 19:55:09.418108	2025-07-13 19:55:09.418108
654bb96a-1e1c-4a56-9569-3107e3deaeb9	c52cb33c-d957-428b-a768-818544982c7f	\N	\N	d9c0a88a-48c9-48f3-afd0-6b4524728b9f	2025-07-13 20:23:45.793617	2025-07-13 20:23:45.793617
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.image (id, hash, created_time, modified_time, extension) FROM stdin;
8cd43dfb-ac36-4834-a1cb-6746f33afa09	f383aa71749f9dbe8e2ce0446d5f0fe5	2025-07-12 20:12:16.878715	2025-07-12 20:12:16.877736	jpg
\.


--
-- Data for Name: issuer; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.issuer (id, name, website, created_time, modified_time) FROM stdin;
db8822d9-4ab1-4862-8569-397ae0999232	Mercury Learning and Information		2025-07-12 21:05:25.622165	2025-07-13 20:10:16.648608
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.profile (id, account_id, first_name, last_name, phone, address, created_time, modified_time) FROM stdin;
31c4d298-0b05-49cf-bfee-e529e68bb3e6	c52cb33c-d957-428b-a768-818544982c7f	1231231	1231	1231231	1111	2025-07-12 14:42:33.540274	2025-07-12 14:42:33.540274
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.tag (id, name, account_id, created_time, modified_time) FROM stdin;
0bea2bfe-c17d-48a6-8190-9c9f0c82f79e	Graphics	c52cb33c-d957-428b-a768-818544982c7f	2025-07-13 11:51:42.099505	2025-07-13 20:10:16.686236
\.


--
-- Data for Name: vote; Type: TABLE DATA; Schema: bookstore; Owner: root
--

COPY bookstore.vote (id, account_id, issuer_id, book_id, author_id, comment_id, created_time, modified_time) FROM stdin;
56f381da-828a-43e3-889b-977f84828092	c52cb33c-d957-428b-a768-818544982c7f	\N	\N	\N	d0c4f9ec-c2aa-4068-8f79-36d5136aa95c	2025-07-13 17:24:19.643976	2025-07-13 17:24:19.643976
5fadde26-39d5-4b81-ac8b-be8ced74f367	c52cb33c-d957-428b-a768-818544982c7f	\N	\N	\N	b7606487-c000-46b2-9402-02f69f8abd60	2025-07-13 19:36:05.955515	2025-07-13 19:36:05.955515
62903897-be93-45dc-bd6c-3de731216df3	c52cb33c-d957-428b-a768-818544982c7f	\N	b350b63a-ec73-43ac-aa1e-45ffd7e54016	\N	\N	2025-07-13 19:51:29.143453	2025-07-13 19:51:29.143453
0f63f471-9a32-4589-b950-b35ec2f296b3	c52cb33c-d957-428b-a768-818544982c7f	db8822d9-4ab1-4862-8569-397ae0999232	\N	\N	\N	2025-07-13 19:55:09.904398	2025-07-13 19:55:09.902836
6674424f-3b82-43ee-bbd7-47d52dab5e51	c52cb33c-d957-428b-a768-818544982c7f	\N	\N	d9c0a88a-48c9-48f3-afd0-6b4524728b9f	\N	2025-07-13 20:23:44.604315	2025-07-13 20:23:44.604315
\.


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: account account_username_key; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.account
    ADD CONSTRAINT account_username_key UNIQUE (username);


--
-- Name: announcement announcement_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.announcement
    ADD CONSTRAINT announcement_pkey PRIMARY KEY (id);


--
-- Name: author author_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);


--
-- Name: book_author_mapping book_author_mapping_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_author_mapping
    ADD CONSTRAINT book_author_mapping_pkey PRIMARY KEY (book_id, author_id);


--
-- Name: book_image_mapping book_image_mapping_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_image_mapping
    ADD CONSTRAINT book_image_mapping_pkey PRIMARY KEY (book_id, image_id);


--
-- Name: book book_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (id);


--
-- Name: book_tag_mapping book_tag_mapping_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_tag_mapping
    ADD CONSTRAINT book_tag_mapping_pkey PRIMARY KEY (book_id, tag_id);


--
-- Name: author business_key_author; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.author
    ADD CONSTRAINT business_key_author UNIQUE (first_name, last_name);


--
-- Name: book business_key_book; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book
    ADD CONSTRAINT business_key_book UNIQUE (name, edition);


--
-- Name: issuer business_key_issuer; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.issuer
    ADD CONSTRAINT business_key_issuer UNIQUE (name);


--
-- Name: comment_image_mapping comment_image_mapping_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment_image_mapping
    ADD CONSTRAINT comment_image_mapping_pkey PRIMARY KEY (comment_id, image_id);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: favourite favourite_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.favourite
    ADD CONSTRAINT favourite_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: issuer issuer_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.issuer
    ADD CONSTRAINT issuer_pkey PRIMARY KEY (id);


--
-- Name: profile profile_account_id_key; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.profile
    ADD CONSTRAINT profile_account_id_key UNIQUE (account_id);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: tag tag_name_key; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.tag
    ADD CONSTRAINT tag_name_key UNIQUE (name);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: favourite unique_favourite_per_target; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.favourite
    ADD CONSTRAINT unique_favourite_per_target UNIQUE (account_id, issuer_id, book_id, author_id);


--
-- Name: image unique_hash; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.image
    ADD CONSTRAINT unique_hash UNIQUE (hash);


--
-- Name: vote unique_vote_per_target; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.vote
    ADD CONSTRAINT unique_vote_per_target UNIQUE (account_id, issuer_id, book_id, author_id, comment_id);


--
-- Name: vote vote_pkey; Type: CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.vote
    ADD CONSTRAINT vote_pkey PRIMARY KEY (id);


--
-- Name: book_author_mapping book_author_mapping_author_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_author_mapping
    ADD CONSTRAINT book_author_mapping_author_id_fkey FOREIGN KEY (author_id) REFERENCES bookstore.author(id) ON DELETE CASCADE;


--
-- Name: book_author_mapping book_author_mapping_book_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_author_mapping
    ADD CONSTRAINT book_author_mapping_book_id_fkey FOREIGN KEY (book_id) REFERENCES bookstore.book(id) ON DELETE CASCADE;


--
-- Name: book_image_mapping book_image_mapping_book_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_image_mapping
    ADD CONSTRAINT book_image_mapping_book_id_fkey FOREIGN KEY (book_id) REFERENCES bookstore.book(id) ON DELETE CASCADE;


--
-- Name: book_image_mapping book_image_mapping_image_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_image_mapping
    ADD CONSTRAINT book_image_mapping_image_id_fkey FOREIGN KEY (image_id) REFERENCES bookstore.image(id) ON DELETE CASCADE;


--
-- Name: book book_issuer_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book
    ADD CONSTRAINT book_issuer_id_fkey FOREIGN KEY (issuer_id) REFERENCES bookstore.issuer(id);


--
-- Name: book_tag_mapping book_tag_mapping_book_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_tag_mapping
    ADD CONSTRAINT book_tag_mapping_book_id_fkey FOREIGN KEY (book_id) REFERENCES bookstore.book(id) ON DELETE CASCADE;


--
-- Name: book_tag_mapping book_tag_mapping_tag_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.book_tag_mapping
    ADD CONSTRAINT book_tag_mapping_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES bookstore.tag(id) ON DELETE CASCADE;


--
-- Name: comment comment_account_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment
    ADD CONSTRAINT comment_account_id_fkey FOREIGN KEY (account_id) REFERENCES bookstore.account(id) ON DELETE CASCADE;


--
-- Name: comment comment_author_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment
    ADD CONSTRAINT comment_author_id_fkey FOREIGN KEY (author_id) REFERENCES bookstore.author(id) ON DELETE SET NULL;


--
-- Name: comment comment_book_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment
    ADD CONSTRAINT comment_book_id_fkey FOREIGN KEY (book_id) REFERENCES bookstore.book(id) ON DELETE SET NULL;


--
-- Name: comment_image_mapping comment_image_mapping_comment_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment_image_mapping
    ADD CONSTRAINT comment_image_mapping_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES bookstore.comment(id) ON DELETE CASCADE;


--
-- Name: comment_image_mapping comment_image_mapping_image_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment_image_mapping
    ADD CONSTRAINT comment_image_mapping_image_id_fkey FOREIGN KEY (image_id) REFERENCES bookstore.image(id) ON DELETE CASCADE;


--
-- Name: comment comment_issuer_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment
    ADD CONSTRAINT comment_issuer_id_fkey FOREIGN KEY (issuer_id) REFERENCES bookstore.issuer(id) ON DELETE SET NULL;


--
-- Name: comment comment_parent_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.comment
    ADD CONSTRAINT comment_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES bookstore.comment(id) ON DELETE SET NULL;


--
-- Name: favourite favourite_account_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.favourite
    ADD CONSTRAINT favourite_account_id_fkey FOREIGN KEY (account_id) REFERENCES bookstore.account(id) ON DELETE CASCADE;


--
-- Name: favourite favourite_author_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.favourite
    ADD CONSTRAINT favourite_author_id_fkey FOREIGN KEY (author_id) REFERENCES bookstore.author(id) ON DELETE SET NULL;


--
-- Name: favourite favourite_book_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.favourite
    ADD CONSTRAINT favourite_book_id_fkey FOREIGN KEY (book_id) REFERENCES bookstore.book(id) ON DELETE SET NULL;


--
-- Name: favourite favourite_issuer_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.favourite
    ADD CONSTRAINT favourite_issuer_id_fkey FOREIGN KEY (issuer_id) REFERENCES bookstore.issuer(id) ON DELETE SET NULL;


--
-- Name: profile profile_account_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.profile
    ADD CONSTRAINT profile_account_id_fkey FOREIGN KEY (account_id) REFERENCES bookstore.account(id) ON DELETE CASCADE;


--
-- Name: tag tag_account_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.tag
    ADD CONSTRAINT tag_account_id_fkey FOREIGN KEY (account_id) REFERENCES bookstore.account(id) ON DELETE CASCADE;


--
-- Name: vote vote_account_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.vote
    ADD CONSTRAINT vote_account_id_fkey FOREIGN KEY (account_id) REFERENCES bookstore.account(id) ON DELETE CASCADE;


--
-- Name: vote vote_author_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.vote
    ADD CONSTRAINT vote_author_id_fkey FOREIGN KEY (author_id) REFERENCES bookstore.author(id) ON DELETE SET NULL;


--
-- Name: vote vote_book_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.vote
    ADD CONSTRAINT vote_book_id_fkey FOREIGN KEY (book_id) REFERENCES bookstore.book(id) ON DELETE SET NULL;


--
-- Name: vote vote_comment_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.vote
    ADD CONSTRAINT vote_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES bookstore.comment(id) ON DELETE SET NULL;


--
-- Name: vote vote_issuer_id_fkey; Type: FK CONSTRAINT; Schema: bookstore; Owner: root
--

ALTER TABLE ONLY bookstore.vote
    ADD CONSTRAINT vote_issuer_id_fkey FOREIGN KEY (issuer_id) REFERENCES bookstore.issuer(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

