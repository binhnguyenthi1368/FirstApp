var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
// import { Http, Response, RequestOptions, Headers } from '@angular/http';
// import { Storage } from '@ionic/storage'
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// import { ItemCart } from '../interfaces/itemCart';
var CartLineItem = /** @class */ (function () {
    function CartLineItem() {
        // this.local = new Storage('list');
    }
    CartLineItem.prototype.addItem = function () {
    };
    CartLineItem.prototype.removeItem = function () {
    };
    CartLineItem.prototype.updateCart = function () {
    };
    CartLineItem.prototype.checkout = function () {
    };
    CartLineItem = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CartLineItem);
    return CartLineItem;
}());
export { CartLineItem };
// function mapLineItem(response:Response): ItemCart[]{
//   return response.json().data.products.map(toProduct)
// }
// function toLineItem(r:any): ItemCart{
//   let Item = <ItemCart>({
//   	id: r.id,
//   	image: r.images[0] ,
//   	product_id: r.id,
//   	variant_id: r.variants[i].id,
//   	variant_title: string,
//   	imageVariant: any[],
//   	title: r.variants[i].title,
//   	price: number,
//   	compareAtPrice: number,
//   	quantity: number,
//   	line_price: string,
//   });
//   // console.log('Parsed Product:', Product);
//   return Product;
// } 
//# sourceMappingURL=cart.js.map