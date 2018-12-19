
myApp.controller('GridExample', function($scope, $rootScope, $routeParams, $location, $http, Data, DataStore, Constant, $q) {
   //var self = this;
	
	var parameters ={};
	var settings ={};
	var self = this;
	var TabRef = $("#celltbl");
	//console.log(Condition);
	var Condition = "";
		Data.post("GetOptions", {
			Config : {
				"Condition" : Condition
			}
		}).then(function (result) {
			console.log(result.data);
			if (result.status == "success") {
				self.SearchResult = result.data;
				var dataLen = result.data.length;
				for(var i = 0 ; i < dataLen ; i++){
					result.data[i].SL_ID = i+1;
					result.data[i].id = result.data[i].ROW_ID;
					TabRef.jqGrid('addRowData',result.data[i].ROW_ID,result.data[i]);
				}
				
			} else {}
		});
		
	TabRef.jqGrid({
   	//url:'server.php?q=2',
	//data:dataset,
	datatype: "local",
   	colNames:['ROW_ID','Sl No','Category','Backend Value', 'Display Value', 'Order By','Parent Id','Active'],
   	colModel:[
   		{name:'id',index:'id',hidden:true},
   		{name:'SL_ID',index:'SL_ID', width:100,align:"center"},
   		{name:'CATEGEORY',index:'CATEGEORY', width:150,editable:true,searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
   		{name:'BACKEND_VALUE',index:'BACKEND_VALUE', width:150,editable:true,searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
   		{name:'DISPLAY_VALUE',index:'DISPLAY_VALUE', width:150, align:"left",editable:true,searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
   		{name:'ORDER_BY',index:'ORDER_BY', width:100, align:"left",editable:true,editrules:{number:true},align:"center"},		
   		{name:'PARENT_ID',index:'PARENT_ID', width:150,align:"left",editable:true,searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},		
   		{name:'ACTIVE',index:'ACTIVE', width:100, sortable:false,editable:true,editrules:{number:true},align:"center"}		
   	],
   	rowNum:10,
   	rowList:[10,20,50],
   	pager: '#pcelltbl',
   	sortname: 'id',
    viewrecords: true,
    sortorder: "desc",
    caption:"List of Options",
	forceFit : true,
	cellEdit: true,
	cellsubmit: 'remote',cellurl:'php/application/updateOptions',
	afterEditCell: function (id,name,val,iRow,iCol){
		console.log(id+"..."+iRow);
		if(name=='invdate') {
			//jQuery("#"+iRow+"_invdate","#celltbl").datepicker({dateFormat:"yy-mm-dd"});
		}
	},
	afterSaveCell : function(rowid,name,val,iRow,iCol) {
		if(name == 'amount') {
			var taxval = jQuery("#celltbl").jqGrid('getCell',rowid,iCol+1);
			TabRef.jqGrid('setRowData',rowid,{total:parseFloat(val)+parseFloat(taxval)});
		}
		if(name == 'tax') {
			var amtval = jQuery("#celltbl").jqGrid('getCell',rowid,iCol-1);
			TabRef.jqGrid('setRowData',rowid,{total:parseFloat(val)+parseFloat(amtval)});
		}
	}
});
TabRef.jqGrid('navGrid','#pgwidth',{edit:false,add:false,del:false}).jqGrid('filterToolbar',{searchOperators : true});


self.AddNewOptions = function (){
	//alert("working");
	$location.path("AddOptions");
}
});

