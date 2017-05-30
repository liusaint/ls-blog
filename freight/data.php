<?php 
// 后台
//使用mt_rand为返回结果增加一些随机性。

$q =  @$_GET['code'];


$length = strlen($q);
$res['status'] = 1;
if($length>mt_rand(1,20)){
	$res['data'] = [];
}else{

	$data = [];
	for ($i=0; $i < mt_rand(2,5); $i++) { 
		@$data[$i]['code'] = $q.$i;
		@$data[$i]['name'] = $q.$i.'name';
	}

	$res['data'] = $data;
}



echo json_encode($res);



?>