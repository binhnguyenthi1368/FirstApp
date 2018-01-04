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
import { HTTP, HTTPResponse } from '@ionic-native/http';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  contentPage;
  loadingFirst: boolean = false;
  errNoti: boolean = false;
  public qtyItemCart: number = 0;

  constructor(public navCtrl: NavController,public storage: Storage,public popoverCtrl: PopoverController,public httpNative: HTTP) {
    this.httpNative.get('https://do4go.com/pages/ve-chung-toi-app?view=dogo.json', {},{}).then(res => {
      this.contentPage = JSON.parse(res.data).page.content;
      this.loadingFirst = true;
    },(err) => {
      console.log(err);
      this.errNoti = true;
    });
    // storage product trong giỏ hàng
    this.storage.get('itemCarts').then((data) => {
      if (data == null) {
        this.qtyItemCart = 0;
      }else{
        this.qtyItemCart = data.length;
      }
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
  // dropdown menu
  dropdownPopover() { 
    let popover = this.popoverCtrl.create(DropdownHeaderPage,{
      estest: '11'
    },{
      cssClass: 'dropdown-header'
    });
    popover.present();
  }
}
