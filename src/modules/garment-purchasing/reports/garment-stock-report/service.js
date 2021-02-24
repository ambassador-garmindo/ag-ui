import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../../utils/rest-service';

const serviceUri = 'garment-stock-report';

export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }

    search(info) {
        let endpoint = `${serviceUri}?unitcode=${info.unitcode}&category=${info.category}&dateFrom=${info.dateFrom}&dateTo=${info.dateTo}&suppliertype=${info.suppliertype}&customstype=${info.customstype}`;
       
        return super.get(endpoint);
    }

    generateExcel(args) {
        var endpoint = `${serviceUri}/download?unitcode=${args.unitcode}&category=${args.category}&dateFrom=${args.dateFrom}&dateTo=${args.dateTo}&suppliertype=${args.suppliertype}&customstype=${args.customstype}`;
        return super.getXls(endpoint);
    }

}
