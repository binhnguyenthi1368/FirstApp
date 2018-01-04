var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
// search page
import { SearchPage } from '../search/search';
// storage
import { Storage } from '@ionic/storage';
// cart page
import { CartPage } from '../cart/cart';
import { HTTP } from '@ionic-native/http';
var PolicyPage = /** @class */ (function () {
    function PolicyPage(navCtrl, storage, popoverCtrl, http, httpNative) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.popoverCtrl = popoverCtrl;
        this.http = http;
        this.httpNative = httpNative;
        this.errNoti = false;
        this.loadingFirst = false;
        this.httpNative.get('https://do4go.com/pages/chinh-sach-dang-ky-tai-khoan?view=dogo.json', {}, {}).then(function (res) {
            _this.contentPage = JSON.parse(res.data).page.content;
            _this.loadingFirst = true;
        }, function (err) {
            console.log(err);
            _this.errNoti = true;
        });
        // set timeout or error 3 phút
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.errNoti = true;
            }
        }, 180000);
    }
    // go to search page
    PolicyPage.prototype.goSearch = function () {
        this.navCtrl.push(SearchPage);
    };
    // đến trang giỏ hàng
    PolicyPage.prototype.gotoCart = function () {
        this.navCtrl.push(CartPage);
    };
    PolicyPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad PolicyPage');
    };
    PolicyPage = __decorate([
        Component({ selector: 'page-policy', templateUrl: 'policy.html', }),
        __metadata("design:paramtypes", [NavController, Storage, PopoverController, Http, HTTP])
    ], PolicyPage);
    return PolicyPage;
}());
export { PolicyPage };
//# sourceMappingURL=policy.js.map