<?php 
$app->get('/GetSession', function() {
    $db = new dbHelper();
    $session = $db->getSession();
	$response["UserId"] = $session['UserId'];
    $response["FirstName"] = $session['FirstName'];
    $response["LastName"] = $session['LastName'];
    $response["UserRowId"] = $session['UserRowId'];
    echoResponse(200, $response);
});
$app->get('/CloseSession', function() {
    $db = new dbHelper();
    $session = $db->destroySession();
	$response["status"] = "info";
    $response["message"] = "Logged out successfully";
	$response["info"] = $session;
    echoResponse(200, $response);
});



$app->get('/GetSessionStatus',function(){
	if (isset($_SESSION['UserId'])) {
		$response["Session"] = 'Active';
		$response["sessionId"] = session_id();
		echoResponse(200, $response);
	}else{
		$response["Session"] = 'Inactive';
		echoResponse(200, $response);
	}
});

$app->post('/SetPassword', function() use ($app) {
	require_once 'passwordHash.php';
	$r = json_decode($app->request->getBody());
    //verifyRequiredParams(array('Username', 'Password'),$r->customer);
	$response = array();
    $db = new dbHelper();
    $NewPassword = $r->customer->Password;
    //$NewPassword = $r->customer->NewPassword;
    //$reNewPassword = $r->customer->reNewPassword;
    $Username = $r->customer->UserName;
	$reNewPassword = passwordHash::hash($NewPassword);
	$user = $db->select("T_USER","*",array('USER_NAME'=>$Username));
   
    if ($user["status"] == "success") {
		foreach($user["data"][0] as $key=>$value){
			$response[$key]=$value;
		}
		//if(passwordHash::check_password($response['PASSWORD'],$OldPassword)){
			$table = 'T_USER';
			$set = "PASSWORD='".$reNewPassword."',PASS_RESET=1,ACCNT_LOCKED=0,ATTEMPT_COUNT=0";
			$where = "ROW_ID='".$response["ROW_ID"]."'";			
			$rows = $db->update2($table,$set,$where);
			$response2['status'] = "success";
            $response2['message'] = 'Password reset successfully.';
		//}
	}else {
		$response2['status'] = "error";
		$response2['message'] = 'No such user is registered';
	}
		
    echoResponse(200, $response2);
	
});

$app->post('/ResetPassword', function() use ($app) {
	require_once 'passwordHash.php';
	$r = json_decode($app->request->getBody());
    //verifyRequiredParams(array('Username', 'Password'),$r->customer);
	$response = array();
    $db = new dbHelper();
    $OldPassword = $r->customer->OldPassword;
    $NewPassword = $r->customer->NewPassword;
    //$reNewPassword = $r->customer->reNewPassword;
    $Username = $r->customer->UserName;
	$reNewPassword = passwordHash::hash($NewPassword);
	$user = $db->select("T_USER","*",array('USER_NAME'=>$Username));
   
    if ($user["status"] == "success") {
		foreach($user["data"][0] as $key=>$value){
			$response[$key]=$value;
		}
		if(passwordHash::check_password($response['PASSWORD'],$OldPassword)){
			$table = 'T_USER';
			$set = "PASSWORD='".$reNewPassword."',PASS_RESET=0,ACCNT_LOCKED=0,ATTEMPT_COUNT=0";
			$where = "ROW_ID='".$response["ROW_ID"]."'";			
			$rows = $db->update2($table,$set,$where);
			$response2['status'] = "success";
            $response2['message'] = 'Password reset successfully.';
		}else{
			$response2['status'] = "error";
            $response2['message'] = 'Username or Password is Invalid';
		}
	}else {
		$response2['status'] = "error";
		$response2['message'] = 'No such user is registered';
	}
		
    echoResponse(200, $response2);
	
});

