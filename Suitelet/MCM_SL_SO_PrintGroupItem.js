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
      var obj;
      var contect = 0;
      var empContact = 0;
      var groupItemArray = [];
      log.debug(title + "Recid ->", recId);
      var salesOrderObj = record.load({
        type: 'salesorder',
        id: parseInt(recId)
      });
      var entity = salesOrderObj.getText({ fieldId: 'entity' });
      var tranid = salesOrderObj.getText({ fieldId: 'tranid' });
      var trandate = salesOrderObj.getText({ fieldId: 'trandate' });
      var projectOnInvoive = salesOrderObj.getText({ fieldId: 'custbody_project_name' });
      var shipaddress = salesOrderObj.getText({ fieldId: 'shipaddress' });
      var billaddress = salesOrderObj.getText({ fieldId: 'billaddress' });
      var salesrep = salesOrderObj.getText({ fieldId: 'salesrep' });
      var salesRepID = salesOrderObj.getValue({ fieldId: 'salesrep' });
      var memoInvoice = salesOrderObj.getValue({ fieldId: 'custbody_memo_invoice' });
      var currency = salesOrderObj.getText({ fieldId: 'currency' });
      var subTotal = salesOrderObj.getValue({ fieldId: 'subtotal' });
      var discounttotal = salesOrderObj.getValue({ fieldId: 'discounttotal' });
      var shippingCost = salesOrderObj.getValue({ fieldId: 'custbody_shipping_cost_inc_gst' });
      var giftcertapplied = salesOrderObj.getValue({ fieldId: 'giftcertapplied' });
      var taxtotal = salesOrderObj.getValue({ fieldId: 'taxtotal' });
      var total = salesOrderObj.getValue({ fieldId: 'total' });
      var terms = salesOrderObj.getText({ fieldId: 'terms' });
      // var balanceDue = salesOrderObj.getValue({ fieldId: 'custbody_so_balance_due' });
      var amountPaid = salesOrderObj.getValue({ fieldId: 'custbody_so_amount_paid' });
      var depositAmount = salesOrderObj.getValue({ fieldId: 'custbody_sp_deposit_amount' });
      var DepositeAmt = parseInt(amountPaid) - parseInt(depositAmount);
      var depositAmountToPrecision = DepositeAmt.toPrecision(2);
      var BalanceDue = total - amountPaid;
      var employeeObj = record.load({
        type: 'employee',
        id: salesRepID
      });
      var empEmail = employeeObj.getValue({ fieldId: 'email' });
      var empPhone = employeeObj.getValue({ fieldId: 'phone' });
      var empLocation = employeeObj.getValue({ fieldId: 'location' });
      var empMobilePhone = employeeObj.getValue({ fieldId: 'mobilephone' });
      if (empPhone) {
        empContact = empPhone;
      } else {
        empContact = empMobilePhone;
      }
      var entityID = salesOrderObj.getValue({ fieldId: 'entity' });
      var customerObj = record.load({
        type: 'customer',
        id: entityID
      });
      var custMobilePhone = customerObj.getValue({ fieldId: 'mobilephone' });
      var custPhone = customerObj.getValue({ fieldId: 'phone' });
      if (custMobilePhone) {
        contect = custMobilePhone;
      } else {
        contect = custPhone;
      }
      var custEmail = customerObj.getValue({ fieldId: 'email' });
      var template = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';

      var salesOrderId = recId.toString();
      var salesorderSearchObj = search.create({
        type: "salesorder",
        filters:
          [
            ["type", "anyof", "SalesOrd"],
            "AND",
            ["internalid", "anyof", salesOrderId]
          ],
        columns:
          [
            search.createColumn({ name: "item", label: "Item" }),
            search.createColumn({ name: "quantity", label: "Quantity" }),
            search.createColumn({ name: "custcol_rrpincl_total", label: "Total RRP" }),
            search.createColumn({ name: "custcol_rrpincl", label: "RRP" }),
            search.createColumn({ name: "custcol_print_item_code", label: "Print Item Code" }),
            search.createColumn({ name: "custcol_item_dims_sales_order", label: "Item Dims - Sales Order" }),
            search.createColumn({ name: "custcol_itemdisplayname", label: "Item Display Name" }),
            search.createColumn({
              name: "type",
              join: "item",
              label: "Type"
            })
          ]
      });
      var searchResultCount = salesorderSearchObj.runPaged().count;
      log.debug("salesorderSearchObj result count", searchResultCount);
      salesorderSearchObj.run().each(function (result) {
        obj = {};
        obj.item = result.getText({ name: 'item' });
        obj.qty = result.getValue({ name: 'quantity' });
        obj.total = parseFloat(result.getValue({ name: 'custcol_rrpincl_total' }));
        obj.total1 = result.getValue({ name: 'custcol_rrpincl_total' });
        obj.rrp = result.getValue({ name: 'custcol_rrpincl' });
        obj.sku = result.getValue({ name: 'custcol_print_item_code' });
        obj.dims = result.getValue({ name: 'custcol_item_dims_sales_order' });
        obj.description = result.getValue({ name: 'custcol_itemdisplayname' });
        obj.itemType = result.getValue({ name: 'type', join: 'item' });
        groupItemArray.push(obj);
        return true;
      });
      log.debug({
        title: 'groupItemArray',
        details: groupItemArray
      });
      /*
      salesorderSearchObj.id="customsearch1666860169585";
      salesorderSearchObj.title="Sales Order Group Item  (copy)";
      var newSearchId = salesorderSearchObj.save();
      */



      template += "<pdfset>";
      //PDF 1
      template += "<pdf>";
      template += "<head>";
      template += '<macrolist>';
      template += '<macro id="nlheader">';
      template += '<table  style="width:100%;" table-layout="fixed"><tr>\
              <td colspan="10" class="left" style=""><p class="left " style="font-size:15pt;padding-top:2.5mm;">'+ entity + '</p></td>\
              <td colspan="10">&nbsp;</td>\
              <td colspan="7"  class="right" style="valign:top;padding: 2mm 0 0mm 0"  rowspan="3"><img src="https://5679695.app.netsuite.com/core/media/media.nl?id=446641&amp;c=5679695&amp;h=7Uq7gkNsQRcfz7Y8X1TTGyxFpHp3unmA87LV6qV_V4_-DKhQ" style="width:10%; height:10%;display: inline-block;"></img></td>\
              </tr>\
              <tr>\
              <td colspan = "10" class="left" style = "" > <p class="left light" style="font-size:7pt;">T. '+ contect + '</p></td >\
              </tr >\
              <tr>\
              <td colspan="10" class="left" style=""><p class="left light" style="font-size:7pt;">'+ custEmail + '</p></td>\
              </tr>';
      if (projectOnInvoive) {
        template += '<tr style="margin-top:1mm">\
              <td colspan="10" class="left" style=""><p class="left " style="font-size:6pt;"><b>PROJECT</b></p></td>\
              <td colspan="7"/>\
              </tr>\
              <tr style="margin-top:0.5mm">\
              <td colspan="10" class="left" style=""><p class="left light" style="font-size:7pt;">'+ projectOnInvoive + '</p></td>\
              <td colspan="7"/>\
              </tr>';
      }
      template += '<tr style="margin-top:5mm;" rowspan = "4">\
        <!-- Secondary Block - tables -->\
              <td colspan="6" class="left" style="width:33%;">\
              <p class="left " style="font-size:6;"><b>DELIVERY TO</b></p>\
          <p class="left light" style="font-size:7;margin-top:0.5mm;line-height:125%">'+ shipaddress + '</p>\
        </td>\
        <td colspan="6" class="left" style="width:33%;">\
        <p class="left " style="font-size:6;">&nbsp;</p>\
  <p class="left light" style="font-size:7;margin-top:0.5mm;line-height:125%">&nbsp;</p>\
  </td>\
        <td colspan="6" class="left" style="width:33%;">\
          <p class="left " style="font-size:6;"><b>INVOICE TO</b></p>\
          <p class="left light" style="font-size:7;margin-top:0.5mm;line-height:125%">'+ billaddress + '</p>\
        </td>\
        <td colspan="5" class="left" style="width:33%;">\
          <p class="left " style="font-size:6;">&nbsp;</p>\
          <p class="left light" style="font-size:7;margin-top:0.5mm;line-height:125%">&nbsp;</p>\
        </td>\
        <td colspan="5" class="left" padding-left="3mm" style="width:33%;">\
          <p class="left " style="font-size:6;"><b>CONSULTANT</b></p>\
          <p class="left light" style="font-size:7;margin-top:0.5mm;line-height:125%;">'+ salesrep + '\
            <br/>'+ empEmail + '\
            <br/>'+ empContact + ' <br/>' + empLocation + '</p>\
        </td>\
      </tr>\
      <tr style="margin-top:5mm;">\
            <td colspan="12" class="left">\
              <p class="left " style="font-size:6;">PROFORMA TAX INVOICE/DATE</p>\
              <p class="left " style="font-size:15;margin:0;padding:2mm 0 0 0;">Proforma Tax Invoice # '+ tranid + '</p>\
              <p class="left light" style="font-size:7;margin:0;padding:2mm 0 0 0;">'+ trandate + '</p>\
            </td>\
          </tr>';
      template += '</table > ';
      template += '</macro>';
      template += '<macro id="nlfooter">';
      template += '<table style="width:100%;border-top:0.5px solid black;">\
        <tr style="">\
          <td class="left" style="padding:3mm 0 0 0;line-height:150%;"  colspan="9"><p class="left "  style="font-size:5pt">10 OXFORD ST, PADDINGTON, NSW 2021<br/>ABN 83 167 988 187</p></td>\
          <td class="left" style="padding:3mm 0 0 0;"  colspan="5" ><p class="right " style="font-size:5pt;">T. 1300 997 975 | MCMHOUSE.COM</p></td>\
          <td class="right" style="padding:3mm 0 0 0;"  colspan="3" ><p class="right " style="font-size:5pt;">PAGE <pagenumber/> OF <totalpages/></p></td>\
        </tr>\
      </table>';
      template += '</macro>';
      template += '</macrolist>';
      template += '</head>';
      template += "<body header='nlheader' header-height='27%' footer='nlfooter' footer-height='1.5%' padding='0.5in 0.5in 0.5in 0.5in' size='A4'>";
      template += '<table class="itemtable" style="width: 100%; margin-top: 10px;">\
        <tr style="padding-top:3mm;padding-bottom:3mm;margin:0">\
            <th class="left" colspan="8"><p class="left " style="font-size:6;letter-spacing:0.50;"><b>PRODUCT</b></p></th>\
            <th class="center" colspan="3"><p class="center " style="font-size:6;letter-spacing:0.50;"><b>RRP</b></p></th>\
            <th class="center" colspan="2"><p class="center " style="font-size:6;letter-spacing:0.50;"><b>QTY</b></p></th>\
            <th class="right" colspan="2"><p class="right " style="font-size:6;letter-spacing:0.50;"><b>TOTAL</b></p></th>\
          </tr>';
      var discountItem = 0;
      var totalAmount = 0;
      var totalAmountFinal = 0;
      for(var j=0; j<groupItemArray.length; j++){
        var item = groupItemArray[j];
        var disCount = item.item;
        if(item.total){
          totalAmount += item.total;
          totalAmountFinal += item.total;
        log.debug({
          title: 'totalAmount',
          details: totalAmount
        });
        }
        if (item.itemType == 'Discount') {
          var dis = disCount.slice(0, 2);
          var discountnt = parseInt(dis);
          discountItem += (totalAmount * discountnt)/100;
          totalAmount = 0;
          log.debug({
            title: 'discountItem',
            details: discountItem
          });
        }
        
      }
      log.debug({
        title: 'totalAmountFinal Final',
        details: totalAmountFinal
      });
      var totalDiscountedAmount = parseFloat(totalAmountFinal - discountItem).toFixed(2);
      for (var i = 0; i < groupItemArray.length; i++) {
        var item = groupItemArray[i];
        
        if (item.itemType != 'Discount') {
          template += '<tr>';
          // <td class="left" colspan="8" >'+item.description+'<br />SKU:'+item.sku+'<br />'+item.dims+'</td>\
          var description = item.description;
          var descriptionAND = description.replace("&", "&amp;");
            template += '<td class="left" colspan="8">' + descriptionAND + '<br /><p style="font-size:7;">' + item.sku + '</p><p style="font-size:7; margin-top: 3%;">' + item.dims + '</p></td>\
                  <td class="center" colspan="3">\
                    <p class="center " style="font-size:9pt;padding-top:0mm;">'+ item.rrp + '</p>\
                  </td>\
                  <td class="center" colspan="2" ><p class="center " style="font-size:9pt;padding-top:0mm;">'+ item.qty + '</p></td>\
                  <td class="right" colspan="2" ><p class="right " style="font-size:9pt;padding-top:0mm;">'+ item.total1 + '</p></td>\
                </tr>';
        }
      }
      if(!!discountItem){
        template += '<tr><td class="left" colspan="8">Discount</td>\
                  <td class="center" colspan="3">\
                    <p class="center " style="font-size:9pt;padding-top:0mm;">&nbsp;</p>\
                  </td>\
                  <td class="center" colspan="2" ><p class="center " style="font-size:9pt;padding-top:0mm;">&nbsp;</p></td>\
                  <td class="right" colspan="2" ><p class="right " style="font-size:9pt;padding-top:0mm;">'+ discountItem + '</p></td>\
                </tr>';
      }
      if(!!totalAmountFinal){
        template += '<tr><td class="left" colspan="8">Total Disconted Amount</td>\
                  <td class="center" colspan="3">\
                    <p class="center " style="font-size:9pt;padding-top:0mm;">&nbsp;</p>\
                  </td>\
                  <td class="center" colspan="2" ><p class="center " style="font-size:9pt;padding-top:0mm;">&nbsp;</p></td>\
                  <td class="right" colspan="2" ><p class="right " style="font-size:9pt;padding-top:0mm;">'+ totalDiscountedAmount + '</p></td>\
                </tr>';
      }
      template += '</table>';
      template += '<div style="padding:0;margin:0">\
          <table style="width:100%;margin-top:2mm">\
            <tr>\
            <td colspan="16" style="width:70%;">\
              <table style="width:100%;margin-top:0mm">\
              <tr>\
                <td class="left" style="margin:0 4mm 0 0;padding: 2mm 0 0 0;border-top: 1px solid;"><p class="left" style="font-size:7pt;">'+ memoInvoice + '</p></td>\
              </tr>\
              </table>\
            </td>\
            <td colspan="8" style="width:30%;">\
            <table style="width:100%;margin-top:0mm">\
            <tr>\
              <td colspan="3" class="left" style="valign:middle;border-top: 1px solid;"><p class="left" style="font-size:5pt;"><b>CURRENCY</b></p></td>\
              <td colspan="5" class="right" style="valign:middle;padding:2.5mm 0 2.5mm 0;border-top: 1px solid;"><p class="right" style="font-size:9pt;">'+ currency + '</p></td>\
            </tr>\
          <tr>\
            <td colspan="3" class="left"  style="valign:middle;"><p class="left" style="font-size:5pt;"><b>SUBTOTAL</b></p></td>\
            <td colspan="5" class="right" style="valign:middle;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:9pt;">'+ currency + ' ' + subTotal + '</p></td>\
          </tr>\
            <tr>\
            <td colspan="3" class="left"  style="valign:middle;"><p class="left" style="font-size:5pt;"><b>DISCOUNT</b></p></td>\
            <td colspan="5" class="right"  style="valign:middle;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:9pt;">'+ currency + ' ' + discounttotal + '</p></td>\
            </tr>\
          <tr>\
            <td colspan="5" class="left" style="valign:middle;"><p class="left" style="font-size:5pt;"><b>SHIPPING</b></p></td>\
            <td colspan="3" class="right" style="valign:middle;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:9pt;">'+ currency + ' ' + shippingCost + '</p></td>\
          </tr>\
            <tr>\
              <td colspan="3" class="left" style="valign:middle;"><p class="left" style="font-size:5pt;"><b>GIFT CERTIFICATE USED</b></p></td>\
              <td colspan="5" class="right" style="valign:middle;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:9pt;">'+ currency + ' ' + giftcertapplied + '</p></td>\
            </tr>\
          <tr>\
            <td colspan="3" class="left" style="valign:middle;"><p class="left" style="font-size:5pt;"><b>GST INCLUDED</b></p></td>\
            <td colspan="5" class="right" style="valign:middle;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:9pt;">'+ currency + ' ' + taxtotal + '</p></td>\
          </tr>\
          <tr>\
            <td colspan="3" class="left" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="left" style="font-size:5pt;"><b>TOTAL INCL GST</b></p></td>\
            <td colspan="5" class="right" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:15pt;">'+ currency + ' ' + total + '</p></td>\
          </tr>\
          <tr>\
            <td colspan="3" class="left" style="valign:middle;"><p class="left" style="font-size:5pt;"><b>TERMS</b></p></td>\
            <td colspan="5" class="right" style="valign:middle;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:5pt;">'+ terms + '</p></td>\
          </tr>\
            <tr>\
              <td colspan="3" class="left" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="left" style="font-size:5pt;"><b>AMOUNT PAID</b></p></td>\
              <td colspan="5" class="right" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:15pt;">'+ currency + ' ' + amountPaid + '</p></td>\
            </tr>\
            <tr>\
              <td colspan="3" class="left" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="left" style="font-size:5pt;"><b>DEPOSIT OUTSTANDING</b></p></td>\
              <td colspan="5" class="right" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:15pt;">'+ currency + ' ' + depositAmountToPrecision + '</p></td>\
            </tr>\
            <tr>\
              <td colspan="3" class="left" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="left" style="font-size:5pt;"><b>TOTAL REMAINING</b></p></td>\
              <td colspan="5" class="right" style="valign:bottom;padding:2.5mm 0 2.5mm 0;"><p class="right" style="font-size:15pt;">'+ currency + ' ' + BalanceDue + '</p></td>\
            </tr>\
        </table>\
            </td>\
            </tr>\
          </table>\
          </div>';
      template += '<div id="terms">\
          <table style="width:100%;margin-top:4mm">\
            <tr>\
              <td colspan="16" class="left btop suprememedium" style="margin:0 4mm 0 0;padding: 2mm 0 0 0;width:65%;border-top: 1px solid;"><p class="left supremebold track100" style="font-size:5pt;"><b>TERMS &amp; CONDITIONS</b></p></td>\
              <td colspan="8" class="left btop suprememedium" style="margin:0 0 0 0;padding: 2mm 0 0 0;width:35%;border-top: 1px solid;"><p class="left supremebold track100" style="font-size:5pt;"><b>PAYMENT DETAILS</b></p></td>\
            </tr>\
            <tr>\
      <td colspan="8" class="left" style="margin:0;padding:2mm 3mm 0 0;width:65%;">\
        <p class="left supremelight" style="font-size:5pt;margin:0;padding:0;">Terms and Conditions <a href="https://www.mcmhouse.com/pages/terms-and-conditons" target="_blank">Click Here</a> for more information.</p>\
        <p class="left supremelight" style="font-size:5pt;padding:0;margin:2mm 0 1mm 0;">Returns / Warranty <a href="https://www.mcmhouse.com/pages/product-care-maintainance" target="_blank">Click here</a> for more information</p>\
      </td>\
      <td colspan="8" class="left" style="margin:0;padding:2mm 3mm 0 0">&nbsp;</td>\
      \
      \
      \
      \
      \
      <td colspan="8" class="left" style="margin:0;padding:0 0 0 0;width:35%;">\
        <table style="width:100%;margin:0;padding:0">\
          <tr><td colspan="10" class="left" style="margin-top:2mm"><p class="left supremebold track100" style="font-size:7pt;line-height:120%;"><b>CREDIT CARD</b></p></td></tr>\
          <tr><td colspan="10" class="left" style="font-size:7pt;"><p class="left supremelight">MCM House accepts all major credit cards. Please contact your consultant to make payment via our online payment portal or over the phone.</p></td></tr>\
\
          <tr><td colspan="10" class="left" style="margin-top:2mm"><p class="left supremebold track100" style="font-size:7pt;line-height:120%;"><b>PAY ONLINE</b></p></td></tr>\
\
               <tr>\
               <td colspan="3" class="left" style="font-size:7pt;"><p class="left supremelight">Deposit Due:</p></td>\
               <td colspan="7" class="left" style="font-size:7pt;"><p class="left supremelight"><a href="https://www.mcmhouse.com/pages/terms-and-conditons" target="_blank">Click to Pay '+ currency + ' ' + depositAmountToPrecision + '</a></p></td>\
               </tr>\
\
\
               <tr><td colspan="3" class="left" style="font-size:7pt;"><p class="left supremelight">Total Due:</p></td><td colspan="7" class="left" style="font-size:7pt;"><p class="left supremelight"><a href="https://www.mcmhouse.com/pages/terms-and-conditons" target="_blank">Click to Pay '+ currency + ' ' + BalanceDue + '</a></p></td></tr>\
\
          <tr><td colspan="10" class="left" style="margin-top:2mm"><p class="left supremebold track100" style="font-size:7pt;line-height:120%;">EFT</p></td></tr>\
          <tr><td colspan="3" class="left" style="font-size:7pt;"><p class="left supremelight">Name:</p></td><td colspan="7" class="left" style="font-size:7pt;"><p class="left supremelight">Charles Bruce Pty Ltd T/A MCM House</p></td></tr>\
          <tr><td colspan="3" class="left" style="font-size:7pt;"><p class="left supremelight">BSB:</p></td><td colspan="7" class="left" style="font-size:7pt;"><p class="left supremelight">012 140</p></td></tr>\
          <tr><td colspan="3" class="left" style="font-size:7pt;"><p class="left supremelight">Account:</p></td><td colspan="7" class="left" style="font-size:7pt;"><p class="left supremelight">302 8126 02</p></td></tr>\
          <tr><td colspan="3" class="left" style="font-size:7pt;"><p class="left supremelight">Reference:</p></td><td colspan="7" class="left" style="font-size:7pt;"><p class="left supremelight">#'+ tranid + '</p></td></tr>\
          <tr><td colspan="10" class="left" style="font-size:7pt;"><p class="left supremelight">Please email your remittance advice to accounts@mcmhouse.com</p></td></tr>\
        </table>\
      </td>\
      </tr>\
          </table>\
          </div>';
      template += "</body>";
      template += "</pdf>";
      template += "</pdfset>";
      //Using "N/render" Module to Generate PDF
      var pdfFile = render.xmlToPdf({
        xmlString: template
      });
      response.writeFile(pdfFile, true);
    }
    return {
      onRequest: onRequest
    };
  });