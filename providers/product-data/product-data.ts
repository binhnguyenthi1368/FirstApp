import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProductDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductDataProvider {

  constructor(public http: Http) {
    console.log('Hello ProductDataProvider Provider');
  }
getRemoteData() {
	// console.log(this.http.get('https://api.myjson.com/bins/bmqnt'));
	this.http.get('https://api.myjson.com/bins/bmqnt').map(res => res.json()).subscribe(data => {
		// console.log(data);
	});
}
// getData() {
// 	this.http.get('https://api.myjson.com/bins/bmqnt').map(res => res.json()).subscribe(data => {
// 		console.log(data);
// 	});
// }
}
