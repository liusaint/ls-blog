<?php 

$callback = $_GET['callback'];
$id = $_GET['id'];

if($id == 1){
	$res = 'this is 1';
}

if($id == 2){
	$res = 'this is 2';
}



$res = $callback."('$res')";

echo $res;

?>