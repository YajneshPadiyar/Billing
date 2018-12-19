<?php 
$app->post('/AddProduct', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$ProductName = $r->Product->ProductName;
	$DisplayName = $r->Product->DisplayName;
	$ProductType = $r->Product->ProductType; 
	$CostPrice = $r->Product->CostPrice; 
	$SecretCode = $r->Product->SecretCode;
	$SellPrice = $r->Product->SellPrice; 
	$WSPrice = $r->Product->WSPrice;
	$BarCode = $r->Product->BarCode;
	$Quantity = $r->Product->Quantity;
	$Tax1 = $r->Product->Tax1;
	$Tax2 = $r->Product->Tax2;
			
	$Table = "T_PRODUCT";
	$ColReq = array();
	$ColVal = array('PRODUCT_NAME'=>$ProductName, 'TYPE'=>$ProductType, 'DISPLAY_NAME'=>$DisplayName, 'RETAIL_SELL_PRICE'=>$SellPrice, 'COST_PRICE'=>$CostPrice, 'WS_SELL_PRICE'=>$WSPrice, 'SEC_BAR_CODE'=>$SecretCode, 'BAR_CODE'=>$BarCode, 'QUANTITY'=>$Quantity, 'TAX_ID_1'=>$Tax1, 'TAX_ID_2'=>$Tax2);
	$AddProd = $db->insert($Table,$ColVal,$ColReq);
	$response = $AddProd;
	if($AddProd["status"] == "success"){
		$response["dataReq"] = $r->Product;
		echoResponse(200, $response);
	}else{
		echoResponse(201, $response);
	}
	
});
$app->post('/DeleteItem', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Table = $r->item->Table;
	$Condition = $r->item->Condition;
	$AddProd = $db->delete($Table,$Condition);
	//delete($table, $where)
	if($AddProd["status"] == "success"){
		$response=$AddProd;
		echoResponse(200, $response);
	}else{
		$response=$AddProd;
		echoResponse(201, $response);
	}
});
$app->post('/InsertItem', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Table = $r->item->Table;
	$ColVal = $r->item->ColVal;
	$ColReq = array();
	//$ColVal = array('PRODUCT_NAME'=>$ProductName, 'TYPE'=>$ProductType, 'DISPLAY_NAME'=>$DisplayName, 'RETAIL_SELL_PRICE'=>$SellPrice, 'COST_PRICE'=>$CostPrice, 'WS_SELL_PRICE'=>$WSPrice, 'SEC_BAR_CODE'=>$SecretCode, 'BAR_CODE'=>$BarCode, 'QUANTITY'=>$Quantity, 'TAX_ID_1'=>$Tax1, 'TAX_ID_2'=>$Tax2);
	$AddProd = $db->insert($Table,$ColVal,$ColReq);
	$response = $AddProd;
	if($AddProd["status"] == "success"){
		$response["dataReq"] = $r->item;
		echoResponse(200, $response);
	}else{
		echoResponse(201, $response);
	}
});
$app->post('/GetListOfProducts',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Condition = $r->Config->Condition;
	$Column = $r->Config->Column;
	$where = $Condition==""?"1=1":$Condition;
	$Table = "T_PRODUCT";
	$data = $db->select3($Table,$Column,$where);
	
	if($data["status"] == "success"){
		echoResponse(200,$data);
		
	}else{
		echoResponse(201,$data);
	}	
});

$app->post('/InactivateProduct',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$ProductId = $r->Product->ProductId;
	$Table = "T_PRODUCT";
	//$ColReq = array();
	$set = "ACTIVE=0";
	$where = "ROW_ID = '".$ProductId."'";
	$upd =  $db->update2($Table,$set,$where);
	if($upd["status"] == "success"){
		echoResponse(200,$upd);
	}else{
		echoResponse(201,$upd);
	}
});


