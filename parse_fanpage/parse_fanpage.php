<?php
//$_POST 只能取得Content-type為application/x-www-form-urlencoded或multipart/form-data的資料
//php://input可以讀取request body的資料，當Content-type為multipart/form-data，php://input會取得空值
//Step1. Get parameters from parse_fanpage.html
$post_data_str = file_get_contents("php://input");
$post_data_json = json_decode($post_data_str, true); //return in array format

$post_data_json['msg1'] = "parse_fanpage.html -> parse_fanpage.php";
$send_data_json = $post_data_json;

$send_data_str = json_encode($send_data_json);
//echo $send_data_str;

//Step2. Send a post request to node.js server by curl handler
$port = "8888";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:".$port);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $send_data_str);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch); 

if(curl_errno($ch)){
	echo curl_error($ch);
}
else{
	echo $response;
}
curl_close($ch);
?>