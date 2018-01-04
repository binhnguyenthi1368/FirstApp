import { HomePage } from './../pages/home/home';
import { Component, ViewChild} from '@angular/core';
import { Events,Nav, Platform, MenuController, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { Globals } from './providers/globals';

import { AccountPage } from '../pages/account/account';
import { Http } from '@angular/http';
// policy page
import { PolicyPage } from '../pages/policy/policy';

// Notifications Model
import { NotificationsModel } from '../pages/notifications/notifications';

// user page
import { UserPage } from '../pages/user/user';

// order page
import { OrderPage } from '../pages/order/order';

// other page
import { OtherPage } from '../pages/other/other';
import { ProductPage } from '../pages/product/product';

// about page
import { AboutPage } from '../pages/about/about';

//commission page
import { CommissionPage } from '../pages/commission/commission';
//firebase login
import { AuthService } from './providers/auth.service';
import { Profile, IApp } from '../interfaces/profiles';
import { PayxuPage } from '../pages/payxu/payxu';
// rut tien
import { WithdrawPage } from '../pages/withdraw/withdraw';
// hướng dẫn rút tiền, nạp xu
import { InfoXuPage } from '../pages/info-xu/info-xu';
import { AppUpdate } from '@ionic-native/app-update';
import { HTTP, HTTPResponse } from '@ionic-native/http';

@Component({templateUrl: 'app.html'})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pagesOther: Array<{title: string, component: any, icon: string, color: string}>;
  displayName;
  typeUser;
  xu:number  = 0;
  xu2:number = 0;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    public menu: MenuController,
    public authService: AuthService,
    public events: Events,
    public storage: Storage,
    public http: Http,
    public alerCtrl: AlertController,
    public globals: Globals,
    public appUpdate: AppUpdate,
    private httpNative: HTTP,
    private keyboard: Keyboard
    ) {
    const updateUrl = 'http://suplo-app.herokuapp.com/update.xml';
    this.appUpdate.checkAppUpdate(updateUrl).then(app =>{
      console.log("updated: " + app);
    });

    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);
    // set status bar to white
    this.initializeApp();

  } 
  // nap xu
  payXu(){
    this.nav.push(PayxuPage);
    this.menu.close();
  }
  // rut tien
  withDraw(){
    this.nav.push(WithdrawPage);
    this.menu.close();
  }
  // thông tin thêm về nạp xu, rút tiền
  infoXu(){
    let modal = this.modalCtrl.create(InfoXuPage);
    modal.present();
    this.menu.close();
  }
  gotoAccount(){
    this.nav.push(UserPage);
    this.menu.close();
  }
  gotoOrder(){
    this.nav.push(OrderPage);
    this.menu.close();
  }
  gotoCommission(){
    if (this.authService.authState != null) {
      this.nav.push(CommissionPage);
    }else {
      let modal = this.modalCtrl.create(AccountPage, {charNum: 'loginTab'});
      modal.present();

    }
    this.menu.close();
  }
  // logout
  logout() {
    let confirm = this.alerCtrl.create({
      message: 'Bạn có chắc muốn đăng xuất?',
      buttons: [
        {
          text: 'Hủy',
          handler: () => {
            console.log('Hủy');
          }
        },
        {
          text: 'Đăng xuất',
          handler: () => {
            this.authService.signOut();
            this.storage.get("profile").then(profile =>{
              if(profile !== null){
                profile.account = null;
                profile.type = null;
                this.storage.set('profile', profile);
              }
            });
            // type user
            this.globals.setTypeUser('');
            // name
            this.globals.setFirstName('');
            // check logout success?
            // setTimeout(() => {
            let alert = this.alerCtrl.create({
              message: 'Bạn đã đăng xuất!',
            });
            alert.present();
            if (alert.present()) {
              setTimeout(() => {
                alert.dismiss();
              }, 2000);
            }
          }
        }
      ]
    });
    confirm.present();
  }
  // login and regis
  openModal(characterNum) {
    let modal = this.modalCtrl.create(AccountPage, characterNum);
    modal.present();
    // this.nav.push(AccountPage, characterNum);
    this.menu.close();
  }
  // go to user page or other page
  gotoPage(page: string, check: number) {
    this.nav.push(page,{
      check: check
    });
    this.menu.close();
  }
  // check login: if login go to oder page else go to login page
  checkLogin(charLogin){
    if (this.authService.authState != null) {
      this.nav.push(OrderPage);
    this.menu.close();
    }else {
      let modal = this.modalCtrl.create(AccountPage, charLogin);
      modal.present();
    }
  }
 
  // hien thi modal notification
  showNoti(id) {
    let modal = this.modalCtrl.create(NotificationsModel, id);
    modal.present();
  }

  // go to page
  openPage(page) {
    // page home, all collections
    this.menu.close();
    this.nav.push(page.component);
  }
  // goto home page
  openHome() {
    this.nav.popToRoot();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#dc0e1d');
      this.splashScreen.hide();
      this.keyboard.hideKeyboardAccessoryBar(false);
      this.pagesOther = [
        { title: 'Chính sách', component: PolicyPage, icon: 'help-buoy', color: 'blue-1' },
        { title: 'Về chúng tôi', component: AboutPage, icon: 'information-circle', color: 'pink-1' }
      ];
  
      this.storage.get('profile').then((profile) => {
        console.log(profile);
        if(profile !== null){
          const _profile = new Profile(profile.app, profile.account);
          console.log(_profile);
          if(!_profile.isAppEmpty()){
            console.log('Home settings was loaded!');
          }else{
            console.log('Home settings not loaded')
          }
          if(!_profile.isAccountEmpty()){
            console.log('Account is already logged');
            console.log(_profile.account);
            _profile.init();
            this.globals.getOwnRewardPoints();
            this.globals.getInvitedRewardPoints(_profile.account.code);
            this.globals.setTypeUser(_profile.type.name);
            this.globals.setFirstName(_profile.account.name);
            this.globals.xu.subscribe(data => {
              this.xu = Math.round(data) || 0;
            });
            this.globals.xu2.subscribe(data => {
              this.xu2 = Math.round(data) || 0;
            });
            this.globals.typeUser.subscribe(data => {
              this.typeUser = data;
            });
            this.globals.firstName.subscribe(data => {
              this.displayName = data;
            });
          }
          this.globals.xu.subscribe(data => {
            this.xu = Math.round(data) || 0;
          });
          this.globals.xu2.subscribe(data => {
            this.xu2 = Math.round(data) || 0;
          });
          this.globals.typeUser.subscribe(data => {
            this.typeUser = data;
          });
          this.globals.firstName.subscribe(data => {
            this.displayName = data;
          });
        }else{
          this.globals.xu.subscribe(data => {
            this.xu = Math.round(data) || 0;
          });
          this.globals.xu2.subscribe(data => {
            this.xu2 = Math.round(data) || 0;
          });
          this.globals.typeUser.subscribe(data => {
            this.typeUser = data;
          });
          this.globals.firstName.subscribe(data => {
            this.displayName = data;
          });
          // this.httpNative.get('https://do4go.com/collections/all?view=home.dogo.json', {}, {}).then(res => {
          //   console.log(res.data);
          //   console.log("tested");
            
          //   var app: IApp = {
          //     collections: null,
          //     percent: null
          //   };
          //   console.log(JSON.parse(res.data).percent_point);
          //   app.percent = JSON.parse(res.data).percent_point;
          //   app.collections = JSON.parse(res.data).listcollections;
          //   const profile = new Profile(app, null);
          //   this.storage.set('profile', profile);
          //   this.globals.typeUser.subscribe(data => {
          //   this.typeUser = data;
          //   });
          //   this.globals.firstName.subscribe(data => {
          //     this.displayName = data;
          //   });
          //   console.log('app.collections   '+app.collections);
          // }).catch(err =>{
          //   console.log(err);
          // });
        }
      });
    });
  }
}
