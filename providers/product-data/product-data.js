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
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the ProductDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var ProductDataProvider = /** @class */ (function () {
    function ProductDataProvider(http) {
        this.http = http;
        console.log('Hello ProductDataProvider Provider');
    }
    ProductDataProvider.prototype.getRemoteData = function () {
        // console.log(this.http.get('https://api.myjson.com/bins/bmqnt'));
        this.http.get('https://api.myjson.com/bins/bmqnt').map(function (res) { return res.json(); }).subscribe(function (data) {
            // console.log(data);
        });
    };
    ProductDataProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], ProductDataProvider);
    return ProductDataProvider;
}());
export { ProductDataProvider };
//# sourceMappingURL=product-data.js.map