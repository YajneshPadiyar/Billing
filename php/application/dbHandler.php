<?php
require_once '../config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
class dbHelper {
    private $db;
    private $err;
    function __construct() {
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
        try {
            $this->db = new PDO($dsn, DB_USERNAME, DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        } catch (PDOException $e) {
            $response["status"] = "error";
            $response["message"] = 'Connection failed: ' . $e->getMessage();
            $response["data"] = null;
            //echoResponse(200, $response);
            exit;
        }
    }
    function select($table, $columns, $where){
        try{
			//print_r("Table : ".$table);
			//print_r("Column : ".$columns);
			
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
              //  print_r("where : ".$key."=>".$value);
				$w .= " and " .$key. " like :".$key;
                $a[":".$key] = $value;
            }
			//print_r("select ".$columns." from ".$table." where 1=1 ". $w);
			
            $stmt = $this->db->prepare("select ".$columns." from ".$table." where 1=1 ". $w);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
            }else{
                $response["status"] = "success";
                $response["message"] = "Data selected from database";
            }
                $response["data"] = $rows;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
    function select2($table, $columns, $where, $order){
        try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " like :".$key;
                $a[":".$key] = $value;
            }
            $stmt = $this->db->prepare("select ".$columns." from ".$table." where 1=1 ". $w." ".$order);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
            }else{
                $response["status"] = "success";
                $response["message"] = "Data selected from database";
            }
                $response["data"] = $rows;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
	function select3($table, $columns, $where){
        try{
			//print_r("Table : ".$table);
			//print_r("Column : ".$columns);
			
            //$a = array();
            //$w = "";
            //foreach ($where as $key => $value) {
              //  print_r("where : ".$key."=>".$value);
				//$w .= " and " .$key. " like :".$key;
                //$a[":".$key] = $value;
            //}
			//print_r("select ".$columns." from ".$table." where ". $where);
			
            $stmt = $this->db->prepare("select ".$columns." from ".$table." where ".$where);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
            }else{
                $response["status"] = "success";
                $response["message"] = "Data selected from database";
            }
                $response["data"] = $rows;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
    function insert($table, $columnsArray, $requiredColumnsArray) {
        $this->verifyRequiredParams($columnsArray, $requiredColumnsArray);
        
        try{
            $a = array();
            $c = "";
            $v = "";
            foreach ($columnsArray as $key => $value) {
                $c .= $key. ", ";
                $v .= ":".$key. ", ";
                $a[":".$key] = $value;
            }
            $c = rtrim($c,', ');
            $v = rtrim($v,', ');
            $stmt =  $this->db->prepare("INSERT INTO $table($c) VALUES($v)");
            $stmt->execute($a);
            $affected_rows = $stmt->rowCount();
            $lastInsertId = $this->db->lastInsertId();
            $response["status"] = "success";
            $response["message"] = $affected_rows." row inserted into database";
            $response["data"] = $lastInsertId;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Insert Failed: ' .$e->getMessage();
            $response["data"] = 0;
        }
        return $response;
    }
	 function update2($table, $set, $where){ 
		//print_r(json_encode($columnsArray,JSON_NUMERIC_CHECK));
		//print_r(json_encode($requiredColumnsArray,JSON_NUMERIC_CHECK));
        //$this->verifyRequiredParams($columnsArray, $requiredColumnsArray);
        try{
            //$a = array();
            //$w = "";
            //$c = "";
            /*foreach ($where as $key => $value) {
                $w .= " and " .$key. " = :".$key;
                $a[":".$key] = $value;
				
            }
            foreach ($columnsArray as $key => $value) {
                $c .= $key. " = :".$key.", ";
                $a[":".$key] = $value;
            }//*/
            //    $c = rtrim($c,", ");
			//print_r("UPDATE $table SET $set WHERE 1=1 and ".$where);
            $stmt =  $this->db->prepare("UPDATE $table SET $set WHERE 1=1 and ".$where);
			//print_r(json_encode($stmt,JSON_NUMERIC_CHECK))			
            $stmt->execute();
            $affected_rows = $stmt->rowCount();
			$response["data"] = $stmt;
            if($affected_rows<=0){
                $response["status"] = "warning";
                $response["message"] = "No row updated";
            }else{
                $response["status"] = "success";
                $response["message"] = $affected_rows." row(s) updated in database";
            }
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = "Update Failed: " .$e->getMessage();
        }
		//print_r($response);
        return $response;
    }
    function update($table, $columnsArray, $where, $requiredColumnsArray){ 
		//print_r(json_encode($columnsArray,JSON_NUMERIC_CHECK));
		//print_r(json_encode($requiredColumnsArray,JSON_NUMERIC_CHECK));
        $this->verifyRequiredParams($columnsArray, $requiredColumnsArray);
        try{
            $a = array();
            $w = "";
            $c = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " = :".$key;
                $a[":".$key] = $value;
				
            }
            foreach ($columnsArray as $key => $value) {
                $c .= $key. " = :".$key.", ";
                $a[":".$key] = $value;
            }
                $c = rtrim($c,", ");
			print_r("UPDATE $table SET $c WHERE 1=1 ".$w);
            $stmt =  $this->db->prepare("UPDATE $table SET $c WHERE 1=1 ".$w);
			print_r(json_encode($stmt,JSON_NUMERIC_CHECK));		
            $stmt->execute($a);
            $affected_rows = $stmt->rowCount();
            if($affected_rows<=0){
                $response["status"] = "warning";
                $response["message"] = "No row updated";
            }else{
                $response["status"] = "success";
                $response["message"] = $affected_rows." row(s) updated in database";
            }
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = "Update Failed: " .$e->getMessage();
        }
		print_r($response);
        return $response;
    }
    function delete($table, $where){
        if(count($where)<=0){
            $response["status"] = "warning";
            $response["message"] = "Delete Failed: At least one condition is required";
        }else{
            try{
                $a = array();
                $w = "";
                foreach ($where as $key => $value) {
                    $w .= " and " .$key. " = :".$key;
                    $a[":".$key] = $value;
                }
				
                $stmt =  $this->db->prepare("DELETE FROM $table WHERE 1=1 ".$w);
				//print_r($stmt);
                $stmt->execute($a);
                $affected_rows = $stmt->rowCount();
				$response["DB"] = $affected_rows;
                if($affected_rows<=0){
                    $response["status"] = "warning";
                    $response["message"] = "No row deleted";
                }else{
                    $response["status"] = "success";
                    $response["message"] = $affected_rows." row(s) deleted from database";
                }
            }catch(PDOException $e){
                $response["status"] = "error";
                $response["message"] = 'Delete Failed: ' .$e->getMessage();
            }
        }
        return $response;
    }
    /*function selectP($name){
        // Select statement
        try{
            // $a = array();
            // $w = "";
            // // $where = array('name' => 'Ipsita Sahoo', 'uid'=>'170' );
            // foreach ($where as $key => $value) {
            //     $w .= " and " .$key. " like :".$key;
            //     $a[":".$key] = $value;
            // }
            // $stmt = $this->db->prepare("CALL `simpleproc`(@a);SELECT @a AS `param1`;");
            // $stmt->execute($a);
            // return $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt = $this->db->prepare("CALL $name(@resultId)"); 
            $stmt->execute(); 
            $stmt = $this->db->prepare("select @resultId as Id"); 
            $stmt->execute(); 
            $myResultId = $stmt->fetchColumn();

            print "procedure returned \n".$myResultId;
            
        }catch(PDOException $e){
            print_r('Query Failed: ' .$e->getMessage());
            return $rows=null;
            exit;
        }
    }*/
    function verifyRequiredParams($inArray, $requiredColumns) {
        $error = false;
        $errorColumns = "";
        foreach ($requiredColumns as $field) {
        // strlen($inArray->$field);
            if (!isset($inArray->$field) || strlen(trim($inArray->$field)) <= 0) {
                $error = true;
                $errorColumns .= $field . ', ';
            }
        }

        if ($error) {
            $response = array();
            $response["status"] = "error";
            $response["message"] = 'Required field(s) ' . rtrim($errorColumns, ', ') . ' is missing or empty';
            echoResponse(200, $response);
            exit;
        }
    }
	
	public function getSession(){
   
    $sess = array();
    if(isset($_SESSION['UserId']))
    {
        $sess["UserId"] = $_SESSION['UserId'];
        $sess["FirstName"] = $_SESSION['FirstName'];
        $sess["LastName"] = $_SESSION['LastName'];
        $sess["LastName"] = $_SESSION['LastName'];
        $sess["UserRowId"] = $_SESSION['UserRowId'];
    }
    else
    {
        $sess["UserId"] = '';
        $sess["FirstName"] = '';
        $sess["LastName"] = '';
        $sess["UserRowId"] = '';
    }
    return $sess;
}
public function destroySession(){
	
    if (!isset($_SESSION)) {
    //session_start();
    }
    if(isset($_SESSION['UserId']))
    {
        unset($_SESSION['UserId']);
        unset($_SESSION['FirstName']);
        unset($_SESSION['LastName']);
        unset($_SESSION['UserRowId']);
		//session_destroy();
        $info='info';
        if(isset($_COOKIE[$info]))
        {
            setcookie ($info, '', time() - $cookie_time);
        }
        $msg="Logged Out Successfully...";
		session_destroy();
    }
    else
    {
		session_destroy();
        $msg = "Not logged in...";
    }
    return $msg;
}
}

?>
