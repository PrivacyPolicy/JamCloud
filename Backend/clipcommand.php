yo
<?
 /* This form is interacted with via javascript
 a clip type command will be initiated to interact with the database
	yaaaaaaaaaaay */
	include("./session.php");
	$g_ip = $_SERVER['REMOTE_ADDR'];
	$action = $_POST['ACTION'];
	$g_id = $_POST['OBJECT'];
	$g_data = $_POST['DATA'];

	/* create an object and put in data if necessary */
	function createObject($id, $data){
		$result = mysqli_query($link, "SELECT * FROM Objects WHERE ID=$g_id");
		if(mysqli_fetch_array($result) == false){
			mysqli_query($link, "INSERT INTO Objects (ID, IP, DATA) VALUES($id, NULL, $data)");
		
			return true;
		}else{
			return false;
		}
	}
	/* Delete object completely*/
	function deleteObject($id){
		$result = mysqli_query($link, "SELECT * FROM Objects WHERE ID=$g_id");
		if(mysqli_fetch_array($link, "SELECT * FROM Objects WHERE ID=$g_id AND IP=NULL");
		if(mysqli_fetch_array($result) !== false){
			mysqli_query($link, "DELETE FROM Objects WHERE ID=$g_id");
			return true;
		}else{
			return false;
		}
	}

	if($action=="CREATE"){
		$rval = createObject($g_id, $g_data);
	else if($action=="DELETE"){
		$rval = deleteObject($g_id);
	}

	echo($rval);

?>
</body>
</html>
