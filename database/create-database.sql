

drop table study_list;
drop table comments;
drop table tags;

drop table recommendations;
drop table users;
drop table stages;



create table users (
user_id serial PRIMARY KEY,
name text CHECK (LENGTH(name) > 0 ) unique,
is_faculty boolean);
 
create table stages (
stage_id serial PRIMARY KEY,
stage_week int NOT NULL,
stage_description text NOT NULL
);


create table recommendations (
recommendation_id serial PRIMARY KEY,
title text CHECK (LENGTH(title) > 0 ),
author text CHECK (LENGTH(author) > 0 ),
url text CHECK (LENGTH(url) > 0 ) unique,
description text CHECK (LENGTH(description) > 0 ),
content text,
time timestamp default now(),
recommended_description text CHECK (LENGTH(recommended_description) > 0 ),
recommended text,
user_id int,
stage_id int,
FOREIGN KEY(user_id)
REFERENCES users(user_id),
FOREIGN KEY(stage_id)
REFERENCES stages(stage_id)
 );
 

create table study_list (
  user_id int,
  recommendation_id int,
  FOREIGN KEY(user_id)
  REFERENCES users (user_id),
  FOREIGN KEY(recommendation_id)
  REFERENCES recommendations (recommendation_id) ON DELETE CASCADE
);


create table comments (
  comment_id serial PRIMARY KEY,
  date timestamp default now(),
  body text CHECK (LENGTH(body) > 0 ),
  user_id int,
  recommendation_id int,
  is_like boolean default false,
  is_dislike boolean default false,
  FOREIGN KEY(recommendation_id)
  REFERENCES recommendations (recommendation_id) ON DELETE CASCADE,
  FOREIGN KEY(user_id)
  REFERENCES users (user_id)
);



create table tags (
tag_id serial PRIMARY KEY,
name text CHECK (LENGTH(name) > 0 ),
recommendation_id int,
FOREIGN KEY(recommendation_id)
  REFERENCES recommendations (recommendation_id) ON DELETE CASCADE
);

insert into stages (stage_week, stage_description)
values (1, 'Workflows'), 
(2, 'TypeScript and code quality'), 
(3, 'React, HTML and CSS'), 
(4, 'React and event handlers'), 
(5, 'React and useEffect'), 
(7, 'Node.js and Express'), 
(8, 'SQL and persistence'),
(0, 'N/A');

insert into users (name, is_faculty)
values ('Neill', true), ('Martha', false), ('Chris', false), ('David', false);