<?php
 /* This form is interacted with via javascript
 a clip type command will be initiated to interact with the database
	yaaaaaaaaaaay */
	include("./session.php");
	$g_ip = $_SERVER['REMOTE_ADDR'];
	$action = $_POST['ACTION'];
	$g_id = $_POST['ID'];
	$g_data = mysqli_real_escape_string($link, $_POST['DATA']);
	$g_table =$_POST['CLASS'];

	/* Return value to javascript */
	function makeStatus($code,$msg){
		return "{\"status\":$code, \"message\":\"$msg\"}";
	}

	/* Is this a real class/table? */
	if($g_table !== "Clips" and $g_table !=="Instruments"){
		global $g_table;
		echo(makeStatus("false", "No such class $g_table"));
		return false;
	}

	
	/* create an object and put in data if necessary */
	function createObject($id, $data){
		global $link;
		global $g_table;
		$result = mysqli_query($link, "SELECT * FROM $g_table WHERE ID=$id;");
		if(mysqli_fetch_array($result) == false){
			$query = "INSERT INTO $g_table (ID, DATA) VALUES($id, '$data');";
			$dp = mysqli_query($link, $query);
            
			return makeStatus("true", "Created object");
            
		}else{
			return makeStatus("false", "Failed to create object");
		}
	}
	/* Delete object completely*/
	function deleteObject($id){
		global $link;
		global $g_table;
		$result = "Poop";
		$result = mysqli_query($link, "SELECT * FROM $g_table WHERE ID=$id");
		if(!(mysqli_fetch_array($result) == false)){
			mysqli_query($link, "DELETE FROM $g_table WHERE ID=$id");
            
			return makeStatus("true", "Deleted object");
		}else{
			return makeStatus("false", "Failed to delete object");
		}
	}
		
	function updateObject($id, $data){
		global $link;
		global $g_table;
		$result= mysqli_query($link, "SELECT * from $g_table where ID=$id");
		if(!(mysqli_fetch_array($result)==false)){
			$update_query= "UPDATE $g_table SET DATA='$data' WHERE ID=$id";
			mysqli_query($link, $update_query);
            
            
            return makeStatus("true", "Updated object $id");
            
		}else{
			return makeStatus("false", "Failed to update object $id, maybe id does not exist");
		}
	}
	$rval = "NOACTION";
	if($action=="CREATE"){
		$rval = createObject($g_id, $g_data);
	}else if($action=="DELETE"){
		$rval = deleteObject($g_id);
	}else if($action=="UPDATE"){
		$rval = updateObject($g_id, $g_data);
    }

	echo($rval);



?>
