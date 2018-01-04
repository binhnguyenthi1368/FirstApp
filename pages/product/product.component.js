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
import { NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
// collection page
import { CollectionsPage } from '../collections/collections';
// // view variant
// import { CollectionsPage } from '../collections/collections';
/**
 * Generated class for the ProductPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var ProductPage = ProductPage_1 = (function () {
    function ProductPage(navCtrl, navParams, platform, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platform = platform;
        this.popoverCtrl = popoverCtrl;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.items = [];
        for (var i = 1; i < 11; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
        // product
        // If we navigated to this page, we will have an product available as a nav param
        this.selectedProduct = navParams.get('product');
        // Let's populate this page with some filler content for funzies
        this.proicon = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.products = [];
        for (var i = 1; i < 11; i++) {
            this.products.push({
                title: 'product ' + i,
                note: 'This is product #' + i,
                icon: this.proicon[Math.floor(Math.random() * this.proicon.length)]
            });
        }
    }
    ProductPage.prototype.presentVaraint = function (id) {
        var popover = this.popoverCtrl.create(viewVariant);
        popover.present({
            ev: id
        });
    };
    ProductPage.prototype.productTapped = function (event, product) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(ProductPage_1, {
            product: product
        });
    };
    ProductPage.prototype.itemTapped = function (event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(CollectionsPage, {
            item: item
        });
    };
    ProductPage.prototype.ionViewDidLoad = function () {
    };
    return ProductPage;
}());
ProductPage = ProductPage_1 = __decorate([
    Component({ selector: 'page-product', templateUrl: 'product.html' }),
    __metadata("design:paramtypes", [NavController, NavParams, Platform, PopoverController])
], ProductPage);
export { ProductPage };
export var ROUTES = [
    { path: '', redirectTo: 'detail', pathMatch: 'full' },
    { path: 'product', component: ProductPage },
    { path: 'overview', loadChildren: './+product#overview' },
    { path: 'detail', loadChildren: './+product#detail' },
];
var viewVariant = (function () {
    function viewVariant() {
        this.num = 1;
    }
    viewVariant.prototype.doMinus = function () {
        this.num = this.num - 1;
        return this.num;
    };
    viewVariant.prototype.doPlus = function () {
        this.num = this.num + 1;
        return this.num;
    };
    return viewVariant;
}());
viewVariant = __decorate([
    Component({ selector: 'viewVariant', templateUrl: 'variant-selected.html' })
], viewVariant);
export { viewVariant };
var ProductPage_1;
//# sourceMappingURL=product.component.js.map