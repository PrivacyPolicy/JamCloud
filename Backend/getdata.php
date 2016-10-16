<?php

	include("./session.php");
	if(in_array("CLASS",$_POST)){
	 	$table = $_POST["CLASS"];
	}else{
		$table = $_GET["CLASS"];
	}
	$result = mysqli_query($link, "SELECT ID,DATA FROM $table");
	echo("{\n");
	$i = 0;
	while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
		if($i){echo(",\n");}
		$i = true;
		echo("{\"id\":".$row['ID'].",\n\"data\":".$row['DATA']."}");
	}
	echo("\n}");
?>
