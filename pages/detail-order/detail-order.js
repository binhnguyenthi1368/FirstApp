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
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
// customer service
import { CustomerService } from '../../services/customer.service';
/**
 * Generated class for the DetailOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DetailOrderPage = /** @class */ (function () {
    function DetailOrderPage(navCtrl, navParams, viewCtrl, cusService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.cusService = cusService;
        // check loading
        this.loadingFirst = false;
        // timeout or empty
        this.notiTimeout = false;
        this.idOrder = navParams.get('idorder');
        this.cusService.getDetailOrder(this.idOrder).subscribe(function (data) {
            _this.detail = data;
            _this.loadingFirst = true;
        }, function (err) {
            _this.notiTimeout = true;
        });
    }
    DetailOrderPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    DetailOrderPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad DetailOrderPage');
    };
    DetailOrderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-detail-order',
            templateUrl: 'detail-order.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ViewController,
            CustomerService])
    ], DetailOrderPage);
    return DetailOrderPage;
}());
export { DetailOrderPage };
//# sourceMappingURL=detail-order.js.map