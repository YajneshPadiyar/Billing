//var RegisterControl = angular.module('RegisterController',[]);

myApp.controller('RegisterController', function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore) {
	var LoginCon = this;
	if ($location.path() == "/RegistrationSuccess") {
		LoginCon.UserName = DataStore.get("UserName");
	} else if ($location.path() == "/ResetPassword") {
		LoginCon.UserName = "";
		Data.get("GetSession").then(function (result) {
			//console.log(result);
			if (result["UserId"] == "") {
				Data.toast2("info", "Please Login again. Do not refresh the page during the transaction.");
				$location.path('login');
			} else {
				LoginCon.FirstName = result["FirstName"];
				LoginCon.LastName = result["LastName"];
				LoginCon.UserName = result["UserId"];
			}
		});

	}
	
	$scope.imageUpload = function(event){ 
	    var files = event.target.files; //FileList object 
	    var file = files[files.length-1];  
	    LoginCon.file = file;
	    var reader = new FileReader();
	    reader.onload = $scope.imageIsLoaded; 
	    reader.readAsDataURL(file); 
	}
	
	$scope.imageIsLoaded = function(e){  
	    $scope.$apply(function() {
	    	LoginCon.step = e.target.result; 
	    });
	} 
	
	//console.log($location.path());
	LoginCon.GoToLogin = function () {
		$location.path('login');
	}
	LoginCon.Register = function () {
		/*LoginCon.FirstName = "Test";
		LoginCon.LastName = "Last";
		LoginCon.Password = "123";
		LoginCon.rePassword = "123";
		LoginCon.AdminPassword = "admin1";
		LoginCon.AdminUsername = "admin";
		LoginCon.PhoneNumber = 9884977713;//*/

		Data.uploadImg(
			'UploadImg', {
			data : 'xx'
		}, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function (results) {
			console.log(results);
		});
		var sFirstName = LoginCon.FirstName.toUpperCase();
		var sLastName = LoginCon.LastName.toUpperCase();
		//var sUsername = LoginCon.Username;
		var sPassword = LoginCon.Password;
		var srePassword = LoginCon.rePassword;
		var sPhoneNumber = LoginCon.PhoneNumber;
		var sAdminPassword = LoginCon.AdminPassword;
		var sAdminUsername = LoginCon.AdminUsername;
		var sEmail = LoginCon.Email ? LoginCon.Email.toLowerCase() : "NA@NA.COM";
		LoginCon.Email = sEmail;
		var result;

		LoginCon.isError = false;
		if (!sPassword || !sFirstName || !sLastName || !srePassword || !sPhoneNumber || !sAdminPassword || !sAdminUsername) {
			LoginCon.ErrorMessage = "Please Enter the Required Fields";
			Data.toast2("warning", LoginCon.ErrorMessage);
			LoginCon.isError = true;
		} else if (sPassword != srePassword) {
			LoginCon.ErrorMessage = "Password and re-entered Password do not match. Please re-enter the Passwords.";
			Data.toast2("warning", LoginCon.ErrorMessage);
			LoginCon.isError = true;
		} else if (/^[a-zA-Z0-9- ]*$/.test(sFirstName) == false || /^[a-zA-Z0-9- ]*$/.test(sLastName) == false) {
			//alert('Your search string contains illegal characters.');
			LoginCon.ErrorMessage = "Fist Name or Last Name cannot have special characters";
			Data.toast2("warning", LoginCon.ErrorMessage);
		} else {

			LoginCon.UserName = GetUserName(sFirstName, sLastName);

			Data.post('login', {
				customer : {
					Username : sAdminUsername,
					Password : sAdminPassword
				}
			}).then(function (results) {
				if (results.status == "success") {
					Data.post('Register', {
						customer : LoginCon
					}).then(function (results) {
						//console.log(results);
						if (results["status"] = "success") {
							$location.path('RegistrationSuccess');
							LoginCon.UserName = results["UserName"];
							//console.log(LoginCon.UserName);
							DataStore.set(LoginCon.UserName, "UserName");
							//console.log(DataStore.get("UserName"));
							results["message"] = "Registration Successfull";
							Data.toast(results);
						}
					});
				} else {
					//console.log(results.message);
					results.message = "Invalid Admin Details";
					Data.toast(results);
					//console.log(results);
				}
			});

		}

	};

	function GetUserName(sFirstName, sLastName) {
		var FNLen = sFirstName.length;
		var LNLen = sLastName.length;
		var sUserName = "";
		if (FNLen >= 4) {
			sUserName = sFirstName + sLastName.substring(0, 1);
		} else if (FNLen >= 3 && LNLen >= 2) {
			sUserName = sFirstName + sLastName.substring(0, 2);
		} else if (FNLen >= 2 && LNLen >= 3) {
			sUserName = sFirstName + sLastName.substring(0, 3);
		} else if (FNLen >= 1 && LNLen >= 4) {
			sUserName = sFirstName + sLastName.substring(0, 4);
		} else {
			sUserName = 'BIL' + sFirstName + sLastName;
		}

		return sUserName;
	}

	LoginCon.PasswordReset = function () {
		var oldPassword = LoginCon.OldPassword;
		var newPassword = LoginCon.NewPassword;
		var newRePassword = LoginCon.reNewPassword;
		var result = {};
		LoginCon.isError = false;
		LoginCon.ErrorMessage = "";
		result.status = "error";
		if (oldPassword && newPassword && newRePassword) {
			if (newPassword.length != newRePassword.length || newPassword != newRePassword) {
				result.message = "Please enter the confimation/re-enter password correctly.";
				LoginCon.ErrorMessage = result.message;
				LoginCon.isError = true;
				Data.toast(result);
				LoginCon.NewPassword = "";
				LoginCon.reNewPassword = "";
			} else if (oldPassword == newPassword) {
				result.message = "Your new password cannot be same as old password.";
				LoginCon.ErrorMessage = result.message;
				LoginCon.isError = true;
				Data.toast(result);
				LoginCon.NewPassword = "";
				LoginCon.reNewPassword = "";
			} else {
				Data.post('ResetPassword', {
					customer : LoginCon
				}).then(function (results) {
					if (results["status"] = "success") {
						$location.path('login');
						results["message"] = "Password Reset Successfull";
						Data.toast(results);
					}
				});
			}
		} else {
			result.message = "Please enter the details in all the fields";
			LoginCon.ErrorMessage = result.message;
			LoginCon.isError = true;
			Data.toast(result);
		}
	}
});
