drop table sets;
drop table workouts;

create table workouts (
    workout_id serial PRIMARY KEY,
	title text CHECK (LENGTH(title) > 0 ),
	day text CHECK (LENGTH(day) > 0 ),
	duration_mins int,
	notes text,
	date timestamp
);

create table sets (
    set_id serial PRIMARY KEY,
  	workout_id int,
	name text CHECK (LENGTH(name) > 0 ),
	weight int,
	reps int,
  	FOREIGN KEY(workout_id)
  REFERENCES workouts (workout_id) ON DELETE CASCADE
);
