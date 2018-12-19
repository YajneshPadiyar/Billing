myApp.controller('StartBillingController',
	function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, $timeout, $q, $log) {
	var StartBill = this;
	//$rootScope.title = $routeParams.title;
	//StartBill.CustDetails =[];
	//console.log($location.path());
	Data.post("GetSessionVal", {
		session : {
			"Type" : "CustId"
		}
	}).then(function (result) {
		//console.log(result);
		if (result.status == "success") {
			Data.post("SearchCustomerWithRowId", {
				Customer : {
					"RowId" : result.data
				}

			}).then(function (result) {
				//	console.log(result);
				if (result.status == "success") {
					//console.log(result);
					var FN = result.data[0].FIRST_NAME;
					var LN = result.data[0].LAST_NAME;
					StartBill.CustDetails = {
						"L" : "Customer Name :",
						"V" : " " + FN.substring(0, 1).toUpperCase() + FN.substring(1, FN.length).toLowerCase() + " "
						 + LN.substring(0, 1).toUpperCase() + LN.substring(1, LN.length).toLowerCase()
					};
					Data.post("GetSessionVal", {
						session : {
							"Type" : "TransId"
						}
					}).then(function (result) {
						//console.log(result);
						if (result.status == "success") {
							StartBill.TransDetail = {
								"L" : "Billing Number :",
								"V" : " " + result.data
							};
							Data.post("GetBillDetailsForTransID", {
								session : {
									"TransId" : StartBill.TransDetail.V.trim()
								}
							}).then(function (result) {
								if (result["status"] == "success") {
									//console.log(result.data);
									StartBill.ProductList = result.data;
									ProdListLen = StartBill.ProductList.length;
									TabRef.jqGrid('clearGridData');
									for (var i = 0; i < ProdListLen; i++) {
										StartBill.ProductList[i].SL_ID = i + 1;
										//StartBill.ProductList[i].ROW_ID = "New";
										//result.data[i].id = result.data[i].ROW_ID;
										TabRef.jqGrid('addRowData', i, StartBill.ProductList[i]);
									}
									var sum = TabRef.jqGrid('getCol', 'Price', false, 'sum');
									var quantity = TabRef.jqGrid('getCol', 'Quantity', false, 'sum');
									TabRef.jqGrid('setSelection', ProdListLen - 1);
									$("#" + TabRef.jqGrid('getGridParam', 'selrow')).focus();
									TabRef.jqGrid('footerData', 'set', {
										'ProdPrice' : 'Total : = ',
										'Quantity' : quantity,
										'Price' : sum
									});
									StartBill.UpdateDiscount(sum);


								} else {
									//console.log(result.data);
								}

							});
						}
					});
				}
			});
		} //*/
	});
	StartBill.Discount = 0;
	StartBill.UpdateDiscount = function(sum){
		//console.log('Update Discount : '+sum);
		if(sum >= 25000 && sum < 5000){
			StartBill.Discount = 5;
			//console.log('Update Discount : '+StartBill.Discount);
		}else if(sum >= 5000 && sum < 10000){
			StartBill.Discount = 8;
			//console.log('Update Discount : '+StartBill.Discount);
		}else if(sum > 10000) {
			StartBill.Discount = 10;
			//console.log('Update Discount : '+StartBill.Discount);
		}else{
			StartBill.Discount = 0;
			//console.log('Update Discount : '+StartBill.Discount);
		}
		
		setTimeout(function(){
			//console.log('First name being reset');
			$scope.$apply(function(){
			$scope.Discount = StartBill.Discount;
			}
			)
			}, 100);
		
	}
	StartBill.Quantity = 1;
	//StartBill.ProductCode = "123abc";
	if (StartBill.ProductList) {}
	else
		StartBill.ProductList = [];

	Data.get("GetSession").then(function (result) {
		//console.log(result);
		if (result["UserId"] == "") {
			Data.toast2("info", "Please Login again. Do not refresh the page during the StartBill.");
			$location.path('login');
		} else {}
	});
	//console.log($location.path());

	StartBill.DiscountChange = function($event){

	}
	StartBill.EnterKeyPress = function ($event) {
		//console.log($event.keyCode);
		if ($event.keyCode == 13) {
			StartBill.SearchAndAdd();
		}
	}
	StartBill.simulateQuery = false;
	StartBill.isDisabled = false;

	//StartBill.repos         = loadAll();
	//StartBill.querySearch   = querySearch;
	StartBill.selectedItemChange = selectedItemChange;
	StartBill.selectedItemChange2 = selectedItemChange;
	StartBill.selectedItemChange3 = selectedItemChange;
	StartBill.searchTextChange = searchTextChange;
	StartBill.searchTextChange2 = searchTextChange;
	StartBill.searchTextChange3 = searchTextChange;
	//StartBill.states = loadAll();
	StartBill.states = {};
	StartBill.states2 = {};
	StartBill.states3 = {};
	StartBill.querySearchWithType = function (query) {
		//console.log(StartBill.states2);
		var results = query ? StartBill.states3.filter(createFilterFor(query)) : StartBill.states3,
		deferred;
		if (StartBill.simulateQuery) {
			deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}
	StartBill.querySearchWithName = function (query) {
		//console.log(StartBill.states2);
		var results = query ? StartBill.states2.filter(createFilterFor(query)) : StartBill.states2,
		deferred;
		if (StartBill.simulateQuery) {
			deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}
	StartBill.querySearch = function (query) {
		//console.log(StartBill.states);
		var results = query ? StartBill.states.filter(createFilterFor(query)) : StartBill.states,
		deferred;
		if (StartBill.simulateQuery) {
			deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}
	function searchTextChange(text) {
		//$log.info('Text changed to ' + text);
	}

	function selectedItemChange(item) {
		//$log.info('Item changed to ' + JSON.stringify(item));
		if (item) {
			StartBill.ProductCode = item.bar_code;
			StartBill.SearchDropDownType = item.SearchText;
			ClearFilter(item.SearchText);
		}

	}
	function ClearFilter(Type) {
		var Lookup = {
			"searchText" : {
				"SearchText" : "searchText",
				"SelectedItem" : "selectedItem"
			},
			"searchTextByName2" : {
				"SearchText" : "searchTextByName2",
				"SelectedItem" : "selectedItem2"
			},
			"searchTextByType" : {
				"SearchText" : "searchTextByType",
				"SelectedItem" : "selectedItem3"
			}
		};
		var len = Lookup.length;
		for (var pos in Lookup) {
			if (pos == Type) {}
			else {
				StartBill[Lookup[pos].SearchText] = null;
				StartBill[Lookup[pos].SelectedItem] = null;
			}
		}

	}
	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);

		return function filterFn(item) {
			return (item.value.indexOf(lowercaseQuery) === 0);
		};

	}
	var Condition = "1=1 ORDER BY T1.CREATED DESC";
	var Table = "T_PRODUCT T1";
	var Column = "BAR_CODE,TYPE,DISPLAY_NAME,RETAIL_SELL_PRICE";
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
			var States = new Array();
			var States2 = new Array();
			var States3 = new Array();
			for (var i = 0; i < dataLen; i++) {
				//console.log(data[i]);
				var temp = {};
				var temp2 = {};
				var temp3 = {};
				temp["bar_code"] = data[i].BAR_CODE;
				temp["DisplayName"] = data[i].DISPLAY_NAME;
				temp["Type"] = data[i].TYPE;
				temp["Price"] = data[i].RETAIL_SELL_PRICE;
				temp2["bar_code"] = data[i].BAR_CODE;
				temp2["DisplayName"] = data[i].DISPLAY_NAME;
				temp2["Type"] = data[i].TYPE;
				temp2["Price"] = data[i].RETAIL_SELL_PRICE;
				temp3["bar_code"] = data[i].BAR_CODE;
				temp3["DisplayName"] = data[i].DISPLAY_NAME;
				temp3["Type"] = data[i].TYPE;
				temp3["Price"] = data[i].RETAIL_SELL_PRICE;

				States[i] = temp;
				States2[i] = temp2;
				States3[i] = temp3;

			}
			//console.log(States);
			var StateMap = States.map(function (state) {
					state.value = state.bar_code.toLowerCase();
					state.name = state.bar_code + " - " + state.DisplayName + " - " + state.Type;
					state.SearchText = "searchText";
					//state.SelectItem="selectedItem2";
					//console.log(state);
					return state;
				}); //*/
			var StateMap2 = States2.map(function (state) {
					state.value = state.DisplayName.toLowerCase();
					state.name2 = state.bar_code + " - " + state.DisplayName + " - " + state.Type;
					state.SearchText = "searchTextByName2";
					//state.SelectItem="selectedItem";
					//console.log(state);
					return state;
				}); //*/
			var StateMap3 = States3.map(function (state) {
					state.value = state.Type.toLowerCase();
					state.name3 = state.bar_code + " - " + state.DisplayName + " - " + state.Type;
					state.SearchText = "searchTextByType";
					//state.SelectItem="selectedItem";
					//console.log(state);
					return state;
				}); //*/

			//console.log(StateMap);
			StartBill.states = StateMap;
			StartBill.states2 = StateMap2;
			StartBill.states3 = StateMap3;
			//console.log(StartBill.states);
			//console.log(StartBill.states2);
		}
	});

	StartBill.SearchAndAdd = function () {
		//console.log("Search and Add");

		if (StartBill.Quantity == 0) {
			Data.toast2("info", "Quantity of an item cannot be zero");
			return;
		} else if (StartBill.ProductCode.length < 4) {
			Data.toast2("info", "Invalid Item Code.");
			return;
		}

		Data.post('SearchProduct', {
			Product : {
				"ProductCode" : StartBill.ProductCode
			}
		}).then(function (result) {
			//console.log(StartBill.ProductList.length);
			//console.log(result);
			if (result.status == "success") {
				if (result.data.length == 1) {
					var ProdListLen = StartBill.ProductList.length;
					//console.log(ProdListLen);
					StartBill.ProductList[ProdListLen] = {
						"ProductId" : result.data[0].ROW_ID,
						"ProductName" : result.data[0].DISPLAY_NAME,
						"Quantity" : StartBill.Quantity,
						"ProdPrice" : result.data[0].RETAIL_SELL_PRICE,
						"Vat" : result.data[0].TAX_RATE,
						"VatId" : result.data[0].TAX_ID_1,
						"Price" : result.data[0].RETAIL_SELL_PRICE * StartBill.Quantity,
						"SL_ID" : ProdListLen
					};
					ProdListLen = StartBill.ProductList.length;
					TabRef.jqGrid('clearGridData');
					for (var i = 0; i < ProdListLen; i++) {
						StartBill.ProductList[i].SL_ID = i + 1;
						StartBill.ProductList[i].id = "New";
						//result.data[i].id = result.data[i].ROW_ID;
						TabRef.jqGrid('addRowData', i, StartBill.ProductList[i]);
					}
					var sum = TabRef.jqGrid('getCol', 'Price', false, 'sum');
					var quantity = TabRef.jqGrid('getCol', 'Quantity', false, 'sum');
					TabRef.jqGrid('setSelection', ProdListLen - 1);
					$("#" + TabRef.jqGrid('getGridParam', 'selrow')).focus();
					TabRef.jqGrid('footerData', 'set', {
						'ProdPrice' : 'Total : = ',
						'Quantity' : quantity,
						'Price' : sum
					});
					StartBill.UpdateDiscount(sum);
					//GetTotalAndQuantity(StartBill.ProductList);
					StartBill.Quantity = 1;
					ClearFilter("ALL");
					//StartBill.ProductCode = "123abc";
				} else {
					Data.toast2("info", "Multiple item codes found for the item");
				}
			} else {
				Data.toast2("info", "This Item Code not found, please add the product manually");
			}
		});
	}
	StartBill.GoToHome = function () {
		$location.path('HomePage');
	}
	StartBill.NewStartBill = function (RowId) {
		var CustId = RowId.target.id;
		CustId = CustId.substring("CustomerId".length, CustId.length);
		console.log(CustId);
	}
	StartBill.Navigate = function (Direction) {

		Data.post("GetSessionVal", {
			session : {
				"Type" : 'CustomerDetails'
			}
		}).then(function (result) {

			var sdata = JSON.parse(result.data);
			var sdataLen = sdata.length;
			var totalPage = Math.ceil(sdataLen / 5);
			var currPage = StartBill.CurrentPage;
			//console.log(currPage);
			//StartBill.sData=[];
			//console.log(sdata[0]);
			var inc = 5;
			if (sdataLen > inc) {
				var newStart = 0;
				var loadData = false;
				if (Direction == "Next") {
					//console.log("Next");
					//console.log(currPage+' - '+totalPage);
					if (totalPage == currPage + 2) {
						StartBill.NxtDisable = true;
					}
					if (totalPage > currPage + 1) {
						StartBill.CurrentPage = currPage + 1;
						newStart = (currPage + 1) * 5;
						loadData = true;
						StartBill.PrvDisable = false;
					} else {
						return;
					}
				} else {
					//console.log(currPage+' - '+totalPage);

					if (currPage - 1 == 0) {
						StartBill.PrvDisable = true;
					}
					if (currPage - 1 >= 0) {
						StartBill.CurrentPage = currPage - 1;
						newStart = (currPage - 1) * 5
						loadData = true;
						StartBill.NxtDisable = false;

					} else {
						return;
					}
				}
				if (loadData) {

					var x = new Array();
					loadData = false;
					for (var i = newStart; i < (newStart + inc) && i < sdataLen; i++) {
						//if(i < sdataLen){
						loadData = true;
						x[i - newStart] = sdata[i];
						//}else{
						//StartBill.sData[i-newStart] = {};
						//}
					}
					//console.log(x.length + '-' + newStart);
					if (loadData) {
						StartBill.PagerInfo = (newStart + 1) + " - " + (newStart + 5 > sdataLen ? sdataLen : newStart + 5) + " of " + sdataLen;
						StartBill.sData = x;
					}
				}
			} else {
				StartBill.NxtDisable = true;
				StartBill.PrvDisable = true;
				StartBill.PagerInfo = (1) + " - " + sdata.length + " of " + sdata.length;
				StartBill.sData = sdata;
			}

		});
	}
	function GetTotalAndQuantity(ProductList) {
		var ProdListLen = ProductList.length;
		var totalQuantity = 0;
		var totalPriceTot = 0;
		var totalPrice = 0
			//console.log(StartBill.ProductList);
			for (var i = 0; i < ProdListLen; i++) {
				//console.log(StartBill.ProductList[i]["Quantity"]);
				totalQuantity += Number(StartBill.ProductList[i]["Quantity"]);
				totalPriceTot += Number(StartBill.ProductList[i]["Price"]);
				totalPrice += Number(StartBill.ProductList[i]["ProdPrice"]);
			}
			StartBill.TotalQuantity = totalQuantity;
		StartBill.TotalPrice = totalPrice;
		StartBill.TotalPriceTot = totalPriceTot;
	}
	StartBill.SearchCustomer = function () {
		var PhNum = StartBill.PhoneNumber;
		var FirstName = StartBill.FirstName;
		var LastName = StartBill.LastName;
		if (PhNum || (FirstName && LastName)) {
			if (!FirstName || !LastName) {
				FirstName = "XX";
				LastName = "XX";
			}
			if (!PhNum) {
				PhNum = 'XX';
			}
			PhNum = PhNum.toUpperCase();
			FirstName = FirstName.toUpperCase();
			LastName = LastName.toUpperCase();
			Data.post('SearchCustomer', {
				Customer : {
					"FirstName" : FirstName,
					"LastName" : LastName,
					"PhoneNumber" : PhNum
				}
			}).then(function (result) {
				if (result["status"] == "success") {
					var data = result["data"];
					//console.log(data.length);
					//var dataStr = JSON.strinfy
					Data.post("SetSessionVal", {
						session : {
							"Type" : 'CustomerDetails',
							"Val" : JSON.stringify(data)
						}
					}).then(function (result) {});
					$location.path("SearchCustomerResult");
				} else {
					Data.toast2("info", "Customer not found. Please continue to add new customer.");
				}
			});
		} else {
			Data.toast2("info", "Please enter the required fields.");
		}
	};

	StartBill.DeleteRecord = function (index) {
		//console.log(index);
		var TempProdList = [];
		var ProdLen = StartBill.ProductList.length;
		for (var i = 0; i < ProdLen; i++) {
			if (i == index) {}
			else {
				TempProdList[TempProdList.length] = StartBill.ProductList[i];
			}
		}
		StartBill.ProductList = TempProdList;
		GetTotalAndQuantity(StartBill.ProductList);
	}

	StartBill.EditRecord = function (index) {
		//console.log(index);
	}

	StartBill.NoSubmitButPrint = function () {
		var NewDate = new Date();
		var DateTime = NewDate.getDate() + "/" + (NewDate.getMonth() + 1) + "/" + NewDate.getFullYear()
			 + " " + NewDate.getHours() + ":" + NewDate.getMinutes() + ":" + NewDate.getSeconds();
		var TimeStamp = NewDate.getDate() + '' + (NewDate.getMonth() + 1) + '' + NewDate.getFullYear() + ''
			 + NewDate.getHours() + '' + NewDate.getMinutes() + '' + NewDate.getSeconds();
		Data.post('GeneratePDF2', {
			"TransactionId" : StartBill.TransDetail.V.trim(),
			"DateTime" : DateTime,
			"TimeStamp" : TimeStamp,
			"Type": "Bill"
		}).then(function (result) {
			if (result["status"] == 'success') {
				StartBill.Source = "fileSystem/Bill/"+result["FileName"]+"?random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
				/*Data.post("SetSessionVal", {
					session : {
						"Type" : 'BillFileName',
						"Val" : result["FileName"]
					}
				}).then(function (result) {});//*/
			}
			//console.log("PDF Printed");
		});
	}

	StartBill.SubmitAndPrint = function () {
		//console.log("SAP");
		//var ProdList = StartBill.ProductList;
		//var ProdListLen = ProdList.length;
		var GridData = TabRef.jqGrid('getRowData');
		var GridDataLen = GridData.length;
		if (GridDataLen == 0) {
			Data.toast2("info", "Please add one more items to the transaction");
			return;
		}
		var sum = TabRef.jqGrid('getCol', 'Price', false, 'sum');
		var quantity = TabRef.jqGrid('getCol', 'Quantity', false, 'sum');
		Data.post('GenerateBill', {
			Transact : {
				"ProductList" : GridData,
				"TransId" : StartBill.TransDetail.V.trim(),
				"TransTotal" : sum,
				"Quantity" : quantity,
				"Discount" : StartBill.Discount
			}
		}).then(function (result) {
			if (result.status == "success") {
				var NewDate = new Date();
				var DateTime = NewDate.getDate() + "/" + (NewDate.getMonth() + 1) + "/" + NewDate.getFullYear()
					 + " " + NewDate.getHours() + ":" + NewDate.getMinutes() + ":" + NewDate.getSeconds();
				var TimeStamp = NewDate.getDate() + '' + (NewDate.getMonth() + 1) + '' + NewDate.getFullYear() + ''
					 + NewDate.getHours() + '' + NewDate.getMinutes() + '' + NewDate.getSeconds();
				Data.post('GeneratePDF2', {
					"TransactionId" : StartBill.TransDetail.V.trim(),
					"DateTime" : DateTime,
					"TimeStamp" : TimeStamp,
					"Type": "Bill"
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

				$timeout(function () {
					$location.path("PrintBill");
				}, 300);
			} else {}
		});

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

	StartBill.NoCancelTransaction = function () {
		Data.post("SetSessionVal", {
			session : {
				"Type" : "TransId",
				"Val" : "NEW"
			}
		});
		StartBill.GotoPage("Home");
	}
	StartBill.CancelTransaction = function () {
		var Table = "T_TRANSACTION";
		var Condition = "ROW_ID = '" + StartBill.TransDetail.V.trim() + "'";
		var Set = "STATUS = 'Closed'";
		Data.post('UpdateRecord', {
			"Config" : {
				Condition : Condition,
				Set : Set,
				Table : Table
			}
		}).then(function (result) {
			//console.log("Paused");
			Data.post("SetSessionVal", {
				session : {
					"Type" : "TransId",
					"Val" : "NEW"
				}
			});
		});
		StartBill.GotoPage("Home");
	}

	StartBill.PauseTransaction = function () {

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
				"Quantity" : quantity,
				"Discount" : StartBill.Discount
			}
		}).then(function (result) {
			if (result["status"] == 'success') {
				PauseTransaction();
				StartBill.GotoPage("Home");
			}
		});

	}
	function PauseTransaction() {
		var Table = "T_TRANSACTION";
		var Condition = "ROW_ID = '" + StartBill.TransDetail.V.trim() + "'";
		var Set = "STATUS = 'Paused'";
		Data.post('UpdateRecord', {
			"Config" : {
				Condition : Condition,
				Set : Set,
				Table : Table
			}
		}).then(function (result) {
			//console.log("Paused");
			Data.post("SetSessionVal", {
				session : {
					"Type" : "TransId",
					"Val" : "NEW"
				}
			});
		});
	}
	if ($location.path() == "/ExistingBillDetails") {
		var TabRef = $("#celltblNoEdit");
		var EnableEdit = false;
		var EnableHidden = true;
	} else {
		var TabRef = $("#celltbl");
		var EnableEdit = true;
		var EnableHidden = false;
	}

	TabRef.jqGrid({
		//url:'server.php?q=2',
		//data:dataset,
		height : '70%',
		datatype : "local",
		colNames : ['ROW_ID', 'Sl No', 'Item Name', 'Price', 'Quantity', 'Vat %', 'Total Price', 'Action Button', 'Vat Id', ' '],
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
				editable : EnableEdit
			}, {
				name : 'ProdPrice',
				index : 'ProdPrice',
				width : 150,
				editable : EnableEdit,
				editrules : {
					number : true
				},
				align : "center"
			}, {
				name : 'Quantity',
				index : 'Quantity',
				width : 100,
				editable : EnableEdit,
				editrules : {
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
				formatter : 'number'
			}, {
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
				hidden : EnableHidden
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
		afterEditCell : function (id, name, val, iRow, iCol) {
			//console.log(id + "..." + iRow);
			if (name == 'Price') {
				//jQuery("#"+iRow+"_invdate","#celltbl").datepicker({dateFormat:"yy-mm-dd"});
			}

		},
		beforeSaveCell : function (rowid, name, val, iRow, iCol) {
			//console.log('fire');
		},
		afterSaveCell : function (rowid, name, val, iRow, iCol) {

			if (name == 'ProdPrice') {
				var Quantity = TabRef.jqGrid('getCell', rowid, iCol + 1);
				TabRef.jqGrid('setRowData', rowid, {
					Price : parseFloat(val) * parseFloat(Quantity)
				});

			}
			if (name == 'Quantity') {
				var ProdPrice = TabRef.jqGrid('getCell', rowid, iCol - 1);
				TabRef.jqGrid('setRowData', rowid, {
					Price : parseFloat(val) * parseFloat(ProdPrice)
				});
			}
			var sum = TabRef.jqGrid('getCol', 'Price', false, 'sum');
			var quantity = TabRef.jqGrid('getCol', 'Quantity', false, 'sum');

			TabRef.jqGrid('footerData', 'set', {
				'ProdPrice' : 'Price:',
				'Quantity' : quantity,
				'Price' : sum
			});
			StartBill.UpdateDiscount(sum);
			//console.log(StartBill.ProductList);
			//console.log(TabRef.jqGrid('getRowData',rowid));
			var RowData = TabRef.jqGrid('getRowData', rowid);
			for (k in StartBill.ProductList) {
				if (StartBill.ProductList[k]["SL_ID"] == RowData["SL_ID"]) {
					StartBill.ProductList[k]["Quantity"] = RowData["Quantity"];
					StartBill.ProductList[k]["Price"] = RowData["Price"];
				}
			}

		}
	});
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
		var sum = TabRef.jqGrid('getCol', 'Price', false, 'sum');
		var quantity = TabRef.jqGrid('getCol', 'Quantity', false, 'sum');
		//TabRef.jqGrid('setSelection', ProdListLen - 1);
		//$("#" + TabRef.jqGrid('getGridParam', 'selrow')).focus();
		TabRef.jqGrid('footerData', 'set', {
			'ProdPrice' : 'Total : = ',
			'Quantity' : quantity,
			'Price' : sum
		});
		StartBill.UpdateDiscount(sum);
	});
	TabRef.jqGrid('navGrid', '#pgwidth', {
		edit : false,
		add : false,
		del : false
	});

});
