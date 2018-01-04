import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';

// search page
import { SearchPage } from '../search/search';
// storage
import { Storage } from '@ionic/storage';
// dropdown menu
import { DropdownHeaderPage } from '../dropdown-header/dropdown-header';
// cart page
import { CartPage } from '../cart/cart';
import { Observable } from 'rxjs/Observable';
import { HTTP, HTTPResponse } from '@ionic-native/http';

@Component({selector: 'page-policy',templateUrl: 'policy.html',})
export class PolicyPage {

  contentPage;
  errNoti: boolean = false;
  loadingFirst: boolean = false;
  constructor(public navCtrl: NavController,public storage: Storage,public popoverCtrl: PopoverController, private http: Http, public httpNative: HTTP) {
    this.httpNative.get('https://do4go.com/pages/chinh-sach-dang-ky-tai-khoan?view=dogo.json', {},{}).then(res => {
      this.contentPage = JSON.parse(res.data).page.content;
      this.loadingFirst = true;
    },(err) => {
      console.log(err);
      this.errNoti = true;
    });
    // set timeout or error 3 phút
    setTimeout(() => {
      if (this.loadingFirst == false) {
        this.errNoti = true;
      }
    }, 180000);
  }

  // go to search page
  goSearch() {
    this.navCtrl.push(SearchPage);
  }
  // đến trang giỏ hàng
  gotoCart() {
    this.navCtrl.push(CartPage);
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad PolicyPage');
  }

}
