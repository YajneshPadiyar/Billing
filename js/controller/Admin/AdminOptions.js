myApp.controller('AdminOptionsCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, Constant, $q, $log) {
	var AdmOpt = this;
	AdmOpt.CatType = [];
	AdmOpt.StatusList = [{
			name : 'Active',
			val : 1
		}, {
			name : 'Inactive',
			val : 0
		}
	];
	Data.post("GetOptionsType", {
		Config : {
			"Condition" : "",
			Column : "DISTINCT CATEGEORY"
		}
	}).then(function (result) {
		//console.log(result.data);
		if (result.status == "success") {
			var dataLen = result.data.length;

			for (var i = 0; i < dataLen; i++) {
				//console.log(result.data.CATEGEORY);
				AdmOpt.CatType[i] = {
					val : result.data[i].CATEGEORY,
					name : result.data[i].CATEGEORY
				};
			}
			//console.log(AdmOpt.CatType);
			//AdmOpt.CatType = result.data;
		} else {}
	});
	var path = $location.path();
	//console.log(path);
	var TabRef = null;
	var EnableEdit = true;
	var EnableHidden = true;
	if (path == "/AdminOptions") {}
	else if (path == "/AdminOptionsEdit") {
		var CatTypeDummy = {
			val : '',
			name : 'none'
		};
		AdmOpt.CatType.unshift(CatTypeDummy);
		Data.post('GetSessionVal', {
			session : {
				Type : 'AdmOptRowId'
			}
		}).then(function (result) {
			//console.log(result);
			if (result.status == 'success') {
				AdmOpt.Row_Id = result.data;
				var Condition = "A.ROW_ID = '" + AdmOpt.Row_Id + "'";
				Data.post("GetOptions", {
					Config : {
						"Condition" : Condition
					}
				}).then(function (result) {
					//console.log(result.data);
					if (result.status == "success") {
						//console.log(result);
						AdmOpt.Category = result.data[0].CATEGEORY;
						AdmOpt.RefVal = result.data[0].BACKEND_VALUE;
						AdmOpt.Val = result.data[0].DISPLAY_VALUE;
						AdmOpt.Active = result.data[0].ACTIVE;
						ParentType = result.data[0].PARENT_ID;
						AdmOpt.OrderBy = result.data[0].ORDER_BY;
					} else {}
				});

			}
		});
	} else if (path == "/AdminOptionsNew") {
		var CatTypeDummy = {
			val : '',
			name : 'none'
		};
		AdmOpt.CatType.unshift(CatTypeDummy);
	} else if (path == "/ManageStore") {
		//$log.info("ManageStore");
		TabRef = $("#celltblStore");
		EnableEdit = true;
		EnableHidden = true;
	} else if (path == "/ManageUser") {
		//$log.info("ManageUser");
		TabRef = $("#celltblUser");
		EnableEdit = true;
		EnableHidden = true;
	} else if (path == "/ManageTax") {
		//$log.info("ManageTax");
		TabRef = $("#celltblTax");
		EnableEdit = true;
		EnableHidden = true;
	}

	AdmOpt.EditOptions = function (RowId) {
		//console.log(RowId);
		Data.post('SetSessionVal', {
			session : {
				Type : 'AdmOptRowId',
				Val : RowId
			}
		}).then(function (result) {
			$location.path("AdminOptionsEdit");
		});
	}
	AdmOpt.AddUpdateOptions = function (RowId) {
		var ParentType = AdmOpt.ParentType == "" || AdmOpt.ParentType == null ? "XXYYZZ" : AdmOpt.ParentType;
		if (RowId == '') {
			//New Options
			Data.post('AddNewOption', {
				Options : {
					Category : AdmOpt.Category,
					RefVal : AdmOpt.RefVal,
					Value : AdmOpt.Val,
					Active : AdmOpt.Active,
					ParentType : ParentType,
					OrderBy : AdmOpt.OrderBy
				}
			}).then(function (result) {
				Data.toast(result);
			});
		} else {
			//Edit Options

			Data.post('UpdateOption', {
				Options : {
					Category : AdmOpt.Category,
					RefVal : AdmOpt.RefVal,
					Value : AdmOpt.Val,
					Active : AdmOpt.Active,
					ParentType : ParentType,
					OrderBy : AdmOpt.OrderBy,
					ROW_ID : RowId
				}
			}).then(function (result) {
				Data.toast(result);
			});
		}
	}
	AdmOpt.SearchOptions = function () {
		var Cate = AdmOpt.Category;
		var RefVal = AdmOpt.RefVal;
		var Val = AdmOpt.Val;
		//console.log(Cate+"-"+RefVal+"-"+Val);

		var Condition = "";
		var Condition1 = Cate == null || Cate.length == 0 ? Condition : "A.CATEGEORY='" + Cate + "'";
		var Condition2 = RefVal == null || RefVal.length == 0 ? Condition : "A.BACKEND_VALUE='" + RefVal + "'";
		var Condition3 = Val == null || Val.length == 0 ? Condition : "A.DISPLAY_VALUE='" + Val + "'";

		//console.log(Condition1+"-"+Condition2+"-"+Condition3);
		if (Condition1 != "") {
			Condition = Condition1;
			if (Condition2 != "") {
				Condition += " AND " + Condition2;
			}
			if (Condition3 != "") {
				Condition += " AND " + Condition3;
			}
		} else if (Condition2 != "") {
			Condition = Condition2;
			if (Condition3 != "") {
				Condition += " AND " + Condition3;
			}
		} else if (Condition3 != "") {
			Condition = Condition3;
		}

		//console.log(Condition);
		Data.post("GetOptions", {
			Config : {
				"Condition" : Condition
			}
		}).then(function (result) {
			console.log(result.data);
			if (result.status == "success") {
				AdmOpt.SearchResult = result.data;
			} else {}
		});

		/*
		SearchResult = []
		for(var i = 0 ; i < 10 ; i++){
		SearchResult[i] = {"CATEGORY":"X_Y_Z_"+i,"BACKEND_VALUE":"B_V_"+i,"DISPLAY_VALUE":"","ACTIVE":"","ORDER_BY":"","PARENT_ID":""};
		}
		AdmOpt.SearchResult = SearchResult;//*/
	}
	AdmOpt.Reset = function () {
		var UserName = AdmOpt.UserName;
		var Password = AdmOpt.Password;
		//var newRePassword = AdmOpt.reNewPassword;
		var result = {};
		result.status = "error";
		Data.post('SetPassword', {
			customer : AdmOpt
		}).then(function (results) {
			if (results["status"] = "success") {
				//$location.path('login');
				results["message"] = "Password Reset Successfull";
				Data.toast(results);
			} else {
				//results["message"] = "So";
				Data.toast(results);
			}
		});
	}
	AdmOpt.AddNewItem = function (Type) {
		var sTable = "";
		var aColVal = {};

		switch (Type) {
		case "Store":
			if (!AdmOpt.StoreName || !AdmOpt.Description) {
				Data.toast2("error", "Please Enter the details !!");
				return;
			}
			sTable = "T_STORE";
			aColVal["STORE_NAME"] = AdmOpt.StoreName;
			aColVal["DESCRIPTION"] = AdmOpt.Description;
			aColVal["IS_PRIMARY"] = AdmOpt.Primary ? 1 : 0;
			break;
		case "Tax":
			if (!AdmOpt.TaxType || !AdmOpt.TaxName || !AdmOpt.TaxRate) {
				Data.toast2("error", "Please Enter the details !!");
				return;
			}
			sTable = "T_TAX";
			aColVal["TYPE"] = AdmOpt.TaxType;
			aColVal["TAX_NAME"] = AdmOpt.TaxName;
			aColVal["TAX_RATE"] = AdmOpt.TaxRate;
			break;
		default:
			return;
		}
		//console.log(aColVal);
		Data.post('InsertItem', {
			item : {
				Table : sTable,
				ColVal : aColVal
			}
		}).then(function (result) {
			if (result.status == "success") {
				Data.toast2("success", "Added successfully !!");
				//DataStore.set(AddProduct, "AddedProduct");
				//$location.path('AddProductSuccess');
				InitialiseGrid();
				AdmOpt.StoreName = "";
				AdmOpt.Description = "";
				AdmOpt.Primary = false;
				AdmOpt.TaxType = "";
				AdmOpt.TaxName = "";
				AdmOpt.TaxRate = "";
			} else {
				Data.toast(result);
			}
		});
	}
	
	AdmOpt.selectedItemChange = selectedItemChange;
	AdmOpt.selectedItemChange2 = selectedItemChange2;
	//AdmOpt.selectedItemChange3 = selectedItemChange;
	AdmOpt.searchTextChange = searchTextChange;
	AdmOpt.searchTextChange2 = searchTextChange;
	//AdmOpt.searchTextChange3 = searchTextChange;
	AdmOpt.states = {};
	AdmOpt.roles = {};
	AdmOpt.querySearch = function (query) {
		//console.log(AdmOpt.states);
		var results = query ? AdmOpt.states.filter(createFilterFor(query)) : AdmOpt.states,
		deferred;
		if (AdmOpt.simulateQuery) {
			deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}
	AdmOpt.querySearchRole = function (query) {
		//console.log(AdmOpt.states);
		var results = query ? AdmOpt.roles.filter(createFilterFor(query)) : AdmOpt.roles,
		deferred;
		if (AdmOpt.simulateQuery) {
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
		
		if (item) {
			if(AdmOpt.selectedItem){
				//$log.info('Item changed to ' + JSON.stringify(item));
				AdmOpt.StoreNameId = AdmOpt.selectedItem["RowId"];
				AdmOpt.StoreName = AdmOpt.selectedItem.STORE_NAME;
			}else{
				AdmOpt.StoreNameId = "";
				AdmOpt.StoreName = "";
			}
		}else{
			AdmOpt.StoreNameId = "";
			AdmOpt.StoreName = "";
		}
		console.log(AdmOpt.selectedItem2);
	}
	function selectedItemChange2(item) {
		
		if (item) {
			if(AdmOpt.selectedItem2){
				//$log.info('Item changed to ' + JSON.stringify(item));
				AdmOpt.RoleNameId = AdmOpt.selectedItem2["RowId"]; 
				AdmOpt.RoleName = AdmOpt.selectedItem2.ROLE_NAME;
			}else{
				AdmOpt.RoleNameId = "";
				AdmOpt.RoleName = "";
				
			}
		}else{
			AdmOpt.RoleNameId = "";
			AdmOpt.RoleName = "";
		}
		//console.log(AdmOpt.selectedItem2);
	}
	
	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);

		return function filterFn(item) {
			return (item.value.indexOf(lowercaseQuery) === 0);
		};

	}
	var Condition = "1=1 ORDER BY T1.CREATED DESC";
	var Table = "T_STORE T1";
	var Column = "T1.*";
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
			
			for (var i = 0; i < dataLen; i++) {
				//console.log(data[i]);
				var temp = {};
				temp["STORE_NAME"] = data[i].STORE_NAME;
				temp["RowId"] = data[i].ROW_ID;
				temp["DESCRIPTION"] = data[i].DESCRIPTION;
				temp["IsPrimary"] = data[i].IS_PRIMARY;			

				States[i] = temp;				

			}
			//console.log(States);
			var StateMap = States.map(function (state) {
					state.value = state.STORE_NAME.toLowerCase();
					state.name = state.STORE_NAME+" - "+state.DESCRIPTION;
					state.SearchText = "searchText";
					
					return state;
				}); //*/
			//console.log(StateMap);
			AdmOpt.states = StateMap;
			
		}
	});
	var Condition = "1=1 ORDER BY T1.CREATED DESC";
	var Table = "T_ROLE T1";
	var Column = "T1.*";
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
			
			for (var i = 0; i < dataLen; i++) {
				//console.log(data[i]);
				var temp = {};
				temp["ROLE_NAME"] = data[i].ROLE_NAME;
				temp["RowId"] = data[i].ROW_ID;
				temp["DESCRIPTION"] = data[i].DESCRIPTION;
				temp["ACTIVE"] = data[i].ACTIVE;			

				States[i] = temp;				

			}
			//console.log(States);
			var StateMap = States.map(function (state) {
					state.value = state.ROLE_NAME.toLowerCase();
					state.role = state.ROLE_NAME+" - "+state.DESCRIPTION;
					state.SearchText = "searchText";
					
					return state;
				}); //*/
			

			//console.log(StateMap);
			AdmOpt.roles = StateMap;
			
		}
	});

	AdmOpt.UserId = "";
	AdmOpt.RoleNameId = "";
	AdmOpt.StoreNameId = "";
	AdmOpt.RoleName = "";
	AdmOpt.StoreName = "";
	AdmOpt.AddRole = function(type){
		var RoleName = AdmOpt.RoleName;
		var StoreName = AdmOpt.StoreName;
		var sTable = "T_USER_PROFILE";
		var aColVal = {};
		var aCondition = "";
		aColVal["USER_ID"]=AdmOpt.UserId;
		aColVal["ROLE"]=AdmOpt.RoleNameId;
		aColVal["STORE_ID"]=AdmOpt.StoreNameId;
		if(!RoleName || !StoreName){
			Data.toast2("warning","Please enter the Required Details.");
			return;
		}
		switch(type){
			case "Add":
				
				aColVal["ACTIVE"]='1';
				Data.post('InsertItem', {
					item : {
						Table : sTable,
						ColVal : aColVal
					}
				}).then(function (result) {
					if (result.status == "success") {
						Data.toast2("success", "Added successfully !!");
						LoadSubgridforUser(AdmOpt.UserId);
					} else {
						Data.toast(result);
					}
				});	
			break;
			case "Remove":
			//aCondition = "USER_ID = '"+AdmOpt.UserId +"' AND STORE_ID = '"+AdmOpt.StoreNameId+"' AND ROLE = '"+AdmOpt.RoleNameId+"'";
			Data.post('DeleteItem', {
					item : {
						Table : sTable,
						Condition : aColVal
					}
				}).then(function (result) {
					if (result.status == "success") {
						Data.toast2("success", "Removed successfully !!");
						LoadSubgridforUser(AdmOpt.UserId);
					} else {
						Data.toast(result);
					}
				});	
			
			break;
			default:
		}
	}
	AdmOpt.Goto = function (Page) {
		switch (Page) {
		case "Home":
			$location.path("HomePage");
			break;
		case "AdminOptions":
			$location.path("AdminOptions");
			break;
		case "NewOptions":
			$location.path("AdminOptionsNew");
			break;
		case "ManageStore":
			$location.path("ManageStore");
			break;
		case "ManageUser":
			$location.path("ManageUser");
			break;
		case "ManageTax":
			$location.path("ManageTax");
			break;
		default:

		}
	}

	if (TabRef) {
		InitialiseGrid();
	}
	function InitialiseGrid() {
		//var MyTabRef = TabRef;
		//console.log(TabRef);
		var Condition = "";
		var Table = "";
		var Column = "";
		var colNames = new Array();
		var ColModelArr = new Array();
		var Caption = "";
		var GridOptions = {};
		var BeforeSubmit = null;
		var navId = "";
		if (path == "/ManageStore") {
			Caption = "Store Details";
			Condition = "1=1 ORDER BY T1.CREATED";
			Table = "T_STORE T1,(SELECT @rownum := 0) r";
			Column = "T1.*,DATE_FORMAT(T1.CREATED,'%d %b %Y') CREATED1,@rownum := @rownum + 1 AS SL_ID";
			//BeforeSubmit = BeforeSubmitStore;
			navId = "pcelltblStore";
			colNames = ['ROW_ID', 'Sl No', 'Created', 'Store Name', 'Description', 'Primary'];
			ColModelArr = [{
					name : 'id',
					index : 'id',
					hidden : true
				}, {
					name : 'SL_ID',
					index : 'SL_ID',
					width : 50,
					align : "center"
				}, {
					name : 'CREATED1',
					index : 'CREATED1',
					width : 100,
					align : "center"
				}, {
					name : 'STORE_NAME',
					index : 'STORE_NAME',
					width : 150,
					editable : EnableEdit,
					align : "center"
				}, {
					name : 'DESCRIPTION',
					index : 'DESCRIPTION',
					width : 100,
					editable : EnableEdit,
					edittype : 'textarea',
					editoptions : {
						rows : "5",
						cols : "10"
					},
					align : "center"
				}, {
					name : 'IS_PRIMARY',
					index : 'IS_PRIMARY',
					width : 100,
					editable : EnableEdit,
					edittype : 'checkbox',
					editoptions : {
						value : "1:0"
					},
					align : "center",
					formatter : "checkbox"
				}
			];
		} else if (path == "/ManageUser") {
			Caption = "User Details";
			Condition = "1=1 ORDER BY T1.CREATED";
			Table = "T_USER T1,(SELECT @rownum := 0) r";
			Column = "T1.*,@rownum := @rownum + 1 AS SL_ID";
			//BeforeSubmit = BeforeSubmitUser;
			navId = "pcelltblUser";
			colNames = ['ROW_ID', 'Sl No', 'User Name', 'First Name', 'Last Name', 'Email', 'Phone Number', 'Active', 'Account Lockout', 'Password Reset'];
			ColModelArr = [{
					name : 'id',
					index : 'id',
					hidden : true
				}, {
					name : 'SL_ID',
					index : 'SL_ID',
					width : 50,
					align : "center"
				}, {
					name : 'USER_NAME',
					index : 'USER_NAME	',
					width : 100,
					editable : false
				}, {
					name : 'FIRST_NAME',
					index : 'FIRST_NAME',
					width : 150,
					editable : EnableEdit,
					align : "center"
				}, {
					name : 'LAST_NAME',
					index : 'LAST_NAME',
					width : 100,
					editable : EnableEdit,
					align : "center"
				}, {
					name : 'EMAIL',
					index : 'EMAIL',
					width : 200,
					editable : EnableEdit,
					editrules : {
						email : true
					},
					align : "center"
				}, {
					name : 'PH_NUM_1',
					index : 'PH_NUM_1',
					width : 100,
					editable : true,
					editrules : {
						number : true
					},
					align : "center"
				}, {
					name : 'ACTIVE',
					index : 'ACTIVE',
					width : 100,
					editable : true,
					edittype : 'checkbox',
					editoptions : {
						value : "1:0"
					},
					align : "center",
					formatter : "checkbox"
				}, {
					name : 'ACCNT_LOCKED',
					index : 'ACCNT_LOCKED',
					width : 100,
					editable : true,
					edittype : 'checkbox',
					editoptions : {
						value : "1:0"
					},
					align : "center",
					formatter : "checkbox"
				}, {
					name : 'PASS_RESET',
					index : 'PASS_RESET',
					width : 100,
					editable : true,
					edittype : 'checkbox',
					editoptions : {
						value : "1:0"
					},
					align : "center",
					formatter : "checkbox"
				}

			];
		} else if (path == "/ManageTax") {
			Caption = "Tax Details";
			Condition = "1=1 ORDER BY T1.CREATED";
			Table = "T_TAX T1,(SELECT @rownum := 0) r";
			Column = "T1.*,@rownum := @rownum + 1 AS SL_ID";
			//BeforeSubmit = BeforeSubmitTax;
			navId = "pcelltblTax";
			colNames = ['Sl No', 'Tax Id', 'Type', 'Tax Name', 'Tax Rate'];
			ColModelArr = [{
					name : 'SL_ID',
					index : 'SL_ID',
					width : 50,
					align : "center"
				}, {
					name : 'id',
					index : 'id',
					hidden : false,
					width : 100,
					align : "center"
				}, {
					name : 'TYPE',
					index : 'TYPE	',
					width : 100,
					editable : EnableEdit
				}, {
					name : 'TAX_NAME',
					index : 'TAX_NAME',
					width : 100,
					editable : EnableEdit,
					align : "center"
				}, {
					name : 'TAX_RATE',
					index : 'TAX_RATE',
					width : 100,
					editable : EnableEdit,
					editrules : {
						number : true
					},
					align : "center"
				}
			];
		}

		LoadGrid(Table, Column, Condition, ColModelArr, colNames, Caption, navId);

	}
	function LoadGrid(Table, Column, Condition, ColModelArr, colNamesArr, Caption, navId) {
		//TabRef.jqGrid('clearGridData');
		TabRef.jqGrid({
			//height : '520',
			datatype : "local",
			gridview: true,
			colNames : colNamesArr,
			colModel : ColModelArr,
			sortname : 'id',
			//footerrow : true,
			//userDataOnFooter : true,
			viewrecords : true,
			sortorder : "desc",
			scroll : true,
			scrollrows : true,
			//pager : '#'+navId,
			caption : Caption,
			forceFit : true,
			gridview : true,
			cellEdit : true,
			forceFit : true,
			//rowNum:5,
			//rowList:[5,20,30],
			cellsubmit : 'remote',
			cellurl : 'php/application/CellEdit',
			afterSubmitCell : AfterSubmitCell,
			beforeSubmitCell : BeforeSubmit,beforeEditCell:BeforeEditCell,onSelectCell:OnCellSelect
		});
		//console.log(TabRef);
		Data.post('GetListOfValues', {
			Config : {
				"Condition" : Condition,
				"Column" : Column,
				"Table" : Table
			}
		}).then(function (result) {
			if (result.status == "success") {
				var dataLen = result.data.length;
				TabRef.jqGrid('clearGridData');
				for (var i = 0; i < dataLen; i++) {
					//result.data[i].SL_ID = i + 1;
					result.data[i].id = result.data[i].ROW_ID;
					TabRef.jqGrid('addRowData', result.data[i].ROW_ID, result.data[i]);
				}
				LoadSubgridforUser(result.data[0].id);
			}
		});
	}
	var lastSel = "";
	function OnCellSelect(id, cellname, value, iRow, iCol) {
		//console.log("RowSelect"+id);
		if (lastSel == "") {
			lastSel = id;
			if (path = "/ManageUser") {
				LoadSubgridforUser(id);
				//SetUserName(id);
			}
		} else if (id == lastSel) {}
		else {
			//console.log(id);
			lastSel = id;
			if (path = "/ManageUser") {
				LoadSubgridforUser(id);
				//SetUserName(id);
			}
		}
	}
	function BeforeEditCell(id, cellname, value, iRow, iCol) {
		//console.log("RowSelect"+id);
		if (lastSel == "") {
			lastSel = id;
			if (path = "/ManageUser") {
				LoadSubgridforUser(id);
				//SetUserName(id);
			}
		} else if (id == lastSel) {}
		else {
			//console.log(id);
			lastSel = id;
			if (path = "/ManageUser") {
				LoadSubgridforUser(id);
				
			}
		}
	}
	function SetUserName(id){
		var RowData = TabRef.jqGrid("getRowData",id);
		AdmOpt.UserNameRole = RowData["USER_NAME"];
		AdmOpt.UserId = RowData["id"];
	}
	function LoadSubgridforUser(FirstRecordId) {
		if (path == "/ManageUser") {
			SetUserName(FirstRecordId);
			/*var ArrId = TabRef.jqGrid('getDataIDs');
			if (ArrId.length > 0) {
			var FirstRecordId = ArrId[0];
			} else {
			return;
			}//*/
			var TabRefUserRole = $("#celltblUserRole");
			var Caption = "User Roles";
			var Condition = "T1.USER_ID='" + FirstRecordId + "' AND T2.ROW_ID = T1.ROLE AND T3.ROW_ID = T1.STORE_ID ORDER BY T1.CREATED";
			var Table = "T_USER_PROFILE T1,T_ROLE T2,T_STORE T3,(SELECT @rownum := 0) r";
			var Column = "T1.ROW_ID id,T1.ROW_ID ROW_ID,T2.ROLE_NAME,T2.DESCRIPTION,T3.STORE_NAME,@rownum := @rownum + 1 AS SL_ID";
			//var BeforeSubmit = BeforeSubmitUserProfile;
			//navId = "pcelltblUser";
			var colNamesArr = ['Sl No', 'ROW_ID', 'Role Name', 'Description', 'Store'];
			var ColModelArr = [{
					name : 'SL_ID',
					index : 'SL_ID',
					width : 50,
					align : "center"
				}, {
					name : 'id',
					index : 'id',
					hidden : true,
					width : 100,
					align : "center"
				}, {
					name : 'ROLE_NAME',
					index : 'ROLE_NAME	',
					width : 100,
					editable : false
				}, {
					name : 'DESCRIPTION',
					index : 'DESCRIPTION',
					width : 250,
					editable : false
				}, {
					name : 'STORE_NAME',
					index : 'STORE_NAME',
					width : 200,
					editable : false,
					editrules : {
						number : true
					}
				}
			];
			TabRefUserRole.jqGrid({
				//height : '520',
				datatype : "local",
				colNames : colNamesArr,
				colModel : ColModelArr,
				sortname : 'id',
				//footerrow : true,
				//userDataOnFooter : true,
				viewrecords : true,
				sortorder : "desc",
				//scroll : true,
				//scrollrows : true,
				//pager : '#'+navId,
				caption : Caption,
				forceFit : true,
				gridview : true,
				cellEdit : true,
				//rowNum:5,
				//rowList:[5,20,30],
				cellsubmit : 'remote',
				cellurl : 'php/application/CellEdit',
				afterSubmitCell : AfterSubmitCell,
				beforeSubmitCell : BeforeSubmit
			});
			//console.log(TabRef);
			Data.post('GetListOfValues', {
				Config : {
					"Condition" : Condition,
					"Column" : Column,
					"Table" : Table
				}
			}).then(function (result) {
				TabRefUserRole.jqGrid('clearGridData');
				if (result.status == "success") {
					var dataLen = result.data.length;
					for (var i = 0; i < dataLen; i++) {
						//result.data[i].SL_ID = i + 1;
						result.data[i].id = result.data[i].ROW_ID;
						TabRefUserRole.jqGrid('addRowData', result.data[i].ROW_ID, result.data[i]);
					}

				}
			});
			//LoadGrid(Table, Column, Condition, ColModelArr, colNames, Caption, BeforeSubmit, navId);
		}
	}

	function AfterSubmitCell(serverresponse, rowid, cellname, value, iRow, iCol) {
		//console.log(serverresponse);
		var mymess = serverresponse.responseJSON.message;
		var status = serverresponse.responseJSON.status;
		var retbool = true;
		if (status == 'error') {

			retbool = false;
			mymess = "Something went wrong during the update of " + cellname + " with below error \n" + mymess;
		}
		var myret = [retbool, mymess];
		return myret;
	}

	function BeforeSubmit(rowid, cellname, value, iRow, iCol) {
		if (path = "/ManageUser") {
			return {
				Column : cellname,
				Table : "T_USER",
				cellname : cellname
			};
		} else
			if (path = "/ManageStore") {
				return {
					Column : cellname,
					Table : "T_STORE",
					cellname : cellname
				};
			} else
				if (path = "/ManageTax") {
					return {
						Column : cellname,
						Table : "T_TAX",
						cellname : cellname
					};
				}

	}

});
