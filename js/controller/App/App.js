var myApp = angular.module('loginPage', ['ngRoute', 'ngAnimate', 'toaster','ngMaterial','nvd3']);

myApp.config(['$routeProvider',
		function ($routeProvider) {
			
			$routeProvider.
			when('/login', {
				templateUrl : 'views/login/login.html',
				title : "Billing"
			}).when('/ResetPassword', {
				templateUrl : 'views/login/ResetPassword.html',
				title : "Billing : Password Reset"
			}).when('/register', {
				templateUrl : 'views/login/Register.html',
				title : "Billing : Register User"
			}).
			when('/forgotPassword', {
				templateUrl : 'views/login/Register.html',
				title : "Forgot Password"
			}).
			when('/RegistrationSuccess', {
				templateUrl : 'views/login/RegistrationSuccess.html',
				title : "Registration Successful"
			}).
			when('/HomePage', {
				templateUrl : 'views/home/HomePage.html',
				title : "Home"
			}).
			when('/AddProduct', {
				templateUrl : 'views/product/AddProduct.html',
				title : "Add Product"
			}).
			when('/AddProductSuccess', {
				templateUrl : 'views/product/AddProductSuccess.html',
				title : "Add Product Successful"
			}).
			when('/StartTransaction', {
				templateUrl : 'views/transaction/Starttransaction.html',
				title : "Search Customer"
			}).
			when('/AddCustomer', {
				templateUrl : 'views/transaction/AddCustomer.html',
				title : "New Customer"
			}).
			when('/SearchCustomerResult', {
				templateUrl : 'views/transaction/SearchCustomerResult.html',
				title : "Customer List"
			}).
			when('/StartBilling', {
				templateUrl : 'views/transaction/StartBilling.html',
				title : "Start Billing"
			}).
			when('/AdminOptions', {
				templateUrl : 'views/admin/AdminOptions.html',
				title : "Billing Admin"
			}).
			when('/AdminOptionsEdit', {
				templateUrl : 'views/admin/AdminOptionsEdit.html',
				title : "Billing Admin"
			}).
			when('/AdminOptionsNew', {
				templateUrl : 'views/admin/AdminOptionsNew.html',
				title : "Billing Admin"
			}).
			when('/GridExample', {
				templateUrl : 'views/admin/GridExample.html',
				title : "Billing Admin"
			}).
			when('/AddOptions', {
				templateUrl : 'views/admin/AddOptions.html',
				title : "Add/Edit Options"
			}).
			when('/ManageStore', {
				templateUrl : 'views/admin/ManageStore.html',
				title : "Add/Manage Store"
			}).
			when('/ManageUser', {
				templateUrl : 'views/admin/ManageUser.html',
				title : "Add/Manage User"
			}).
			when('/ManageTax', {
				templateUrl : 'views/admin/ManageTax.html',
				title : "Add/Manage Tax"
			}).
			when('/ListOfProducts', {
				templateUrl : 'views/product/ListofProducts.html',
				title : "Add/Stock List"
			}).
			when('/PrintBill', {
				templateUrl : 'views/transaction/PrintBill.html',
				title : "Bill Print"
			}).
			when('/PrintBarCode', {
				templateUrl : 'views/product/PrintBarCode.html',
				title : "Print Barcode"
			}).
			when('/SearchExistingBill', {
				templateUrl : 'views/transaction/SearchExistingBill.html',
				title : "Search Existing Bill"
			}).
			when('/ExistingBillDetails', {
				templateUrl : 'views/transaction/ExistingBillDetails.html',
				title : "Existing Bill Details"
			}).
			when('/RecentBills', {
				templateUrl : 'views/transaction/RecentBills.html',
				title : "Recent Bill Details"
			}).
			when('/ProcessReturn', {
				templateUrl : 'views/transaction/ProcessReturn.html',
				title : "Recent Bill Details"
			}).
			when('/ReportsPage',{
				templateUrl : 'views/reports/SalesReports.html',
				title : "Sales Reports"
			}).
			when('/ReportByProductSale',{
				templateUrl : 'views/reports/SalesReportsByType.html',
				title : "Reports By Product"
			}).
			when('/ManageEmployee',{
				templateUrl : 'views/admin/ManageEmployee.html',
				title : "Employee Management"
			}).
			when('/AttendanceList',{
				templateUrl : 'views/admin/AttendanceList.html',
				title : "Employee Management"
			}).
			when('/ApplyLeave',{
				templateUrl : 'views/admin/ApplyLeave.html',
				title : "Employee Management"
			}).
			otherwise({
				redirectTo : '/login'
			});
		}
	]).run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if(current.$$route.title){
		$rootScope.title = current.$$route.title;
		}
		//console.log($rootScope.title);
    });
	}
	]);
	
	