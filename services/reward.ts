import { Injectable } from '@angular/core';
import { Http, Response, /*RequestOptions,*/ Headers } from '@angular/http';
import { Storage } from '@ionic/storage'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User, UserRegister, Order } from '../interfaces/user';


@Injectable()
export class CustomerService{
  private baseUrl: string = 'https://suplo-app.herokuapp.com/dogo-app';
  constructor(private http : Http, public storage: Storage){
  }

  private getHeaders(){
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }
  
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