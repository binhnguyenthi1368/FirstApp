var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, /*RequestOptions,*/ Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
var CustomerService = /** @class */ (function () {
    function CustomerService(http, storage) {
        this.http = http;
        this.storage = storage;
        this.baseUrl = 'https://suplo-app.herokuapp.com/dogo-app';
    }
    CustomerService.prototype.getHeaders = function () {
        // I included these headers because otherwise FireFox
        // will request text/html
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    };
    CustomerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, Storage])
    ], CustomerService);
    return CustomerService;
}());
export { CustomerService };
// this could also be a private method of the component class
function handleError(error) {
    // log error
    // could be something more sofisticated
    var errorMsg = error.message || "K\u1EBFt n\u1ED1i d\u1EEF li\u1EC7u kh\u00F4ng th\u00E0nh c\u00F4ng! Vui l\u00F2ng th\u1EED l\u1EA1i.";
    console.error(errorMsg);
    // throw an application level error
    return Observable.throw(errorMsg);
}
//# sourceMappingURL=reward.js.map