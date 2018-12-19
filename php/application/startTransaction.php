<?php 

$app->post('/SetSessionVal',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$Type = $r->session->Type;
	$Value = $r->session->Val;
	if($Type!="" && $Value!=""){
	 if (!isset($_SESSION)) {
        session_start();
     }
	 $_SESSION[$Type] = $Value;
	 $response['status'] = 'success';
	}else{
	$response['status'] = 'errorr';	
	}
	echoResponse(200,$response);
});

$app->post('/GetSessionVal',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$Type = $r->session->Type;
	
	if($Type != ""){
	 if (!isset($_SESSION)) {
        session_start();
     }
	  if(isset($_SESSION[$Type])){
		$response['data'] = $_SESSION[$Type];
		$response['status'] = 'success';
	  }else{
		$response['data'] = "";
		$response['status'] = 'Value not set'; 
	  }	 
	}else{
		$response['status'] = 'errorr';
	}
	echoResponse(200,$response);
});

$app->post('/UnsetSessionVal',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$Type = $r->session->Type;
	
	if($Type != ""){
	 if (!isset($_SESSION)) {
        session_start();
     }
	  if(isset($_SESSION[$Type])){
		unset($_SESSION[$Type]);
		$response['status'] = 'success';
	  }else{
		$response['data'] = "";
		$response['status'] = 'Value not set'; 
	  }	 
	}else{
		$response['status'] = 'errorr';
	}
	echoResponse(200,$response);
});

$app->post('/AddCustomer', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$FirstName = $r->Customer->FirstName;
	$LastName = $r->Customer->LastName;
	$PhoneNumber = $r->Customer->PhoneNumber; 
	$Email = $r->Customer->Email; 	
			
	$Table = "T_CUSTOMER";
	$ColReq = array();
	$ColVal = array('FIRST_NAME'=>$FirstName, 'LAST_NAME'=>$LastName, 'PH_NUM_1'=>$PhoneNumber, 'EMAIL'=>$Email);
	$where = array('PH_NUM_1'=>$PhoneNumber);
	$cust = $db->select($Table,'*',$where);
	//print_r($cust["message"]);
	if($cust["status"] != "success"){
		$AddProd = $db->insert($Table,$ColVal,$ColReq);
		$response = $AddProd;
		if($AddProd["status"] == "success"){
			$response["dataReq"] = $r->Customer;
			$response["data"] = $AddProd;			
			$response["message"] = 'Customer created successfully';
			echoResponse(200, $response);
		}else{
			echoResponse(201, $response);
		}
	}else{
		$response["message"] = 'Customer with phone number '.$PhoneNumber.' already exists';
		$response['status'] = 'error';
		echoResponse(201,$response);
	}
	
	
});
$app->post('/SearchCustomer', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$FirstName = $r->Customer->FirstName;
	$LastName = $r->Customer->LastName;
	$PhoneNumber = $r->Customer->PhoneNumber; 
	$Email = $r->Customer->PhoneNumber; 			
	$Table = "T_CUSTOMER";
	$ColReq = array();
	//$ColVal = array('FIRST_NAME'=>$FirstName, 'LAST_NAME'=>$LastName, 'PH_NUM_1'=>$PhoneNumber, 'EMAIL'=>$Email);
	$where = "PH_NUM_1='".$PhoneNumber."' or Email = '".$Email."' OR (FIRST_NAME = '".$FirstName."' AND LAST_NAME = '".$LastName."')";
	$cust = $db->select3($Table,'*',$where);
	if($cust['status']=='success'){
		echoResponse(200,$cust);
	}else{
		echoResponse(201,$cust);
	}
});

$app->post('/NewTransaction', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$UserId = $r->session->UserId;
	$CustId = $r->session->CustId;
	$Type = $r->session->Type;
	$TransType = $r->session->TransType;
	
	$Table = "T_TRANSACTION";
	$colVal = array("CUSTOMER_ID"=>$CustId,"USER_ID"=>$UserId,"TYPE"=>$TransType);
	$colReq = array();		
	$NewTrans = $db->insert($Table,$colVal,$colReq);
	if($NewTrans['status'] == 'success'){
		if (!isset($_SESSION)) {
			session_start();
		}
		$_SESSION[$Type] = $NewTrans['data'];
		echoResponse(200,$NewTrans);
	}else{
		echoResponse(201,$NewTrans);
	}
});

