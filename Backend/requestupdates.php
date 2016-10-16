<?php
/* The clients submits a GET request to receive a list of all updates
   since the GET-given timestamp
   */
include("./session.php");
$g_ip = $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT'];
$g_timestamp = isset($_GET["TIMESTAMP"]) ? $_GET["TIMESTAMP"] : 0;
$result = mysqli_query($link, "SELECT * FROM Updates WHERE TIMESTAMP
    >= $g_timestamp ORDER BY TIMESTAMP ASC;");
$rows;
if ($result == false) die("Select did not work; sucks to be you");
if ($result->num_rows > 0) {
    //$rows = mysqli_fetch_array($result);
    echo "[\n";
    $rows = $result->fetch_assoc();
    while ($rows) {
        if ($rows["IP"] == $g_ip) {
            $rows = $result->fetch_assoc();
            continue;
        }
        echo "{\"timestamp\": {$rows["TIMESTAMP"]}, ";
        echo "\"IP\": \"{$rows["IP"]}\", ";
        echo "\"class\": \"{$rows["CLASS"]}\", ";
        echo "\"objectID\": {$rows["OBJ_ID"]}, ";
        echo "\"action\": \"{$rows["ACTION"]}\", ";
        echo "\"data\": {$rows["DATA"]}";
        echo "}";
        $rows = $result->fetch_assoc();
        if ($rows) {
            echo ",\n";
        }
    }
    echo "\n]\n";
} else {
    // no new updates
    die("[]");
}