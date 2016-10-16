<?php
/* The clients submits a GET request to receive a list of all updates
   since the GET-given timestamp
   */
include("./session.php");
$g_timestamp = isset($_GET["TIMESTAMP"]) ? $_GET["TIMESTAMP"] : 0;
$result = mysqli_query($link, "SELECT * FROM Updates WHERE TIMESTAMP
    >= $g_timestamp ORDER BY TIMESTAMP;");
$rows;
if ($result == false) die("Select did not work; sucks to be you");
if ($result->num_rows > 0) {
    //$rows = mysqli_fetch_array($result);
    echo "[\n";
    $rows = $result->fetch_assoc();
    while ($rows) {
        echo "{\"timestamp\": {$rows["TIMESTAMP"]}, ";
        echo "\"class\": {$rows["CLASS"]}, ";
        echo "\"objectID\": {$rows["OBJ_ID"]}, ";
        echo "\"action\": {$rows["ACTION"]}, ";
        echo "\"data\": {$rows["DATA"]}";
        echo "}";
        $rows = $result->fetch_assoc();
        if ($rows) {
            echo ",\n";
        }
    }
    echo "\n]\n";
} else {
    die("something didn't work out right; sucks to be you");
}