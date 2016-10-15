<html>
<body>
hey
<?php

/* This file exists to create the database tables automatically */
$db_name = "JamCloud";
$sql_username = "root";
$sql_password = "hunter2";
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
echo("kk\n<br>\n");
if(!$database){
	die("No database found\n");
}
echo("ho\n<br>\n");
$result = mysqli_query($link, "SHOW TABLES LIKE 'Users'");
echo("Checking\n<br>\n");
if($result->num_rows == 1){
	echo("Table 'Users' exists\n<br>\n");
}else{
	echo("Table 'Users' does not exist\n<br>\n");
	mysqli_query($link,$def_users_table);
}

$result = mysqli_query($link, "SHOW TABLES LIKE 'Objects'");
echo("Checking\n<br>\n");
if($result->num_rows == 1){
	echo("Table 'Objects' exists\n<br>\n");
}else{
	echo("Table 'Objects' does not exist\n<br>\n");
	mysqli_query($link,$def_objects_table);
}
$result = mysqli_query($link, "SHOW TABLES LIKE 'Files'");
echo("Checking\n<br>\n");
if($result->num_rows == 1){
	echo("Table 'Files' exists\n<br>\n");
}else{
	echo("Table 'Files' does not exist\n<br>\n");
	mysqli_query($link,$def_files_table);
}
/**/?>
</body>
</html>
