<?php

	include("./session.php");
	$result = mysqli_query($link, "SELECT DATA FROM Objects");
	while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
		echo($row['DATA']);
	}
?>
