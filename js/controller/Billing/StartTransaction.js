myApp.controller('TransActionController',
	function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore) {
	var TransAction = this;

	Data.get("GetSession").then(function (result) {
		//console.log(result);
		if (result["UserId"] == "") {
			Data.toast2("info", "Please Login again. Do not refresh the page during the transaction.");
			$location.path('login');
		} else {
			TransAction.UserId = result["UserRowId"];
			//console.log(TransAction.UserId);
		}
	});
	Data.post("GetSessionVal",{
		session:{
			"Type" : "TransId"	
		}
	}).then(function(result){
		if(result.status == "success"){
			if(result.data == "NEW"){
					
			}else{
				Data.post("CloseTransaction",{
					session:{"TransId":result.data,"Type":"TransId"}
				});
			}
		}else{
			Data.post("SetSessionVal",{
			session:{
				"Type": "TransId",
				"Val" : "NEW"
			}
		});
		}
	});
	
		
	//console.log($location.path());
	if ($location.path() == "/SearchCustomerResult") {
		//console.log("SearchCustomer");
		Data.post("GetSessionVal", {
			session : {
				"Type" : 'CustomerDetails'
			}
		}).then(function (result) {

			var sdata = JSON.parse(result.data);
			TransAction.sData = [];
			//console.log(sdata[0]);

			if (sdata.length > 5) {
				TransAction.CurrentPage = 0;
				TransAction.PagerInfo = "1 - 5 of " + sdata.length;
				for (var i = 0; i < 5; i++) {
					TransAction.sData[i] = sdata[i];
				}
				//TransAction.NxtDisable = true;
				TransAction.PrvDisable = true;
			} else {
				TransAction.NxtDisable = true;
				TransAction.PrvDisable = true;
				TransAction.PagerInfo = (1) + " - " + sdata.length + " of " + sdata.length;
				TransAction.sData = sdata;
			}

		});
	}
	TransAction.AddNewCustomer = function () {
		$location.path('AddCustomer');
	}
	TransAction.GoToHome = function () {
		$location.path('HomePage');
	}
	TransAction.NewTransaction = function(RowId){
		var CustId = RowId.target.id;
		CustId = CustId.substring("CustomerId".length,CustId.length);
		//console.log(CustId);
		Data.post("SetSessionVal",{
			session:{
				"Type": "CustId",
				"Val" : CustId
			}
		});
		Data.post("NewTransaction",{
			session: {
				"UserId":TransAction.UserId,
				"CustId":CustId,
				"Type":"TransId",
				"TransType":"NEW_BILL"
				}			
		});
		//console.log("NewTrans");
		$location.path('StartBilling');
	}
	TransAction.Navigate = function (Direction) {

		Data.post("GetSessionVal", {
			session : {
				"Type" : 'CustomerDetails'
			}
		}).then(function (result) {

			var sdata = JSON.parse(result.data);
			var sdataLen = sdata.length;
			var totalPage = Math.ceil(sdataLen / 5);
			var currPage = TransAction.CurrentPage;
			//console.log(currPage);
			//TransAction.sData=[];
			//console.log(sdata[0]);
			var inc = 5;
			if (sdataLen > inc) {
				var newStart = 0;
				var loadData = false;
				if (Direction == "Next") {
					//console.log("Next");
					//console.log(currPage+' - '+totalPage);
					if(totalPage == currPage+2){
							TransAction.NxtDisable = true;
					}
					if (totalPage > currPage + 1) {
						TransAction.CurrentPage = currPage + 1;
						newStart = (currPage + 1) * 5;
						loadData = true;						
						TransAction.PrvDisable = false;
					} else {
						return;
					}
				} else {
					//console.log(currPage+' - '+totalPage);
					
					if(currPage-1 == 0){
							TransAction.PrvDisable = true;
						}
					if (currPage - 1 >= 0) {
						TransAction.CurrentPage = currPage - 1;
						newStart = (currPage - 1) * 5
						loadData = true;
						TransAction.NxtDisable = false;
						
					} else {
						return;
					}
				}
				if (loadData) {

					var x = new Array();
					loadData = false;
					for (var i = newStart; i < (newStart + inc) && i < sdataLen; i++) {
						//if(i < sdataLen){
						loadData = true;
						x[i - newStart] = sdata[i];
						//}else{
						//TransAction.sData[i-newStart] = {};
						//}
					}
					//console.log(x.length + '-' + newStart);
					if (loadData) {
						TransAction.PagerInfo = (newStart + 1) + " - " + (newStart + 5 > sdataLen ? sdataLen : newStart + 5) + " of " + sdataLen;
						TransAction.sData = x;
					}
				}
			} else {
				TransAction.NxtDisable = true;
				TransAction.PrvDisable = true;
				TransAction.PagerInfo = (1) + " - " + sdata.length + " of " + sdata.length;
				TransAction.sData = sdata;
			}

		});
	}
	TransAction.EnterKeyPress = function ($event) {
		//console.log($event.keyCode);
		if ($event.keyCode == 13) {
			TransAction.SearchCustomer();
		}
	}
	TransAction.SearchCustomer = function () {
		var PhNum = TransAction.PhoneNumber;
		var FirstName = TransAction.FirstName;
		var LastName = TransAction.LastName;
		if (PhNum || (FirstName && LastName)) {
			if (!FirstName || !LastName) {
				FirstName = "XX";
				LastName = "XX";
			}
			if (!PhNum) {
				PhNum = 'XX';
			}
			PhNum = PhNum.toUpperCase();
			FirstName = FirstName.toUpperCase();
			LastName = LastName.toUpperCase();
			Data.post('SearchCustomer', {
				Customer : {
					"FirstName" : FirstName,
					"LastName" : LastName,
					"PhoneNumber" : PhNum
				}
			}).then(function (result) {
				if (result["status"] == "success") {
					var data = result["data"];
					//console.log(data.length);
					//var dataStr = JSON.strinfy
					Data.post("SetSessionVal", {
						session : {
							"Type" : 'CustomerDetails',
							"Val" : JSON.stringify(data)
						}
					}).then(function (result) {});
					$location.path("SearchCustomerResult");
				} else {
					Data.toast2("info", "Customer not found. Please continue to add new customer.");
				}
			});
		} else {
			Data.toast2("info", "Please enter the required fields.");
		}
	};
	
	TransAction.SearchExistingBill = function (){
		var BillNum = TransAction.BillNumber;
		if(BillNum){
			Data.post('SearchBillNumber', {
				Bill : {
					"BillNumber" : BillNum
				}
			}).then(function (result) {
				if (result["status"] == "success") {
					var data = result["data"];
					//console.log(data.length);
					//var dataStr = JSON.strinfy
					data = data[0];
					var CustId = data.CUSTOMER_ID;
					var TransId = data.ROW_ID;
					
					Data.post("SetSessionVal", {
						session : {
							"Type" : 'CustId',
							"Val" : CustId
						}
					}).then(function (result) {});
					
					Data.post("SetSessionVal", {
						session : {
							"Type" : 'TransId',
							"Val" : TransId
						}
					}).then(function (result) {});
					
					//console.log(CustId+TransId);
					$location.path("ExistingBillDetails");
				} else {
					Data.toast2("info", "Could not find the Bill Number please try again.");
				}
			});
		}else{
			Data.toast2("info", "Please enter the Existing Bill Number.");
		}
	}
	

});
