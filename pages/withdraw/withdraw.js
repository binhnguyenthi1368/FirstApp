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
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { CartPage } from '../cart/cart';
// import { viewVariant } from '../product/product';
import { CoinService } from '../../services/coin.service';
// import { ProductService } from '../../services/product.service';
// in app browser
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
// customer service
import { CustomerService } from '../../services/customer.service';
import { Globals } from '../../app/providers/globals';
/**
 * Generated class for the WithdrawPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var WithdrawPage = /** @class */ (function () {
    function WithdrawPage(navCtrl, navParams, cservice, storage, cusService, tb, viewCtrl, alertCtrl, globals) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.cservice = cservice;
        this.storage = storage;
        this.cusService = cusService;
        this.tb = tb;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.globals = globals;
        this.totalXu = 0;
        // loading first
        this.loadingClick = false;
        // timeout or empty
        this.notiTimeout = false;
        // checkout
        this.data_post_structor = {
            "line_items": [],
            "full_name": "",
            "email": "",
            "phone": "",
            "address": "",
            "ln": 0,
            "tldt": 0,
            "tnc": 0,
            "qtt": 0
        };
        this.item = {
            "variant_id": '',
            "quantity": 1
        };
        this.options2 = {
            statusbar: {
                color: '#db3235'
            },
            toolbar: {
                height: 44,
                color: '#db3235'
            },
            title: {
                color: '#ffffff',
                staticText: 'Rút tiền mặt'
            },
            closeButton: {
                wwwImage: 'assets/icon/close.png',
                align: 'right',
                event: 'closePressed'
            },
            customButtons: [
                {
                    wwwImage: 'assets/icon/back.png',
                    align: 'left',
                    event: 'backToCart'
                }
            ],
            // clearcache: true,
            // clearsessioncache: true,
            backButtonCanClose: true
        };
        this.cservice.getHandle('nap-xu', 1, "price-ascending").then(function (res) {
            _this.items = JSON.parse(res.data).products.map(_this.toProduct);
        }, function (err) {
            _this.notiTimeout = true;
        });
        this.globals.xu.subscribe(function (data) {
            _this.totalXu += Math.round(data);
        });
        this.globals.xu2.subscribe(function (data) {
            _this.totalXu += Math.round(data);
        });
        setTimeout(function () {
            console.log("total xu: " + _this.totalXu);
        }, 10000);
    }
    WithdrawPage.prototype.toProduct = function (r) {
        var Product = ({
            id: r.first_variant,
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
        if (r.isWholeSale === 'true') {
            Product.isWholeSale = true;
        }
        return Product;
    };
    // pay
    WithdrawPage.prototype.productTapped = function (id, price) {
        var _this = this;
        this.loadingClick = true;
        setTimeout(function () {
            _this.loadingClick = false;
        }, 2000);
        price = price / 100;
        // check xem số xu của acc đó có thể rút mệnh giá này không
        console.log(price + '  ' + this.totalXu);
        if (this.totalXu >= price) {
            // info account
            this.storage.get('infoAccount').then(function (data) {
                // neu dang nhap roi thi co thong tin nguoi dung
                if (data != null && data != '') {
                    // lay thong tin nguoi dung
                    _this.cusService.get(data).subscribe(function (customer) {
                        _this.infoAccount = customer;
                        // lay itemcarts storage
                        var item = { "variant_id": id, "quantity": 1 };
                        _this.data_post_structor.line_items.push(item);
                        // thông tin email
                        _this.data_post_structor.email = _this.infoAccount.email;
                        // check first name = null ko
                        if (_this.infoAccount.first_name == null) {
                            _this.infoAccount.first_name = '';
                        }
                        // check default_address 
                        if (_this.infoAccount.default_address != null && _this.infoAccount.default_address != undefined) {
                            // thông tin địa chỉ
                            _this.data_post_structor.address = _this.infoAccount.default_address.address1;
                            // check địa chỉ = null ko
                            if (_this.infoAccount.default_address.address1 == null) {
                                _this.infoAccount.default_address.address1 = '';
                            }
                        }
                        // check last name = null ko
                        if (_this.infoAccount.last_name == null) {
                            _this.infoAccount.last_name = '';
                        }
                        // thông tin fullname = first + last name
                        _this.data_post_structor.full_name = _this.infoAccount.first_name + _this.infoAccount.last_name;
                        // loi nhuan
                        _this.data_post_structor.ln = 0;
                        // thuong nhi cap
                        _this.data_post_structor.tnc = 0;
                        // thuong tich luy
                        _this.data_post_structor.tldt = -price / 100;
                        // quy tu thien
                        _this.data_post_structor.qtt = 0;
                        // json và encode
                        var data_post_encode = encodeURIComponent(JSON.stringify(_this.data_post_structor));
                        //tao url
                        var url = "https://dogobtgroup.myharavan.com/cart?data=" + data_post_encode + "&view=dogo&themeid=1000281853";
                        // let url = "https://dogobtgroup.myharavan.com/cart?line_items=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%2C%22full_name%22%3A%22pham%20the%20loi%22%2C%22email%22%3A%22phamtheloi%40gmail.com%22%2C%22phone%22%3A982839923%2C%22address%22%3A%22test%201%22%7D&view=dogo&themeid=1000281853";
                        // let url = "https://dogobtgroup.myharavan.com/cart?test=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%7D&view=dogo&themeid=1000281853";
                        var brower = _this.tb.create(url, '_blank', _this.options2);
                        brower.on("ThemeableBrowserError").subscribe(function (error) {
                            console.log(error);
                            brower.close();
                        });
                        brower.on("backToCart").subscribe(function (error) {
                            brower.close();
                            //   this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
                            //    let index = this.viewCtrl.index;
                            //    this.navCtrl.remove(index);
                            // })
                        });
                        brower.on("closePressed").subscribe(function (error) {
                            // this.clearCart()
                            brower.close();
                        });
                        brower.on("loadfail").subscribe(function (error) {
                            console.log(error);
                            var noti = _this.alertCtrl.create({
                                message: "Kiểm tra lại kết nối!"
                            });
                            noti.present();
                            setTimeout(function () {
                                if (noti.isOverlay) {
                                    noti.dismiss();
                                }
                            }, 3000);
                            brower.close();
                        });
                        brower.on("unexpected").subscribe(function (error) {
                            console.log(error);
                            brower.close();
                        });
                        brower.on("undefined").subscribe(function (error) {
                            console.log(error);
                            brower.close();
                        });
                        brower.on("ThemeableBrowserWarning").subscribe(function (error) {
                            console.log(error);
                        });
                        brower.on("critical").subscribe(function (error) {
                            console.log(error);
                        });
                    });
                }
            });
        }
        else {
            var noti_1 = this.alertCtrl.create({
                message: "Số xu trong tài khoản không đủ!",
            });
            noti_1.present();
            setTimeout(function () {
                if (noti_1.isOverlay) {
                    noti_1.dismiss();
                }
            }, 3000);
        }
    };
    WithdrawPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad WithdrawPage');
    };
    WithdrawPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-withdraw',
            templateUrl: 'withdraw.html',
            providers: [CoinService /*, CartPage, viewVariant, ProductService*/]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            CoinService,
            Storage,
            CustomerService,
            ThemeableBrowser,
            ViewController,
            AlertController,
            Globals])
    ], WithdrawPage);
    return WithdrawPage;
}());
export { WithdrawPage };
//# sourceMappingURL=withdraw.js.map