$app->post('/ReturnTransaction', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$UserId = $r->session->UserId;
	$CustId = $r->session->CustId;
	$Type = $r->session->Type;
	$ReturnId = $r->session->ReturnId;
	$TransType = $r->session->TransType;
	$TotalAmt = $r->session->TotalAmt;
	$TotalQuantity = $r->session->TotalQuantity;
	$ReturnList = $r->session->ReturnList;
	
	$Table = "T_TRANSACTION";
	$colVal = array("CUSTOMER_ID"=>$CustId,"USER_ID"=>$UserId,"TYPE"=>$TransType,"RETURN_ID"=>$ReturnId,"TOTAL_AMOUNT"=>$TotalAmt,"QUANTITY"=>$TotalQuantity);
	$colReq = array();		
	$NewTrans = $db->insert($Table,$colVal,$colReq);
	
	
	if($NewTrans['status'] == 'success'){
		
		$TransId = $NewTrans['data'];
		$Table = "T_BILL_DETAILS";
		$ColReq = array();
		try{	
			foreach($ReturnList as $Prodz=>$Prod){				
				//print_r($ReturnList);
				$ColVal = array('TRANS_ID'=>$TransId,'PRODUCT_ID'=>$Prod->ProductId,'PRICE'=>$Prod->ProdPrice,'QUANTITY'=>$Prod->ReturnQuantity,'TOTAL'=>$Prod->ReturnPrice,'VAT'=>$Prod->Vat,'TAX1'=>$Prod->VatId);
				$AddBill = $db->insert($Table,$ColVal,$ColReq);
				//print_r($AddBill);
			}
			}catch(Exception $e){
				echoResponse(201,$e);
			}
		echoResponse(200,$NewTrans);
	}else{
		echoResponse(201,$NewTrans);
	}
});


$app->post('/CloseTransaction', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$TransId = $r->session->TransId;
	$Type = $r->session->Type;
	$Table = "T_TRANSACTION";
		$where = "ROW_ID='".$TransId."'";
		$set = "STATUS='Closed'";
		//Updatet the Sequence to next value
		$TransUpdate = $db->update2($Table,$set,$where);
		if($TransUpdate["status"] == "success"){
			if (!isset($_SESSION)) {
				session_start();
			}
			$_SESSION[$Type] = "NEW";
			echoResponse(200,$TransUpdate);
		}else{
			echoResponse(201,$TransUpdate);
		}
	
});

$app->post('/SearchCustomerWithRowId', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$ROW_ID = $r->Customer->RowId;
	//$LastName = $r->Customer->LastName;
	//$PhoneNumber = $r->Customer->PhoneNumber; 
	//$Email = $r->Customer->PhoneNumber; 			
	$Table = "T_CUSTOMER";
	$ColReq = array();
	//$ColVal = array('FIRST_NAME'=>$FirstName, 'LAST_NAME'=>$LastName, 'PH_NUM_1'=>$PhoneNumber, 'EMAIL'=>$Email);
	$where = "ROW_ID='".$ROW_ID."'";
	$cust = $db->select3($Table,'*',$where);
	if($cust['status']=='success'){
		echoResponse(200,$cust);
	}else{
		echoResponse(201,$cust);
	}
});
$app->post('/SearchProduct',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$ProductCode = $r->Product->ProductCode;
	$Table = "T_PRODUCT T1,T_TAX T2";
	$Where = "T1.BAR_CODE LIKE '".$ProductCode."' AND T1.TAX_ID_1=T2.ROW_ID";
	$prod = $db->select3($Table,'T1.*,T2.TAX_RATE',$Where);
	if($prod['status'] == 'success'){
		echoResponse(200,$prod);
	}else{
		echoResponse(201,$prod);
	}
});

$app->post('/GenerateBill',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$ProductList = $r->Transact->ProductList;
	$TransId = $r->Transact->TransId;
	$TransTotal = $r->Transact->TransTotal;
	$Quantity = $r->Transact->Quantity;
	$Discount = $r->Transact->Discount;
	$prodLen = sizeof($ProductList);
	$Table = "T_BILL_DETAILS";
	$ColReq = array();
	$where = "TRANS_ID = '".$TransId."'";
	//Check if there are records for the current transaction
	$BillRec = $db->select3($Table,'*',$where);
	if($BillRec["status"] == "success"){
		$set = "INACTIVE = 1";
		$Upd = $db->update2($Table,$set,$where);
	}
	$Table2 = "T_TRANSACTION";
	$where2 = "ROW_ID = '".$TransId."'";
	$set2 = "TOTAL_AMOUNT = ".$TransTotal.",STATUS='Completed',QUANTITY='".$Quantity."',"."DISCOUNT = '".$Discount."'";
	//print_r($set2);
	$upd = $db->update2($Table2,$set2,$where2);
	$count = 0;
	try{
	
	foreach($ProductList as $Prodz=>$Prod){
		$count++;
		//print_r($Prod);
		$ColVal = array('TRANS_ID'=>$TransId,'PRODUCT_ID'=>$Prod->ProductId,'PRICE'=>$Prod->ProdPrice,'QUANTITY'=>$Prod->Quantity,'TOTAL'=>$Prod->Price,'VAT'=>$Prod->Vat,'TAX1'=>$Prod->VatId);
		$AddBill = $db->insert($Table,$ColVal,$ColReq);
		
	}
	}catch(Exception $e){
		echoResponse(201,$e);
	}
	$AddBill["TotalCount"] = $count;
	echoResponse(200,$AddBill);
	
	
});

