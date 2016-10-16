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
$def_updates_table = "CREATE TABLE Updates (
    ID int(11) AUTO_INCREMENT,
    TIMESTAMP int(13),
    IP varchar(256),
    CLASS varchar(256),
    OBJ_ID int(11),
    ACTION varchar(256),
    DATA varchar(4096),
    PRIMARY KEY(ID)
    )";

$results = [];
$result = mysqli_query($link, "DROP TABLES Instruments, Clips, Files, Updates");
$results[] = $result;  

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
$result = mysqli_query($link, "SHOW TABLES LIKE 'Updates'");
echo("Checking\n<br>\n");
if($result->num_rows == 1){
	echo("Table 'Updates' exists\n<br>\n");
}else{
	echo("Table 'Updates' does not exist\n<br>\n");
	mysqli_query($link,$def_updates_table);
}

$result = mysqli_query($link, "INSERT INTO Instruments (DATA) VALUES
    ('{\"type\": \"acoustic_grand_piano\", \"volume\": 1, \"balance\": -1}'),
    ('{\"type\": \"acoustic_guitar_steel\", \"volume\": 1, \"balance\": 0}'), 
    ('{\"type\": \"acoustic_grand_piano\", \"volume\": 0.5, \"balance\": 0}')");
$results[] = $result;
$result = mysqli_query($link, "INSERT INTO Clips (DATA) VALUES
    ('{\"instrument\": 1, \"startTime\": 1.2, \"duration\": 2,
    \"type\":\"note\", \"contents\":[]}'), 
    ('{\"instrument\": 2, \"startTime\": 0.3, \"duration\": 1,
    \"type\":\"note\", \"contents\":[]}'), 
    ('{\"instrument\": 2, \"startTime\": 1.4, \"duration\": 2,
    \"type\":\"note\", \"contents\":[]}')");
$results[] = $result;
$result = mysqli_query($link, "INSERT INTO Updates (TIMESTAMP, CLASS,
    IP, OBJ_ID, ACTION, DATA) VALUES
    (1, \"Clips\", 1, \"328.23.23.355\", \"UPDATE\",
    \"{'instrument':1, 'startTime':0.76, 'duration':5}\")");
$results[] = $result;
//print_r($results);
/**/?>
</body>
</html>
