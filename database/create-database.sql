create table users (
user_id serial PRIMARY KEY,
name text NOT NULL unique,
is_faculty boolean);
 
create table stages (
stage_id serial PRIMARY KEY,
stage_week int NOT NULL,
stage_description text NOT NULL
);


create table recommendations (
recommendation_id serial PRIMARY KEY,
title varchar(50) NOT NULL unique,
author varchar(50) NOT NULL,
url text unique,
description text,
content text,
time timestamp default now(),
recommended_description text NOT NULL,
recommended text,
likes int default(0),
dislikes int default(0),
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
  REFERENCES recommendations (recommendation_id)
);

create table comments (
  comment_id serial PRIMARY KEY,
  date timestamp default now(),
  body text NOT NULL,
  user_id int,
  recommendation_id int,
  FOREIGN KEY(recommendation_id)
  REFERENCES recommendations (recommendation_id),
  FOREIGN KEY(user_id)
  REFERENCES users (user_id)
);


create table tags (
tag_id serial PRIMARY KEY,
name text unique,
recommendation_id int,
FOREIGN KEY(recommendation_id)
  REFERENCES recommendations (recommendation_id)
);

insert into stages (stage_week, stage_description)
values (1, 'Workflows'), 
(2, 'TypeScript and code quality'), 
(3, 'React, HTML and CSS'), 
(4, 'React and event handlers'), 
(5, 'React and useEffect'), 
(7, 'Node.js and Express'), 
(8, 'SQL and persistence');

insert into stages (stage_week, stage_description)
values (1, 'Workflows'), 
(2, 'TypeScript and code quality'), 
(3, 'React, HTML and CSS'), 
(4, 'React and event handlers'), 
(5, 'React and useEffect'), 
(7, 'Node.js and Express'), 
(8, 'SQL and persistence');

