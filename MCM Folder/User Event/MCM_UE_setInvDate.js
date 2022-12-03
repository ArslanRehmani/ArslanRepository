/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */
define(['N/log','N/record'], function(log,record) {

    function beforeSubmit(context) {
        var title = 'beforeSubmit(::)';
        try{
           // var rec = context.newRecord;
            var newValue = context.newRecord;
            var oldValue = context.oldRecord;
            var newStatus = newValue.getValue('shipstatus');
            var oldStatus = oldValue.getValue('shipstatus');
                if(newStatus != oldStatus  && newStatus == 'C'){
                    var shipSatatusDate = new Date();
                        thirdDayDate = shipSatatusDate.setDate(shipSatatusDate.getDate() + 3);
                        newValue.setValue('custbody_if_invoice_date', new Date(thirdDayDate));
                }else{
                    newValue.setValue('custbody_if_invoice_date', '');
                }
        } catch(e) {
            log.debug('Exception ' +title, e.message);
        }
    }

    return {
        beforeSubmit: beforeSubmit
    }
});
