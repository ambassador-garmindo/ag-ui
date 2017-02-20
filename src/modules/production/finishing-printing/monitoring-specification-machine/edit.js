
import {Router} from 'aurelia-router';
import {Service} from './service';

import {inject, bindable, computedFrom} from 'aurelia-framework';
var moment = require('moment');
var momentToMillis = require('../../../../utils/moment-to-millis')


@inject(Router, Service)
export class View {
    @bindable data = { "import": true };
    @bindable error = {};
    @bindable showSecond = false;
    @bindable timePickerFormat = "HH:mm";
    @bindable datePickerFormat = "DD MMMM YYYY";
    @bindable Options = {
        "readOnly": false,

    }

    constructor(router, service, bindingEngine, element) {
        this.router = router;
        this.service = service;
        this.bindingEngine = bindingEngine;
        this.element = element;
    }
    // @computedFrom("data._id")
    // get isEdit() {
    //     return (this.data._id || '').toString() != '';
    // }

    // get isFilterMachineType() {
    //     this.filterMachineType = {
    //         "code": this.data.code
    //     };
    //     return this.filterMachineType;
    // }


    machineChanged(e) {
        if (e.detail) {
            var selectedProcess = e.detail || {};
            if (selectedProcess) {

                var items = [];
                for (var indicator of selectedProcess.machineType.indicators) {
                    var item = {
                        indicator: indicator.indicator,
                        dataType: indicator.dataType,
                        defaultValue: indicator.defaultValue,
                        value: "",
                    };
                    items.push(item);
                }
                this.data.items = items;

                this.data.machineId = selectedProcess._id ? selectedProcess._id : "";
            }
        }
    }

    bind() {
        this.data;
        this.timeInMoment = this.data ? moment(this.data.time) : "";
    }

    async activate(params) {

        var id = params.id;
        this.data = await this.service.getById(id);
    }

    view() {
        this.router.navigateToRoute('view', { id: this.data._id });
    }

    save() {
        
        this.service.update(this.data).then(result => {
            this.view();
            
        }).catch(e => {
            
            this.error = e;
        })
    }
}