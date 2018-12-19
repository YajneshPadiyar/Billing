myApp.controller('AddProductController', function ($scope, $rootScope, $routeParams, $location, $http, Data, DataStore) {
	var AddProduct = this;
	
	var TabRef = $("#celltbl");
	/*AddProduct.ProductTypeVal = [{"name":"Ready Made","val":"ReadyMade"},{"name":"Saree","val":"Saree"},{"name":"Silk","val":"Silk"},{"name":"Suting","val":"Suting"}
	];//*/
	if ($location.path() == "/AddProduct") {
		Data.post('select', {
			Query : {
				"Table" : "T_OPTIONS",
				"Where" : {
					"CATEGEORY" : "T_PRODUCT_TYPE",
					"ACTIVE" : "1"
				},
				"Order" : "ORDER_BY"
			}
		}).then(function (results) {
			//console.log(results);
			if (results.status = "success") {
				var dataLen = results.data.length;
				var productType = [];
				for (var i = 0; i < dataLen; i++) {
					productType[i] = {
						"name" : results.data[i]["DISPLAY_VALUE"],
						"val" : results.data[i]["BACKEND_VALUE"]
					};
				}
				//console.log(productType);
				AddProduct.ProductTypeVal = productType;
			}
		});
		Data.get("GetSession").then(function (result) {
			//console.log(result);
			if (result["UserId"] == "") {
				Data.toast2("info", "Please Login again. Do not refresh the page during the transaction.");
				$location.path('login');
			} else {
				AddProduct.FirstName = result["FirstName"];
				AddProduct.LastName = result["LastName"];
			}
		});
		AddProduct.ProductName = "Silk";
		AddProduct.DisplayName = "Silk";
		AddProduct.ProductType = "SAREE";
		AddProduct.CostPrice = 1000;
		AddProduct.SecretCode = "ABCD";
		AddProduct.SellPrice = 1200;
		AddProduct.WSPrice = 1100;
		AddProduct.BarCode = "123abc";
		AddProduct.Quantity = 10;
		AddProduct.Tax1 = 1;
		AddProduct.Tax2 = ""; //*/
	} else if ($location.path() == "/AddProductSuccess") {
		var AddedProduct = {};
		AddedProduct.ProductName = "Silk";
		AddedProduct.DisplayName = "Silk";
		AddedProduct.ProductType = "SAREE";
		AddedProduct.CostPrice = 1000;
		AddedProduct.SecretCode = "ABCD";
		AddedProduct.SellPrice = 1200;
		AddedProduct.WSPrice = 1100;
		AddedProduct.BarCode = "123abc";
		AddedProduct.Quantity = 10;
		AddedProduct.Tax1 = 1;
		AddedProduct.Tax2 = ""; //*/
		//var AddedProduct = DataStore.get("AddedProduct");
		//console.log(AddedProduct);
		var ProductDetail = [];
		ProductDetail[0] = {
			"L" : "Product Name",
			"V" : AddedProduct.ProductName
		};
		ProductDetail[1] = {
			"L" : "Display Name",
			"V" : AddedProduct.DisplayName
		};
		ProductDetail[2] = {
			"L" : "Type",
			"V" : AddedProduct.ProductType
		};
		var PricingDetail = [];
		PricingDetail[0] = {
			"L" : "Cost Price",
			"V" : AddedProduct.CostPrice
		};
		PricingDetail[1] = {
			"L" : "Secret Code",
			"V" : AddedProduct.SecretCode
		};
		PricingDetail[2] = {
			"L" : "Selling Price",
			"V" : AddedProduct.SellPrice
		};
		PricingDetail[3] = {
			"L" : "Wholesale Price",
			"V" : AddedProduct.WSPrice
		};
		var BarCodeDetails = [];
		BarCodeDetails[0] = {
			"L" : "BarCode",
			"V" : AddedProduct.BarCode
		};
		BarCodeDetails[1] = {
			"L" : "Quantity",
			"V" : AddedProduct.Quantity
		};
		BarCodeDetails[2] = {
			"L" : "Vat",
			"V" : AddedProduct.Tax1
		};
		AddProduct.SusProdDetail = ProductDetail;
		AddProduct.SusPriceDetail = PricingDetail;
		AddProduct.SudBarCodeDetail = BarCodeDetails; //*/
		//console.log(AddProduct);
	} else if ($location.path() == "/ListOfProducts") {
		TabRef.jqGrid({
			//url:'server.php?q=2',
			//data:dataset,
			datatype : "local",
			gridview : true,
			colNames : ['Sl No', 'Product Id', 'Product Name', 'Display Value', 'Type', 'Cost Price', 'Secret Code', 'Selling Price', 'Wholesale Price', 'Bar Code', 'Stock Quantity', 'Stock Sold','Stock Status','VAT Id'],
			colModel : [{
					name : 'SL_ID',
					index : 'SL_ID',
					width : 100,
					align : "center"
				}, {
					name : 'ROW_ID',
					index : 'ROW_ID',
					hidden : false,
					width : 50,
					hidden :true,
					align : "center"
				}, {
					name : 'PRODUCT_NAME',
					index : 'PRODUCT_NAME',
					width : 150,
					editable : true,
					searchoptions : {
						sopt : ['eq', 'ne', 'le', 'lt', 'gt', 'ge']
					}
				}, {
					name : 'DISPLAY_NAME',
					index : 'DISPLAY_NAME',
					width : 150,
					editable : true,
					searchoptions : {
						sopt : ['eq', 'ne', 'le', 'lt', 'gt', 'ge']
					}
				}, {
					name : 'TYPE',
					index : 'TYPE',
					width : 100,
					align : "left",
					editable : true,
					searchoptions : {
						sopt : ['eq', 'ne', 'le', 'lt', 'gt', 'ge']
					}
				}, {
					name : 'COST_PRICE',
					index : 'COST_PRICE',
					width : 75,
					align : "left",
					editable : true,
					editrules : {
						number : true
					},
					align : "center"
				}, {
					name : 'SEC_BAR_CODE',
					index : 'SEC_BAR_CODE',
					width : 100,
					align : "left",
					editable : true,
					searchoptions : {
						sopt : ['eq', 'ne', 'le', 'lt', 'gt', 'ge']
					}
				}, {
					name : 'RETAIL_SELL_PRICE',
					index : 'RETAIL_SELL_PRICE',
					width : 75,
					sortable : false,
					editable : true,
					editrules : {
						number : true
					},
					align : "center"
				}, {
					name : 'WS_SELL_PRICE',
					index : 'WS_SELL_PRICE',
					width : 100,
					sortable : false,
					editable : true,
					editrules : {
						number : true
					},
					align : "center"
				}, {
					name : 'BAR_CODE',
					index : 'BAR_CODE',
					width : 100,
					sortable : false,
					editable : true,
					align : "left"
				}, {
					name : 'QUANTITY',
					index : 'QUANTITY',
					width : 100,
					sortable : false,
					editable : true,
					editrules : {
						number : true
					},
					align : "center"
				}, {
					name : 'SOLD',
					index : 'SOLD',
					width : 100,
					sortable : false,
					editable : true,
					editrules : {
						number : true
					},
					align : "center"
				},{
					name : 'Stock',
					index : 'Stock',
					width : 100,
					sortable : true,					
					align : "center"
				},{
					name : 'TAX_ID_1',
					index : 'TAX_ID_1',
					width : 100,
					sortable : false,
					editable : true,
					editrules : {
						number : true
					},
					align : "center"
				}
			],
			rowNum : 10,
			height : '60%',
			rowList : [10, 50, 100],
			//pager : '#pcelltbl',
			sortname : 'id',
			viewrecords : true,
			sortorder : "desc",
			caption : "List of Stock",
			forceFit : true,
			cellEdit : true,
			cellsubmit : 'remote',
			cellurl : 'php/application/updateProducts',
			afterEditCell : function (id, name, val, iRow, iCol) {
				//console.log(id + "..." + iRow);
				if (name == 'invdate') {
					//jQuery("#"+iRow+"_invdate","#celltbl").datepicker({dateFormat:"yy-mm-dd"});
				}
			},
			afterSaveCell : function (rowid, name, val, iRow, iCol) {
				//console.log(this);
				/*if (name == 'amount') {
					var taxval = jQuery("#celltbl").jqGrid('getCell', rowid, iCol + 1);
					TabRef.jqGrid('setRowData', rowid, {
						total : parseFloat(val) + parseFloat(taxval)
					});
				}
				if (name == 'tax') {
					var amtval = jQuery("#celltbl").jqGrid('getCell', rowid, iCol - 1);
					TabRef.jqGrid('setRowData', rowid, {
						total : parseFloat(val) + parseFloat(amtval)
					});
				}//*/
			},
			afterSubmitCell: function (serverresponse, rowid, cellname, value, iRow, iCol) {
               //console.log(serverresponse);
			   var mymess = serverresponse.responseJSON.message;
			   var status = serverresponse.responseJSON.status;
			   var retbool = true;
			   if(status == 'error'){
					
					retbool = false;
					mymess = "Something went wrong during the update of "+cellname+" with below error \n"+mymess;
			   }
			   var myret = [retbool,mymess];
				return myret;
			   },rowattr: function (rd) {
				var TotalStock = rd.QUANTITY;
				var StockSold = rd.SOLD;
				var remainingStock = TotalStock-StockSold;
					if (remainingStock < 1) { // verify that the testing is correct in your case
						return {"class": "RowHighLight"};
					}//*/
				}
               
			
		});
		
		AddProduct.InStock = 0;
		AddProduct.OutStock = 0;
		AddProduct.BookOrder = 0;
		
		TabRef.jqGrid('navGrid', '#pgwidth', {
			edit : false,
			add : false,
			del : false
		}).jqGrid('filterToolbar', {
			searchOperators : true
		});

		var Condition = "";
		var Column = "*";

		Data.post('GetListOfProducts', {
			Config:{"Condition" : Condition,
			"Column" : Column}
		}).then(function (result) {
			if (result.status == "success") {
				//Data.toast2("success", "Product Added successfully !!");
				//DataStore.set(AddProduct,"AddedProduct");
				//$location.path('AddProductSuccess');
				var dataLen = result.data.length;
				for (var i = 0; i < dataLen; i++) {
					result.data[i].SL_ID = i + 1;
					result.data[i].id = result.data[i].ROW_ID;
					
					var Quantity = result.data[i].QUANTITY;
					var Sold = result.data[i].SOLD;
					var Stock = "";
					if(Quantity-Sold>0){
						if(Quantity-Sold>5){
							AddProduct.InStock++;						
							Stock = "InStock";
						}else{
							AddProduct.BookOrder++;
							Stock = "Book Order";
						}
					}else{
						AddProduct.OutStock++;
						Stock = "Out of Stock";
					}
					result.data[i].Stock = Stock;
					TabRef.jqGrid('addRowData', result.data[i].ROW_ID, result.data[i]);
				}
				$scope.data = [
					{
						key: "In Stock",
						y: AddProduct.InStock
					},
					{
						key: "Out of Stock",
						y: AddProduct.OutStock
					},
					{
						key: "Book Order",
						y: AddProduct.BookOrder
					}
				];
				//console.log("AddProduct.OutStock : "+AddProduct.OutStock);
				//console.log("AddProduct.InStock : "+AddProduct.InStock);
			} else {
				Data.toast(result);
			}
		});
	}else if($location.path() == "/PrintBarCode" ){
		Data.post("GetSessionVal", {
		session : {
			"Type" : "PrintProductCode"
		}
	}).then(function (result) {
		//console.log(result);
		if (result.status == "success") {
			//AddProduct.BarCode = result.data;
			//$(".DisplayBill").attr('src',Bill.Source);
			Data.post("SearchProduct",{
				"Product":{"ProductCode":result.data}
			}).then(function(result){
				//console.log(result);
				AddProduct.NoOfLabel = 2;
				AddProduct.ItemName = result.data[0].DISPLAY_NAME; 
				AddProduct.BarCode = result.data[0].BAR_CODE;
				AddProduct.ProductDetails = new Array();
				AddProduct.ProdcutDetails = result.data[0];
			});
		}
	});
	}
	
	function DeleteButton(cellvalue, options, rowObject) {
		return ("<img src='img/cancel.png' class='DeleteRecord' id='" + rowObject.SL_ID + "' ROW_ID='"+rowObject.ROW_ID+"'/>")
	}
	
	$(".ApplicationContent").delegate(".DeleteRecord", "click", function () {
		//alert("working : " + $(this).attr('id'));
		var SL_ID = $(this).attr('id');
		var ROW_ID = $(this).attr('ROW_ID');
		console.log(ROW_ID);
		console.log(SL_ID);
		
		TabRef.jqGrid('delRowData', Number(ROW_ID));
		
		Data.post("InactivateProduct",{
				"Product":{"ProductId":ROW_ID}
			}).then(function(result){
				console.log(result);
			});
	});
	
	AddProduct.AddOneMoreProduct = function () {
		$location.path('AddProduct');
	}
	AddProduct.GoToHome = function () {
		$location.path('HomePage');
	}
	AddProduct.AddProducts = function (ProdcutDetail) {
		var ProductName = AddProduct.ProductName;
		var DisplayName = AddProduct.DisplayName;
		var ProductType = AddProduct.ProductType;
		var CostPrice = AddProduct.CostPrice;
		var SecretCode = AddProduct.SecretCode;
		var SellPrice = AddProduct.SellPrice;
		var WSPrice = AddProduct.WSPrice;
		var BarCode = AddProduct.BarCode;
		var Quantity = AddProduct.Quantity;
		var Tax1 = AddProduct.Tax1;
		var Tax2 = AddProduct.Tax2;

		if (!ProductName || !DisplayName || !ProductType
			 || !CostPrice || !SecretCode || !SellPrice
			 || !Quantity) {

			Data.toast2("warning", "Plese enter all the required fields.");
		} else {
			Data.post('AddProduct', {
				Product : AddProduct
			}).then(function (result) {
				if (result.status == "success") {
					Data.toast2("success", "Product Added successfully !!");
					DataStore.set(AddProduct, "AddedProduct");
					$location.path('AddProductSuccess');
				} else {
					Data.toast(result);
				}
			});
		}
	};
	
	AddProduct.StartLogout = function () {
		DataStore.set("", "UserDetails");
		$location.path('login');
		Data.toast2("info", "Logged out Successfully");
	};

	AddProduct.AddNewProduct = function () {
		$location.path('AddProduct');
	}
	AddProduct.GotoStockManagement= function () {
		$location.path('ListOfProducts');
	}
	AddProduct.PrintBarcode = function () {
		var selRowId = TabRef.jqGrid ('getGridParam', 'selrow');		
		if(selRowId == null){
			Data.toast2("info","Please select one of the product");
			return;
		}
		var ProductId = TabRef.jqGrid("getCell",selRowId,"BAR_CODE");
		Data.post("SetSessionVal", {
			session : {
				"Type" : 'PrintProductCode',
				"Val" : ProductId
			}
		}).then(function (result) {});
		
		$location.path('PrintBarCode');
	}
	AddProduct.PrintLabel = function (){
		var TotalLbl = AddProduct.NoOfLabel;
		if(TotalLbl == null || TotalLbl == 0){
			Data.toast2("info","Please enter the Number of Labels");
			return;
		}else if(TotalLbl>39){
			Data.toast2("info","Only 39 labels can be printed at once.");
			return;
		}
		var NewDate = new Date();
		var DateTime = NewDate.getDate() + "/" + (NewDate.getMonth() + 1) + "/" + NewDate.getFullYear()
			 + " " + NewDate.getHours() + ":" + NewDate.getMinutes() + ":" + NewDate.getSeconds();
		var DateOnly = NewDate.getDate() + "/" + (NewDate.getMonth() + 1) + "/" + NewDate.getFullYear();
		var TimeStamp = NewDate.getDate() +''+ (NewDate.getMonth() + 1)+'' +  NewDate.getFullYear()+''
			 + NewDate.getHours() +''+ NewDate.getMinutes() +''+  NewDate.getSeconds();
		Data.post('GenerateBarCode', {
			"ProdcutDetails" : AddProduct.ProdcutDetails,
			"TotalLabel" : AddProduct.NoOfLabel,
			"DateOnly" : DateOnly,
			"DateTime" : DateTime,
			"TimeStamp" : TimeStamp
		}).then(function (result) {
			//console.log(result);
			if(result["status"] == "success"){
				AddProduct.Source = "fileSystem/BarCode/"+result["FileName"]+"?random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
				cosole.log(AddProduct.Source);
			}else{
				
			}
		});
	}
	
	$scope.options = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: 5,
                        right: 70,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        
		
		
	
});
