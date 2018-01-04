import { Injectable } from '@angular/core';
// import { Http, Response, RequestOptions, Headers } from '@angular/http';
// import { Storage } from '@ionic/storage'

// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// import { ItemCart } from '../interfaces/itemCart';

@Injectable()
export class CartLineItem {
  
  constructor(/*private http : Http, public storage: Storage*/){
    // this.local = new Storage('list');
  }
  addItem() {

  }
  removeItem() {

  }
  updateCart() {

  }
  checkout() {

  }

}

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