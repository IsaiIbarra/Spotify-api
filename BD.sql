create database spotify;

create table users(id_use int not null auto_increment primary key, user_use char(60));

create table favorite_songs(id_fav int not null auto_increment primary key, name_fav char(50), img_fav varchar(255), note_fav varchar(60), id_spotify_fav varchar(255), id_use int, foreign key(id_use) references users(id_use));