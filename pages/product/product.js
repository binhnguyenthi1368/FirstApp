var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Globals } from './../../app/providers/globals';
import { Component, ViewChild } from '@angular/core';
import { ViewController, NavController, Content, NavParams, Platform, PopoverController, MenuController, Slides, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
// storage
import { Storage } from '@ionic/storage';
// in app browser
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CurrencyPipe } from '@angular/common';
// collection page
import { CollectionsPage } from '../collections/collections';
// // view variant
import { ProductService } from '../../services/product.service';
// other page
import { OtherPage } from '../other/other';
// Notifications Model
import { NotificationsModel } from '../notifications/notifications';
import { SearchPage } from '../search/search';
// cart page
import { CartPage } from '../cart/cart';
//firebase login
import { AuthService } from '../../app/providers/auth.service';
// customer service
import { CustomerService } from '../../services/customer.service';
var ProductPage = /** @class */ (function () {
    function ProductPage(navCtrl, navParams, platform, popoverCtrl, menu, modalCtrl, http, sanitized, curency, pservice, storage, toastCtrl, alerCtrl, globals, authService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platform = platform;
        this.popoverCtrl = popoverCtrl;
        this.menu = menu;
        this.modalCtrl = modalCtrl;
        this.http = http;
        this.sanitized = sanitized;
        this.curency = curency;
        this.pservice = pservice;
        this.storage = storage;
        this.toastCtrl = toastCtrl;
        this.alerCtrl = alerCtrl;
        this.globals = globals;
        this.authService = authService;
        this.loadingFirst = false;
        this.isProductLoaded = false;
        this.products = [];
        this.listSeenProducts = [];
        this.addFavor = false;
        this.qtyItemCart = 0;
        // rut gon detail product
        this.showdes = true;
        // rut gon thong so product
        this.showdes1 = true;
        // timeout or empty
        this.notiTimeout = false;
        // so thong bao
        this.notiCounts = 0;
        this.typeUser = '';
        // checkWholeSale: boolean = false;
        this.isAgencyRegular = false;
        // storage noti
        this.globals.notiCounts.subscribe(function (data) {
            _this.notiCounts = data;
        });
        // hien thi dai ly hoac ctv
        var obs = this.globals.typeUser.subscribe(function (data) {
            _this.typeUser = data;
        });
        // this.storage.get('profile').then((profile) => {
        //   if(profile !== null){
        //     const _profile = new Profile(profile.app, profile.account);
        //     console.log(_profile);
        //     if(!_profile.isAppEmpty()){
        //       console.log('Home settings was loaded!');
        //     }
        //     if(!_profile.isAccountEmpty()){
        //       console.log('Account is already logged');
        //       _profile.init();
        //       this.typeUser = _profile.type.name;
        //       if(_profile.account.name == ""){
        //         this.globals.typeUser.subscribe(data => {
        //           this.typeUser = data;
        //         });
        //       }
        //     }
        //   }
        // });
        // storage product trong giỏ hàng
        this.storage.get('itemCarts').then(function (data) {
            if (data == null) {
                _this.qtyItemCart = 0;
            }
            else {
                _this.qtyItemCart = data.length;
            }
            globals.setCartCounts(_this.qtyItemCart);
            globals.cartCounts.subscribe(function (data) {
                _this.qtyItemCart = data;
            });
        });
        // so thong bao
        this.productId = navParams.get('product');
        // thông tin chi tiết sp, sp cung nha san xuat, handle collection
        // this.productAsync = this.pservice.get(this.productId);
        this.pservice.get(this.productId).then(function (res) {
            // chi tiet sp
            console.log(JSON.parse(res.data));
            _this.productDetail = _this.toProductDetail(JSON.parse(res.data));
            console.log(_this.productDetail);
            // if(this.productDetail.isWholeSale === 'true'){
            //   this.checkWholeSale = true;
            // }
            if (_this.typeUser.indexOf('tổng đại lý') > -1) {
                _this.isAgencyRegular = true;
            }
            console.log(_this.typeUser);
            console.log(_this.productDetail.isWholeSale);
            // this.checkWholeSale = product.isWholeSale.parseBoolean("true");
            // check sp có thuộc nhóm sp bán buôn?
            if (_this.productDetail.isWholeSale) {
                // check có là đại lý?
                if (_this.isAgencyRegular == false) {
                    console.log(_this.productDetail.price);
                    // ko là đại lý thì ko hiện giá
                    _this.productDetail.price = '0₫';
                    _this.productDetail.compare_at_price = '0₫';
                    _this.productDetail.sale = '0%';
                    obs.unsubscribe();
                }
                else {
                    if (_this.typeUser.toLowerCase().indexOf('đại lý bắc') > -1 && _this.productDetail.related_handle == 'tong-dai-ly-mien-bac') {
                        obs.unsubscribe();
                    }
                    else if (_this.typeUser.toLowerCase().indexOf('đại lý nam') > -1 && _this.productDetail.related_handle == 'tong-dai-ly-mien-nam') {
                        obs.unsubscribe();
                    }
                    else {
                        var noti_1 = _this.alerCtrl.create({
                            message: "Bạn không có quyền xem sản phẩm này!",
                        });
                        obs.unsubscribe();
                        noti_1.present();
                        setTimeout(function () {
                            if (noti_1.isOverlay) {
                                noti_1.dismiss();
                            }
                        }, 3000);
                        _this.navCtrl.pop();
                    }
                }
            }
            _this.products = _this.productDetail.related_products;
            _this.loadingFirst = true;
            if (_this.productDetail.video != "video giới thiệu") {
                _this.video = _this.sanitized.bypassSecurityTrustResourceUrl(_this.productDetail.video);
            }
            // check xem da co trong danh sach yeu thich chua
            _this.storage.get('listFavorite').then(function (data) {
                if (data != null && data.length != 0) {
                    if (_this.loadingFirst == true) {
                        var lengthFavo = data.length;
                        var compareIDFavo = _this.productDetail.id;
                        for (var iFavo = 0; iFavo <= lengthFavo - 1; iFavo++) {
                            var checkID = data[iFavo].id;
                            if (checkID == compareIDFavo) {
                                _this.addFavor = true;
                                break;
                            }
                        }
                    }
                }
            });
        }, function (err) {
            _this.notiTimeout = true;
        });
        // this.video = this.sanitized.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/SLfDIvmLehM');
        // this.pservice.getHandle('thoi-trang-nu', 1).subscribe((products) => {
        //   this.products = products;
        // });
        // get seen product
        this.storage.get('seenProducts').then(function (data) {
            _this.listSeenProducts = data;
        });
        // set timeout or error 5 phút
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.notiTimeout = true;
            }
        }, 300000);
    }
    ProductPage_1 = ProductPage;
    // link logo ve trang chu
    ProductPage.prototype.goHome = function () {
        this.navCtrl.popToRoot();
    };
    // den trang gio hang
    ProductPage.prototype.gotoCart = function () {
        this.navCtrl.push(CartPage);
    };
    // hien thi thong bao
    ProductPage.prototype.showNoti = function (id) {
        var modal = this.modalCtrl.create(NotificationsModel, id);
        modal.present();
    };
    // an/hien rut gon detail product
    ProductPage.prototype.showMore = function () {
        // if (this.showdes == true) { 
        //   this.showdes = false;
        // } else {
        //   this.showdes = true;
        // }
        this.navCtrl.push(OtherPage, {
            check: 3,
            detailPro: this.productDetail.body_html
        });
    };
    // an/hien rut gon thong so product
    ProductPage.prototype.showMore1 = function () {
        // if (this.showdes1 == true) { 
        //   this.showdes1 = false;
        // } else {
        //   this.showdes1 = true;
        // }
        this.navCtrl.push(OtherPage, {
            check: 5,
            thongSoPro: this.productDetail.thong_so
        });
    };
    // den trang tim kiem
    ProductPage.prototype.goSearch = function () {
        // this.clicked = !this.clicked;
        this.navCtrl.push(SearchPage);
    };
    // them vao list sp yeu thich
    ProductPage.prototype.addFavorite = function () {
        var _this = this;
        this.addFavor = !this.addFavor;
        // neu add vao favo = true
        if (this.addFavor == true) {
            // storage
            this.storage.get('listFavorite').then(function (data) {
                if (data != null && data.length != 0) {
                    console.log('func addfavor with not null');
                    var lengthFavo = data.length;
                    var favoDuplicate = 0;
                    var compareIDFavo = _this.productDetail.id;
                    for (var i = 0; i <= lengthFavo - 1; i++) {
                        var checkID = data[i].id;
                        if (checkID == compareIDFavo) {
                            favoDuplicate++;
                        }
                    }
                    if (favoDuplicate == 0) {
                        data.push(_this.productDetail);
                        _this.storage.set('listFavorite', data);
                    }
                }
                else {
                    console.log('func addfavor with null data');
                    var arrFavo = [];
                    arrFavo.push(_this.productDetail);
                    _this.storage.set('listFavorite', arrFavo);
                }
            });
        }
        // neu add favo = false
        if (this.addFavor == false) {
            // storage
            this.storage.get('listFavorite').then(function (data) {
                if (data != null && data.length != 0) {
                    var lengthFavo = data.length;
                    var favoDuplicate = 0;
                    var compareIDFavo = _this.productDetail.id;
                    for (var i = 0; i <= lengthFavo - 1; i++) {
                        var checkID = data[i].id;
                        if (checkID == compareIDFavo) {
                            favoDuplicate++;
                            console.log(i);
                            data.splice(i, 1);
                            console.log(data);
                            // data.push(data);
                            _this.storage.set('listFavorite', data);
                            break;
                        }
                    }
                }
            });
        }
    };
    ProductPage.prototype.presentVaraint = function (idProduct) {
        var popover = this.popoverCtrl.create(viewVariant, {
            inforProduct: this.productDetail
        }, { cssClass: 'variant-product' });
        popover.present();
    };
    // xem product co luu vao list da xem
    ProductPage.prototype.productTapped = function ($event, product) {
        var _this = this;
        var lengthPro = this.products.length;
        for (var i = 0; i <= lengthPro - 1; i++) {
            if (this.products[i].handle == product) {
                break;
            }
        }
        // That's right, we're pushing to ourselves!
        this.productSelected = this.products[i];
        // storage
        this.storage.get('seenProducts').then(function (data) {
            if (data != null && data.length != 0) {
                var lengthArr = void 0;
                var checkDuplicate = 0;
                lengthArr = data.length;
                var compareID = _this.productSelected.id;
                for (var i = 0; i <= lengthArr - 1; i++) {
                    var checkID = data[i].id;
                    if (checkID == compareID) {
                        checkDuplicate++;
                    }
                }
                if (checkDuplicate == 0) {
                    data.push(_this.productSelected);
                    _this.storage.set('seenProducts', data);
                }
            }
            else {
                var arrID = [];
                arrID.push(_this.productSelected);
                _this.storage.set('seenProducts', arrID);
            }
        });
        this.navCtrl.push(ProductPage_1, {
            product: product
            // product: this.products
        });
    };
    // xem sp da co trong list product da xem
    ProductPage.prototype.productTappedHasSeen = function ($event, product) {
        this.navCtrl.push(ProductPage_1, {
            product: product
        });
    };
    // xem tất cả sp đã xem
    ProductPage.prototype.viewSeenProduct = function () {
        this.navCtrl.push(OtherPage, {
            check: 1
        });
    };
    // xem collection khác
    ProductPage.prototype.openCollection = function (event, collectionID, collectionTitle) {
        this.navCtrl.push(CollectionsPage, {
            collectionID: collectionID,
            collectionTitle: collectionTitle
        });
    };
    // go to hash tag
    ProductPage.prototype.scrollTo = function (element) {
        // set the scrollLeft to 0px, and scrollTop to 500px
        if (element == "overview") {
            this.slides.slideTo(0, 500);
        }
        if (element == "detail") {
            this.slides.slideTo(1, 500);
        }
        if (element == "video") {
            this.slides.slideTo(2, 500);
        }
        var yOffset = document.getElementById(element).offsetTop - 50;
        this.content.scrollTo(0, yOffset, 500);
    };
    ProductPage.prototype.toProductDetail = function (r) {
        var ProductDetail = ({
            id: r.product.id,
            handle: r.product.handle,
            title: r.product.title,
            body_html: r.product.body_html,
            thong_so: r.product.thong_so,
            video: r.product.video,
            product_type: r.product.product_type,
            original_price: r.product.original_price,
            compare_at_price: r.product.compare_at_price,
            price: r.product.price,
            sale: r.product.sale,
            // // lợi nhuận
            // profit: r.product.price - r.product.original_price,
            // // thưởng nhị cấp
            // reward_points_1: 0.05 * (r.product.price - r.product.original_price),
            // // thưởng tích lũy doanh số
            // reward_points_2: 0.03 * (r.product.price - r.product.original_price),
            // // quỹ từ thiện
            // charity_fund: 0.03 * (r.product.price - r.product.original_price),
            vendor: r.product.vendor,
            tags: r.product.tags,
            images: r.product.images,
            variants: r.product.variants,
            related_products: r.related_products,
            related_handle: r.related_handle,
            related_title: r.related_title,
            isWholeSale: false
        });
        // if (r.variants[0].compare_at_price > 0 && r.variants[0].price > 0 ) {
        //   Product.sale = Math.round((r.variants[0].compare_at_price - r.variants[0].price)/r.variants[0].compare_at_price*100) + "%"
        // }
        // if (r.body_html != null && r.body_html.split('####').length > 1) {
        //   Product.description = r.body_html.split('####')[0];
        //   Product.video = r.body_html.split('####')[1].replace(/<[^>]+>/gm,'');
        // }
        if (r.product.video == null || r.product.video == '' || r.product.video == 'null') {
            ProductDetail.video = 'video giới thiệu';
        }
        if (r.product.body_html == null || r.product.body_html == '' || r.product.body_html == 'null' || r.product.body_html.error == "json not allowed for this object") {
            ProductDetail.body_html = 'Chưa có chi tiết sản phẩm';
        }
        if (r.product.thong_so == null || r.product.thong_so == '' || r.product.thong_so == 'null' || r.product.thong_so.error == "json not allowed for this object") {
            ProductDetail.thong_so = 'Chưa có thông số sản phẩm';
        }
        if (r.isWholeSale === 'true') {
            ProductDetail.isWholeSale = true;
        }
        console.log('Parsed Product:', ProductDetail);
        return ProductDetail;
    };
    ProductPage.prototype.ionViewDidLoad = function () {
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], ProductPage.prototype, "content", void 0);
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], ProductPage.prototype, "slides", void 0);
    ProductPage = ProductPage_1 = __decorate([
        Component({ selector: 'page-product', templateUrl: 'product.html', providers: [ProductService] }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Platform,
            PopoverController,
            MenuController,
            ModalController,
            Http,
            DomSanitizer,
            CurrencyPipe,
            ProductService,
            Storage,
            ToastController,
            AlertController,
            Globals,
            AuthService])
    ], ProductPage);
    return ProductPage;
    var ProductPage_1;
}());
export { ProductPage };
var viewVariant = /** @class */ (function () {
    function viewVariant(navCtrl, navParams, http, curency, pservice, storage, toastCtrl, alerCtrl, viewCtrl, authService, modalCtrl, cusService, loadingCtrl, iab, tb, globals) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.curency = curency;
        this.pservice = pservice;
        this.storage = storage;
        this.toastCtrl = toastCtrl;
        this.alerCtrl = alerCtrl;
        this.viewCtrl = viewCtrl;
        this.authService = authService;
        this.modalCtrl = modalCtrl;
        this.cusService = cusService;
        this.loadingCtrl = loadingCtrl;
        this.iab = iab;
        this.tb = tb;
        this.globals = globals;
        this.num = 1;
        this.indexVariant = 0;
        this.lineItem = {
            "id": 0,
            "title": "",
            "handle": "",
            "original_price": 0,
            "quantity": 1,
            "images": null,
            "variant": null,
        };
        this.qtyItemCart = 0;
        this.checkWholeSale = false;
        this.isAgencyRegular = false;
        this.selectedProduct = navParams.get('inforProduct');
        // hien thi dai ly hoac ctv
        this.globals.typeUser.subscribe(function (data) {
            _this.typeUser = data;
        });
        if (this.typeUser.indexOf('tổng đại lý') > -1) {
            this.isAgencyRegular = true;
        }
        // if(this.selectedProduct.isWholeSale === 'true'){
        //   this.checkWholeSale = true;
        // }
        // hiển thị bthg với sp ko thuộc nhóm bán buôn
        this.variantPrice = this.selectedProduct.variants[0].price_format;
        this.variantComparePrice = this.selectedProduct.variants[0].compare_at_price_format;
        this.variantQuantity = this.selectedProduct.variants[0].inventory_quantity;
        if (this.selectedProduct.variants[0].image != '' && this.selectedProduct.variants[0].image != null && this.selectedProduct.variants[0].image != 'http:') {
            this.variantImage = this.selectedProduct.variants[0].image;
        }
        else {
            this.variantImage = this.selectedProduct.images[0];
        }
    }
    viewVariant.prototype.doMinus = function () {
        if (this.num > 1) {
            this.num = this.num - 1;
            return this.num;
        }
    };
    viewVariant.prototype.doPlus = function () {
        if (this.num < this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
            this.num = this.num + 1;
            return this.num;
        }
        else {
            this.num = this.selectedProduct.variants[this.indexVariant].inventory_quantity;
            var alert_1 = this.alerCtrl.create({
                message: 'Số sản phẩm trong kho không đủ!',
            });
            alert_1.present();
            return this.num;
        }
    };
    viewVariant.prototype.changeNum = function (qtynum) {
        if (qtynum <= this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
            this.num = parseInt(qtynum);
            return this.num;
        }
        else {
            this.num = this.selectedProduct.variants[this.indexVariant].inventory_quantity;
            var alert_2 = this.alerCtrl.create({
                message: 'Số sản phẩm trong kho không đủ!',
            });
            alert_2.present();
            return this.num;
        }
    };
    viewVariant.prototype.changeVariant = function (num) {
        this.indexVariant = num;
        this.variantPrice = this.selectedProduct.variants[num].price_format;
        this.variantComparePrice = this.selectedProduct.variants[num].compare_at_price_format;
        this.variantQuantity = this.selectedProduct.variants[num].inventory_quantity;
        // lay image:
        if (this.selectedProduct.variants[num].image != '' && this.selectedProduct.variants[num].image != null && this.selectedProduct.variants[num].image != 'http:') {
            this.variantImage = this.selectedProduct.variants[num].image;
        }
        else {
            this.variantImage = this.selectedProduct.images[0];
        }
    };
    // noti đã thêm sp
    viewVariant.prototype.notiAdd = function (qty) {
        var alert = this.alerCtrl.create({
            message: 'Đã thêm ' + qty + ' sản phẩm vào giỏ hàng!',
        });
        alert.present();
        if (alert.present()) {
            setTimeout(function () {
                alert.dismiss();
            }, 2000);
        }
    };
    // them vao gio
    viewVariant.prototype.addCart = function (qty) {
        var _this = this;
        // TH them moi: kiem tra so luong sp co du trong kho ko
        if (qty <= this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
            this.storage.get('itemCarts').then(function (data) {
                if (data != null && data.length != 0) {
                    var lengthArr = void 0;
                    var checkDuplicate = 0;
                    lengthArr = data.length;
                    var compareID = _this.selectedProduct.variants[_this.indexVariant].id;
                    // kiem tra variant đâ có trong giỏ chưa
                    for (var i = 0; i <= lengthArr - 1; i++) {
                        var checkID = data[i].variant.id;
                        if (checkID == compareID) {
                            checkDuplicate++;
                        }
                    }
                    // variant chưa có trong giỏ thì thêm mới
                    if (checkDuplicate == 0) {
                        _this.lineItem.id = _this.selectedProduct.id;
                        _this.lineItem.title = _this.selectedProduct.title;
                        _this.lineItem.original_price = _this.selectedProduct.original_price;
                        _this.lineItem.handle = _this.selectedProduct.handle;
                        _this.lineItem.quantity = qty;
                        // gia tri cua image_id trong variant
                        if (_this.selectedProduct.variants[_this.indexVariant].image != null && _this.selectedProduct.variants[_this.indexVariant].image != '' && _this.selectedProduct.variants[_this.indexVariant].image != 'http:') {
                            console.log('1:  ' + _this.selectedProduct.variants[_this.indexVariant].image);
                            _this.lineItem.images = _this.selectedProduct.variants[_this.indexVariant].image;
                        }
                        else {
                            _this.lineItem.images = _this.selectedProduct.images[0];
                        }
                        _this.lineItem.variant = _this.selectedProduct.variants[_this.indexVariant];
                        data.push(_this.lineItem);
                        _this.storage.set('itemCarts', data);
                        console.log('da add sp 1 variant ko trung');
                        _this.viewCtrl.dismiss();
                        _this.notiAdd(qty);
                        _this.globals.setCartCounts(lengthArr + 1);
                    }
                    // variant có trong giỏ thì tăng số lượng thêm
                    if (checkDuplicate > 0) {
                        var compareID2 = _this.selectedProduct.variants[_this.indexVariant].id;
                        for (var j = 0; j <= lengthArr - 1; j++) {
                            var checkID = data[j].variant.id;
                            if (checkID == compareID2) {
                                break;
                            }
                        }
                        var oldItem = data[j];
                        var newQty = parseInt(oldItem.quantity) + parseInt(qty);
                        // kiem tra so luong sp sau khi tang co du trong kho ko
                        if (newQty <= _this.selectedProduct.variants[_this.indexVariant].inventory_quantity) {
                            oldItem.quantity = newQty;
                            _this.storage.set('itemCarts', data);
                            console.log('tang so luong san pham them 1');
                            _this.viewCtrl.dismiss();
                            _this.notiAdd(qty);
                        }
                        else {
                            var alert_3 = _this.alerCtrl.create({
                                message: 'Số sản phẩm trong kho không đủ!',
                            });
                            alert_3.present();
                        }
                    }
                }
                else {
                    // this.qtyItemCart = 1;
                    _this.pservice.countItem = 1;
                    console.log('so item trong cart 2   : ' + _this.pservice.countItem);
                    var arrLineItem = [];
                    _this.lineItem.id = _this.selectedProduct.id;
                    _this.lineItem.title = _this.selectedProduct.title;
                    _this.lineItem.original_price = _this.selectedProduct.original_price;
                    _this.lineItem.handle = _this.selectedProduct.handle;
                    _this.lineItem.quantity = qty;
                    // gia tri cua image_id trong variant
                    if (_this.selectedProduct.variants[_this.indexVariant].image != null && _this.selectedProduct.variants[_this.indexVariant].image != '' && _this.selectedProduct.variants[_this.indexVariant].image != 'http:') {
                        console.log('2:  ' + _this.selectedProduct.variants[_this.indexVariant].image);
                        _this.lineItem.images = _this.selectedProduct.variants[_this.indexVariant].image;
                    }
                    else {
                        _this.lineItem.images = _this.selectedProduct.images[0];
                    }
                    _this.lineItem.variant = _this.selectedProduct.variants[_this.indexVariant];
                    arrLineItem.push(_this.lineItem);
                    _this.storage.set('itemCarts', arrLineItem);
                    _this.viewCtrl.dismiss();
                    _this.notiAdd(qty);
                    _this.globals.setCartCounts(1);
                }
            });
        }
        else {
            var alert_4 = this.alerCtrl.create({
                message: 'Số sản phẩm trong kho không đủ!',
            });
            alert_4.present();
        }
    };
    // den trang gio hang
    viewVariant.prototype.gotoCart = function (qty) {
        var _this = this;
        if (qty <= this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
            this.addCart(qty);
            setTimeout(function () {
                _this.navCtrl.push(CartPage);
            }, 1000);
        }
        else {
            var alert_5 = this.alerCtrl.create({
                message: 'Số sản phẩm trong kho không đủ!',
            });
            alert_5.present();
        }
    };
    viewVariant = __decorate([
        Component({ selector: 'viewVariant', templateUrl: 'variant-selected.html', providers: [ProductService, ThemeableBrowser] }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Http,
            CurrencyPipe,
            ProductService,
            Storage,
            ToastController,
            AlertController,
            ViewController,
            AuthService,
            ModalController,
            CustomerService,
            LoadingController,
            InAppBrowser,
            ThemeableBrowser,
            Globals])
    ], viewVariant);
    return viewVariant;
}());
export { viewVariant };
//# sourceMappingURL=product.js.map