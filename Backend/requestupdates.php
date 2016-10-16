<?php
/* The clients submits a GET request to receive a list of all updates
   since the GET-given timestamp
   */
include("./session.php");
$g_timestamp = $_GET["TIMESTAMP"] or 0;
$result = mysqli_query($link, "SELECT * FROM Updates WHERE TIMESTAMP
    >= $g_timestamp ORDER BY TIMESTAMP;");
$rows;
if (($rows = mysqli_fetch_array($result)) != false) {
    echo "[\n";
    for ($i = 0; $i < count($rows); $i++) {
        echo "{\"timestamp\": {$row["TIMESTAMP"]}, ";
        echo "\"class\": {$row["CLASS"]}, ";
        echo "\"objectID\": {$row["OBJ_ID"]}, ";
        echo "\"action\": {$row["ACTION"]}, ";
        echo "\"data\": {$row["DATA"]}";
        echo "}";
        if ($i < len($rows)) {
            echo ",\n";
        }
    }
    echo "\n]\n";
}