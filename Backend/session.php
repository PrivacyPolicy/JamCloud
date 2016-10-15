<?php
$db_name = "JamCloud";
$sql_username = "root";
$sql_password = "hunter2";
$link = mysqli_connect("localhost", $sql_username, $sql_password);

if(!$link){
	die("Error connecting to database\n");
}
$database = mysqli_select_db($link, "$db_name");
if(!$database){
	die("No database found\n");
}
?>