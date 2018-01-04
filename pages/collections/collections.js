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
import { NavController, NavParams, ModalController, PopoverController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
// storage
import { Storage } from '@ionic/storage';
// import { CurrencyPipe } from '@angular/common';
// cart page
import { CartPage } from '../cart/cart';
// search page
import { SearchPage } from '../search/search';
// Product page
import { ProductPage } from '../product/product';
import { ProductService } from '../../services/product.service';
import { DropdownHeaderPage } from '../dropdown-header/dropdown-header';
import { Globals } from '../../app/providers/globals';
import { HTTP } from '@ionic-native/http';
var CollectionsPage = /** @class */ (function () {
    function CollectionsPage(navCtrl, navParams, modalCtrl, http, pservice, globals, storage, popoverCtrl, httpNative) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.http = http;
        this.pservice = pservice;
        this.globals = globals;
        this.storage = storage;
        this.popoverCtrl = popoverCtrl;
        this.httpNative = httpNative;
        // @ViewChild(Nav) nav: Nav;
        // loading first
        this.loadingFirst = false;
        this.product = 0;
        this.products = [];
        this.sortSelected = false;
        // test infinite scroll
        this.items = [];
        this.page = 1;
        this.loading = true;
        this.totalPages = 1;
        // timeout or empty
        this.notiTimeout = false;
        this.isAgencyRegular = false;
        this.selectedRadio = true;
        this.sortType = 'created-descending';
        this.sortLists = [
            "created-descending", "price-descending", "price-ascending", "title-ascending", "title-descending"
        ];
        this.qtyItemCart = 0;
        // storage: lay so product dang co trong giỏ hàng
        this.storage.get('itemCarts').then(function (data) {
            if (data == null) {
                _this.qtyItemCart = 0;
            }
            else {
                _this.qtyItemCart = data.length;
            }
            _this.globals.setCartCounts(_this.qtyItemCart);
            _this.globals.cartCounts.subscribe(function (data) {
                _this.qtyItemCart = data;
            });
        });
        this.storage.get('profile').then(function (profile) {
            // console.log(profile);
        });
        // hien thi dai ly hoac ctv
        this.globals.typeUser.subscribe(function (data) {
            _this.typeUser = data;
        });
        if (this.typeUser.indexOf('tổng đại lý') > -1) {
            this.isAgencyRegular = true;
        }
        // get collection_id, collection_title, menu lv3
        this.selectedCollection = navParams.get('collectionID');
        this.titleCollection = navParams.get('collectionTitle');
        this.menuLv3 = navParams.get('menulv3');
        this.selectedCollectionFirst = navParams.get('collectionID');
        this.titleCollectionFirst = navParams.get('collectionTitle');
        this.getListProduct(this.selectedCollection, this.sortType);
        // set timeout or error 5 phút
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.notiTimeout = true;
            }
        }, 300000);
    }
    CollectionsPage_1 = CollectionsPage;
    // dropdown menu
    CollectionsPage.prototype.dropdownPopover = function () {
        var popover = this.popoverCtrl.create(DropdownHeaderPage, {
            estest: '11'
        }, {
            cssClass: 'dropdown-header'
        });
        popover.present();
    };
    // đến trang giỏ hàng
    CollectionsPage.prototype.gotoCart = function () {
        this.navCtrl.push(CartPage);
    };
    // go to search page
    CollectionsPage.prototype.goSearch = function () {
        this.navCtrl.push(SearchPage);
    };
    CollectionsPage.prototype.getListProduct = function (selectCol, sortType) {
        var _this = this;
        // get product by collection_handle
        this.pservice.getHandle(selectCol, 1, this.sortType).then(function (res) {
            try {
                _this.products = null;
                _this.products = JSON.parse(res.data).products.map(_this.toProduct);
                _this.totalPages = JSON.parse(res.data).paginate.pages;
                _this.loadingFirst = true;
            }
            catch (error) {
                console.log(error);
            }
            //  this.autoLoadMore(selectCol,sortType);
        }, function (err) {
            console.log(err);
            _this.notiTimeout = true;
        });
    };
    CollectionsPage.prototype.autoLoadMore = function (selectCol, sortType) {
        var _this = this;
        if (this.page < this.totalPages) {
            if (this.page < 3) {
                setTimeout(function () {
                    _this.page++;
                    console.log(_this.page);
                    _this.pservice.getHandle(selectCol, _this.page, sortType).then(function (res) {
                        _this.products = _this.products.concat(JSON.parse(res.data).products.map(_this.toProduct));
                        _this.autoLoadMore(selectCol, sortType);
                    });
                }, 500);
            }
        }
    };
    CollectionsPage.prototype.viewCollection = function (handle, title, sortType) {
        this.selectedRadio = false;
        this.loadingFirst = false;
        this.items = [];
        this.page = 1;
        this.loading = true;
        this.selectedCollection = handle;
        this.titleCollection = title;
        this.content.scrollTo(0, 0, 700);
        this.getListProduct(handle, sortType);
    };
    // test infinite scroll
    CollectionsPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        if (this.page < this.totalPages) {
            setTimeout(function () {
                _this.loading = true;
                _this.page++;
                _this.pservice.getHandle(_this.selectedCollection, _this.page, _this.sortType).then(function (res) {
                    _this.products = _this.products.concat(JSON.parse(res.data).products.map(_this.toProduct));
                });
                infiniteScroll.complete();
            }, 1000);
        }
        else {
            this.loading = false;
            infiniteScroll.complete();
        }
    };
    // xem chi tiết sp
    CollectionsPage.prototype.productTapped = function ($event, product) {
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
                    if ((_this.productSelected.isWholeSale && !_this.isAgencyRegular)) {
                        _this.productSelected.price_format = '0₫';
                        _this.productSelected.compare_at_price = 0;
                        _this.productSelected.sale = '-0%';
                    }
                    data.push(_this.productSelected);
                    _this.storage.set('seenProducts', data);
                }
            }
            else {
                var arrID = [];
                if ((_this.productSelected.isWholeSale && !_this.isAgencyRegular)) {
                    _this.productSelected.price_format = '0₫';
                    _this.productSelected.compare_at_price = 0;
                    _this.productSelected.sale = '-0%';
                }
                arrID.push(_this.productSelected);
                _this.storage.set('seenProducts', arrID);
            }
        });
        this.navCtrl.push(ProductPage, {
            product: product
            // product: this.products
        });
    };
    CollectionsPage.prototype.onSelectChange = function (selectedValue) {
        if (selectedValue !== this.sortType) {
            this.sortType = selectedValue;
            this.sortSelected = true;
            this.content.scrollTo(0, 0, 700);
            this.page = 1;
            this.loading = true;
            this.getListProduct(this.selectedCollection, selectedValue);
        }
    };
    CollectionsPage.prototype.openCollection = function (event, collectionID, collectionTitle) {
        this.navCtrl.push(CollectionsPage_1, {
            collectionID: collectionID,
            collectionTitle: collectionTitle
        });
    };
    // getHandle(handle: string, page: number, sortType: string): Promise<HTTPResponse> {
    //   let productCol$ = this.httpNative
    //   .get(`https://dogobtgroup.myharavan.com/collections/${handle}?page=${page}&sort_by=${sortType}&view=dogo.json`, {}, {"Content-Type": "application/json"});
    //   return productCol$;
    // }
    CollectionsPage.prototype.toProduct = function (r) {
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
        // console.log('parse product:   '+ JSON.stringify(Product) );
        // if (r.variants[0].compare_at_price > 0 && r.variants[0].price > 0 ) {
        //   Product.sale = Math.round((r.variants[0].compare_at_price - r.variants[0].price)/r.variants[0].compare_at_price*100) + "%"
        // }
        if (r.isWholeSale === 'true') {
            Product.isWholeSale = true;
        }
        return Product;
    };
    CollectionsPage.prototype.ionViewDidLoad = function () {
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], CollectionsPage.prototype, "content", void 0);
    CollectionsPage = CollectionsPage_1 = __decorate([
        Component({ selector: 'page-collections', templateUrl: 'collections.html', providers: [ProductService] }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ModalController,
            Http,
            ProductService,
            Globals,
            Storage,
            PopoverController,
            HTTP])
    ], CollectionsPage);
    return CollectionsPage;
    var CollectionsPage_1;
}());
export { CollectionsPage };
//# sourceMappingURL=collections.js.map