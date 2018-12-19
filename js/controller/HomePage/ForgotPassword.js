
	
myApp.controller('ForgotPasswordController',function(){
		var LoginCon = this;
		LoginCon.Register = function(){
			var sFirstName = LoginCon.FirstName;
			var sLastName = LoginCon.LastName;
			var sUsername = LoginCon.Username;
			var sPassword = LoginCon.Password;
			var srePassword = LoginCon.rePassword;
			var sPhoneNumber = LoginCon.PhoneNumber;
			var sEmail = LoginCon.Email;
			//console.log($scope.isError);
			console.log(sFirstName);
			console.log(sLastName);
			console.log(sUsername);
			console.log(srePassword);
			console.log(sPhoneNumber);
			console.log(sEmail);
			LoginCon.isError=false;
			if(!sUsername || !sPassword || !sFirstName || !sLastName || !srePassword || !sPhoneNumber){
				LoginCon.ErrorMessage = "Please Enter the Required Fields";
				///alert(LoginCon.ErrorMessage);
				LoginCon.isError=true;
			}
		};
		
		
	});