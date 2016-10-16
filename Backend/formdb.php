<html>
<body>
hey
<?php

/* This file exists to create the database tables automatically */
include_once("./session.php");
$def_instruments_table = "CREATE TABLE Instruments (
	ID int(11) AUTO_INCREMENT,
	IP varchar(256),
	DATA varchar(4096),
	PRIMARY KEY(ID)
	)";
$def_clips_table = "CREATE TABLE Clips (
	ID int(11) AUTO_INCREMENT,
	IP varchar(256),
	DATA varchar(4096),
	PRIMARY KEY(ID)
	)";
$def_files_table = "CREATE TABLE Files (
	ID int(11) AUTO_INCREMENT,
	FP varchar(256),
	PRIMARY KEY(ID)
	)";

echo("ho\n<br>\n");
$result = mysqli_query($link, "SHOW TABLES LIKE 'Instruments'");
echo("Checking\n<br>\n");
if($result->num_rows == 1){
	echo("Table 'Instruments' exists\n<br>\n");
}else{
	echo("Table 'Instruments' does not exist\n<br>\n");
	mysqli_query($link,$def_instruments_table);
}

$result = mysqli_query($link, "SHOW TABLES LIKE 'Clips'");
echo("Checking\n<br>\n");
if($result->num_rows == 1){
	echo("Table 'Clips' exists\n<br>\n");
}else{
	echo("Table 'Clips' does not exist\n<br>\n");
	mysqli_query($link,$def_clips_table);
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
