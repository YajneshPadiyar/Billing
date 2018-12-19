myApp.controller('AddNewController',
	function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore) {
	var TransAction = this;
	TransAction.Email = "";
	/*Data.post("SetSessionVal", {
	session : {
	"Type" : 'x',"Val":"Wroking..."
	}
	}).then(function (result) {
	console.log(result);
	});
	Data.post("GetSessionVal", {
	session : {
	"Type" : 'x'
	}
	}).then(function (result) {
	console.log(result);
	});//*/
	Data.get("GetSession").then(function (result) {
		//console.log(result);
		if (result["UserId"] == "") {
			Data.toast2("info", "Please Login again. Do not refresh the page during the transaction.");
			$location.path('login');
		} else {
			//TransAction.FirstName = result["FirstName"];
			//TransAction.LastName = result["LastName"];
		}
	});

	TransAction.AddCustomer = function () {
		var FirstName = TransAction.FirstName;
		var LastName = TransAction.LastName;
		var PhNumber = TransAction.PhoneNumber.toString();
		var Email = TransAction.Email;
		var data= {};
		 data.FirstName = FirstName;
  		 data.LastName = LastName;
		 data.PhoneNumber = PhNumber;
		 data.Email = Email;
		 //console.log(data);
		 
		 if (!FirstName || !LastName || !PhNumber) {
			Data.toast2("warning", "Plese enter all the required fields.");
		 }
		else if(typeof(Email) == "undefined"){
			Data.toast2("warning", "Please enter valid eMail address.");
		} else if(PhNumber.length != 10){
			Data.toast2("warning", "Phone Number should of 10 digits.");
		} else {
			if(Email && Email.length>0){
				var atpos = Email.indexOf("@");
				var dotpos = Email.lastIndexOf(".");
				if (atpos<1 || dotpos<atpos+2 || dotpos+2>=Email.length) {
					Data.toast2("warning", "Please enter valid eMail address.");
					return;
				}
			}
		 data.FirstName = FirstName.toUpperCase();
  		 data.LastName = LastName.toUpperCase();
		 data.PhoneNumber = PhNumber;
		 data.Email = Email.toUpperCase();
			Data.post("AddCustomer", {
				Customer : data
			}).then(function (result) {
				Data.toast(result);
				var data = [];
				data[0] ={
					"FIRST_NAME":result.dataReq.FirstName,"LAST_NAME":result.dataReq.LastName,"EMAIL":result.dataReq.Email,"ROW_ID":result.data.data,"PH_NUM_1":result.dataReq.PhoneNumber
				}
				//console.log(JSON.stringify(result.dataReq));
				Data.post("SetSessionVal", {
					session : {
						"Type" : 'CustomerDetails',
						"Val" : JSON.stringify(data)
					}
				}).then(function (result) {
					//console.log(result);
					$location.path("SearchCustomerResult");
				});
			});
		}

	};

});
