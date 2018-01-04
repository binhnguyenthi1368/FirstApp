var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http';
var InfoXuPage = /** @class */ (function () {
    function InfoXuPage(navCtrl, http, httpNative) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.http = http;
        this.httpNative = httpNative;
        this.errNoti = false;
        this.loadingFirst = false;
        this.httpNative.get('https://do4go.com/pages/huong-dan-nap-xu-rut-tien-app?view=dogo.json', {}, {}).then(function (res) {
            _this.contentPage = JSON.parse(res.data).page.content;
            _this.loadingFirst = true;
        }, function (err) {
            console.log(err);
            _this.errNoti = true;
        });
        // set timeout or error 2 phút
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.errNoti = true;
            }
        }, 120000);
    }
    InfoXuPage.prototype.ionViewDidLoad = function () { };
    InfoXuPage = __decorate([
        Component({
            selector: 'page-info-xu',
            templateUrl: 'info-xu.html',
        }),
        __metadata("design:paramtypes", [NavController, Http, HTTP])
    ], InfoXuPage);
    return InfoXuPage;
}());
export { InfoXuPage };
//# sourceMappingURL=info-xu.js.map