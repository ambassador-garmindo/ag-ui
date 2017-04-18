import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';


@inject(Router, Service)
export class List {
    data = [];
    listReport = [
        "63193d44-40f7-4983-ae54-1f4096fed943",//Durasi PR
        "163de3e2-fe44-4f12-9177-625c15fb976f",//Durasi PO Internal - PO Eksternal
        "49aac9e1-0abd-4f4a-b6fe-23c4813cc118",//Durasi PO Eksternal - Surat Jalan
        "3d33db62-883e-4e15-8a25-07cedd32dba1",//Total Nilai Pembelian
        "1031ae03-7b0d-4466-928b-e59e3a24c39d",//Supplier Tepat Waktu
        "89ee506a-cf54-48d1-92ca-d2a0b9de26fd",//Perbandingan Purchase Order
        // "2b455aa7-9d41-4c0c-883b-730454e428cd",//Top Ten Supplier per Total SPB
        "4fd55640-57bd-46b5-bf9c-b584869a31fd", //Total Hutang
    ];
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    activate() {
        this.service.search('')
            .then(data => {
                for (var report of this.listReport) {
                    var _data = data.find((_data) => _data.id === report);
                    if (_data) {
                        this.data.push(_data);
                    }
                }
            })
    }

    view(data) {
        this.router.navigateToRoute('view', { id: data.id });
    }
}
