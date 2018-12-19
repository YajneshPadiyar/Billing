<html ng-app="loginPage">
	<head>
		<meta charset="UTF-8">
		<title ng-bind="title">Biller</title>
		<meta name="viewport" content="width=device-width, user-scalable=no">
		
		<link rel="stylesheet" href="js/lib/Guriddo_jqGrid_JS_5.1.0/css/ui.jqgrid.css"></link>
		<link rel="stylesheet" href="js/lib/Guriddo_jqGrid_JS_5.1.0/css/ui.jqgrid-bootstrap.css"></link>
		<link rel="stylesheet" href="js/lib/Guriddo_jqGrid_JS_5.1.0/css/ui.jqgrid-bootstrap-ui.css"></link>
		<link rel="stylesheet" href="js/lib/Guriddo_jqGrid_JS_5.1.0/css/jQuery-ui-custom.css"></link>
		<link rel="stylesheet" href="css/AppLogin.css"></link>
		<link rel="stylesheet" href="css/toaster.min.css"></link>
		
		<script src="js/lib/Guriddo_jqGrid_JS_5.1.0/js/jquery-1.11.0.min.js"></script>
		<script src="js/lib/Guriddo_jqGrid_JS_5.1.0/js/i18n/grid.locale-en.js"></script>
		<script src="js/lib/Guriddo_jqGrid_JS_5.1.0/js/jquery.jqGrid.min.js"></script>		
		<script src="js/lib/Guriddo_jqGrid_JS_5.1.0/src/grid.celledit.js"></script>		
		<script src="js/lib/angular.min.js"></script>
	
		<script src="js/lib/angular-route.min.js"></script>
		<script src="js/lib/angular-aria.min.js"></script>
		<script src="js/lib/angular-material.min.js"></script>
		<script src="js/lib/angular-animate.min.js"></script>
		<script src="js/lib/toaster.min.js"></script>	
		
			
		
		
		
		<script src="js/controller/App/App.js"></script>
		<script src="js/controller/App/Constant.js"></script>
		<script src="js/controller/App/data.js"></script>
		<script src="js/controller/App/directives.js"></script>
		<script src="js/controller/Login/Login.js"></script>
		<script src="js/controller/Login/Registration.js"></script>
		<script src="js/controller/App/TempService.js"></script>
		<script src="js/controller/HomePage/HomePage.js"></script>
		<script src="js/controller/Billing/AddProduct.js"></script>		
		<script src="js/controller/Billing/StartTransaction.js"></script>
		<script src="js/controller/Customer/AddNewCustomer.js"></script>
		<script src="js/controller/Billing/StartBilling.js"></script>
		<script src="js/controller/Admin/AdminOptions.js"></script>
		<script src="js/controller/Admin/GridExample.js"></script>
		<script src="js/controller/Admin/AddOptions.js"></script>
		
	</head>
	<body>
	<div class='ApplicationHeader'>
		<div class='ApplicationTitle'>Biller</div>
	</div>
	<div ng-view></div>
		</body>
		 <toaster-container toaster-options="{'time-out': 3000,'position-class':'toast-bottom-full-width','prevent-duplicates':true}"></toaster-container>
</html>