$app->post('/updateProducts',function() use ($app){
    //Update book identified by $id
	$response = array();
	$db = new dbHelper();
	//print_r($app);
	//print_r($app->request->getBody());
	parse_str($app->request->getBody(),$Param);
	//print_r($Param);
	if(array_key_exists('PRODUCT_NAME',$Param)){
		$Column = ('PRODUCT_NAME');
	}else if(array_key_exists('DISPLAY_NAME',$Param)){
		$Column = ('DISPLAY_NAME');
	}else if(array_key_exists('TYPE',$Param)){
		$Column = ('TYPE');
	}else if(array_key_exists('COST_PRICE',$Param)){
		$Column = ('COST_PRICE');
	}else if(array_key_exists('SEC_BAR_CODE',$Param)){		
		$Column = ('SEC_BAR_CODE');	
	}else if(array_key_exists('WS_SELL_PRICE',$Param)){
		$Column = ('WS_SELL_PRICE');	
	}else if(array_key_exists('BAR_CODE',$Param)){
		$Column = ('BAR_CODE');	
	}else if(array_key_exists('QUANTITY',$Param)){
		$Column = ('QUANTITY');	
	}else if(array_key_exists('SOLD',$Param)){
		$Column = ('SOLD');	
	}else if(array_key_exists('TAX_ID_1',$Param)){
		$Column = ('TAX_ID_1');	
	}else if(array_key_exists('RETAIL_SELL_PRICE',$Param)){
		$Column = ('RETAIL_SELL_PRICE');
	}
	
	$Table = "T_PRODUCT";
	$ColReq = array();
	$set = $Column."='".$Param[$Column]."'";
	$where = "ROW_ID = '".$Param['id']."'";
	//print_r($set);
	//print_r($where);
	$upd =  $db->update2($Table,$set,$where);
	if($upd["status"] == "success"){
		echoResponse(200,$upd);
	}else{
		echoResponse(201,$upd);
	}
	
	
	
});
//End of Product Releated Code


$app->post('/CellEdit',function() use ($app){
    //Update book identified by $id
	$response = array();
	$db = new dbHelper();
	//print_r($app);
	//print_r($app->request->getBody());
	parse_str($app->request->getBody(),$Param);
	
	$Table = $Param["Table"];
	$ColReq = array();
	$set = $Param["Column"]."='".$Param[$Param["cellname"]]."'";
	$where = "ROW_ID = '".$Param['id']."'";
	//print_r($set);
	//print_r($where);
	$upd =  $db->update2($Table,$set,$where);
	if($upd["status"] == "success"){
		echoResponse(200,$upd);
	}else{
		echoResponse(201,$upd);
	}//*/
	
	
	
});

//Start of Options Related Code
$app->post('/GetOptions',function() use ($app){
	//print_r($app);
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Condition = $r->Config->Condition;
	$where = $Condition==""?"1=1":$Condition;
	$Table = "T_OPTIONS A LEFT JOIN T_OPTIONS AS B on A.PARENT_ID = B.ROW_ID";
	$data = $db->select3($Table,'A.ROW_ID,A.CATEGEORY AS CATEGEORY,A.BACKEND_VALUE,A.DISPLAY_VALUE,A.ACTIVE,A.ORDER_BY,B.CATEGEORY AS PARENT_ID',$where);
	
	if($data["status"] == "success"){
		echoResponse(200,$data);
	}else{
		echoResponse(201,$data);
	}	
});

