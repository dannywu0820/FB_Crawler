<?php
//$_POST �u����oContent-type��application/x-www-form-urlencoded��multipart/form-data�����
//php://input�i�HŪ��request body����ơA��Content-type��multipart/form-data�Aphp://input�|���o�ŭ�
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