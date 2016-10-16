<!DOCTYPE HTML>
<html>
<head>
	<link href="style.css" rel="stylesheet"/>
        <script src=jquery.min.js></script>

</head>
<body>
<script src="apiwrapper.js"></script>
<table>
<tr>
<td><strong>Object Type</strong></td>
<td><strong>ID</strong></td>
<td><strong>Data</strong></td>
<td><strong>Delete?</strong></td>
</tr>
<?php

	include("../Backend/session.php");
	if(in_array("CLASS",$_POST)){
	 	$table = $_POST["CLASS"];
	}else{
		$table = $_GET["CLASS"];
	}
	$result = mysqli_query($link, "SELECT ID,DATA FROM $table");
    
    if ($result != false) {
        while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
	    echo("<tr>");
	    echo("<td>$table</td>");
	    echo("<td>".$row['ID']."</td>");
	    echo("<td>".$row['DATA']."</td>");
            echo("<td><input id='rmme' type='button' value='rm' onClick='serverDelete(\"Clips\",".$row['ID'].")'></td>");
	    echo("</tr>\n");
        }
    }
?>
</table>
</body>
</html>