$app->post('/GetOptionsType',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Condition = $r->Config->Condition;
	$Column = $r->Config->Column;
	$where = $Condition==""?"1=1":$Condition;
	$Table = "T_OPTIONS";
	$data = $db->select3($Table,$Column,$where);
	
	if($data["status"] == "success"){
		echoResponse(200,$data);
	}else{
		echoResponse(201,$data);
	}	
});
$app->post('/UpdateOption',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Category = $r->Options->Category;
	$RefVal = $r->Options->RefVal;
	$Value = $r->Options->Value;
	$Active = $r->Options->Active;
	$ParentType = $r->Options->ParentType;
	$OrderBy = $r->Options->OrderBy;
	$ROW_ID = $r->Options->ROW_ID;
	
	$Active = $Active=='Y'?1:0;
	//print_r("Working".$ParentType);
	//$ParentType!=""?$ParentType:"XXYYZZ";
	$where = "CATEGEORY = '".$ParentType."'";
	
	//print_r($where);
	$Table = "T_OPTIONS";
	$Column = "*";
	$data = $db->select3($Table,$Column,$where);
	
	//print_r($data);
	if($data["status"] == "success"){
		$ParentType = $data["data"][0]["ROW_ID"];
		//print_r($ParentType);
	}else{
		$ParentType = 999999;
	}
		
	$Table = "T_OPTIONS";
	$ColReq = array();
	$set = "CATEGEORY='".$Category."', BACKEND_VALUE='".$RefVal."', DISPLAY_VALUE='".$Value."', ACTIVE='".$Active."', PARENT_ID='".$ParentType."', ORDER_BY='".$OrderBy."'";
	$where = "ROW_ID = '".$ROW_ID."'";
	$upd =  $db->update2($Table,$set,$where);
	if($upd["status"] == "success"){
		echoResponse(200,$upd);
	}else{
		echoResponse(201,$upd);
	}
});
$app->post('/AddNewOption',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Category = $r->Options->Category;
	$RefVal = $r->Options->RefVal;
	$Value = $r->Options->Value;
	$Active = $r->Options->Active;
	$ParentType = $r->Options->ParentType;
	$OrderBy = $r->Options->OrderBy;
	
	$Active = $Active=='Y'?1:0;
	//print_r("Working".$ParentType);
	//$ParentType!=""?$ParentType:"XXYYZZ";
	$where = "CATEGEORY = '".$ParentType."'";
	
	//print_r($where);
	$Table = "T_OPTIONS";
	$Column = "*";
	$data = $db->select3($Table,$Column,$where);
	
	//print_r($data);
	if($data["status"] == "success"){
		$ParentType = $data["data"][0]["ROW_ID"];
		//print_r($ParentType);
	}else{
		$ParentType = 999999;
	}
		
	$Table = "T_OPTIONS";
	$ColReq = array();
	$ColVal = array('CATEGEORY'=>$Category, 'BACKEND_VALUE'=>$RefVal, 'DISPLAY_VALUE'=>$Value, 'ACTIVE'=>$Active, 'PARENT_ID'=>$ParentType, 'ORDER_BY'=>$OrderBy);
	$AddProd = $db->insert($Table,$ColVal,$ColReq);
	
	if($AddProd["status"] == "success"){
		echoResponse(200,$AddProd);
	}else{
		echoResponse(201,$AddProd);
	}
});

$app->post('/updateOptions',function() use ($app){
    //Update book identified by $id
	$response = array();
	$db = new dbHelper();
	//print_r($app);
	//print_r($app->request->getBody());
	parse_str($app->request->getBody(),$Param);
	//print_r($Param);
	if(array_key_exists('CATEGEORY',$Param)){
		$Column = ('CATEGEORY');
	}else if(array_key_exists('BACKEND_VALUE',$Param)){
		$Column = ('BACKEND_VALUE');
	}else if(array_key_exists('DISPLAY_VALUE',$Param)){
		$Column = ('DISPLAY_VALUE');
	}else if(array_key_exists('ORDER_BY',$Param)){
		$Column = ('ORDER_BY');
	}else if(array_key_exists('PARENT_ID',$Param)){
		$Column = ('PARENT_ID');
	}else if(array_key_exists('ACTIVE',$Param)){
		$Column = ('ACTIVE');
	}
	
	$Table = "T_OPTIONS";
	$ColReq = array();
	$set = $Column."='".$Param[$Column]."'";
	$where = "ROW_ID = '".$Param['id']."'";
	//print_r($set);
	//print_r($where);
	$upd =  $db->update2($Table,$set,$where);
	if($upd["status"] == "success"){
		echoResponse(200,$upd);
	}else{
		echoResponse(201,$upd);
	}
	
	
	
});
?>