<?php
$app->post('/GeneratePDF', function() use ($app) { 

$response = array();
$r = json_decode($app->request->getBody());
$db = new dbHelper();
$TransactionId = $r->TransactionId;
$DateTime = $r->DateTime;
//PDF Config
$TotalLength = 190;
$LineHeight10 = 10;
$LineHeight5 = 5;
$borders = 0;
//PDF Constants
$Table = "T_OPTIONS";
$where = "CATEGEORY = 'COMPANY_DETAILS'" ;
$col = "*";
$CompDetails  = $db->select3($Table,$col,$where); 	
$Title = "TAX INVOICE";
$CompanyName = "";
$CompanyType = "";
$CompanyAddress = "";
$TINNUMBER = "";
$PhNum1 = "";
$PhNum2 = "";
$CustomMessage="";

if($CompDetails["status"]=="success"){
	foreach($CompDetails["data"] as $CompDet=>$Comp){
		if($Comp["BACKEND_VALUE"]=="NAME"){
			//print_r("Name");
			$CompanyName = $Comp["DISPLAY_VALUE"];
			//print_r($CompanyName);
		}elseif($Comp["BACKEND_VALUE"]=="TIN"){
			$TINNUMBER = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="PHNUM1"){
			$PhNum1 = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="PHNUM2"){
			$PhNum2 = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="CUSTOM_MESSAGE"){
			$CustomMessage = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="ADDRESS"){
			$CompanyAddress = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="COMPANY_TYPE"){
			$CompanyType = $Comp["DISPLAY_VALUE"];
		}
	}
}

$Table = "T_BILL_DETAILS T1, T_PRODUCT T2";
$where = "TRANS_ID = '".$TransactionId."' AND T1.PRODUCT_ID = T2.ROW_ID AND T1.INACTIVE='0'" ;
$col = "T1.ROW_ID,T2.DISPLAY_NAME,T1.QUANTITY,T1.PRICE,T1.TOTAL";
$BillDetails  = $db->select3($Table,$col,$where);

$Table = "T_TRANSACTION T1,T_USER T2";
$where = "T1.ROW_ID = '".$TransactionId."' AND T1.USER_ID = T2.ROW_ID" ;
$col = "T1.TOTAL_AMOUNT,T1.QUANTITY,T2.USER_NAME,T2.DISCOUNT";
$TransDetails = $db->select3($Table,$col,$where);
//print_r($TransDetails);
//SELECT   FROM t_bill_details T1,t_product T2 WHERE T1.QUANTITY = T2.ROW_ID
if($BillDetails["status"] == 'success' and $TransDetails["status"]=='success'){
	$pdf = new PDF_Code128();
	$pdf->AddPage('L');
	$pdf->SetFont('Arial','',6);
	$pdf->SetTextColor(51,51,51);
	$xPos = $pdf->GetX();
	$yPos = $pdf->GetY();
	$CodeString=$TransactionId;
	$pdf->Code128($xPos,$yPos,$CodeString,50,10);
	$pdf->SetY($yPos+12);
	$pdf->Write(1,"Bill No : ".$CodeString);
	$pdf->SetFont('Arial','B',12);
	$pdf->SetX($xPos);
	//$pdf->MultiCell($TotalLength,$LineHeight5,'',$borders,'C');
	$pdf->MultiCell($TotalLength,$LineHeight5,$Title,$borders,'C');
	$pdf->MultiCell($TotalLength,$LineHeight5,$CompanyName,$borders,'C');
	$pdf->SetFont('Arial','',10);
	$pdf->MultiCell($TotalLength,$LineHeight5,$CompanyType,$borders,'C');
	$pdf->SetFont('Arial','I',10);
	$pdf->MultiCell($TotalLength,$LineHeight5,$CompanyAddress,$borders,'C');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell($TotalLength-140,$LineHeight5,'TIN-'.$TINNUMBER,$borders,0,'L');
	$pdf->Cell($TotalLength-50,$LineHeight5,'Ph. Num-'.$PhNum1,$borders,1,'R');
	$pdf->Cell($TotalLength,$LineHeight5,'Ph. Num-'.$PhNum2,$borders,1,'R');
	$pdf->Cell($TotalLength-95,$LineHeight5,'Bi	lling Number : '.$TransactionId,$borders,0,'L');
	$pdf->Cell($TotalLength-95,$LineHeight5,'Date Time-'.$DateTime,$borders,1,'R');
	$pdf->SetFont('Arial','B',8);
	$pdf->SetTextColor(51,51,51);	
	$pdf->Cell($TotalLength-180,$LineHeight5,"Sl.no",'BT',0);		
	$pdf->Cell($TotalLength-130,$LineHeight5,"Item Name",'BT',0,'L');		
	$pdf->Cell($TotalLength-170,$LineHeight5,"Quantity",'BT',0,'C');		
	$pdf->Cell($TotalLength-170,$LineHeight5,"Price",'BT',0,'C');
	$pdf->Cell($TotalLength-170,$LineHeight5,"Total",'BT',1,'C');
	$pdf->SetFont('Arial','',8);
	$Cnt = 1;
	foreach($BillDetails["data"] as $BillDet=>$Bill){
		//print_r($Bill);		
		$pdf->Cell($TotalLength-180,$LineHeight5,$Cnt,$borders);		
		$pdf->Cell($TotalLength-130,$LineHeight5,$Bill["DISPLAY_NAME"],$borders,0,'L');		
		$pdf->Cell($TotalLength-170,$LineHeight5,$Bill["QUANTITY"],$borders,0,'C');		
		$pdf->Cell($TotalLength-170,$LineHeight5,$Bill["PRICE"],$borders,0,'C');		
		$pdf->Cell($TotalLength-170,$LineHeight5,$Bill["TOTAL"],$borders,1,'C');		
		$Cnt = $Cnt + 1;
		//$pdf->MultiCell($TotalLength,$LineHeight5,$Bill["ROW_ID"].$Bill["DISPLAY_NAME"],$borders);		
	}
	$pdf->MultiCell($TotalLength,1,'','B','C');
	$pdf->Cell($TotalLength-180,$LineHeight5,'',$borders);		
	$pdf->Cell($TotalLength-130,$LineHeight5,'Total : ',$borders,0,'R');		
	$pdf->Cell($TotalLength-170,$LineHeight5,$TransDetails["data"][0]["QUANTITY"],$borders,0,'C');		
	$pdf->Cell($TotalLength-170,$LineHeight5,'',$borders,0,'C');		
	$pdf->Cell($TotalLength-170,$LineHeight5,$TransDetails["data"][0]["TOTAL_AMOUNT"],$borders,1,'C');
	if($TransDetails["data"][0]["DISCOUNT"]>0){
		$pdf->Cell($TotalLength,$LineHeight5,'Discount   =    '.$TransDetails["data"][0]["DISCOUNT"],$borders,1,'C');
	}
	$pdf->SetFont('Arial','B',12);
	$pdf->Cell($TotalLength,$LineHeight5,'GRAND TOTAL   =    '.$TransDetails["data"][0]["TOTAL_AMOUNT"],$borders,1,'C');
	$VAT = "5.5";
	$TotalNoVat = "";
	$TAX = "";
	$pdf->SetFont('Arial','',8);
	$pdf->MultiCell($TotalLength,$LineHeight5,"VAT @ ".$VAT."% SALES :  ".$TotalNoVat."  TAX :  ".$TAX,$borders,'L');
	$pdf->MultiCell($TotalLength,1,'','T','C');
	$pdf->SetFont('Arial','',10);
	$pdf->Ln();
	$pdf->MultiCell($TotalLength,$LineHeight5,$CustomMessage,$borders,'L');
	$pdf->MultiCell($TotalLength,$LineHeight5,"Billed By :  ".$TransDetails["data"][0]["USER_NAME"],$borders,'L');
	
	$pdf->Output('F');
}else{
	echoResponse(201,$BillDetails);
}



});

