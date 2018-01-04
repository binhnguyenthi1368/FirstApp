import { Injectable } from '@angular/core';
import { Http, Response, /*RequestOptions,*/ Headers } from '@angular/http';
import { Storage } from '@ionic/storage'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Product, ProductDetail } from '../interfaces/product';
import { Collection } from '../interfaces/collection';
import { HTTP,HTTPResponse } from '@ionic-native/http';

@Injectable()
export class CoinService{
  // private baseUrl: string = 'https://api.myjson.com/bins/bmqnt';
  private baseUrl: string = 'https://suplo-app.herokuapp.com/dogo-app';
  // list = {id: 1323}
  // arrList = [];
  // local: any;
  // list: any;
  constructor(private http : Http, public storage: Storage, private httpNative: HTTP){
    
  }
  private getHeaders(){
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

  // lay products theo collection_id, page
  getHandle(handle: string, page: number, sortType: string): Promise<HTTPResponse> {
    let productCol$ = this.httpNative
    .get(`https://do4go.com/collections/${handle}?page=${page}&sort_by=${sortType}&view=dogo.json`, {}, {});
    return productCol$;
  }

}

function mapProducts(response:Response): Product[]{
  //throw new Error('ups! Force choke!');

  // The response of the API has a results
  // property with the actual results
  return response.json().data.products.map(toProduct)
}

function toProduct(r:any): Product{
  let Product = <Product>({
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
  return Product;
}

// this could also be a private method of the component class
function handleError (error: any) {
  // log error
  // could be something more sofisticated
  let errorMsg = error.message || `Kết nối dữ liệu không thành công! Vui lòng thử lại.`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}