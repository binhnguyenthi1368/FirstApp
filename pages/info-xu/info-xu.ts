import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { HTTP, HTTPResponse } from '@ionic-native/http';

@Component({
  selector: 'page-info-xu',
  templateUrl: 'info-xu.html',
})
export class InfoXuPage {

  contentPage;
  errNoti: boolean = false;
  loadingFirst: boolean = false;
  constructor(public navCtrl: NavController,private http: Http, public httpNative: HTTP) {
    this.httpNative.get('https://do4go.com/pages/huong-dan-nap-xu-rut-tien-app?view=dogo.json', {},{}).then(res => {
      this.contentPage = JSON.parse(res.data).page.content;
      this.loadingFirst = true;
    },(err) => {
      console.log(err);
      this.errNoti = true;
    });
    // set timeout or error 2 phút
    setTimeout(() => {
      if (this.loadingFirst == false) {
        this.errNoti = true;
      }
    }, 120000);
  }
  ionViewDidLoad() {}

}
