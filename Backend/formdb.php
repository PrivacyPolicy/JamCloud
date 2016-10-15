<?php
/* This file exists to create the database tables automatically */

$db_name = "JamCloud"
$sql_username = "root"
$sql_password = "hunter2"
$def_users_table = "CREATE TABLE Users (
ID int(11) AUTO_INCREMENT,
IP char(4),
PRIMARY KEY(ID)
)";
$def_objects_table = "CREATE TABLE Objects (
	ID int(11) AUTO_INCREMENT,
	USER int(11),
	DATA varchar(4096),
	PRIMARY KEY(ID),
	FOREIGN KEY(USER)
		REFERENCES Users(ID)
		ON DELETE CASCADE
	)";
$def_files_table = "CREATE TABLE Files (
	ID int(11) AUTO_INCREMENT,
	FP varchar(256),
	PRIMARY KEY(ID)
	)";
$link = mysqli_connect("localhost", $sql_username, $sql_password);

if(!$link){
	die("Error connecting to database\n");
}
$database = mysqli_select_db($link, "$db_name");

if(!$datbase){
	die("No database found\n");
}
$result = $mysqli->query("SHOW TABLES LIKE 'Users'")
if($result->num_rows == 1){
	echo "Table exists";
}else{
	echo "Not";
	mysqli_query($link,$def_users_table);
	}
	
