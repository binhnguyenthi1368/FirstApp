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
import { Http, /*RequestOptions,*/ Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HTTP } from '@ionic-native/http';
var ProductService = /** @class */ (function () {
    // list = {id: 1323}
    // arrList = [];
    // local: any;
    // list: any;
    function ProductService(http, storage, httpNative) {
        var _this = this;
        this.http = http;
        this.storage = storage;
        this.httpNative = httpNative;
        this.countItem = 0;
        // private baseUrl: string = 'https://api.myjson.com/bins/bmqnt';
        this.baseUrl = 'https://suplo-app.herokuapp.com/dogo-app';
        // this.local = new Storage('list');
        // storage product trong giỏ hàng
        this.storage.get('itemCarts').then(function (data) {
            if (data == null) {
                _this.countItem = 0;
            }
            else {
                _this.countItem = data.length;
            }
        });
    }
    ProductService.prototype.getAll = function () {
        var product$ = this.http
            .get(this.baseUrl + "/products", { headers: this.getHeaders() })
            .map(mapProducts)
            .catch(handleError);
        return product$;
    };
    ProductService.prototype.getHeaders = function () {
        // I included these headers because otherwise FireFox
        // will request text/html
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    };
    // get(handle: string): Observable<ProductDetail> {
    //   let Product$ = this.http
    //     .get(`${this.baseUrl}/product/detail/${handle}`, {headers: this.getHeaders()})
    //     .map(mapProduct)
    //     .catch(handleError);
    //     return Product$;
    // }
    ProductService.prototype.save = function (Product) {
        // this won't actually work because the StarWars API doesn't 
        // is read-only. But it would look like this:
        return this
            .http
            .put(this.baseUrl + "/products/" + Product.id, JSON.stringify(Product), { headers: this.getHeaders() });
    };
    // lay products theo collection_id, co limit
    // getHandle(handle: string, page: number, sortType: string): Observable<Product[]> {
    //   let productCol$ = this.http
    //   .get(`${this.baseUrl}/collections/${handle}/${page}/${sortType}`, {headers: this.getHeaders()})
    //   .map(mapProducts)
    //   .catch(handleError);
    //   return productCol$;
    // }
    ProductService.prototype.get = function (handle) {
        var Product$ = this.httpNative
            .get("https://do4go.com/products/" + handle + "?view=dogo.json", {}, {});
        return Product$;
    };
    ProductService.prototype.getHandle = function (handle, page, sortType) {
        var productCol$ = this.httpNative
            .get("https://do4go.com/collections/" + handle + "?page=" + page + "&sort_by=" + sortType + "&view=dogo.json", {}, {});
        return productCol$;
    };
    ProductService.prototype.gotoSearch = function (value, page) {
        var par = encodeURIComponent("filter=((collectionid:product>=0)&&(title:product**" + value + "))");
        var productResult$ = this.httpNative
            .get("https://do4go.com/search?q=" + par + "&page=" + page + "&view=dogo.json", {}, {});
        return productResult$;
    };
    // tim kiem sp
    // gotoSearch(value: string, page: number): Observable<Product[]> {
    //   let productResult$ = this.http
    //   .get(`${this.baseUrl}/search/${value}/${page}`, {headers: this.getHeaders()})
    //   .map(mapProducts)
    //   .catch(handleError);
    //   return productResult$;
    // }
    // lay info cua 1 collection
    ProductService.prototype.getCollection = function (id) {
        var collection$ = this.http
            .get(this.baseUrl + "/collections/" + id, { headers: this.getHeaders() })
            .map(mapCollection)
            .catch(handleError);
        return collection$;
    };
    ProductService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, Storage, HTTP])
    ], ProductService);
    return ProductService;
}());
export { ProductService };
function mapProducts(response) {
    //throw new Error('ups! Force choke!');
    // The response of the API has a results
    // property with the actual results
    var data = {
        products: response.json().data.products.map(toProduct),
        paginate: response.json().data.paginate
    };
    return data;
}
function toProduct(r) {
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
}
function toProductDetail(r) {
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
}
function toCollecton(r) {
    var Collection = ({
        id: r.id,
        title: r.title,
        banner: r.image_featured
    });
    return Collection;
}
function mapCollection(response) {
    return toCollecton(response.json().data.collections);
}
// to avoid breaking the rest of our app
// I extract the id from the Product url
// function extractId(ProductData:any){
//   let extractedId = ProductData.url.replace('http://swapi.co/api/people/','').replace('/','');
//   return parseInt(extractedId);
// }
function mapProduct(response) {
    // toProduct looks just like in the previous example
    return toProductDetail(response.json().data);
}
// this could also be a private method of the component class
function handleError(error) {
    // log error
    // could be something more sofisticated
    var errorMsg = error.message || "K\u1EBFt n\u1ED1i d\u1EEF li\u1EC7u kh\u00F4ng th\u00E0nh c\u00F4ng! Vui l\u00F2ng th\u1EED l\u1EA1i.";
    console.error(errorMsg);
    // throw an application level error
    return Observable.throw(errorMsg);
}
//# sourceMappingURL=product.service.js.map