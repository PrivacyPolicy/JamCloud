<?php

	include("./session.php");
	$table = "Clips";
	$result = mysqli_query($link, "SELECT ID,DATA FROM $table");
    
    if ($result != false) {
        echo("[\n");
        $i = 0;
        while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
            if($i){echo(",\n");}
            $i = true;
            echo("{\"id\":".$row['ID'].",\n\"data\":".$row['DATA']."}");
        }
        echo("\n]");
    }
?>
