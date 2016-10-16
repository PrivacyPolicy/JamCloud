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

	$ownership = false;

	function makeStatus($code,$msg){
		return "{\"status\":$code, \"message\":\"$msg\"}";
	}
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
		
			return makeStatus("true", "Created object using query($query)");
		}else{
			return makeStatus("false", "Failed to create object");
		}
	}
	/* Delete object completely*/
	function deleteObject($id){
		global $link;
		global $ownership;
		global $g_table;
		$result = "Poop";
		if($ownership){
			$result = mysqli_query($link, "SELECT * FROM $g_table WHERE ID=$id and IP=NULL");
		}else{
			$result = mysqli_query($link, "SELECT * FROM $g_table WHERE ID=$id");
		}
		if(!(mysqli_fetch_array($result) == false)){
			mysqli_query($link, "DELETE FROM $g_table WHERE ID=$id");
			return makeStatus("true", "Deleted object");
		}else{
			return makeStatus("false", "Failed to delete object");
		}
	}
	function requestEditObject($id, $ip){
		global $link;
		global $g_table;
		$result = mysqli_query($link, "SELECT * FROM $g_table WHERE ID=$ip and IP=NULL");
		if(mysqli_fetch_array($result) !== false){
			mysqli_query($link, "UPDATE $g_table SET IP=$ip WHERE ID=$id");
			return makeStatus("true","Request permission granted");
		}else{
			return makeStatus("false","Request permission denied");
		}
	}
	function quitEditObject($id, $ip){
		global $link;
		global $g_table;
		$result = mysqli_query($link, "SELECT * FROM $g_table WHERE ID=$id and IP=$ip");
		if(mysqli_fetch_array($result) !== false){
			mysqli_query($link, "UPDATE $g_table SET IP=NULL WHERE ID=$id");
			return makeStatus("true", "Permission resigned");
		}else{
			return makeStatus("false", "Permission for object $id is not granted to $ip");
		}
	}
		
	function updateObject($id, $ip, $data){
		global $link;
		global $g_table;
		global $ownership;
		if($ownership){
		$result = mysqli_query($link, "SELECT * from $g_table where ID=$id and IP=$ip");}else{
		 $result= mysqli_query($link, "SELECT * from $g_table where ID=$id");
		}
		if(!(mysqli_fetch_array($result)==false)){
			$update_query= "UPDATE $g_table SET DATA='$data' WHERE ID=$id";
			mysqli_query($link, $update_query); return makeStatus("true", "Updated object $id via query $update_query");
		}else{
			return makeStatus("false", "Failed to update object $id, maybe id does not exist");
		}
	}
	$rval = "NOACTION";
	if($action=="CREATE"){
		$rval = createObject($g_id, $g_data);
	}else if($action=="DELETE"){
		$rval = deleteObject($g_id);
	}else if($action=="RQEDIT"){
		$rval = requestEditObject($g_id,$g_ip);
	}else if($action=="QTEDIT"){
		$rval = quitEditObject($g_id,$g_ip);
	}else if($action=="UPDATE"){
		$rval = updateObject($g_id,$g_ip,$g_data);
	}
	echo($rval);

?>
