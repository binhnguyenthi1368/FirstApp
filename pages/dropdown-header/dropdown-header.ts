import { Component, ViewChild } from '@angular/core';
import { NavController, App, ViewController, Nav, ModalController } from 'ionic-angular';
// user page
import { UserPage } from '../user/user';
import { AccountPage } from '../account/account';
// home page
import { HomePage } from '../home/home';
//firebase login
import { AuthService } from '../../app/providers/auth.service';


@Component({
  template: `
    <ion-list class="popover-page">
      <ion-item class="text-athelas" tappable (tap)="openHome()">
        <ion-label>Trang chủ</ion-label>
      </ion-item>
      <ion-item class="text-charter" tappable (tap)="openUser()">
        <ion-label>Quản lý tài khoản</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class DropdownHeaderPage {
  @ViewChild(Nav) nav: Nav; 
  constructor(public navCtrl: NavController,public appCtrl: App,public viewCtrl: ViewController,public authService: AuthService,public modalCtrl: ModalController,) {}
  openUser() {
    if (this.authService.authState != null) {
      this.navCtrl.push(UserPage);
    }else {
      let modal = this.modalCtrl.create(AccountPage, {charNum: 'loginTab'});
      modal.present();
    }
  }
  openHome() {
    this.viewCtrl.dismiss();
    // this.nav.setPages([HomePage]);
    this.appCtrl.getRootNav().popTo(0);
    // this.appCtrl.getRootNav().push(HomePage);
  }
}
