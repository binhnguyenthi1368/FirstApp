import { HTTP } from '@ionic-native/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

/**
 * Generated class for the DetailNotiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-noti',
  templateUrl: 'detail-noti.html',
})
export class DetailNotiPage {
  urlNoti;
  detailNoti;
  errNoti: boolean = false;
  loadingFirst: boolean = false;
  constructor(private httpClient: Http,public navCtrl: NavController, public navParams: NavParams, public httpNative: HTTP) {
    this.urlNoti = navParams.get('urlNoti');
  	this.httpNative.get('https://do4go.com'+this.urlNoti+'?view=dogo.json', {},{}).then(res => {
      var article = JSON.parse(res.data).article;
      console.log(article);
      if(typeof article !== 'undefined' && article !== null){
      	this.detailNoti = article;
    	 	this.loadingFirst = true;
  	  }else{
  	  	// this.loadingFirst = true;
  	  }
    },(err) => {
      console.log(err);
    });
    // set timeout or error 3 phút
    setTimeout(() => {
      if (this.loadingFirst == false) {
        this.errNoti = true;
      }
    }, 180000);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DetailNotiPage');
  }

}
