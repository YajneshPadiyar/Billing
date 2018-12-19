myApp.controller('PrintBill',
	function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, $timeout, $q, $log) {
	var Bill = this;
	Bill.Source = null;
	//$rootScope.title = $routeParams.title;
	//StartBill.CustDetails =[];
	Data.post("GetSessionVal", {
		session : {
			"Type" : "CustId"
		}
	}).then(function (result) {
		//console.log(result);
		if (result.status == "success") {
			if (result.status == "success") {
				if(result.data == "XX"){
					$location.path('HomePage');
				}							
			}
			
		} //*/
	});
	
	Data.post("GetSessionVal", {
		session : {
			"Type" : "BillFileName"
		}
	}).then(function (result) {
		//console.log(result);
		if (result.status == "success") {
			Bill.Source = "fileSystem/Bill/"+result.data+"?random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
			Bill.BillReceipt = result.data;
			//$(".DisplayBill").attr('src',Bill.Source);
		}
	});
	Data.post("GetSessionVal", {
		session : {
			"Type" : "TransId"
		}
	}).then(function (result) {
		//console.log(result);
		if (result.status == "success") {
			Bill.TransId = result.data;
			//$(".DisplayBill").attr('src',Bill.Source);
		}
	});
	
	Bill.UpdateStock = function(){
		Data.post("DoneTransaction",{
			session:{
				"TransId":Bill.TransId,
				"BillReceipt":Bill.BillReceipt
				}
		}).then(function(result){
			console.log("Done");
		});
		
		
		Data.post("SetSessionVal", {
			session : {
				"Type" : 'CustId',
				"Val" : "XX"
			}
		}).then(function (result) {});//*/
		Data.post("SetSessionVal", {
			session : {
				"Type" : 'TransId',
				"Val" : "XX"
			}
		}).then(function (result) {});//*/
		
		$location.path('HomePage');
	}
	
	});