$app->post('/GetBillDetailsForTransID',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$TransId = $r->session->TransId;
	$Table = "T_BILL_DETAILS T1,T_PRODUCT T2,T_TAX T3";
	$ColReq = array();
	$where = "TRANS_ID = '".$TransId."' AND T1.PRODUCT_ID = T2.ROW_ID AND T1.INACTIVE='0' AND T3.ROW_ID=T2.TAX_ID_1" ;
	$col = "T1.ROW_ID id,T2.DISPLAY_NAME ProductName,T1.PRICE ProdPrice,T1.QUANTITY Quantity,T1.TOTAL Price,T1.PRODUCT_ID ProductId,T3.TAX_RATE Vat,T3.ROW_ID VatId";
	$BillDetails = $db->select3($Table,$col,$where);
	if($BillDetails["status"] == 'success'){
		echoResponse(200,$BillDetails);
	}else{
		echoResponse(201,$BillDetails);
	}
});

$app->post('/DoneTransaction',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$TransId = $r->session->TransId;
	$BillReceipt = $r->session->BillReceipt;
	$Table = "T_TRANSACTION";
	$where = "ROW_ID='".$TransId."'";
	$set = "STATUS='Done',BILL_RECEIPT='".$BillReceipt."'";
	$TransUpdate = $db->update2($Table,$set,$where);
	//print_r("Prod Id : 1".$TransUpdate["status"]);
	if($TransUpdate["status"] == "success"){
		if (!isset($_SESSION)) {
			session_start();
		}
		//$_SESSION[$Type] = "NEW";
	
		$Table = "T_BILL_DETAILS T1,T_PRODUCT T2";
		$ColReq = array();
		$where = "T1.TRANS_ID = '".$TransId."' AND T1.PRODUCT_ID = T2.ROW_ID AND T1.INACTIVE='0'" ;
		$col = "T1.ROW_ID id,T2.DISPLAY_NAME ProductName,T1.PRICE ProdPrice,T1.QUANTITY Quantity,T1.TOTAL Price,T1.PRODUCT_ID ProductId";
		$BillDetails = $db->select3($Table,$col,$where);//*/
		//print_r("Prod Id : ".$BillDetails["status"]);
		if($BillDetails["status"] == 'success'){
			foreach($BillDetails["data"] as $BillDet=>$Bill){	
				$ProdId = $Bill["ProductId"];
				$Quantity = $Bill["Quantity"];				
				$Table = "T_PRODUCT";
				$where = "ROW_ID = '".$ProdId."'" ;
				$col = "SOLD sold";
				$ProdDetails = $db->select3($Table,$col,$where);//*/
				//print_r("Prod Id1 : ".$ProdDetails["data"][0]["sold"]);
				if($ProdDetails["status"] == 'success'){
					$SoldVal = intval($ProdDetails["data"][0]["sold"]);
					//Update Sold
					$SoldVal = $SoldVal + $Quantity;
					$Table = "T_PRODUCT";
					$where = "ROW_ID='".$ProdId."'";
					$set = "SOLD=".$SoldVal;
					$TransUpdate = $db->update2($Table,$set,$where);
					if($TransUpdate["status"] == 'success'){
						
					}//*/
				}				
			}		
			
			echoResponse(200,$TransUpdate);
		}else{
			echoResponse(201,$TransUpdate);
		}
	}else{
		echoResponse(201,$TransUpdate);
	}
});
$app->post('/SearchBillNumber',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$BillNumber = $r->Bill->BillNumber;
	$Table = "T_TRANSACTION";
	$Where = "ROW_ID = '".$BillNumber."'";
	$Bill = $db->select3($Table,'*',$Where);
	if($Bill['status'] == 'success'){
		echoResponse(200,$Bill);
	}else{
		echoResponse(201,$Bill);
	}
});
$app->post('/GetListOfValues',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	
	$Where = $r->Config->Condition;
	$Column = $r->Config->Column;
	$Table = $r->Config->Table;
	
	//$Table = "T_TRANSACTION";
	//$Where = "ROW_ID = '".$BillNumber."'";
	$Trans = $db->select3($Table,$Column,$Where);
	if($Trans['status'] == 'success'){
		echoResponse(200,$Trans);
	}else{
		echoResponse(201,$Trans);
	}
	
});

$app->post('/UpdateRecord',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	
	$Where = $r->Config->Condition;
	$Set = $r->Config->Set;
	$Table = $r->Config->Table;
	
	$upd =  $db->update2($Table,$Set,$Where);
	if($upd["status"] == "success"){
		echoResponse(200,$upd);
	}else{
		echoResponse(201,$upd);
	}
});

?>