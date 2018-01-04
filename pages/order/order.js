var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';
// storage
import { Storage } from '@ionic/storage';
// Product page
import { ProductPage } from '../product/product';
// detail order modal
import { DetailOrderPage } from '../detail-order/detail-order';
// customer service
import { CustomerService } from '../../services/customer.service';
import { Profile } from '../../interfaces/profiles';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OrderPage = /** @class */ (function () {
    function OrderPage(modalCtrl, navCtrl, navParams, storage, cusService) {
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.cusService = cusService;
        this.query = 'slide0';
        // check loading
        this.loadingFirst = false;
        this.orderDone = [];
        this.orderPending = [];
        // timeout or empty
        this.notiTimeout = false;
    }
    OrderPage.prototype.ngOnInit = function () {
        var _this = this;
        // view đơn hàng
        this.storage.get('profile').then(function (profile) {
            console.log(profile);
            if (profile !== null) {
                var _profile = new Profile(profile.app, profile.account);
                if (!_profile.isAccountEmpty()) {
                    console.log('Account is already logged');
                    _profile.init();
                    _this.cusService.getOrder(_profile.account.id).subscribe(function (order) {
                        _this.orders = order;
                        console.log(_this.orders);
                        for (var iorder = 0; iorder <= _this.orders.length - 1; iorder++) {
                            if ((_this.orders[iorder].fulfillment_status == 'fulfilled' && _this.orders[iorder].financial_status == 'paid') || _this.orders[iorder].cancelled_status == 'cancelled') {
                                _this.orderDone.push(_this.orders[iorder]);
                            }
                            else {
                                // if (this.orders[iorder].financial_status == 'pending' || this.orders[iorder].financial_status == 'refunded') {
                                _this.orderPending.push(_this.orders[iorder]);
                                // }
                            }
                        }
                        _this.loadingFirst = true;
                    }, function (err) {
                        _this.notiTimeout = true;
                    });
                }
            }
        });
        // set timeout or error 3 phút
        // set timeout or error 3 phút
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.notiTimeout = true;
            }
        }, 180000);
    };
    // 2 tab segment của đơn hàng
    OrderPage.prototype.slideChanged = function () {
        if (this.slides._activeIndex == 0) {
            this.query = 'slide0';
        }
        if (this.slides._activeIndex == 1) {
            this.query = 'slide1';
        }
        // let currentIndex = this.slides.getActiveIndex();
    };
    OrderPage.prototype.showdata = function () {
        if (this.query == 'slide0') {
            this.slides.slideTo(0, 0);
            // this.slides.ionSlideWillChange.
        }
        if (this.query == 'slide1') {
            this.slides.slideTo(1, 0);
        }
        // this.slides.getActiveIndex();
    };
    // view chi tiet khi click vào sp trong trang sp đã xem
    OrderPage.prototype.productTapped = function ($event, product) {
        this.navCtrl.push(ProductPage, {
            product: product
            // product: this.products
        });
    };
    // view chi tiet don hang
    OrderPage.prototype.viewDetailOrder = function (id) {
        console.log(id);
        var modal = this.modalCtrl.create(DetailOrderPage, {
            idorder: id
        });
        modal.present();
    };
    OrderPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad OrderPage');
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], OrderPage.prototype, "slides", void 0);
    OrderPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-order',
            templateUrl: 'order.html',
        }),
        __metadata("design:paramtypes", [ModalController,
            NavController,
            NavParams,
            Storage,
            CustomerService])
    ], OrderPage);
    return OrderPage;
}());
export { OrderPage };
//# sourceMappingURL=order.js.map