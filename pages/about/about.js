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
import { NavController, PopoverController } from 'ionic-angular';
// search page
import { SearchPage } from '../search/search';
// storage
import { Storage } from '@ionic/storage';
// dropdown menu
import { DropdownHeaderPage } from '../dropdown-header/dropdown-header';
// cart page
import { CartPage } from '../cart/cart';
import { HTTP } from '@ionic-native/http';
var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl, storage, popoverCtrl, httpNative) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.popoverCtrl = popoverCtrl;
        this.httpNative = httpNative;
        this.loadingFirst = false;
        this.errNoti = false;
        this.qtyItemCart = 0;
        this.httpNative.get('https://do4go.com/pages/ve-chung-toi-app?view=dogo.json', {}, {}).then(function (res) {
            _this.contentPage = JSON.parse(res.data).page.content;
            _this.loadingFirst = true;
        }, function (err) {
            console.log(err);
            _this.errNoti = true;
        });
        // storage product trong giỏ hàng
        this.storage.get('itemCarts').then(function (data) {
            if (data == null) {
                _this.qtyItemCart = 0;
            }
            else {
                _this.qtyItemCart = data.length;
            }
        });
        // set timeout or error 3 phút
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.errNoti = true;
            }
        }, 180000);
    }
    // go to search page
    AboutPage.prototype.goSearch = function () {
        this.navCtrl.push(SearchPage);
    };
    // đến trang giỏ hàng
    AboutPage.prototype.gotoCart = function () {
        this.navCtrl.push(CartPage);
    };
    // dropdown menu
    AboutPage.prototype.dropdownPopover = function () {
        var popover = this.popoverCtrl.create(DropdownHeaderPage, {
            estest: '11'
        }, {
            cssClass: 'dropdown-header'
        });
        popover.present();
    };
    AboutPage = __decorate([
        Component({
            selector: 'page-about',
            templateUrl: 'about.html'
        }),
        __metadata("design:paramtypes", [NavController, Storage, PopoverController, HTTP])
    ], AboutPage);
    return AboutPage;
}());
export { AboutPage };
//# sourceMappingURL=about.js.map