$app->post('/GeneratePDF2', function() use ($app) { 

$response = array();
$r = json_decode($app->request->getBody());
$db = new dbHelper();
$TransactionId = $r->TransactionId;
$DateTime = $r->DateTime;
$TimeStamp = $r->TimeStamp;
$Type = $r->Type;
//PDF Config
$TotalLength = 100;
$TotalHeight = 230;
$LineHeight10 = 10;
$LineHeight5 = 5;
$borders = 0;
$MarginLeft=1;
$MarginRight=1;
$MarginTop=1;
$TotCol = 6;
$FontSizeExtraSmall = 6;
$FontSizeSmall = 8;
$FontSizeMedium = 10;
$FontSizeLarge = 12;
$FontStyle = 'Courier';
$ContentWidth = $TotalLength-$MarginLeft-$MarginRight;
$Col1 = (10/100)*$ContentWidth;
$Col2 = (30/100)*$ContentWidth;
$Col3 = (15/100)*$ContentWidth;
$Col4 = (15/100)*$ContentWidth;
$Col5 = (10/100)*$ContentWidth;
$Col6 = (15/100)*$ContentWidth;
//PDF Constants
$Table = "T_OPTIONS";
$where = "CATEGEORY = 'COMPANY_DETAILS'" ;
$col = "*";
$CompDetails  = $db->select3($Table,$col,$where); 	
$Title = "TAX INVOICE";
$CompanyName = "";
$CompanyType = "";
$CompanyAddress = "";
$TINNUMBER = "";
$PhNum1 = "";
$PhNum2 = "";
$CustomMessage="";

if($CompDetails["status"]=="success"){
	foreach($CompDetails["data"] as $CompDet=>$Comp){
		if($Comp["BACKEND_VALUE"]=="NAME"){
			//print_r("Name");
			$CompanyName = $Comp["DISPLAY_VALUE"];
			//print_r($CompanyName);
		}elseif($Comp["BACKEND_VALUE"]=="TIN"){
			$TINNUMBER = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="PHNUM1"){
			$PhNum1 = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="PHNUM2"){
			$PhNum2 = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="CUSTOM_MESSAGE"){
			$CustomMessage = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="ADDRESS"){
			$CompanyAddress = $Comp["DISPLAY_VALUE"];
		}
		elseif($Comp["BACKEND_VALUE"]=="COMPANY_TYPE"){
			$CompanyType = $Comp["DISPLAY_VALUE"];
		}elseif($Comp["BACKEND_VALUE"]=="CURRENCY"){
			$Currency = $Comp["DISPLAY_VALUE"];
		}
	}
}

$Table = "T_BILL_DETAILS T1, T_PRODUCT T2";
$where = "TRANS_ID = '".$TransactionId."' AND T1.PRODUCT_ID = T2.ROW_ID AND T1.INACTIVE='0'" ;
$col = "T1.ROW_ID,T2.DISPLAY_NAME,T1.QUANTITY,T1.PRICE,T1.TOTAL,T1.VAT";
$BillDetails  = $db->select3($Table,$col,$where);
$TotalCount=0;
foreach($BillDetails["data"] as $BillDet=>$Bill){
	$TotalCount = $TotalCount + 1;
}

$TotalHeight = ($TotalCount*$LineHeight5)+(14)+($LineHeight5*22);

$Table = "T_TRANSACTION T1,T_USER T2";
$where = "T1.ROW_ID = '".$TransactionId."' AND T1.USER_ID = T2.ROW_ID" ;
$col = "T1.TOTAL_AMOUNT,T1.QUANTITY,T2.USER_NAME,T1.RETURN_ID,T1.DISCOUNT";
$TransDetails = $db->select3($Table,$col,$where);
//print_r($TransDetails);
//SELECT   FROM t_bill_details T1,t_product T2 WHERE T1.QUANTITY = T2.ROW_ID
if($BillDetails["status"] == 'success' and $TransDetails["status"]=='success'){
	$pdf = new PDF_Code128('P','mm',array($TotalLength,$TotalHeight));
	$pdf->AddPage();
	$pdf->SetMargins($MarginLeft,$MarginTop,$MarginRight);
	$pdf->SetFont('Arial','',$FontSizeExtraSmall);
	$pdf->SetTextColor(51,51,51);
	$xPos = $MarginLeft;
	$yPos = $MarginTop;
	$CodeString=$TransactionId;
	$pdf->Code128($xPos+($ContentWidth-50)/2,$yPos,$CodeString,50,10);
	$pdf->SetY($yPos+12);
	if($Type == "Return"){
		$pdf->Write(1,"Return Bill No : ".$CodeString." Main Bill No : ".$TransDetails["data"][0]["RETURN_ID"] );
	}else{
		$pdf->Write(1,"Bill No : ".$CodeString);
	}
	$pdf->SetFont($FontStyle,'B',$FontSizeLarge);
	$pdf->SetX($xPos);
	//$pdf->MultiCell($TotalLength,$LineHeight5,'',$borders,'C');
	$pdf->MultiCell($ContentWidth,$LineHeight5,$Title,$borders,'C');
	$pdf->MultiCell($ContentWidth,$LineHeight5,$CompanyName,$borders,'C');
	$pdf->SetFont($FontStyle,'',$FontSizeMedium);
	$pdf->MultiCell($ContentWidth,$LineHeight5,$CompanyType,$borders,'C');
	$pdf->SetFont($FontStyle,'I',$FontSizeMedium);
	$pdf->MultiCell($ContentWidth,$LineHeight5,$CompanyAddress,$borders,'C');
	$pdf->SetFont($FontStyle,'',$FontSizeSmall);
	$pdf->Cell($ContentWidth/2,$LineHeight5,'TIN-'.$TINNUMBER,$borders,0,'L');
	$pdf->Cell($ContentWidth/2,$LineHeight5,'Ph. Num-'.$PhNum1,$borders,1,'R');
	$pdf->Cell($ContentWidth/2,$LineHeight5,'Date Time-'.$DateTime,$borders,0,'L');
	$pdf->Cell($ContentWidth/2,$LineHeight5,'Ph. Num-'.$PhNum2,$borders,1,'R');
	//$pdf->Cell($ContentWidth/2,$LineHeight5,'Bi	lling Number : '.$TransactionId,$borders,0,'L');
	
	$pdf->SetFont($FontStyle,'B',$FontSizeSmall);
	$pdf->SetTextColor(51,51,51);	
	$pdf->Cell($ContentWidth-($ContentWidth-$Col1),$LineHeight5,"Sl.no",'BT',0);		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col2),$LineHeight5,"Item Name",'BT',0,'L');		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col3),$LineHeight5,"Quantity",'BT',0,'C');		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col4),$LineHeight5,"Price(".$Currency.")",'BT',0,'C');
	$pdf->Cell($ContentWidth-($ContentWidth-$Col5),$LineHeight5,"Vat %",'BT',0,'C');
	$pdf->Cell($ContentWidth-($ContentWidth-$Col6),$LineHeight5,"Total(".$Currency.")",'BT',1,'C');
	$pdf->SetFont($FontStyle,'',$FontSizeSmall);
	$Cnt = 1;
	$VatArray = array();
	foreach($BillDetails["data"] as $BillDet=>$Bill){
		//print_r($Bill);		
		$pdf->Cell($ContentWidth-($ContentWidth-$Col1),$LineHeight5,$Cnt,$borders,0,'R');		
		$pdf->Cell($ContentWidth-($ContentWidth-$Col2),$LineHeight5,$Bill["DISPLAY_NAME"],$borders,0,'L');		
		$pdf->Cell($ContentWidth-($ContentWidth-$Col3),$LineHeight5,$Bill["QUANTITY"],$borders,0,'C');		
		$pdf->Cell($ContentWidth-($ContentWidth-$Col4),$LineHeight5,$Bill["PRICE"],$borders,0,'C');		
		$pdf->Cell($ContentWidth-($ContentWidth-$Col5),$LineHeight5,$Bill["VAT"],$borders,0,'C');		
		$pdf->Cell($ContentWidth-($ContentWidth-$Col6),$LineHeight5,$Bill["TOTAL"],$borders,1,'C');		
		$Cnt = $Cnt + 1;
		
		if(array_key_exists($Bill["VAT"],$VatArray)){
			$VatArray[$Bill["VAT"]] = $VatArray[$Bill["VAT"]] + $Bill["TOTAL"];
		}else{
			$VatArray[$Bill["VAT"]] = $Bill["TOTAL"];
		}
		//$pdf->MultiCell($TotalLength,$LineHeight5,$Bill["ROW_ID"].$Bill["DISPLAY_NAME"],$borders);		
	}
	$pdf->MultiCell($ContentWidth,1,'','B','C');
	$pdf->Cell($ContentWidth-($ContentWidth-$Col1),$LineHeight5,'',$borders);		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col2),$LineHeight5,'Total : ',$borders,0,'R');		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col3),$LineHeight5,$TransDetails["data"][0]["QUANTITY"],$borders,0,'C');		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col4),$LineHeight5,'',$borders,0,'C');		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col5),$LineHeight5,'',$borders,0,'C');		
	$pdf->Cell($ContentWidth-($ContentWidth-$Col6),$LineHeight5,$Currency." ".$TransDetails["data"][0]["TOTAL_AMOUNT"],$borders,1,'C');
	$Discount = $TransDetails["data"][0]["DISCOUNT"];
	
	if(!($Discount>0)){
	$pdf->SetFont($FontStyle,'B',$FontSizeLarge);
	$pdf->Cell($ContentWidth,$LineHeight5,'GRAND TOTAL   =    '.$Currency." ".$TransDetails["data"][0]["TOTAL_AMOUNT"],$borders,1,'C');
	}
	$GrandTotal = $TransDetails["data"][0]["TOTAL_AMOUNT"];
	$VAT = 5.50;
	$pdf->SetFont($FontStyle,'',$FontSizeSmall);	
	foreach($VatArray as $VA => $VA_Val){
		$TotalNoVat = $VA_Val-($VA_Val*$VA/100);
		$TAX = $VA_Val-$TotalNoVat;			
		$pdf->MultiCell($ContentWidth,$LineHeight5,"VAT @ ".$VA."% SALES :  ".$Currency." ".$TotalNoVat."  TAX :  ".$Currency." ".$TAX,$borders,'L');
	}
	$pdf->SetFont($FontStyle,'B',$FontSizeLarge);
	if($Discount>0){
		$DiscountAmt = $GrandTotal*$Discount/100;
		$DiscountTotal = $GrandTotal - ($GrandTotal*$Discount/100);
		$pdf->Cell($TotalLength,$LineHeight5,'Discount   =    '.$DiscountAmt."@".$Discount."%",$borders,1,'C');
		$DiscountTotal = $GrandTotal - ($GrandTotal*$Discount/100);
		$pdf->Cell($ContentWidth,$LineHeight5,'Amount After Discount  =    '.$Currency." ".$DiscountTotal,$borders,1,'C');
	}
	$pdf->MultiCell($ContentWidth,1,'','T','C');
	$pdf->SetFont($FontStyle,'',$FontSizeMedium);
	$pdf->Ln();
	$pdf->MultiCell($ContentWidth,$LineHeight5,$CustomMessage,$borders,'L');
	$pdf->MultiCell($ContentWidth,$LineHeight5,"Billed By :  ".$TransDetails["data"][0]["USER_NAME"],$borders,'L');
	$yPos = $pdf->GetY();
	$pdf->SetAutoPageBreak(true,$TotalHeight-$yPos);
	$pdf->Output('F','../.././fileSystem/Bill/'.'Bill_'.$TransactionId.'_'.$TimeStamp.'.pdf');
	$response["status"] = 'success';
	$response["FileName"] = 'Bill_'.$TransactionId.'_'.$TimeStamp.'.pdf';
	echoResponse(200,$response);
}else{
	echoResponse(201,$TransDetails);
}



});

