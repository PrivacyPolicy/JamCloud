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
    $output = "[\n";
    $rows = $result->fetch_assoc();
    while ($rows) {
        $output .= "{\"timestamp\": {$rows["TIMESTAMP"]}, ";
        $output .= "\"IP\": \"{$rows["IP"]}\", ";
        $output .= "\"class\": \"{$rows["CLASS"]}\", ";
        $output .= "\"objectID\": {$rows["OBJ_ID"]}, ";
        $output .= "\"action\": \"{$rows["ACTION"]}\", ";
        $output .= "\"data\": {$rows["DATA"]}";
        $output .= "},\n";
        $rows = $result->fetch_assoc();
    }
    //$output = substr($output, strlen($output) - 6);
    $output .= "\n]\n";
    
    $output = str_replace("},\n\n]", "}\n]", $output);
    echo $output;
} else {
    // no new updates
    die("[]");
}