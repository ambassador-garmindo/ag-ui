import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

//var UnitLoader = require('../../../loader/garment-units-loader');
var SupplierLoader = require('../../../loader/garment-supplier-loader');
//var UnitReceiptLoader = require('../../../loader/garment-unit-receipt-note-loader');

@inject(Router, Service)
export class List {
  constructor(router, service) {
        this.service = service;
        this.router = router;

        //this.flag = false;

    }
    
    // tableOptions = {
    //     search: false,
    //     showToggle: false,
    //     showColumns: false
    // }
    // get unitLoader(){
    //     return UnitLoader;
    // }
    // unitView = (unit) => {
      
    //     return `${unit.Code} - ${unit.Name}`
    // }
    get supplierLoader(){
        return SupplierLoader;
    }
    // get unitReceiptLoader(){
    //     return UnitReceiptLoader;
     
    // }
    customsCategoryOptions = ['', 'FASILITAS', 'NONFASILTIAS'];
   
    // tgl 02/09/2021
    // columns = [
    //     { field: "id", title: "No", sortable: false },
    //     { field: "no", title: "Nomor Bon Terima Unit", sortable: false },
    //     { field: "dateBon", title: "Tanggal Bon Terima Unit", sortable: false },
    //     { field: "unit", title: "Unit", sortable: false },
    //     { field: "supplier", title: "Supplier", sortable: false },
    //     { field: "shipmentType", title: "Jenis Supplier", sortable: false, formatter: function (value, data) {
    //             return (value)==""? "Local" : "Import";
    //     }},
    //     { field: "doNo", title: "Surat Jalan", sortable: false },
    //     { field: "poEksternalNo", title: "No PO Eksternal", sortable: false },
    //     { field: "customsCategory", title: "Jenis Pembelian", sortable: false },
    //     { field: "poRefPR", title: "No Ref PR", sortable: false },
    //     { field: "roNo", title: "No RO", sortable: false },
    //     { field: "article", title: "Artikel", sortable: false },
    //     { field: "productCode", title: "Kode Barang", sortable: false },
    //     { field: "productName", title: "Nama Barang", sortable: false },
    //     { field: "qty", title: "Jumlah", sortable: false },
    //     { field: "uom", title: "Satuan", sortable: false },
    //     { field: "price", title: "Harga Satuan", sortable: false },
    //     { field: "remark", title: "Keterangan", sortable: false },
    //     { field: "design", title: "Desain Color", sortable: false },
    //     { field: "user", title: "User", sortable: false },
    //     { field: "createdBy", title: "Staff Pembelian", sortable: false },
    //     { field: "internNote", title: "Nota Intern", sortable: false },
    // ]
    // Values() {
    //     this.arg.dateFrom = this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : null;
    //     this.arg.dateTo = this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : null;
    //     this.arg.no = this.no ? this.no.URNNo : "";
    //     this.arg.refNo = this.poRefPR ? this.poRefPR : "";
    //     this.arg.roNo = this.roNo ? this.roNo : "";
    //     this.arg.doNo =this.doNo ? this.doNo : "";
    //     this.arg.supplier =  this.supplier ? this.supplier.code : "";
    //     this.arg.unit = this.unit ? this.unit.Code : "";
    //     this.arg.customsCategory = this.customsCategory;
    //     console.log(this.arg);
    // }
    
    // listDataFlag = false;
    // loader = (info) => {
    //     var order = {};

    //     if (info.sort)
    //         order[info.sort] = info.order;

    //     this.arg = {
    //         page: parseInt(info.offset / info.limit, 10) + 1,
    //         size: info.limit,
    //         keyword: info.search,
    //         order: order
    //     };
    //     return this.listDataFlag ? (
    //         this.Values(),
    //         this.service.search(this.arg)
    //             .then(result => {
    //                 return {
    //                     total: result.info.total,
    //                     data: result.data,
    //                 }
    //             })
    //     ) : { total: 0, data: {} };
    // }
    // search() {
    //     this.listDataFlag = true;
    //     this.table.refresh();
    // }

    bind(context){
        this.context = context;
    }

    attached(){

    }

    active(){

    }

    search(){
        this.info = { page: 1, size: 25 };
        this.info.total = 0;
        this.searching();
    }

    searching() {
            
            var info = {
                page: this.info.page,
                size: this.info.size,
                no : this.no ? this.no : "",
                poRefPR : this.poRefPR ? this.poRefPR : "",
                roNo : this.roNo ? this.roNo : "",
                doNo : this.doNo ? this.doNo : "",
                supplier : this.supplier ? this.supplier.code : "",
                customsCategory : this.customsCategory,
                unit : this.unit ? this.unit.Code : "",
                dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
                dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : ""
            }
        
            this.service.search(info)
                .then(result => {
                    var rowDoc=[]
                    for(var _data of result.data){
                        var no = _data.no.toString();

                        if (!rowDoc[no]){
                            rowDoc[no] = 1;
                        }
                        else {
                            rowDoc[no]++;
                        }

                        for(var b of result.data){
                            let no = result.data.find(o => o.no == b.no);
                            b.supplierType = b.shipmentType == "" ? "Local" : "Import";

                            if(no){
                                no.rowspan = rowDoc[b.no];
                            } 
                        }
                    }
                    this.info.total = result.info.total;
                    this.data = result.data;
            });

    }
    
    ExportToExcel() {
        var info = {
            no : this.no ? this.no.URNNo : "",
            poRefPR : this.poRefPR ? this.poRefPR : "",
            roNo : this.roNo ? this.roNo : "",
            doNo : this.doNo ? this.doNo : "",
            supplier : this.supplier ? this.supplier.code : "",
            unit : this.unit ? this.unit.Code : "",
            dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
            customsCategory : this.customsCategory
        }
        console.log(info);
        this.service.generateXls(info.no, info.poRefPR, info.roNo, info.doNo, info.unit, info.supplier, info.customsCategory, info.dateFrom, info.dateTo)
    }
  

    reset() {
       
        this.no="";
        this.poRefPR="";
        this.roNo="";
        this.doNo="";
        this.unit="";
        this.dateFrom="";
        this.dateTo="";
        this.supplier="";
        //this.table.refresh();
        this.data=null;
    }

    changePage(e) {
        var page = e.detail;
        this.info.page = page;
        this.searching();
    }
}