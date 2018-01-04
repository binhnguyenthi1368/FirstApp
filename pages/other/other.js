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
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
// storage
import { Storage } from '@ionic/storage';
// copy to clipboard
// import { Clipboard } from '@ionic-native/clipboard';
// Product page
import { ProductPage } from '../product/product';
import { ProductService } from '../../services/product.service';
// customer service
import { CustomerService } from '../../services/customer.service';
/**
 * Generated class for the OtherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OtherPage = /** @class */ (function () {
    function OtherPage(navCtrl, navParams, alertCtrl, storage, cusService, modalCtrl, 
        // public clipboard: Clipboard,
        http) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.cusService = cusService;
        this.modalCtrl = modalCtrl;
        this.http = http;
        // list sp da xem
        this.listSeenProducts = [];
        // list sp da xem
        this.listFavoriteProducts = [];
        this.products = [];
        this.checkSeenPro = false;
        this.checkQr = false;
        this.checkFavoriteProduct = false;
        // value resultView = 1 => view seen Product
        // value resultView = 2 => view sp yeu thich
        // value resultView = 3 => view thông số sp
        // value resultView = 4 => view Mã giới thiệu cá nhân
        // value resultView = 5 => view chi tiết sp
        this.checkDetailProduct = false;
        this.checkThongSoProduct = false;
        // số coin
        this.coin = 0;
    }
    OtherPage_1 = OtherPage;
    OtherPage.prototype.ngOnInit = function () {
        var _this = this;
        this.resultView = this.navParams.get('check');
        this.myCode = this.navParams.get('code');
        // this.clipboard.paste().then(
        //  (resolve: string) => {
        //     alert(resolve);
        //   },
        //   (reject: string) => {
        //     alert('Error: ' + reject);
        //   }
        // );
        // view seen Product
        if (this.resultView == 1) {
            this.checkSeenPro = true;
            this.checkQr = false;
            this.checkFavoriteProduct = false;
            this.checkDetailProduct = false;
            this.checkThongSoProduct = false;
            // get seen product
            this.storage.get('seenProducts').then(function (data) {
                _this.listSeenProducts = data;
            });
        }
        // view sp yeu thich
        if (this.resultView == 2) {
            this.checkFavoriteProduct = true;
            this.checkSeenPro = false;
            this.checkQr = false;
            this.checkDetailProduct = false;
            this.checkThongSoProduct = false;
            // get seen product
            this.storage.get('listFavorite').then(function (data) {
                _this.listFavoriteProducts = data;
            });
        }
        // view chi tiết sp
        if (this.resultView == 3) {
            this.detailProduct = this.navParams.get('detailPro');
            this.checkDetailProduct = true;
            this.checkQr = false;
            this.checkSeenPro = false;
            this.checkFavoriteProduct = false;
            this.checkThongSoProduct = false;
        }
        // view Mã giới thiệu cá nhân
        if (this.resultView == 4) {
            this.checkQr = true;
            this.checkSeenPro = false;
            this.checkFavoriteProduct = false;
            this.checkDetailProduct = false;
            this.checkThongSoProduct = false;
        }
        // view thông số kỹ thuật sp
        if (this.resultView == 5) {
            this.thongSoProduct = this.navParams.get('thongSoPro');
            this.checkThongSoProduct = true;
            this.checkQr = false;
            this.checkSeenPro = false;
            this.checkFavoriteProduct = false;
            this.checkDetailProduct = false;
        }
    };
    // copy code to clipboard
    OtherPage.prototype.copyCode = function () {
        // copy ma gioi thieu to clipboard
        // this.clipboard.copy(this.myCode);
        console.log('sdhsd');
    };
    // view chi tiet khi click vào sp trong trang sp đã xem
    OtherPage.prototype.productTapped = function ($event, product) {
        this.navCtrl.push(ProductPage, {
            product: product
            // product: this.products
        });
    };
    // view mã code cá nhân
    OtherPage.prototype.showYourCode = function (event, check, code) {
        this.navCtrl.push(OtherPage_1, {
            check: check,
            code: code
        });
    };
    OtherPage.prototype.ionViewDidLoad = function () {
    };
    OtherPage = OtherPage_1 = __decorate([
        IonicPage(),
        Component({
            selector: 'page-other',
            templateUrl: 'other.html',
            providers: [ProductService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            Storage,
            CustomerService,
            ModalController,
            Http])
    ], OtherPage);
    return OtherPage;
    var OtherPage_1;
}());
export { OtherPage };
//# sourceMappingURL=other.js.map