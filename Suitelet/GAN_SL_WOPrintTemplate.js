/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
// eslint-disable-next-line no-undef
define(['N/render', 'N/search', 'N/log', 'N/record', 'N/config'],

    function (render, search, log, record, config) {
        function onRequest(context) {
            var title = " onRequest() ";
            var response = context.response;
            var params = context.request.parameters;
            var recId = params.id;
            log.debug(title + "Recid ->", recId);
            var workOrderObj = record.load({
                type: 'workorder',
                id: parseInt(recId)
            });
            var reqByDate = workOrderObj.getValue({fieldId : 'requesteddate'});
            var reqByDateFormated = formateDate(reqByDate)
            var lineCount = workOrderObj.getLineCount({
                sublistId: 'item'
            });
            log.debug(title + "lineCount ->", lineCount);//class_display
            var template = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
                    template += "<pdfset>";
                    //PDF 1
                    template += "<pdf>";
                    template += "<head>";
                    template += "<link name='NotoSans' type='font' subtype='truetype' src='${nsfont.NotoSans_Regular}' src-bold='${nsfont.NotoSans_Bold}' src-italic='${nsfont.NotoSans_Italic}' src-bolditalic='${nsfont.NotoSans_BoldItalic}' bytes='2' />\
             <style>\
                table {\
                    font-size: 9pt;\
                    table-layout: fixed;\
                }\
                th {\
                    font-weight: bold;\
                    font-size: 8pt;\
                    vertical-align: middle;\
                    padding: 5px 6px 3px;\
                    background-color: #e3e3e3;\
                    color: #333333;\
                }\
                td {\
                    padding: 4px 6px;\
                }\
                td p { align:left }\
              table.border{\
                border: 1px solid black;\
              }\
              td.borderRight{\
                border-right: 1px solid black;\
              }\
              td.borderLeft{\
                border-left: 1px solid black;\
              }\
              td.Tdborder{\
                border-top: 1px solid black;\
              }\
        </style>\
        </head>";
            for (var i = 0; i < lineCount; i++) {
                var class_display = workOrderObj.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'class_display',
                    line: i
                });
                log.debug(title + "class_display ->", class_display);
                var noOfDoors = workOrderObj.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol10',
                    line: i
                });
                var insertColour = workOrderObj.getSublistText({
                    sublistId: 'item',
                    fieldId: 'custcol5',
                    line: i
                });
                var doorSwing = workOrderObj.getSublistText({
                    sublistId: 'item',
                    fieldId: 'custcol1',
                    line: i
                });
                var doorType = workOrderObj.getSublistText({
                    sublistId: 'item',
                    fieldId: 'custcol11',
                    line: i
                });
                var doorSize = workOrderObj.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol9',
                    line: i
                });
                var RoomTemp = workOrderObj.getSublistText({
                    sublistId: 'item',
                    fieldId: 'custcol8',
                    line: i
                });
                if (class_display == 'Door Insert') {
                    //Writing Template Code
                    template += "<body padding='0.5in 0.5in 0.5in 0.5in' size='Letter'>";
                    template += '<table class="border" style="width: 100%; margin-top: 10px;"><tr>\
             <td style="margin-left: 200px;"><b>GANNON FABRICATIONS INSERT SHEET</b></td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%"><b>Customer:</b></td>\
                 <td style="width: 25%"><b>Job Details:</b></td>\
                 <td class="borderLeft" style="width: 25%" align="center"><b>Due Date:</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%">&nbsp;</td>\
                 <td style="width: 25%">&nbsp;</td>\
                 <td class="borderLeft" style="width: 25%" align="center"><b>'+reqByDateFormated+'</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%" align="center"><b>Door size:</b></td>\
                 <td class="borderLeft" style="width: 7%" align="center"><b>Qty:</b></td>\
               <td class="borderLeft" style="width: 8%" align="center"><b>Colour:</b></td>\
                 <td class="borderLeft" style="width: 10%" align="center"><b>Door swing:</b></td>\
                 <td class="borderLeft" style="width: 10%" align="center"><b>Infill:</b></td>\
                 <td class="borderLeft" style="width: 15%" align="center"><b>Heater:</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%" align="center"><b>'+doorSize+'</b></td>\
                 <td class="borderLeft" style="width: 7%" align="center"><b>'+noOfDoors+'</b></td>\
                 <td class="borderLeft" style="width: 8%" align="center"><b>'+insertColour+'</b></td>\
                 <td class="borderLeft" style="width: 10%" align="center"><b>'+doorSwing+'</b></td>\
                 <td class="borderLeft" style="width: 10%" align="center"><b>'+doorType+'</b></td>\
                 <td class="borderLeft" style="width: 15%" align="center"><b>FALSE</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 36.5% ;background-color: rgb(220,220,220);" align="center"><b>LOW TEMP</b></td>\
                 <td class="borderLeft" style="width: 8.5%" align="center"><b>Frame:</b></td>\
                 <td class="borderLeft" style="width: 10.5%" align="center"><b>Doorway:</b></td>\
                 <td class="borderLeft" style="width: 10.5%" align="center"><b>Lights:</b></td>\
                 <td class="borderLeft" style="width: 6%" align="center"><b>CAPS</b></td>\
                 <td class="borderLeft" style="width: 6%" align="center"><b>SAW</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
           <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 12%;"><b>'+RoomTemp+'</b></td>\
                 <td style="width: 5%;"><b>X</b></td>\
                 <td style="width: 12%;"><b>3122</b></td>\
                 <td class="borderLeft" style="width: 8.5%" align="center"><b>0</b></td>\
                 <td class="borderLeft" style="width: 10.5%" align="center"><b>FALSE</b></td>\
                 <td class="borderLeft" style="width: 10.5%" align="center"><b>3</b></td>\
                 <td class="borderLeft" style="width: 6%"><b>Crated</b></td>\
                 <td class="borderLeft" style="width: 6%"></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 8%;"><b>Cap Height</b></td>\
                 <td class="borderLeft" style="width: 5%;"><b>1932</b></td>\
                 <td class="borderLeft" style="width: 6%;"><b>X2</b></td>\
                 <td class="borderLeft" style="width: 5%"></td>\
                 <td class="borderLeft" style="width: 22%"><b>Shelves per door</b></td>\
                 <td class="borderLeft" style="width: 12%"></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 8%;"><b>Cap Height</b></td>\
                 <td class="borderLeft" style="width: 5%;"><b>3172</b></td>\
                 <td class="borderLeft" style="width: 6%;"><b>X2</b></td>\
                 <td class="borderLeft" style="width: 5%"></td>\
                 <td class="borderLeft" style="width: 8%"><b>Group</b></td>\
                 <td class="borderLeft" style="width: 7%"></td>\
                 <td class="borderLeft" style="width: 12%"><b>Cut Flanges</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 44%"></td>\
                 <td class="borderLeft" style="width: 28.5%"><b>Rear Sliding Door Kit</b></td>\
                 <td class="borderLeft" style="width: 3%"></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 20%"></td>\
                 <td class="borderLeft" style="width: 15.5%"><b>Special Instructions</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 20%"></td>\
                 <td class="borderLeft" style="width: 15.5%"><b>S</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
           </table>';
            // '<p style="page-break-before: always;">&nbsp;</p>
            template += '<table class="border" style="width: 100%; margin-top: 10px;"><tr>\
                    <td align="center" style="background-color: rgb(220,220,220);"><b>Job No.</b></td>\
                    <td class="borderLeft">&nbsp;</td>\
                    <td align="center" class="borderLeft" style="background-color: rgb(220,220,220);"><b>Customer</b></td>\
                    <td class="borderLeft">&nbsp;</td>\
                    </tr>\
                    <tr>\
                    <td style="background-color: rgb(220,220,220);">&nbsp;</td>\
                    <td style="background-color: rgb(220,220,220);">&nbsp;</td>\
                    <td style="margin-left: -50px;background-color: rgb(220,220,220);"><b><u>Bill of Materials</u></b></td>\
                    <td style="background-color: rgb(220,220,220);">&nbsp;</td>\
                        </tr>\
                    </table>\
                        <table class="border" style="width=100%;">\
                                <tr style="background-color: #d3d3d3; ">\
                                <th align="center" style=" font-weight: bold; " width="270pt">Item</th>\
                                <th align="center" style=" font-weight: bold; " width="260pt">Qty</th>\
                                <th align="center" style="font-weight: bold; " width="250pt">SKU</th>\
                                <th align="center" style="font-weight: bold; " width="180pt">Description</th>\
                                <th align="center" style="font-weight: bold; " width="190pt">Check</th>\
                                </tr>';
            //   for(var i = 0 ; i < searchResult.items.length;i++){
            //       var item = searchResult.items[i];
            //       var item_item = item.invoiceNum;
            //       var rate ;

            //       if(item.itemType == 'TaxItem'){
            //           rate = item.rate+'%';
            //       }else{
            //           rate = '$'+item.rate;
            //       }
            //       var item_inv = item_item.slice(9, 18);
            template += '<tr>\
                            <td align="center" style="">+item.item+</td>\
                                <td align="center" style="">+item.Qty+</td>\
                                <td align="center" style="">+item.SKU+</td>\
                                <td align="center" style="">+item.Description+</td>\
                                <td align="center" style="">+item.Check+</td>\
                        </tr>';
            //   }\
            template += '</table>';
                // } else if(class_display =='Entry Door'){
                } else {
                    template += '<table class="border" style="width: 100%; margin-top: 10px;"><tr>\
             <td style="margin-left: 200px;"><b>GANNON FABRICATIONS ENTRY DOOR</b></td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%"><b>Customer:</b></td>\
                 <td style="width: 25%"><b>Job Details:</b></td>\
                 <td class="borderLeft" style="width: 25%"><b>Due Date:</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%">&nbsp;</td>\
                 <td style="width: 25%">&nbsp;</td>\
                 <td class="borderLeft" style="width: 25%"><b>9/15/2021</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%"><b>Door size:</b></td>\
                 <td class="borderLeft" style="width: 7%"><b>Qty:</b></td>\
               <td class="borderLeft" style="width: 8%"><b>Colour:</b></td>\
                 <td class="borderLeft" style="width: 10%"><b>Door swing:</b></td>\
                 <td class="borderLeft" style="width: 10%"><b>Infill:</b></td>\
                 <td class="borderLeft" style="width: 15%"><b>Heater:</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 25%"><b>1830 x 750</b></td>\
                 <td class="borderLeft" style="width: 7%"><b>4</b></td>\
                 <td class="borderLeft" style="width: 8%"><b>BLACK</b></td>\
                 <td class="borderLeft" style="width: 10%"><b>LH</b></td>\
                 <td class="borderLeft" style="width: 10%"><b>TGH</b></td>\
                 <td class="borderLeft" style="width: 15%"><b>FALSE</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
             <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 36.5% ;background-color: rgb(220,220,220);"><b>LOW TEMP</b></td>\
                 <td class="borderLeft" style="width: 8.5%"><b>Frame:</b></td>\
                 <td class="borderLeft" style="width: 10.5%"><b>Doorway:</b></td>\
                 <td class="borderLeft" style="width: 10.5%"><b>Lights:</b></td>\
                 <td class="borderLeft" style="width: 6%"><b>CAPS</b></td>\
                 <td class="borderLeft" style="width: 6%"><b>SAW</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
           <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 12%;"><b>1882</b></td>\
                 <td style="width: 5%;"><b>X</b></td>\
                 <td style="width: 12%;"><b>3122</b></td>\
                 <td class="borderLeft" style="width: 8.5%"><b>0</b></td>\
                 <td class="borderLeft" style="width: 10.5%"><b>FALSE</b></td>\
                 <td class="borderLeft" style="width: 10.5%"><b>3</b></td>\
                 <td class="borderLeft" style="width: 6%"><b>Crated</b></td>\
                 <td class="borderLeft" style="width: 6%"></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 8%;"><b>Cap Height</b></td>\
                 <td class="borderLeft" style="width: 5%;"><b>1932</b></td>\
                 <td class="borderLeft" style="width: 6%;"><b>X2</b></td>\
                 <td class="borderLeft" style="width: 5%"></td>\
                 <td class="borderLeft" style="width: 22%"><b>Shelves per door</b></td>\
                 <td class="borderLeft" style="width: 12%"></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 8%;"><b>Cap Height</b></td>\
                 <td class="borderLeft" style="width: 5%;"><b>3172</b></td>\
                 <td class="borderLeft" style="width: 6%;"><b>X2</b></td>\
                 <td class="borderLeft" style="width: 5%"></td>\
                 <td class="borderLeft" style="width: 8%"><b>Group</b></td>\
                 <td class="borderLeft" style="width: 7%"></td>\
                 <td class="borderLeft" style="width: 12%"><b>Cut Flanges</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 44%"></td>\
                 <td class="borderLeft" style="width: 28.5%"><b>Rear Sliding Door Kit</b></td>\
                 <td class="borderLeft" style="width: 3%"></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 20%"></td>\
                 <td class="borderLeft" style="width: 15.5%"><b>Special Instructions</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
            <tr>\
             <td>\
             <table class="border" style="width: 100%"><tr>\
                 <td style="width: 20%"></td>\
                 <td class="borderLeft" style="width: 15.5%"><b>S</b></td>\
                 </tr></table>\
             </td>\
             </tr>\
           </table>';
            // '<p style="page-break-before: always;">&nbsp;</p>
            template += '<table class="border" style="width: 100%; margin-top: 10px;"><tr>\
                    <td align="center" style="background-color: rgb(220,220,220);"><b>Job No.</b></td>\
                    <td class="borderLeft">&nbsp;</td>\
                    <td align="center" class="borderLeft" style="background-color: rgb(220,220,220);"><b>Customer</b></td>\
                    <td class="borderLeft">&nbsp;</td>\
                    </tr>\
                    <tr>\
                    <td style="background-color: rgb(220,220,220);">&nbsp;</td>\
                    <td style="background-color: rgb(220,220,220);">&nbsp;</td>\
                    <td style="margin-left: -50px;background-color: rgb(220,220,220);"><b><u>Bill of Materials</u></b></td>\
                    <td style="background-color: rgb(220,220,220);">&nbsp;</td>\
                        </tr>\
                    </table>\
                        <table class="border" style="width=100%;">\
                                <tr style="background-color: #d3d3d3; ">\
                                <th align="center" style=" font-weight: bold; " width="270pt">Item</th>\
                                <th align="center" style=" font-weight: bold; " width="260pt">Qty</th>\
                                <th align="center" style="font-weight: bold; " width="250pt">SKU</th>\
                                <th align="center" style="font-weight: bold; " width="180pt">Description</th>\
                                <th align="center" style="font-weight: bold; " width="190pt">Check</th>\
                                </tr>';
            //   for(var i = 0 ; i < searchResult.items.length;i++){
            //       var item = searchResult.items[i];
            //       var item_item = item.invoiceNum;
            //       var rate ;

            //       if(item.itemType == 'TaxItem'){
            //           rate = item.rate+'%';
            //       }else{
            //           rate = '$'+item.rate;
            //       }
            //       var item_inv = item_item.slice(9, 18);
            template += '<tr>\
                            <td align="center" style="">+item.item+</td>\
                                <td align="center" style="">+item.Qty+</td>\
                                <td align="center" style="">+item.SKU+</td>\
                                <td align="center" style="">+item.Description+</td>\
                                <td align="center" style="">+item.Check+</td>\
                        </tr>';
            //   }\
            template += '</table>';
                }
            }

            template += "</body>";
            template += "</pdf>";
            template += "</pdfset>";
            //Using "N/render" Module to Generate PDF
            var pdfFile = render.xmlToPdf({
                xmlString: template
            });
            response.writeFile(pdfFile, true);
        }
        function formateDate(trandate){
            var date = new Date(trandate);
            var day = date.getDay();
            var month = date.getMonth()+1;
            var year = date.getFullYear();
            var formateDate =  month +'/'+ day +'/'+ year;
            return formateDate;
   
        }
        return {
            onRequest: onRequest
        };
    });