$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
	$r = json_decode($app->request->getBody());
    verifyRequiredParams(array('Username', 'Password'),$r->customer);
    $response = array();
    $db = new dbHelper();
    $Password = $r->customer->Password;
    $Username = $r->customer->Username;
    $user = $db->select("T_USER","*",array('USER_NAME'=>$Username,'ACTIVE'=>'1'));
	//$reNewPassword111 = passwordHash::hash($Password);
	//print_r($reNewPassword111);
	//echo '<br/>';
    if ($user["status"] == "success") {
		foreach($user["data"][0] as $key=>$value){
			$response[$key]=$value;
		}
		$rePassword = $response["PASSWORD"];
	//print_r($seq["PASSWORD"]);
	//print_r($Password);
	//echo '<br/>';
	//print_r($response['PASSWORD']);
	//echo '<br/>';
	
		if(passwordHash::check_password($response['PASSWORD'],$Password)){
			$response2['action'] = '';			
			if($response["ACCNT_LOCKED"]==1 || $response["ATTEMPT_COUNT"] >= 3){
				$response2['message'] = 'Your Account is locked. Please contact your manager.';
				$response2['status'] = "error";
				$response2['action'] = 'AccountLocked';
			}else if($response["ACTIVE"] == 0){
				$response2['message'] = 'Your Account is Inactive. Please contact your manager.';
				$response2['status'] = "error";
				$response2['action'] = 'Inactive';
			}else if($response["PASS_RESET"] == 1){
				$response2['message'] = 'Please Reset Your Password.';
				$response2['status'] = "info";
				$response2['action'] = 'PasswordReset';
			}else{
				$response2['message'] = 'Logged in successfully.';
				$response2['status'] = "success";
				$Table = "T_USER_PROFILE T1, T_USER T2, T_STORE T3, T_ROLE T4";
				$where = "T1.USER_ID = T2.ROW_ID AND T1.STORE_ID = T3.ROW_ID AND T1.ROLE = T4.ROW_ID AND T2.USER_NAME='".$Username."'";
				$select = "T4.ROLE_NAME,T3.STORE_NAME";
				$cust = $db->select3($Table,$select,$where);
				$response2['UserRole'] = $cust["data"];
				$table = 'T_USER';
				$set = "ATTEMPT_COUNT=0";
				$where = "USER_NAME='".$Username."'";
				$column = array();				
				$rows = $db->update2($table,$set,$where);
			}			
		
        $_SESSION['UserId'] = $response['USER_NAME'];
        $_SESSION['FirstName'] = $response['FIRST_NAME'];
        $_SESSION['LastName'] = $response['LAST_NAME'];
		$_SESSION['UserRowId'] = $response["ROW_ID"];
		//$_SESSION['UserRole'] = $cust;
        /* else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }//*/
		}else{
			
			$table = 'T_USER';
			$set = "ATTEMPT_COUNT=ATTEMPT_COUNT+1";
			$where = "USER_NAME='".$Username."'";
			$column = array();
			
			$rows = $db->update2($table,$set,$where);
			$user = $db->select("T_USER","*",array('USER_NAME'=>$Username,'ATTEMPT_COUNT'=>'>=3'));
			if ($user["status"] == "success") {
				$table = 'T_USER';
				$set = "ACCNT_LOCKED='1'";
				$where = "USER_NAME='".$Username."'";			
				$rows = $db->update2($table,$set,$where);
			}
			$response2['status'] = "error";
            $response2['message'] = 'Username or Password is Invalid';
		}		
    }else {
            $response2['status'] = "error";
            $response2['message'] = 'No such user is registered';
        }
		
    echoResponse(200, $response2);
});
$app->post('/select', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Table = $r->Query->Table;
	$where = $r->Query->Where;
    $userPass = $db->SELECT($Table,"*",$where);
	if($userPass["status"] == "success"){
		$response["data"] = $userPass["data"];
	}
	//$session = $db->destroySession();
    $response["status"] = $userPass["status"];
    $response["message"] = $userPass["message"];
    echoResponse(200, $response);
});
$app->post('/select2', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Table = $r->Query->Table;
	$where = $r->Query->Where;
	$Order = $r->Query->Order;
    $userPass = $db->SELECT2($Table,"*",$where,$Order);
	if($userPass["status"] == "success"){
		$response["data"] = $userPass["data"];
	}
	//$session = $db->destroySession();
    $response["status"] = $userPass["status"];
    $response["message"] = $userPass["message"];
    echoResponse(200, $response);
});
$app->post('/update', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Table = $r->Query->Table;
	$where = $r->Query->Where;
	$set = $r->Query->Set;
    $userPass = $db->update2($Table,$set,$where);
	//$session = $db->destroySession();
    $response["status"] = "success";
    $response["message"] = "Updated successfully";
	$response = $userPass;
    echoResponse(200, $response);
});

