//var LoginControl = angular.module('LoginController',[]);

myApp.controller('LoginController', function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, Constant, $timeout) {
	var LoginCon = this;
	LoginCon.AdminVal = false;
	LoginCon.AdminRoleName = "NA";
	LoginCon.AppTitle = Constant.AppTitle;
	LoginCon.AppTagLine = Constant.AppTagLine;
	Data.get("CloseSession").then(function (r) {});

	LoginCon.EnterKeyPress = function ($event) {
		//console.log($event.keyCode);
		if ($event.keyCode == 13) {
			LoginCon.Login(LoginCon);
		}
	}

	var Condition = "BACKEND_VALUE='Admin' AND CATEGEORY='T_APP_ROLE'";
	var Table = "T_OPTIONS A";
	var Column = "*";

	Data.post('GetListOfValues', {
		Config : {
			"Condition" : Condition,
			"Column" : Column,
			"Table" : Table
		}
	}).then(function (result) {
		//console.log(result);
		var data = result.data;
		for (k in data) {
			if (data[k].BACKEND_VALUE == "Admin") {
				LoginCon.AdminVal = true;
				LoginCon.AdminRoleName = data[k].DISPLAY_VALUE;
				break;
			}
		}
	});

	LoginCon.Login = function (DataLogin) {
		var sUsername = DataLogin.Username;
		var sPassword = DataLogin.Password;

		LoginCon.isError = false;
		if (!sUsername || !sPassword) {
			LoginCon.ErrorMessage = "Username or Password is invalid";
			///alert(LoginCon.ErrorMessage);
			LoginCon.isError = true;
		} else {
			Data.post('login', {
				customer : DataLogin
			}).then(function (results) {
				if (results.status == "success") {
					var URole = results.UserRole;
					var URoleLen = URole.length;
					if (URoleLen == 0) {
						Data.toast2("warning", "No role is set up for the user. Please contact your manager for furthre information.");
					}
					else {
						for (var i = 0; i < URoleLen; i++) {
							//console.log(URole[i].ROLE_NAME);
							if (LoginCon.AdminVal && URole[i].ROLE_NAME == LoginCon.AdminRoleName) {
								//console.log("Admin");
								Data.post("SetSessionVal", {
									session : {
										"Type" : 'IsAdmin',
										"Val" : true
									}
								}).then(function (result) {});
							}
						}
						$timeout(function () {
							$location.path('HomePage');
						}, 300);

						Data.toast(results);
					}
					
				} else if (results.action == 'PasswordReset') {
					$location.path('ResetPassword');
					Data.toast(results);
				} else {
					//console.log(results.message);
					Data.toast(results);
				}
			});
		}
	};

});
