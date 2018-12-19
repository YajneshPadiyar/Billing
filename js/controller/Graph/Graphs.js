myApp.controller('ReportsController', function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore) {
	var RptOpt = this;
	
	RptOpt.Goto = function(Type){
		switch(Type){
			case "Home":
				$location.path('HomePage');
			break;
			case "SalesReport":
				$location.path('ReportsPage');
			break;
			case "SalesProductType":
				$location.path('ReportByProductSale');
			break;
		}
	}
	RptOpt.GenerateRpt = function (Type){
		$(".SubMenu .Button.Active").toggleClass("Active");
		switch(Type){
			case "Weekly" :{
				var Condition = "CREATED>=CURDATE()-14 AND T1.TYPE='NEW_BILL' GROUP BY label";
				var Table = "T_TRANSACTION T1";
				var Column = "DATE_FORMAT(T1.CREATED,'%d %b') label,SUM(T1.TOTAL_AMOUNT) value";
				$(".SubMenu .Button.Week").toggleClass("Active");
				break;
			}
			case "Monthly" :{
				var Condition = "CREATED>=CURDATE()-365 AND T1.TYPE='NEW_BILL' GROUP BY label";
				var Table = "T_TRANSACTION T1";
				var Column = "DATE_FORMAT(T1.CREATED,'%b') label,SUM(T1.TOTAL_AMOUNT) value";
				$(".SubMenu .Button.Month").toggleClass("Active");
				break;
			}
			case "Yearly" :{
				var Condition = "CREATED>=CURDATE()-(365*5) AND T1.TYPE='NEW_BILL' GROUP BY label";
				var Table = "T_TRANSACTION T1";
				var Column = "DATE_FORMAT(T1.CREATED,'%Y') label,SUM(T1.TOTAL_AMOUNT) value";
				$(".SubMenu .Button.Year").toggleClass("Active");
				break;
			}		
		}
		InitialiseDailyReport(Column,Table,Condition);
	}
	RptOpt.DateChange = function(){
		//console.log(RptOpt.DateRange);
		InitialiseProductSaleReport(RptOpt.DateRange);
	}
	
	var path = $location.path();
	switch (path) {
	case "/ReportsPage":
		RptOpt.GenerateRpt("Weekly");
		//InitialiseDailyReport();
		//InitialiseProductSaleReport();
		break;
	case "/ReportByProductSale":
		RptOpt.DateRange = new Date();
		InitialiseProductSaleReport(RptOpt.DateRange);
	break;
	default:
	}
	
	function InitialiseDailyReport(Column,Table,Condition) {
		//SELECT DATE_FORMAT(T1.CREATED,'%d %b %Y') label,SUM(T1.TOTAL_AMOUNT) FROM `t_transaction` T1 WHERE CREATED>CURDATE()-10 GROUP BY label
		$scope.SalesData = [{
						key : "Cumulative Return",
						values : [{}]
					}
				];
		Data.post('GetListOfValues', {
			Config : {
				"Condition" : Condition,
				"Column" : Column,
				"Table" : Table
			}
		}).then(function (result) {
			if (result.status == "success") {
				//console.log(result);
				var data = result.data;
				$scope.SalesData = [{
						key : "Cumulative Return",
						values : data
					}
				];

			}
		});
	}
	function InitialiseProductSaleReport(sDate){
		var gMonths =  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var dd = sDate.getDate();
		//console.log(gMonths);
		var MMM = gMonths[sDate.getMonth()];
		var YYYY = sDate.getFullYear();
		var SDate = (dd<10?"0"+dd:dd)+" "+MMM+" "+YYYY;
		//SELECT DATE_FORMAT(T1.CREATED,'%d %b') label,T3.PRODUCT_NAME value,COUNT(*) Total FROM t_transaction T1, t_bill_details T2, t_product T3 WHERE T1.ROW_ID = T2.TRANS_ID AND T3.ROW_ID = T2.PRODUCT_ID AND T1.STATUS = 'Done' AND T1.CREATED>=CURDATE()-14 GROUP BY label,value 
		//SELECT DATE_FORMAT(T1.CREATED,'%d %b') label,T3.PRODUCT_NAME value,COUNT(*) Total FROM t_transaction T1, t_bill_details T2, t_product T3 WHERE T1.ROW_ID = T2.TRANS_ID AND T3.ROW_ID = T2.PRODUCT_ID AND T1.STATUS = 'Done' AND DATE_FORMAT(T1.CREATED,'%d %b')='17 Sep' GROUP BY label,value
		var Condition = "T1.ROW_ID = T2.TRANS_ID AND T3.ROW_ID = T2.PRODUCT_ID AND T1.STATUS = 'Done' AND T1.TYPE='NEW_BILL' AND DATE_FORMAT(T1.CREATED,'%d %b %Y')='"+SDate+"' GROUP BY label";
		var Table = "t_transaction T1, t_bill_details T2, t_product T3";
		var Column = "T3.TYPE label,COUNT(*) value";
		Data.post('GetListOfValues', {
			Config : {
				"Condition" : Condition,
				"Column" : Column,
				"Table" : Table
			}
		}).then(function (result) {
			if (result.status == "success") {
				//console.log(result);
				var data = result.data;
				var dataLen = data.length;
				var Out = {};
				var aOut = new Array();
				
				Out = [{"key":"Cumulative Return","bar":true,"values":data}];
				//debugger;
				//console.log(Out);
				$scope.SalesSalesByTypeData = Out;
			}else{
				$scope.SalesSalesByTypeData = [{"key":"Cumulative Return","bar":true,"values":[{}]}];
			}
		});
	}
	$scope.SalesOptions = {
		chart : {
			type : 'discreteBarChart',
			height : 700,
			margin : {
				top : 50,
				right : 20,
				bottom : 50,
				left : 100
			},
			x : function (d) {
				return d.label;
			},
			y : function (d) {
				return d.value/1000;
			},
			showValues : true,
			valueFormat : function (d) {
				return 'Rs. '+d3.format(',.0f')(d/1000)+' K';
			},
			duration : 5000,
			xAxis : {
				axisLabel : 'Date ->',
				axisLabelDistance : 100
			},
			yAxis : {
				axisLabel : 'Total Sales (Rs.) ->',
				axisLabelDistance : 1000
			}
		}
	};

	$scope.SalesByTypeOptions = {
		chart : {
			type : 'discreteBarChart',
			height : 500,
			margin : {
				top : 50,
				right : 20,
				bottom : 50,
				left : 100
			},
			x : function (d) {
				return d.label;
			},
			y : function (d) {
				return d.value;
			},
			showValues : true,
			valueFormat : function (d) {
				return d3.format(',.0f')(d);
			},
			duration : 500,
			xAxis : {
				axisLabel : 'Type ->'
			},
			yAxis : {
				axisLabel : 'Total Count',
				axisLabelDistance : 10
			},
			title : {
				enable : true,
				text : "Daily Sales Report",
				className : 'h4'
			}
		}
	};

	
	
});