$app->post('/GenerateBarCode', function() use ($app) { 
	$response = array();
	$r = json_decode($app->request->getBody());
	$db = new dbHelper();
	$ProdcutDetails = $r->ProdcutDetails;
	$TotalLabel = $r->TotalLabel;
	$DateTime = $r->DateTime;
	$DateOnly = $r->DateOnly;
	$TimeStamp = $r->TimeStamp;
	$TotalLine = floor($TotalLabel/3);
	$FinalLineCount = $TotalLabel % 3;
	//print_r($ProdcutDetails);
	//PDF Config
	$TotalLength = 210;
	$TotalHeight = 297;
	$LineHeight10 = 10;
	$LineHeight5 = 5;
	$borders = 0;
	$MarginLeft=10;
	$MarginRight=10;
	$MarginTop=10;
	$ContentWidth = $TotalLength-$MarginLeft-$MarginRight;
	$pdf = new PDF_Code128('P','mm',array($TotalLength,$TotalHeight));
	$pdf->AddPage();
	$pdf->SetMargins($MarginLeft,$MarginTop,$MarginRight);
	$pdf->SetFont('Arial','',6);
	$pdf->SetTextColor(51,51,51);
	$xPos = $MarginLeft/2;
	$yPos = $MarginTop;
	for($i = 0 ; $i < $TotalLine ; $i++){
		$xPos = $MarginLeft/2;
		$xPosTemp = $xPos;
		$yPosTemp = $yPos+$LineHeight10-6;
		$yPos1 = $yPos;
		$yPos2 = $yPos+$LineHeight10+1;
		$pdf->SetY($yPos1);
		$pdf->SetY($yPos2);
		$pdf->SetX($xPos);
		for($j = 0 ; $j < 3 ; $j++){
			$pdf->SetY($yPos1);			
			$pdf->SetX($xPosTemp);
			$pdf->Cell(($ContentWidth/6-($MarginLeft/2)),$LineHeight10/2,$DateOnly,$borders,'L');		
			$pdf->Cell(($ContentWidth/6-($MarginLeft/2)),$LineHeight10/2,"Item Name : ".$ProdcutDetails->DISPLAY_NAME."/".$ProdcutDetails->SEC_BAR_CODE,$borders,'L');		
			$pdf->Cell(($MarginLeft/2),$LineHeight10/2,'',$borders,0,'L');		
			$pdf->Code128($xPosTemp,$yPosTemp,$ProdcutDetails->BAR_CODE,($ContentWidth/3),$LineHeight10);			
			$pdf->SetY($yPos2);
			$pdf->SetX($xPosTemp);
			$pdf->Cell(($ContentWidth/6),$LineHeight10,"Bar Code : ".$ProdcutDetails->BAR_CODE,$borders,0,'L');		
			$pdf->Cell(($ContentWidth/6),$LineHeight10,"Price : Rs.".$ProdcutDetails->RETAIL_SELL_PRICE,$borders,0,'L');		
			$pdf->Cell(($MarginLeft/2),$LineHeight10,'',$borders,0,'L');		
			$xPosTemp = ($ContentWidth/3)+$MarginLeft/2+$xPosTemp;
		}
		$yPos = $yPosTemp+$LineHeight10+5;
	}
		$xPos = $MarginLeft/2;
		$xPosTemp = $xPos;
		$yPosTemp = $yPos+$LineHeight10-6;
		$yPos1 = $yPos;
		$yPos2 = $yPos+$LineHeight10+1;
		$pdf->SetY($yPos1);
		$pdf->SetY($yPos2);
		$pdf->SetX($xPos);
	//$yPos = $yPos+$LineHeight10+5;
	for($j = 0 ; $j < $FinalLineCount ; $j++){	
		$pdf->SetY($yPos1);			
		$pdf->SetX($xPosTemp);
		$pdf->Cell(($ContentWidth/6-($MarginLeft/2)),$LineHeight10/2,$DateOnly,$borders,'L');		
		$pdf->Cell(($ContentWidth/6-($MarginLeft/2)),$LineHeight10/2,"Item Name : ".$ProdcutDetails->DISPLAY_NAME."/".$ProdcutDetails->SEC_BAR_CODE,$borders,'L');		
		$pdf->Cell(($MarginLeft/2),$LineHeight10/2,'',$borders,0,'L');		
		$pdf->Code128($xPosTemp,$yPosTemp,$ProdcutDetails->BAR_CODE,($ContentWidth/3),$LineHeight10);			
		$pdf->SetY($yPos2);
		$pdf->SetX($xPosTemp);
		$pdf->Cell(($ContentWidth/6),$LineHeight10,"Bar Code : ".$ProdcutDetails->BAR_CODE,$borders,0,'L');		
		$pdf->Cell(($ContentWidth/6),$LineHeight10,"Price : Rs.".$ProdcutDetails->RETAIL_SELL_PRICE,$borders,0,'L');		
		$pdf->Cell(($MarginLeft/2),$LineHeight10,'',$borders,0,'L');		
		$xPosTemp = ($ContentWidth/3)+$MarginLeft/2+$xPosTemp;
	}
	
	
	
	//$pdf->Code128($xPos+($ContentWidth/4)-($MarginLeft),$yPos,$ProdcutDetails->BAR_CODE,($ContentWidth/4)-($MarginLeft),10);
	//$pdf->Code128($xPos+($ContentWidth/4)-($MarginLeft),$yPos,$ProdcutDetails->BAR_CODE,($ContentWidth/4)-($MarginLeft),10);
	//$pdf->SetY($yPos+12);
	//$pdf->Write(1,"Bill No : ".$CodeString);
	$pdf->SetFont('Arial','B',12);
	$pdf->SetX($xPos);
	$pdf->Output('F','../.././fileSystem/BarCode/BarCode_'.$TimeStamp.'.pdf');
	$response["FileName"] = 'BarCode_'.$TimeStamp.'.pdf';
	$response["status"] = "success";
	echoResponse(200,$response);
});

?>	