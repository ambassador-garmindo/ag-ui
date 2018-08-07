import { inject, bindable, BindingEngine, observable, computedFrom } from 'aurelia-framework'
var moment = require('moment');

var VatLoader = require('../../../loader/vat-loader');

@inject(BindingEngine, Element)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable error = {};
    @bindable options = { isUseIncomeTax: false };

    termPaymentOptions = ['CASH', 'KREDIT', 'DP (DOWN PAYMENT) + BP (BALANCE PAYMENT)', 'DP (DOWN PAYMENT) + TERMIN 1 + BP (BALANCE PAYMENT)', 'RETENSI'];
    freightCostByOptions = ['Penjual', 'Pembeli'];

    itemsColumns = [{ header: "Nomor PR", value: "purchaseRequest.no" }]

    constructor(bindingEngine, element) {
        this.bindingEngine = bindingEngine;
        this.element = element;
    }

    @computedFrom("data._id")
    get isEdit() {
        return (this.data._id || '').toString() != '';
    }

    controlOptions = {
        control: {
            length: 8
        }
    };

    attached() {
        if (this.data.items) {
            this.data.items.forEach(item => {
                item.showDetails = false
            })
        }
    }


    // addItem() {
    //     this.data.items = this.data.items ? this.data.items : [];
    //     this.data.items.push({ showDetails: false });
    // }

    get addItems() {
        return (event) => {
            this.data.items.push({ purchaseRequest: { no: "" } })
        };
    }

    removeItem(item) {
        var itemIndex = this.data.items.indexOf(item);
        this.data.items.splice(itemIndex, 1);
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        if (this.data && this.data.supplier)
            this.data.supplier.toString = function () {
                return this.code + " - " + this.name;
            };
    }

    supplierChanged(e) {
        var selectedSupplier = e.detail;
        if (selectedSupplier)
            this.data.supplierId = selectedSupplier._id ? selectedSupplier._id : "";
    }

    currencyChanged(e) {
        var selectedCurrency = e.detail;
        if (selectedCurrency) {
            var currencyRate = parseInt(selectedCurrency.rate ? selectedCurrency.rate : 1, 10);
            this.data.currencyRate = currencyRate;
        }
        else
            this.data.currencyRate = 0;
    }

    paymentMethodChanged(e) {
        var selectedPayment = e.srcElement.value;
        if (selectedPayment) {
            this.data.paymentMethod = selectedPayment;
            if (this.data.paymentMethod == "CASH") {
                this.data.paymentDueDays = 0;
            }
            else {
                this.data.paymentDueDays = 30;
            }
        }
    }

    vatChanged(e) {
        var selectedVat = e.detail;
        if (selectedVat) {
            this.data.vatRate = selectedVat.rate ? selectedVat.rate : 0;
            this.data.useVat = true;
        }
        else {
            this.data.vatRate = 0;
            this.data.useVat = false;
        }
    }

    useIncomeTaxChanged(e) {
        var selectedUseIncomeTax = e.srcElement.checked || false;
        if (!selectedUseIncomeTax) {
            for (var po of this.data.items) {
                for (var poItem of po.items) {
                    poItem.useIncomeTax = false;
                    poItem.pricePerDealUnit = poItem.priceBeforeTax;
                }
            }
        }
    }

    getText = (text) => {
        var data = text._id ? `${text.name} - ${text.rate}` : "";
        return data
    }

    get vatLoader() {
        return VatLoader;
    }

} 