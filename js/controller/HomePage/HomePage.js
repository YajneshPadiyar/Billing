myApp.controller('HomePageController', function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, Constant, $q, $timeout) {
	var HomePage = this;
	HomePage.isAdmin = false;
	HomePage.Present = 0;
	HomePage.Leave = 0;
	HomePage.Absent = 0;
	Data.get("GetSessionStatus").then(function (result) {
		//console.log(result);
		if (result["Session"] == "Active") {}
		else {
			Data.toast2("info", "Your session is inactive.");
			$location.path('login');

		}
	});

	Data.post("GetSessionVal", {
		session : {
			"Type" : "IsAdmin"
		}
	}).then(function (result) {
		//console.log(result);
		if (result.status == "success") {
			if (result.status == "success") {
				HomePage.isAdmin = result.data;
				if (HomePage.isAdmin) {
					var gMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					var fromDate = new Date();
					//fromDate.setDate(fromDate.getDate());
					var fromDD = fromDate.getDate();
					var fromMMM = gMonths[fromDate.getMonth()];
					var fromYYYY = fromDate.getFullYear();
					var toDate = fromYYYY+"-"+(fromDate.getMonth()+1)+"-"+fromDD;
					/*
					SELECT FROM
					(
					//*/
					var Condition = "1=1";
					var Table = "(SELECT LEAVE_TYPE,COUNT(*) cnt FROM T_ATTENDANCE WHERE LEAVE_TYPE='Leave' AND ATTENDANCE_DATE='"+toDate+"') A, (SELECT LEAVE_TYPE,COUNT(*) cnt FROM T_ATTENDANCE WHERE LEAVE_TYPE='Present' AND ATTENDANCE_DATE='"+toDate+"') B, (SELECT COUNT(*) cnt FROM T_USER WHERE USER_NAME!='ADMIN') C";
					var Column = "A.LEAVE_TYPE Present,A.cnt PCnt,B.LEAVE_TYPE Leavet,B.cnt BCnt,'Absent' Absent,(C.cnt-(B.cnt+A.cnt)) ACnt";
					Data.post('GetListOfValues', {
						Config : {
							"Condition" : Condition,
							"Column" : Column,
							"Table" : Table
						}
					}).then(function (result) {
						//console.log(result);
						if (result.status = 'success') {
							var data = result.data;
							if (data.length > 0) {
								HomePage.Leave = data[0].PCnt ? data[0].PCnt : 0;
								HomePage.Present = data[0].BCnt ? data[0].BCnt : 0;
								HomePage.Absent = data[0].ACnt ? data[0].ACnt : 0;
							}
						}
					});
				}
			}

		} //*/
	});
	Data.get("GetSession").then(function (result) {
		//console.log(result);
		if (result["UserId"] == "") {
			//Data.toast2("info", "Please Login again. Do not refresh the page during the transaction.");
			//$location.path('login');
		} else {
			HomePage.FirstName = result["FirstName"];
			HomePage.LastName = result["LastName"];
			HomePage.Date = new Date().toDateString();
		}
	});

	//console.log("w");
	//});

	HomePage.StartBilling = function () {
		$location.path("StartTransaction");
	};
	HomePage.StartAddProduct = function () {
		$location.path("ListOfProducts");
	}
	HomePage.StartLogout = function () {
		DataStore.set("", "UserDetails");
		Data.get("CloseSession").then(function (r) {});
		$location.path('login');
		Data.toast2("info", "Logged out Successfully");
	};
	HomePage.GotoAdmin = function () {
		$location.path("AdminOptions");
		//HomePage.printDiv('Home');
	}
	HomePage.ManageEmployee = function () {
		$location.path("ManageEmployee");
		//HomePage.printDiv('Home');
	}

	HomePage.Reports = function () {
		$location.path("ReportsPage");
	}
	HomePage.ProcessReturn = function () {
		$location.path("ProcessReturn");
	}

	HomePage.RecentBills = function () {
		$location.path("RecentBills");
	}
	HomePage.printDiv = function (divName) {
		var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=300,height=300');
		popupWin.document.open();
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWin.document.close();
	}

	var TabRef = $("#celltblPausedDetails");

	var EnableEdit = false;
	var EnableHidden = false;
	var lastSel = "";
	TabRef.jqGrid({
		//url:'server.php?q=2',
		//data:dataset,
		height : '200',
		gridview : true,
		datatype : "local",
		colNames : ['Sl No', 'Bill Number', 'CustId', 'Date', 'Customer Name', 'User Name', 'Total Amount', 'Status'],
		colModel : [{
				name : 'SL_ID',
				index : 'SL_ID',
				width : 50,
				align : "center"
			}, {
				name : 'ROW_ID',
				index : 'ROW_ID',
				hidden : false,
				width : 150,
				align : "center"
			}, {
				name : 'CustId',
				index : 'CustId',
				width : 80,
				hidden : true
			}, {
				name : 'CREATED',
				index : 'CREATED',
				width : 150,
				editable : EnableEdit
			}, {
				name : 'CUSTNAME',
				index : 'CUSTNAME',
				width : 200,
				editable : EnableEdit,
				align : "center"
			}, {
				name : 'USERNAME',
				index : 'USERNAME',
				width : 130,
				editable : EnableEdit,
				align : "center"
			}, {
				name : 'TOTAL_AMOUNT',
				index : 'TOTAL_AMOUNT',
				width : 150,
				align : "left",
				editable : false,
				align : "center",
				formatter : 'number'
			}, {
				name : 'STATUS',
				index : 'STATUS',
				hidden : false,
				width : 100,
				formatter : ShowAsLink
			}
		],
		rowNum : 5,
		gridview : true,
		//rowList:[10,20,50],
		//pager: '#celltblTransNav',
		sortname : 'id',
		//footerrow : true,
		//userDataOnFooter : true,
		//viewrecords : true,
		sortorder : "desc",
		scroll : true,
		scrollrows : true,
		caption : "Paused Bills",
		emptyrecords : "No records to view",
		loadtext : "Refreshing Grid",
		forceFit : true,
		onSelectRow : function (id) {
			if (lastSel == "") {
				lastSel = id;
				LoadBillDetails(id);
			} else if (id == lastSel) {}
			else {
				//console.log(id);
				lastSel = id;
				LoadBillDetails(id);
			}
		}
	});
	function ShowAsLink(cellvalue, options, rowObject) {
		if (cellvalue == 'Paused') {
			return "<a class='link GoToTransaction' TransId='" + rowObject.ROW_ID + "' CustId='" + rowObject.CustId + "'>Resume</a>";
		} else {
			return cellvalue;
		}
	}
	$(".Wrapper").delegate(".GoToTransaction", "click", function () {
		//console.log($(this).attr("TransId"));
		var TransId = $(this).attr("TransId");
		var CustId = $(this).attr("CustId");
		Data.post("SetSessionVal", {
			session : {
				"Type" : "TransId",
				"Val" : TransId
			}
		});
		Data.post("SetSessionVal", {
			session : {
				"Type" : "CustId",
				"Val" : CustId
			}
		});
		$timeout(function () {
			$location.path("StartBilling");
		}, 300);
	});
	LoadRecentBill();
	function LoadRecentBill() {
		var gMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - 5);
		var fromDD = fromDate.getDate();
		var fromMMM = gMonths[fromDate.getMonth()];
		var fromYYYY = fromDate.getFullYear();
		var fromSDate = (fromDD < 10 ? "0" + fromDD : fromDD) + " " + fromMMM + " " + fromYYYY;
		var Condition = "T1.CUSTOMER_ID=T2.ROW_ID AND T1.USER_ID=T3.ROW_ID AND T1.STATUS='Paused' AND DATE_FORMAT(T1.CREATED,'%d %b %Y')>='" + fromSDate + "' ORDER BY T1.CREATED DESC";
		var Table = "T_TRANSACTION T1,T_CUSTOMER T2,T_USER T3";
		var Column = "T1.CUSTOMER_ID CustId,T1.ROW_ID,DATE_FORMAT(T1.CREATED,'%d %b %Y') CREATED,CONCAT(T2.FIRST_NAME,', ',T2.LAST_NAME) CUSTNAME,T3.USER_NAME USERNAME,T1.TOTAL_AMOUNT,T1.STATUS";
		Data.post('GetListOfValues', {
			Config : {
				"Condition" : Condition,
				"Column" : Column,
				"Table" : Table
			}
		}).then(function (result) {
			if (result.status == "success") {
				TabRef.jqGrid('clearGridData');
				var dataLen = result.data.length;
				for (var i = 0; i < dataLen && i < 1000; i++) {
					result.data[i].SL_ID = i + 1;
					result.data[i].id = result.data[i].ROW_ID;
					TabRef.jqGrid('addRowData', result.data[i].ROW_ID, result.data[i]);
					//TabRef.setGridParam({page:1}).trigger("reloadGrid")
				}

				var TransId = result.data[0].id;
			} else {
				TabRef.jqGrid('clearGridData');
				//Data.toast(result);
			}
		});
	}

});
