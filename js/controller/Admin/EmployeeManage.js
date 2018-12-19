myApp.controller('EmployeeManageCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, Constant, $q, $log) {
	var EmpMgm = this;
	EmpMgm.RecordsFound = false;
	EmpMgm.gYears = new Array();
	EmpMgm.gMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	EmpMgm.gDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var toDay = new Date();
	var toYYYY = toDay.getFullYear();
	var toDD = toDay.getDate();
	var toMMM = EmpMgm.gMonths[toDay.getMonth()];
	EmpMgm.MonthSelect = toMMM;
	EmpMgm.YearSelect = toYYYY;
	for (var i = 5; i >= 0; i--) {
		EmpMgm.gYears.push(toYYYY - i);
	}

	EmpMgm.CatType = [];
	EmpMgm.StatusList = [{
			name : 'Active',
			val : 1
		}, {
			name : 'Inactive',
			val : 0
		}
	];

	var path = $location.path();
	//console.log(path);
	var TabRef = null;
	var EnableEdit = true;
	var EnableHidden = true;
	if (path == "/ManageEmployee") {
		InitialiseManageEmployee();
	} else if (path == "/AttendanceList") {
		InitialiseAttendanceList();
	} else if (path == "/AdminOptionsNew") {
		var CatTypeDummy = {
			val : '',
			name : 'none'
		};
		EmpMgm.CatType.unshift(CatTypeDummy);
	} else if (path == "/ApplyLeave") {
		InitialiseApplyLeave();
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
	
	function InitialiseApplyLeave(){
		EmpMgm.LeaveTotal = 0;
		EmpMgm.LeaveTypeList = new Array();
		Data.get("GetSession").then(function (result) {
			//console.log(result);
			if (result["UserId"] == "") {
				
			} else {
				EmpMgm.UserRowId = result["UserRowId"];
				EmpMgm.UserID = result["UserId"];
				EmpMgm.UserName = result["FirstName"]+", "+result["LastName"];
			}
		});
		Data.post("GetOptionsType", {
			Config : {
				"Condition" : "CATEGEORY='T_LEAVE_TYPE'",
				Column : "DISTINCT BACKEND_VALUE,DISPLAY_VALUE"
			}
		}).then(function (result) {
			//console.log(result.data);
			if (result.status == "success") {
				var dataLen = result.data.length;

				for (var i = 0; i < dataLen; i++) {
					//console.log(result.data.CATEGEORY);
					EmpMgm.LeaveTypeList[i] = {
						val : result.data[i].BACKEND_VALUE,
						name : result.data[i].DISPLAY_VALUE
					};
				}
			} else {}
		});
	}
	
	function InitialiseManageEmployee() {
		var gMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var toDay = new Date();
		var toDD = toDay.getDate();
		var toMMM = gMonths[toDay.getMonth()];
		var toYYYY = toDay.getFullYear();
		var toSDate = (toDD < 10 ? "0" + toDD : toDD) + " " + toMMM + " " + toYYYY;
		var Condition = "1=1 AND A.USER_NAME != 'ADMIN' ORDER BY A.USER_NAME";
		var Table = "T_USER AS A LEFT JOIN (SELECT T1.USER_ID,T1.ROW_ID,T1.LEAVE_TYPE FROM T_ATTENDANCE T1 WHERE DATE_FORMAT(T1.ATTENDANCE_DATE,'%d %b %Y')='" + toSDate + "') AS B ON A.ROW_ID = B.USER_ID";
		var Column = "A.ROW_ID USERID,B.ROW_ID AttId,A.USER_NAME,CONCAT(A.FIRST_NAME,', ',A.LAST_NAME) FULLNAME,B.LEAVE_TYPE LType";
		//SELECT A.ROW_ID USERID,B.ROW_ID AttId,A.USER_NAME FROM T_USER AS A LEFT JOIN (SELECT T1.USER_ID,T1.ROW_ID FROM T_ATTENDANCE T1 WHERE DATE_FORMAT(T1.ATTENDANCE_DATE,'%d %b %Y')='17 Sep 2016') AS B ON A.ROW_ID = B.USER_ID

		Data.post('GetListOfValues', {
			Config : {
				"Condition" : Condition,
				"Column" : Column,
				"Table" : Table
			}
		}).then(function (result) {
			if (result.status == "success") {
				var dataLen = result.data.length;
				var data = result.data;
				var newArry = new Array();
				var newArry2 = new Array();
				for (var i = 0; i < dataLen; i++) {
					if (data[i]["AttId"] == null) {
						newArry[newArry.length] = data[i];
					} else {
						newArry2[newArry2.length] = data[i];
					}
				}

				EmpMgm.UserList = newArry.concat(newArry2);
			}
		});
	}

	EmpMgm.AttandanceList = {};
	EmpMgm.DayList = {};
	function InitialiseAttendanceList() {
		var gMonths = EmpMgm.gMonths;
		//var toDay = new Date();
		//var toDD = toDay.getDate();
		//var toMMM = gMonths[toDay.getMonth()];
		//var toYYYY = toDay.getFullYear();
		//var toSDate = (toDD<10?"0"+toDD:toDD)+" "+toMMM+" "+toYYYY;
		var toYYYY = EmpMgm.YearSelect;
		var toMMM = EmpMgm.MonthSelect;
		var FromDate = toYYYY + "-" + (gMonths.indexOf(toMMM) + 1) + "-01";
		var ToDate = toYYYY + "-" + (gMonths.indexOf(toMMM) + 1) + "-" + EmpMgm.gDays[gMonths.indexOf(toMMM)];
		var Condition = "A.USER_NAME != 'ADMIN' AND A.ROW_ID = B.USER_ID AND ATTENDANCE_DATE>='" + FromDate + "' AND ATTENDANCE_DATE<='" + ToDate + "'";
		var Table = "T_USER A, T_ATTENDANCE B";
		var Column = "A.ROW_ID,A.USER_NAME,A.FIRST_NAME,A.LAST_NAME,DATE_FORMAT(B.ATTENDANCE_DATE,'%e %b %Y') ATTENDANCE_DATE,B.STATUS,B.LEAVE_TYPE LType";
		//SELECT A.ROW_ID USERID,B.ROW_ID AttId,A.USER_NAME FROM T_USER AS A LEFT JOIN (SELECT T1.USER_ID,T1.ROW_ID FROM T_ATTENDANCE T1 WHERE DATE_FORMAT(T1.ATTENDANCE_DATE,'%d %b %Y')='17 Sep 2016') AS B ON A.ROW_ID = B.USER_ID

		Data.post('GetListOfValues', {
			Config : {
				"Condition" : Condition,
				"Column" : Column,
				"Table" : Table
			}
		}).then(function (result) {
			//console.log(result);
			var data = result.data;
			var dataLen = data.length;
			var UAList = {}
			for (var i = 0; i < dataLen; i++) {
				if (UAList.hasOwnProperty(data[i]["ROW_ID"])) {
					UAList[data[i]["ROW_ID"]]["AttendList"].push({
						key : data[i]["ATTENDANCE_DATE"],
						value : true,
						Type : data[i]["LType"]
					});
				} else {
					UAList[data[i]["ROW_ID"]] = {};
					UAList[data[i]["ROW_ID"]]["AttendList"] = new Array();
					UAList[data[i]["ROW_ID"]]["AttendList"].push({
						key : data[i]["ATTENDANCE_DATE"],
						value : true,
						Type : data[i]["LType"]
					});
					UAList[data[i]["ROW_ID"]]["USER_ID"] = data[i]["ROW_ID"];
					UAList[data[i]["ROW_ID"]]["USER_NAME"] = data[i]["FIRST_NAME"] + ", " + data[i]["LAST_NAME"];
					UAList[data[i]["ROW_ID"]]["LOGIN_ID"] = data[i]["USER_NAME"];
				}
			}
			//console.log(UAList);
			var Days = 0;
			if (toMMM == "Feb") {
				if (Number(toYYYY) % 4 == 0) {
					Days = 29;
				} else {
					Days = 28;
				}
			} else {
				Days = EmpMgm.gDays[EmpMgm.gMonths.indexOf(toMMM)];
			}

			var UALen = UAList.length;
			//var FList = {};
			var MonthList = {};
			for (var i = 1; i <= Days; i++) {
				var index = (i > 9 ? i : i); //+" "+toMMM+" "+toYYYY;
				MonthList[index] = index;
			}
			//console.log(MonthList);
			EmpMgm.DayList = MonthList;

			for (x in UAList) {
				UAList[x]["FinalList"] = new Array();
				for (var i = 1; i <= Days; i++) {
					var index = (i > 9 ? i : "0" + i) + " " + toMMM + " " + toYYYY;
					var fFlg = false;
					var status = "";
					for (k in UAList[x].AttendList) {
						if (UAList[x].AttendList[k].key == index) {
							fFlg = true;
							status = UAList[x].AttendList[k].Type;
							break;
						}
					}
					UAList[x].FinalList.push({
						key : index,
						value : fFlg,
						Type : status
					});
				}
			}
			//console.log(UAList);
			EmpMgm.AttandanceList = UAList;
			EmpMgm.RecordsFound = dataLen==0?false:true;
			
		});
	}

	EmpMgm.Goto = function (Page) {
		$location.path(Page);
	}
	
	EmpMgm.OnLeaveDateChange = function(B){
		var LStartDate = EmpMgm.LeaveStartDate;
		var LEndDate = EmpMgm.LeaveEndDate;
		if(LStartDate == null || LEndDate == null){
			return;
		}
		switch(B){
			case "S":
				//if()
				EmpMgm.LeaveTotal= (LEndDate-LStartDate)/(60*60*24*1000);
			break;
			case "E":
				EmpMgm.LeaveTotal= (LEndDate-LStartDate)/(60*60*24*1000);
			break;
			default:
		}
	}
	EmpMgm.SubmitLeave = function (){
		Data.toast2("info", "Please Login again. Do not refresh the page during the StartBill.");
	}
	EmpMgm.MarkPresent = function (USERID, index, status) {
		//console.log("USERID : "+USERID);
		var toDay = new Date();
		var toDD = toDay.getDate();
		var toMM = toDay.getMonth();
		toMM++;
		var toYYYY = toDay.getFullYear();
		var sTable = "t_attendance";
		var aColVal = {};
		aColVal["USER_ID"] = USERID;
		aColVal["ATTENDANCE_DATE"] = toYYYY + "-" + toMM + "-" + toDD;
		aColVal["DAY_QUANTITY"] = 1;
		aColVal["STATUS"] = status;
		aColVal["LEAVE_TYPE"] = status == 1 ? 'Present' : 'Leave';
		EmpMgm.UserList[index]["AttId"] = status;
		EmpMgm.UserList[index]["LType"] = aColVal["LEAVE_TYPE"];

		Data.post('InsertItem', {
			item : {
				Table : sTable,
				ColVal : aColVal
			}
		}).then(function (result) {
			if (result.status == "success") {
				Data.toast2("success", "Marked Present successfully !!");
				//InitialiseManageEmployee();
			} else {
				Data.toast(result);
			}
		});
	}
	EmpMgm.MonthSelected = function (m) {
		//console.log(m);
		if (m == EmpMgm.MonthSelect) {}
		else {
			EmpMgm.MonthSelect = m
				InitialiseAttendanceList();
		}
	}
	EmpMgm.YearSelected = function (y) {
		//console.log(y);
		if (y == EmpMgm.YearSelect) {}
		else {
			EmpMgm.YearSelect = y;
			InitialiseAttendanceList();
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
			gridview : true,
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
			beforeSubmitCell : BeforeSubmit,
			beforeEditCell : BeforeEditCell,
			onSelectCell : OnCellSelect
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
	function SetUserName(id) {
		var RowData = TabRef.jqGrid("getRowData", id);
		EmpMgm.UserNameRole = RowData["USER_NAME"];
		EmpMgm.UserId = RowData["id"];
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
