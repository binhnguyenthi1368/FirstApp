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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
// storage
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
// Product page
import { ProductPage } from '../product/product';
import { Globals } from '../../app/providers/globals';
import { ProductService } from '../../services/product.service';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SearchPage = /** @class */ (function () {
    function SearchPage(keyboard, pservice, alertCtrl, globals, navCtrl, navParams, storage, http) {
        var _this = this;
        this.keyboard = keyboard;
        this.pservice = pservice;
        this.alertCtrl = alertCtrl;
        this.globals = globals;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.http = http;
        this.searchQuery = '';
        this.loadingFirst = true;
        // timeout or empty
        this.notiTimeout = false;
        this.isAgencyRegular = false;
        this.page = 1;
        this.totalPages = 1;
        // hien thi dai ly hoac ctv
        this.globals.typeUser.subscribe(function (data) {
            _this.typeUser = data;
        });
        if (this.typeUser.indexOf('tổng đại lý') > -1) {
            this.isAgencyRegular = true;
        }
    }
    // bo dau tieng viet
    SearchPage.prototype.eventHandler = function (keyCode, ev) {
        var _this = this;
        if (keyCode == 13) {
            this.keyboard.close();
            this.notiTimeout = false;
            this.loadingFirst = false;
            var val_1 = ev.target.value;
            var newVal = encodeURIComponent(val_1);
            // get kết quả tìm kiếm
            this.pservice.gotoSearch(val_1, 1).then(function (results) {
                _this.results = null;
                console.log(results.data);
                _this.results = JSON.parse(results.data).products.map(_this.toProduct);
                _this.totalPages = JSON.parse(results.data).paginate.pages;
                _this.loadingFirst = true;
                _this.autoLoadMore(val_1);
                console.log(_this.notiTimeout + ' ' + _this.loadingFirst);
                if (_this.totalPages == 0) {
                    _this.notiTimeout = true;
                }
            }).catch(function (err) {
                _this.notiTimeout = true;
                _this.loadingFirst = true;
                console.log(_this.notiTimeout + ' ' + _this.loadingFirst);
            });
            // set timeout or error 5 phút
            setTimeout(function () {
                if (_this.loadingFirst == false) {
                    _this.loadingFirst = true;
                }
            }, 300000);
        }
    };
    SearchPage.prototype.autoLoadMore = function (value) {
        var _this = this;
        if (this.page < this.totalPages) {
            if (this.page < 5) {
                setTimeout(function () {
                    _this.page++;
                    console.log(_this.page);
                    _this.pservice.gotoSearch(value, _this.page).then(function (results) {
                        _this.results = _this.results.concat(JSON.parse(results.data).products.map(_this.toProduct));
                        _this.autoLoadMore(value);
                    });
                }, 500);
            }
        }
    };
    // click xem chi tiet sp
    SearchPage.prototype.productTapped = function ($event, product) {
        var _this = this;
        console.log(product);
        var lengthPro = this.results.length;
        for (var i = 0; i <= lengthPro - 1; i++) {
            if (this.results[i].handle == product) {
                break;
            }
        }
        // That's right, we're pushing to ourselves!
        this.productResult = this.results[i];
        // neu sp thuoc nhom ban buon
        if (this.productResult.isWholeSale) {
            // check typeuser
            var obs = this.globals.typeUser.subscribe(function (typeUser) {
                if (typeUser.toLowerCase().indexOf('tổng đại lý') > -1) {
                    _this.navCtrl.push(ProductPage, {
                        product: product
                    });
                }
                else {
                    var noti_1 = _this.alertCtrl.create({
                        message: "Bạn không có quyền xem sản phẩm này!",
                    });
                    obs.unsubscribe();
                    noti_1.present();
                    setTimeout(function () {
                        if (noti_1.isOverlay) {
                            noti_1.dismiss();
                        }
                    }, 3000);
                }
            });
        }
        else {
            // storage
            this.storage.get('seenProducts').then(function (data) {
                if (data != null && data.length != 0) {
                    var lengthArr = void 0;
                    var checkDuplicate = 0;
                    lengthArr = data.length;
                    var compareID = _this.productResult.id;
                    for (var i = 0; i <= lengthArr - 1; i++) {
                        var checkID = data[i].id;
                        if (checkID == compareID) {
                            checkDuplicate++;
                        }
                    }
                    if (checkDuplicate == 0) {
                        if ((_this.productResult.isWholeSale && !_this.isAgencyRegular)) {
                            _this.productResult.price_format = '0₫';
                            _this.productResult.compare_at_price = 0;
                            _this.productResult.sale = '-0%';
                        }
                        data.push(_this.productResult);
                        _this.storage.set('seenProducts', data);
                    }
                }
                else {
                    var arrID = [];
                    if ((_this.productResult.isWholeSale && !_this.isAgencyRegular)) {
                        _this.productResult.price_format = '0₫';
                        _this.productResult.compare_at_price = 0;
                        _this.productResult.sale = '-0%';
                    }
                    arrID.push(_this.productResult);
                    _this.storage.set('seenProducts', arrID);
                }
            });
            this.navCtrl.push(ProductPage, {
                product: product
                // product: this.products
            });
        }
    };
    SearchPage.prototype.toProduct = function (r) {
        var Product = ({
            id: r.id,
            title: r.title,
            featured_image: r.featured_image,
            handle: r.handle,
            compare_at_price: r.compare_at_price,
            compare_at_price_format: r.compare_at_price_format,
            price: r.price,
            price_format: r.price_format,
            available: r.available,
            sale: r.sale,
            isWholeSale: false
        });
        console.log(' test -- ' + r.isWholeSale);
        if (r.isWholeSale == "true") {
            Product.isWholeSale = true;
        }
        // console.log('parse product:   '+ JSON.stringify(Product) );
        // if (r.variants[0].compare_at_price > 0 && r.variants[0].price > 0 ) {
        //   Product.sale = Math.round((r.variants[0].compare_at_price - r.variants[0].price)/r.variants[0].compare_at_price*100) + "%"
        // }
        return Product;
    };
    SearchPage.prototype.ionViewDidLoad = function () {
    };
    SearchPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-search',
            templateUrl: 'search.html', providers: [ProductService]
        }),
        __metadata("design:paramtypes", [Keyboard, ProductService, AlertController, Globals, NavController, NavParams, Storage, Http])
    ], SearchPage);
    return SearchPage;
}());
export { SearchPage };
//# sourceMappingURL=search.js.map