$app->post('/Register',function() use ($app){
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	require_once 'passwordHash.php'; 	
	$Username = $r->customer->UserName;
	$phone = $r->customer->PhoneNumber;
    $FirstName = $r->customer->FirstName;
    $LastName = $r->customer->LastName;
    $UserName = $r->customer->UserName;
    $email = $r->customer->Email;
    $Password = $r->customer->Password;
    $rePassword = $r->customer->rePassword;	
	$Password = passwordHash::hash($rePassword);
	//print_r($Username);
	//Check if the user id exists in T_User table
	$user = $db->select("T_USER","*",array('USER_NAME'=>$Username));
	
	if($user["status"] =="success"){
		$Table = "T_SEQUENCE";
		$where = "TYPE='".$Username."'";
		$set = "VAL=VAL+1";
		//Updatet the Sequence to next value
		$userPass = $db->update2($Table,$set,$where);
		if($userPass["status"]=="success"){
			//Get the latest sequence
			$user = $db->select("T_SEQUENCE","*",array('TYPE'=>$Username));
			//$response = $user;
			//$response["type"]="EXIST";
			$Type = "EXIST";
			if($user["status"]="success"){
				foreach($user["data"][0] as $key=>$value){
					$seq[$key]=$value;
				}
				$Username = $Username."_".$seq["VAL"];
			}
		}else{
			//Some thing went wrong			
			$response = $userPass;
			$response["type"]="FAIL";
			$Type = "FAIL";
		}
	}else{
		//Insert the value in the sequence
		$Table = "T_SEQUENCE";
		$colVal = array("TYPE"=>$Username);
		$colReq = array();		
		$userPass = $db->insert($Table,$colVal,$colReq);
		//$response=$usePass; 
		//$response["type"] = "NEW";
		//print_r("User found ".$userPass["status"]. " message ".$userPass["message"]);
		$Type = "NEW";
	}
	
	if($Type =="NEW" || $Type == "EXIST"){
		$Table = "T_USER";
		$set = array("USER_NAME"=>$Username,"FIRST_NAME"=>$FirstName,"LAST_NAME"=>$LastName,"EMAIL"=>$email,"PASSWORD"=>$Password,"PH_NUM_1"=>$phone);
		$ColReq = array();
		$user = $db->insert($Table,$set,$ColReq);		
		$response = $user;
		$response["UserName"] = $Username;
	}else{
		
	}
	echoResponse(200,$response);
});

$app->post('/insert', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$Table = $r->Query->Table;
	$colVal = $r->Query->columnsVal;
	$colReq = array();
    $userPass = $db->insert($Table,$colVal,$colReq);
	//$session = $db->destroySession();
    $response["status"] = "succes";
    $response["message"] = "Insered successfully";
	$response = $userPass;
    echoResponse(200, $response);
});
$app->post('/Register1', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('FirstName','LastName','UserName','Password','rePassword','PhoneNumber','Email'),$r->customer);
    require_once 'passwordHash.php';
    $db = new dbHelper();
    $phone = $r->customer->PhoneNumber;
    $FirstName = $r->customer->FirstName;
    $LastName = $r->customer->LastName;
    $UserName = $r->customer->UserName;
    $email = $r->customer->Email;
    $Password = $r->customer->Password;
    $rePassword = $r->customer->rePassword;
    $isUserExists = $db->getOneRecord("select 1 from customers_auth where phone='$phone' or email='$email'");
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $tabble_name = "customers_auth";
        $column_names = array('phone', 'name', 'email', 'password', 'city', 'address');
        $result = $db->insertIntoTable($r->customer, $column_names, $tabble_name);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["uid"] = $result;
            if (!isset($_SESSION)) {
                session_start();
            }
            $_SESSION['uid'] = $response["uid"];
            $_SESSION['phone'] = $phone;
            $_SESSION['name'] = $name;
            $_SESSION['email'] = $email;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }            
    }else{
        $response["status"] = "error";
        $response["message"] = "An user with the provided phone or email exists!";
        echoResponse(201, $response);
    }
});
$app->get('/logout', function() {
    $db = new dbHelper();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});

$app->get('/SendeMail',function(){
	$response["status"] = "info";
	$response["message"] = "eMail Sent Out successfully";
	$message='<html>
<head>
  <title>Birthday Reminders for August</title>
</head>
<body>
  <p>Here are the birthdays upcoming in August!</p>
  <table>
    <tr>
      <th>Person</th><th>Day</th><th>Month</th><th>Year</th>
    </tr>
    <tr>
      <td>Joe</td><td>3rd</td><td>August</td><td>1970</td>
    </tr>
    <tr>
      <td>Sally</td><td>17th</td><td>August</td><td>1973</td>
    </tr>
  </table>
</body>
</html>';

// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

// Additional headers
$headers .= 'To: yajneshpadiyar@gmail.com' . "\r\n";
$headers .= 'From: Birthday Reminder <yp.drait@gmail.com>' . "\r\n";
$headers .= 'Cc: yp.drait@gmail.com' . "\r\n";
$headers .= 'Bcc: yp.drait@gmail.com' . "\r\n";
	mail('yajneshpadiyar@gmail.com','Hello',$message,$headers);
	echoResponse(200, $response);
});

$app->post('/UploadImg', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
	print_r( $r);
	if (!empty( $_FILES ) ) { 
	    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ]; 
	    $uploadPath = "../uploads/".$_FILES[ 'file' ][ 'name' ]; 
		if(move_uploaded_file($tempPath, $uploadPath)){
			$db = new DB_Handler();
			$result = $db->save($_FILES[ 'file' ][ 'name' ]);
			unset($db);
			if($result){
				echo "Uploaded Successfully!";
			}else{
				echo "Uploaded but not saved!";
			} 
		}else{
		    echo "Failed to upload!";
		}  
 	} else { 
	    echo "Error occurred!";
	}  
});

?>