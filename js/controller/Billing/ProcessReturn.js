myApp.controller('ProcessReturnController',
	function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, $timeout, $q, $log) {
	var StartBill = this;
	
	StartBill.CustId = "";
	StartBill.UserId = "";
	StartBill.TotalAmt = "";
	StartBill.TotalPriceTot = "";
	StartBill.TotalQuantity = "";
	
	Data.get("GetSession").then(function (result) {
		//console.log(result);
		if (result["UserId"] == "") {
			//Data.toast2("info", "Please Login again. Do not refresh the page during the transaction.");
			//$location.path('login');
		} else {
			StartBill.UserId = result["UserRowId"];
		}
	});
	StartBill.BillNumber = "";
	//StartBill.ProductCode = "123abc";
	if(StartBill.ProductList){}else
	StartBill.ProductList = [];
	

	

	StartBill.EnterKeyPress = function ($event) {
		//console.log($event.keyCode);
		if ($event.keyCode == 13) {
			StartBill.SearchAndTransaction();
		}
	}
	
	StartBill.SearchAndTransaction = function(){
		var Condition = "T1.ROW_ID='"+StartBill.BillNumber+"' AND T1.CUSTOMER_ID = T2.ROW_ID";
		var Column = "T1.ROW_ID BillNumber,T2.FIRST_NAME Fname,T2.LAST_NAME Lname,T2.ROW_ID CustId";
		var Table = "T_TRANSACTION T1,T_CUSTOMER T2";
		Data.post('GetListOfValues', {
			Config : {
				"Condition" : Condition,
				"Column" : Column,
				"Table" : Table
			}
		}).then(function (result) {
			if (result.status == "success") {
				var data = result.data;		
				var dataLen = result.data.length;
				//console.log(data);
				StartBill.TransDetail = {
					"L" : "Billing Number :",
					"V" : " " + data[0].BillNumber
				};
				var FN = data[0].Fname;
				var LN = data[0].Lname;
				StartBill.CustId = data[0].CustId;
				StartBill.CustDetails = {
					"L" : "Customer Name :",
					"V" : " " + FN.substring(0, 1).toUpperCase() + FN.substring(1, FN.length).toLowerCase() + " "
					 + LN.substring(0, 1).toUpperCase() + LN.substring(1, LN.length).toLowerCase()
				};
				Data.post("SetSessionVal",{
					session:{
						"Type": "CustId",
						"Val" : data[0].CustId
					}
				});
				
				Data.post("GetBillDetailsForTransID", {
						session : {
							"TransId" : StartBill.BillNumber
						}
					}).then(function (result) {
						if (result["status"] == "success") {
							//console.log(result.data);
							StartBill.ProductList = result.data;
							ProdListLen = StartBill.ProductList.length;
							TabRef.jqGrid('clearGridData');
							for (var i = 0; i < ProdListLen; i++) {
								StartBill.ProductList[i].SL_ID = i + 1;
								StartBill.ProductList[i].ReturnQuantity = 0;
								StartBill.ProductList[i].ReturnPrice = 0;
								//StartBill.ProductList[i].ROW_ID = "New";
								//result.data[i].id = result.data[i].ROW_ID;
								TabRef.jqGrid('addRowData', i, StartBill.ProductList[i]);
							}
							var sum = TabRef.jqGrid('getCol', 'ReturnPrice', false, 'sum');
							var quantity = TabRef.jqGrid('getCol', 'ReturnQuantity', false, 'sum');
							TabRef.jqGrid('setSelection', ProdListLen - 1);
							$("#" + TabRef.jqGrid('getGridParam', 'selrow')).focus();
							TabRef.jqGrid('footerData', 'set', {
								'ProdPrice' : 'Total : = ',
								'ReturnQuantity' : quantity,
								'ReturnPrice' : sum
							});
						} else {
							//console.log(result.data);
						}

					});
							
			}else{
				Data.toast2("error","Entered Bill number is closed, cancelled or does not exist");
			}
		});
	}
	
	StartBill.GoToHome = function () {
		$location.path('HomePage');
	}
	StartBill.NewStartBill = function (RowId) {
		var CustId = RowId.target.id;
		CustId = CustId.substring("CustomerId".length, CustId.length);
		//console.log(CustId);
	}

	function GetTotalAndQuantity(ProductList) {
		var ProdListLen = ProductList.length;
		var totalQuantity = 0;
		var totalPriceTot = 0;
		var totalPrice = 0
			//console.log(StartBill.ProductList);
		for (var i = 0; i < ProdListLen; i++) {
			//console.log(StartBill.ProductList[i]["Quantity"]);
			totalQuantity += Number(ProductList[i]["ReturnQuantity"]);
			totalPriceTot += Number(ProductList[i]["ReturnPrice"]);
			totalPrice += Number(ProductList[i]["ProdPrice"]);
		}
		StartBill.TotalQuantity = totalQuantity;
		StartBill.TotalPrice = totalPrice;
		StartBill.TotalPriceTot = totalPriceTot;
	}
	

	

	
	StartBill.ReturnData=[];
	StartBill.ReturnTransId="";
	StartBill.SubmitAndPrint = function () {		
		
		var GridData = TabRef.jqGrid('getRowData');
		var GridDataLen = GridData.length;
		if (GridDataLen == 0) {
			Data.toast2("info", "Please add one more items to the transaction");
			return;
		}
		
		
		var Return = false;
		var ReturnData = [];
		for(var i = 0 ; i < GridDataLen ; i++){
			if(GridData[i].ReturnQuantity > 0){
				Return = true;
				ReturnData[ReturnData.length] = GridData[i];
			}
		}
		StartBill.ReturnData = ReturnData;
		
		if(Return){
			GetTotalAndQuantity(ReturnData);
			
			//console.log(ReturnData);
			Data.post("ReturnTransaction",{
				session: {
					"UserId":StartBill.UserId,
					"CustId":StartBill.CustId,
					"Type":"RetTransId",
					"TransType":"RETURN_BILL",
					"ReturnId":StartBill.BillNumber,				
					"TotalAmt":StartBill.TotalPriceTot,
					"TotalQuantity":StartBill.TotalQuantity,
					"ReturnList":ReturnData
				}			
			}).then(function (result) {
				if (result.status == "success") {
					StartBill.ReturnTransId = result.data;
					var RetData = StartBill.ReturnData;
					var RetLen = RetData.length;
					var ProdList = {};
					for(var i = 0 ; i < RetLen ; i++){
						if(ProdList.hasOwnProperty(RetData[i]["ProductId"])){
							ProdList[RetData[i]["ProductId"]]+=Number(RetData[i]["ReturnQuantity"]);
						}else{
							ProdList[RetData[i]["ProductId"]]=Number(RetData[i]["ReturnQuantity"]);
						}
						
					}
					
					for(key in ProdList){
						Data.post("UpdateRecord",{
							Config: {
								"Condition":"ROW_ID='"+key+"'",
								"Set":"SOLD=SOLD-"+parseFloat(ProdList[key]),
								"Table":"T_PRODUCT"
							}			
						});
					}
					Data.post("UpdateRecord",{
						Config: {
							"Condition":"ROW_ID='"+StartBill.ReturnTransId+"'",
							"Set":"STATUS='Done',BILL_RECEIPT='Return_Bill'",
							"Table":"T_TRANSACTION"
						}			
					}).then(function(result){						
						var NewDate = new Date();
						var DateTime = NewDate.getDate() + "/" + (NewDate.getMonth() + 1) + "/" + NewDate.getFullYear()
						+ " " + NewDate.getHours() + ":" + NewDate.getMinutes() + ":" + NewDate.getSeconds();
						var TimeStamp = NewDate.getDate() + '' + (NewDate.getMonth() + 1) + '' + NewDate.getFullYear() + ''
						+ NewDate.getHours() + '' + NewDate.getMinutes() + '' + NewDate.getSeconds();
						Data.post('GeneratePDF2', {
							"TransactionId" : StartBill.ReturnTransId,
							"DateTime" : DateTime,
							"TimeStamp" : TimeStamp,
							"Type": "Return"
						}).then(function (result) {
							if (result["status"] == 'success') {
								Data.post("SetSessionVal", {
									session : {
										"Type" : 'BillFileName',
										"Val" : result["FileName"]
									}
								}).then(function (result) {});
							}
					//console.log("PDF Printed");
						});
					});		
					//StartBill.GotoPage("Home");	
					$timeout(function () {
						$location.path("PrintBill");
					}, 300);
					
				}
			});			
		}else{
			Data.toast2("error","Please enter the return quantity for one of the selected items.");
		}		
	}

	StartBill.GotoPage = function (Page) {
		//console.log("Page " + Page);
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

	StartBill.CancelTransaction = function () {
		
		StartBill.GotoPage("Home");
	}
	
	
	StartBill.PauseTransaction = function(){		
		
		var GridData = TabRef.jqGrid('getRowData');
		var GridDataLen = GridData.length;
		if (GridDataLen == 0) {
			//Data.toast2("info", "Please add one more items to the transaction");
			PauseTransaction();
			StartBill.GotoPage("Home");
			return;
		}
		var sum = TabRef.jqGrid('getCol', 'Price', false, 'sum');
		var quantity = TabRef.jqGrid('getCol', 'Quantity', false, 'sum');
		Data.post('GenerateBill', {
			Transact : {
				"ProductList" : GridData,
				"TransId" : StartBill.TransDetail.V.trim(),
				"TransTotal" : sum,
				"Quantity" : quantity
			}
		}).then(function (result) {
			if (result["status"] == 'success') {
				PauseTransaction();
				StartBill.GotoPage("Home");
			}
		});
		
		
	}
	function PauseTransaction(){
		var Table = "T_TRANSACTION";
		var Condition = "ROW_ID = '"+StartBill.TransDetail.V.trim()+"'";
		var Set = "STATUS = 'Paused'";
		Data.post('UpdateRecord', {
			"Config" :{Condition:Condition,Set:Set,Table:Table}
		}).then(function (result) {					
			//console.log("Paused");
			Data.post("SetSessionVal",{
			session:{
				"Type": "TransId",
				"Val" : "NEW"
			}
			});
		});
	}
	
	
	var TabRef = $("#celltbl");

	TabRef.jqGrid({
		//url:'server.php?q=2',
		//data:dataset,
		height : '70%',
		datatype : "local",
		colNames : ['ROW_ID', 'Sl No', 'Item Name', 'Price', 'Quantity','Return Quantity', 'Vat %', 'Total Price','Return Price', 'Action Button', 'Vat Id',''],
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
				name : 'ProductName',
				index : 'ProductName',
				width : 250,
				editable : false
			}, {
				name : 'ProdPrice',
				index : 'ProdPrice',
				width : 150,
				editable : false,
				editrules : {
					number : true
				},
				align : "center"
			}, {
				name : 'Quantity',
				index : 'Quantity',
				width : 100,
				editable : false,
				editrules : {
					number : true
				},
				align : "center"
			}, {
				name : 'ReturnQuantity',
				index : 'ReturnQuantity',
				width : 100,
				editable : true,
				editrules : {
					custom:true,
					custom_func: customValidationMessage,
					number : true
				},
				align : "center"
			}, {
				name : 'Vat',
				index : 'Vat',
				width : 100,
				editable : false,
				editrules : {
					number : true
				},
				align : "center"
			}, {
				name : 'Price',
				index : 'Price',
				width : 150,
				align : "left",
				editable : false,
				editrules : {
					number : true
				},
				align : "center",
				formatter : 'number',
				hidden : true
			},{
				name : 'ReturnPrice',
				index : 'ReturnPrice',
				width : 150,
				align : "left",
				editable : false,
				editrules : {
					number : true
				},
				align : "center",
				formatter : 'number'
			},  {
				name : 'ProductId',
				index : 'ProductId',
				hidden : true
			}, {
				name : 'VatId',
				index : 'VatId',
				hidden : true
			}, {
				name : 'myac',
				width : 60,
				fixed : true,
				sortable : false,
				resize : false,
				formatter : DeleteButton,
				align : "center",
				hidden : true
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
		//	caption:"List of Options",
		forceFit : true,
		cellEdit : true,
		cellsubmit : 'clientArray', //cellurl:'php/application/updateOptions',
		afterSaveCell : function (rowid, name, val, iRow, iCol) {
			//console.log(name);
			
			if (name == 'ReturnQuantity') {
				var ProdPrice = TabRef.jqGrid('getCell', rowid, iCol - 2);
				
				TabRef.jqGrid('setRowData', rowid, {
					ReturnPrice : parseFloat(val) * parseFloat(ProdPrice)
				});
			}
			var sum = TabRef.jqGrid('getCol', 'ReturnPrice', false, 'sum');
			var quantity = TabRef.jqGrid('getCol', 'ReturnQuantity', false, 'sum');

			TabRef.jqGrid('footerData', 'set', {
				'ProdPrice' : 'Price:',
				'ReturnQuantity' : quantity,
				'ReturnPrice' : sum
			});
			
			//console.log(StartBill.ProductList);
			//console.log(TabRef.jqGrid('getRowData',rowid));
			var RowData = TabRef.jqGrid('getRowData',rowid);
			for(k in StartBill.ProductList){
				if(StartBill.ProductList[k]["SL_ID"]==RowData["SL_ID"]){
					StartBill.ProductList[k]["Quantity"] = RowData["Quantity"];
					StartBill.ProductList[k]["Price"] = RowData["Price"];
				}
			}
			
		}
	});
	function customValidationMessage(val, colname){		
		var AQuantity = TabRef.jqGrid ('getCell', TabRef.jqGrid ('getGridParam', 'selrow'), 'Quantity');
			val = parseFloat(val);
		if(AQuantity < val){			
			return [false,"Return Quantity cannot be greater than the actual quantity"];
		}else{
			return [true,""];
		}
	}
	function DeleteButton(cellvalue, options, rowObject) {
		return ("<img src='img/cancel.png' class='DeleteRecord' id='" + rowObject.SL_ID + "'/>")
	}

	$(".ApplicationContent").delegate(".DeleteRecord", "click", function () {
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
		var sum = TabRef.jqGrid('getCol', 'ReturnPrice', false, 'sum');
		var quantity = TabRef.jqGrid('getCol', 'ReturnQuantity', false, 'sum');
		//TabRef.jqGrid('setSelection', ProdListLen - 1);
		//$("#" + TabRef.jqGrid('getGridParam', 'selrow')).focus();
		TabRef.jqGrid('footerData', 'set', {
			'ProdPrice' : 'Total : = ',
			'ReturnQuantity' : quantity,
			'ReturnPrice' : sum
		});

	});
	TabRef.jqGrid('navGrid', '#pgwidth', {
		edit : false,
		add : false,
		del : false
	});

});
