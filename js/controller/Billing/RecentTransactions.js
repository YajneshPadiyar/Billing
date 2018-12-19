myApp.controller('RecentTransactions',
	function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, $timeout, $q, $log) {
	var RecentTrans = this;
	

	Data.get("GetSession").then(function (result) {
		//console.log(result);
		if (result["UserId"] == "") {
			Data.toast2("info", "Please Login again. Do not refresh the page during the StartBill.");
			$location.path('login');
		} else {}
	});
	//console.log($location.path());

	
	RecentTrans.GoToHome = function () {
		$location.path('HomePage');
	}
	RecentTrans.NewStartBill = function (RowId) {
		var CustId = RowId.target.id;
		CustId = CustId.substring("CustomerId".length, CustId.length);
		//console.log(CustId);
	}
	
	RecentTrans.GotoPage = function (Page) {
		console.log("Page "+Page);
		switch (Page) {
		case "Home":
			$location.path("HomePage");
			break;
		case "NewTrans":
			$location.path("StartTransaction");
			break;
		case "PrintBill":
			$location.path("PrintBill");
			break;
		default:
		}
	}

	var TabRef = $("#celltblTrans");
	var TabRefDetails = $("#celltblTransDetails");
	var EnableEdit = false;
	var EnableHidden = false;
	var lastSel = "";
	TabRef.jqGrid({
		//url:'server.php?q=2',
		//data:dataset,
		height : '520',
		gridview: true,
		datatype : "local",
		colNames : ['Sl No','Bill Number', 'CustId','Date', 'Customer Name', 'User Name','Total Amount', 'Status'],
		colModel : [ {
				name : 'SL_ID',
				index : 'SL_ID',
				width : 50,
				align : "center"
			}, {
				name : 'ROW_ID',
				index : 'ROW_ID',
				hidden : false,
				width : 80,
				align : "center"
			},{
				name : 'CustId',
				index : 'CustId',
				width : 80,
				hidden:true
			},{
				name : 'CREATED',
				index : 'CREATED',
				width : 80,
				editable : EnableEdit
			}, {
				name : 'CUSTNAME',
				index : 'CUSTNAME',
				width : 150,
				editable : EnableEdit,
				align : "center"
			},{
				name : 'USERNAME',
				index : 'USERNAME',
				width : 100,
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
				width: 100,
				formatter: ShowAsLink
			}
		],
		rowNum:9999,
		gridview: true,
		//rowList:[10,20,50],
		//pager: '#celltblTransNav',
		sortname : 'id',
		//footerrow : true,
		//userDataOnFooter : true,
		//viewrecords : true,
		sortorder : "desc",
		scroll : true,
		scrollrows : true,
		caption:"Recent Bills",
		emptyrecords: "No records to view",
		loadtext: "Refreshing Grid",
		forceFit : true,
		onSelectRow	: function(id){
			if(lastSel == ""){
				lastSel = id;
				LoadBillDetails(id);
			}else if(id==lastSel){
				
			}else{
				//console.log(id);
				lastSel = id;
				LoadBillDetails(id);
			}
		}
	});
	function ShowAsLink(cellvalue, options, rowObject){
			if(cellvalue == 'Paused'){
				return "<a class='link GoToTransaction' TransId='"+rowObject.ROW_ID+"' CustId='"+rowObject.CustId+"'>Resume</a>";
			}else{
				return cellvalue;
			}
	}
	$(".ApplicationContent").delegate(".GoToTransaction", "click", function () {
		//console.log($(this).attr("TransId"));
		var TransId = $(this).attr("TransId");
		var CustId = $(this).attr("CustId");
		Data.post("SetSessionVal",{
			session:{
				"Type": "TransId",
				"Val" : TransId
			}
		});
		Data.post("SetSessionVal",{
			session:{
				"Type": "CustId",
				"Val" : CustId
			}
		});
		$timeout(function () {
					$location.path("StartBilling");
				}, 300);
	});
	function DeleteButton(cellvalue, options, rowObject) {
		return ("<img src='img/cancel.png' class='DeleteRecord' id='" + rowObject.SL_ID + "'/>")
	}
	
	TabRefDetails.jqGrid({
		//url:'server.php?q=2',
		//data:dataset,
		height : '520',
		datatype : "local",
		colNames : ['ROW_ID', 'Sl No', 'Item Name', 'Price', 'Quantity','Vat %', 'Total Price'],
		colModel : [{
				name : 'id',
				index : 'id',
				hidden : true
			}, {
				name : 'SL_ID',
				index : 'SL_ID',
				width : 50,
				align : "center"
			}, {
				name : 'DISPLAY_NAME',
				index : 'DISPLAY_NAME	',
				width : 150,
				editable : EnableEdit
			}, {
				name : 'PRICE',
				index : 'PRICE',
				width : 150,
				editable : EnableEdit,				
				align : "center",
				formatter : 'number'
			},{
				name : 'QUANTITY',
				index : 'QUANTITY',
				width : 100,
				editable : EnableEdit,				
				align : "center"
			}, {
				name : 'TAX_RATE',
				index : 'TAX_RATE',
				width : 100,
				editable : false,				
				align : "center"
			},{
				name : 'TOTAL',
				index : 'TOTAL',
				width : 150,
				align : "left",
				editable : false,				
				align : "center",
				formatter : 'number'
			}
		],
		//rowNum:10,
		//rowList:[10,20,50],
		//pager: '#pcelltbl',
		sortname : 'id',
		footerrow : true,
		userDataOnFooter : true,
		viewrecords : true,
		sortorder : "desc",
		scroll : true,
		scrollrows : true,
		caption:"Item Details",
		emptyrecords: "No records to view",
		loadtext: "Refreshing Grid",
		forceFit : true
	});
	var toDay = new Date();
	var toDay2 = new Date();
	RecentTrans.ToDateRange = toDay;
	RecentTrans.FromDateRange = new Date(toDay2.setDate(toDay.getDate()-7));
	LoadRecentBill();
	RecentTrans.DateChange=function(){
		LoadRecentBill();
	}
	function LoadRecentBill(){
		var gMonths =  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var toDD = RecentTrans.ToDateRange.getDate();
		var toMMM = gMonths[RecentTrans.ToDateRange.getMonth()];
		var toYYYY = RecentTrans.ToDateRange.getFullYear();
		//var toSDate = (toDD<10?"0"+toDD:toDD)+" "+toMMM+" "+toYYYY;
		var toSDate = toYYYY+"-"+(RecentTrans.ToDateRange.getMonth()+1)+"-"+(toDD<10?"0"+toDD:toDD)+" 23:59:59";
		var fromDD = RecentTrans.FromDateRange.getDate();
		var fromMMM = gMonths[RecentTrans.FromDateRange.getMonth()];
		var fromYYYY = RecentTrans.FromDateRange.getFullYear();
		//var fromSDate = (fromDD<10?"0"+fromDD:fromDD)+" "+fromMMM+" "+fromYYYY;
		var fromSDate = fromYYYY+"-"+(RecentTrans.FromDateRange.getMonth()+1)+"-"+(fromDD<10?"0"+fromDD:fromDD)+" 00:00:00";
		var Condition = "T1.CUSTOMER_ID=T2.ROW_ID AND T1.USER_ID=T3.ROW_ID AND T1.TYPE='NEW_BILL' AND T1.CREATED  BETWEEN '"+fromSDate+"' AND '"+toSDate+"' ORDER BY T1.CREATED DESC";
		var Table = "T_TRANSACTION T1,T_CUSTOMER T2,T_USER T3";	
		var Column = "T1.CUSTOMER_ID CustId,T1.ROW_ID,DATE_FORMAT(T1.CREATED,'%d %b %Y') CREATED,CONCAT(T2.FIRST_NAME,', ',T2.LAST_NAME) CUSTNAME,T3.USER_NAME USERNAME,T1.TOTAL_AMOUNT,T1.STATUS";
		Data.post('GetListOfValues', {
				Config:{
					"Condition" : Condition,
					"Column" : Column,
					"Table":Table
					}
			}).then(function (result) {
				if (result.status == "success") {
					TabRef.jqGrid('clearGridData');
					var dataLen = result.data.length;
					for (var i = 0; i < dataLen && i <1000; i++) {
						result.data[i].SL_ID = i + 1;
						result.data[i].id = result.data[i].ROW_ID;
						TabRef.jqGrid('addRowData', result.data[i].ROW_ID, result.data[i]);
						//TabRef.setGridParam({page:1}).trigger("reloadGrid") 
					}
					
					var TransId = result.data[0].id;
					LoadBillDetails(TransId);
					
					
					
				} else {
					TabRef.jqGrid('clearGridData');
					Data.toast(result);
				}
			});
	}
	
		function LoadBillDetails(TransId){
			var Condition = "T1.INACTIVE=0 AND T1.TRANS_ID = T2.ROW_ID AND T1.PRODUCT_ID=T3.ROW_ID AND T1.TAX1 = T4.ROW_ID AND T2.ROW_ID='"+TransId+"'";
			var Table = "T_BILL_DETAILS T1,T_TRANSACTION T2,T_PRODUCT T3,T_TAX T4";
			var Column = "T1.ROW_ID id,T3.DISPLAY_NAME,T1.PRICE,T4.TAX_RATE,T1.QUANTITY,T1.TOTAL";
			Data.post('GetListOfValues', {
					Config:{
						"Condition" : Condition,
						"Column" : Column,
						"Table":Table
						}
				}).then(function (result) {
					if (result.status == "success") {
						var dataLen = result.data.length;
						TabRefDetails.jqGrid('clearGridData');
						for (var i = 0; i < dataLen; i++) {
							result.data[i].SL_ID = i + 1;
							result.data[i].id = result.data[i].ROW_ID;
							TabRefDetails.jqGrid('addRowData', result.data[i].ROW_ID, result.data[i]);
						}
						var sum = TabRefDetails.jqGrid('getCol', 'TOTAL', false, 'sum');
						var quantity = TabRefDetails.jqGrid('getCol', 'QUANTITY', false, 'sum');
												
						TabRefDetails.jqGrid('footerData', 'set', {
							'PRICE' : 'Total : = ',
							'QUANTITY' : quantity,
							'TOTAL' : sum
						});
					}else{
						TabRefDetails.jqGrid('clearGridData');
					}
				});
		}
	/*$(".ApplicationContent").delegate(".DeleteRecord", "click", function () {
		//alert("working : " + $(this).attr('id'));
		var SL_ID = $(this).attr('id');
		TabRef.jqGrid('delRowData', Number(SL_ID) - 1);
		StartBill.ProductList = TabRef.jqGrid('getRowData');
		ProdListLen = StartBill.ProductList.length;
					TabRef.jqGrid('clearGridData');
					for (var i = 0; i < ProdListLen; i++) {
						StartBill.ProductList[i].SL_ID = i + 1;
						//StartBill.ProductList[i].id = ";
						//result.data[i].id = result.data[i].ROW_ID;
						TabRef.jqGrid('addRowData', i, StartBill.ProductList[i]);
					}
					var sum = TabRef.jqGrid('getCol', 'Price', false, 'sum');
					var quantity = TabRef.jqGrid('getCol', 'Quantity', false, 'sum');
					//TabRef.jqGrid('setSelection', ProdListLen - 1);
					//$("#" + TabRef.jqGrid('getGridParam', 'selrow')).focus();
					TabRef.jqGrid('footerData', 'set', {
						'ProdPrice' : 'Total : = ',
						'Quantity' : quantity,
						'Price' : sum
					});
		
	});
	TabRef.jqGrid('navGrid', '#pgwidth', {
		edit : false,
		add : false,
		del : false
	});//*/

});
