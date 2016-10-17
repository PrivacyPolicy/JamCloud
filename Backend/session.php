<?php
$ini_array = parse_ini_file("db.ini");
$db_name = "JamCloud";
$sql_username = $ini_array["username"];
$sql_password = $ini_array["password"];
$link = mysqli_connect("localhost", $sql_username, $sql_password);

if(!$link){
	die("Error connecting to database\n");
}
$database = mysqli_select_db($link, "$db_name");
if(!$database){
	die("No database found\n");
}
?>
