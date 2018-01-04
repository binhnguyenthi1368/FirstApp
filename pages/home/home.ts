import { Badge } from '@ionic-native/badge';
import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { Nav, NavParams, NavController, ModalController, PopoverController,ToastController, Content, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
// storage
import { Globals } from './../../app/providers/globals';
import { Storage } from '@ionic/storage';
// collection page
import { CollectionsPage } from '../collections/collections';
// Product page
import { ProductPage } from '../product/product';
// Notifications Model
import { NotificationsModel } from '../notifications/notifications';
import { SearchPage } from '../search/search';

// cart page
import { Profile, IApp } from '../../interfaces/profiles';

import { CartPage } from '../cart/cart';
import { DropdownHeaderPage } from '../dropdown-header/dropdown-header';
import { NotificationsService } from '../../services/notifications.service';
import { Platform } from 'ionic-angular/platform/platform';
import { HTTP, HTTPResponse } from '@ionic-native/http';

// tinh chieu cao cho collections level 2
@Pipe({name: 'ceil'})
export class RoundPipe implements PipeTransform {
    /**
     * @param value
     * @returns {number}
     */
    transform(value: number): number {
        let heightItem = Math.ceil(value/3);
        return heightItem*53;
    }
}

@Component({selector: 'page-home',templateUrl: 'home.html'})
export class HomePage {
  @ViewChild(Nav) nav: Nav;  
  @ViewChild(Content) content: Content;
  public qtyItemCart: number = 0;
  public notiCounts: number = 1;
  // collection
  selectedCollection;
  // settings
  settings: any[] = [];
  selectedIndex: number;
  // loading first
  loadingFirst: boolean = false;
  // timeout or empty
  notiTimeout: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public modalCtrl: ModalController,
    public http: Http,
    public storage: Storage,
    public globals: Globals,
    private notiService: NotificationsService,
    private platform: Platform,
    private badge: Badge,
    private httpNative: HTTP,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
    ) {
      this.badge.clear();
      // so thong bao
      this.storage.get('notifications').then((data)=>{
        if(data !== null){
          this.storage.get('notiseen').then((notiseen)=>{
            if(typeof notiseen !== "undefined" && notiseen !== null){
              var count = data.length - notiseen.length;
              this.globals.setNotiCounts(count);
            }
          })
        }else{
          this.notiService.notiWelcome();
          this.globals.setNotiCounts(1);
        }
      });
      this.globals.notiCounts.subscribe(data => {
        this.notiCounts = data;
      });
      this.storage.get('itemCarts').then((data) => {
        if (data == null) {
          this.qtyItemCart = 0;
        }else{
          this.qtyItemCart = data.length;
        }
        this.globals.setCartCounts(this.qtyItemCart);
        this.globals.cartCounts.subscribe(data => {
          this.qtyItemCart = data;
        });
      });
      this.selectedIndex = -1;
      // get menu

      //PROFILE --------------------------------------------------------------------
      this.storage.get('profile').then((profile) => {
        if(profile !== null){
          const _profile = new Profile(profile.app, profile.account);
          if(!_profile.isAppEmpty()){
            this.settings = _profile.app.collections;
            this.loadingFirst = true;
            this.httpNative.get('https://do4go.com/collections/all?view=home.dogo.json&themeid=1000281853', {}, {}).then(res => {
              var app: IApp = {
                collections: null,
                percent: null
              };
              try {
                app.percent = JSON.parse(res.data).percent_point;
                app.collections = JSON.parse(res.data).listcollections;
                if(this.settings !== app.collections){
                  this.settings = app.collections;
                }
                _profile.setApp(app);
                this.storage.set('profile', _profile);
                this.loadingFirst = true;
              } catch (error) {
                console.log(error);
              }
            }).catch(err => {
              console.log(err);
            });
          }else{
            this.httpNative.get('https://do4go.com/collections/all?view=home.dogo.json&themeid=1000281853', {}, {}).then(res => {
              var app: IApp = {
                collections: null,
                percent: null
              };
              try {
                app.percent = JSON.parse(res.data).percent_point;
                app.collections = JSON.parse(res.data).listcollections;
                this.settings = app.collections;
                _profile.setApp(app);
                this.storage.set('profile', _profile);
                this.loadingFirst = true;
              } catch (error) {
                console.log(error);
              }
            }).catch(err => {
              console.log(err);
              this.notiTimeout = true;
            });
          }
        }else{
          this.httpNative.get('https://do4go.com/collections/all?view=home.dogo.json&themeid=1000281853', {}, {}).then(res => {
            var app: IApp = {
              collections: null,
              percent: null
            };
            try {
              console.log(JSON.parse(res.data));
              app.percent = JSON.parse(res.data).percent_point;
              app.collections = JSON.parse(res.data).listcollections;
              console.log(app);
              this.settings = app.collections;
              const profile = new Profile(app, null);
              this.storage.set('profile', profile);
              this.loadingFirst = true;
            } catch (error) {
              console.log(error);
            }
          }).catch(err => {
            console.log(err);
            console.log("tested home error");
            
            this.notiTimeout = true;
          });
        }
      });
      //END PROFILE -------------------------------------------------------------------------
    
      // this.storage.get('home_settings').then((settings) =>{
      //   console.log(settings);
      //   if(settings !== null && settings !== undefined && settings.length > 0){
      //     // this.settings = settings;
      //     // this.loadingFirst = true;
      //   }else{
          

      //     this.http.get('https://suplo-app.herokuapp.com/dogo-app/settings').map(res => res.json()).subscribe(data => {
      //       console.log(data)
      //       this.settings = data.data.listcollections;
      //       this.loadingFirst = true;
      //       // storage % đại lý
      //       this.storage.set('dai_ly', data.data.percent_point.dai_ly / 100);
      //       // storage % đại lý bắc
      //       this.storage.set('dai_ly_bac', data.data.percent_point.dai_ly_bac / 100);
      //       // storage % đại lý nam
      //       this.storage.set('dai_ly_nam', data.data.percent_point.dai_ly_nam / 100);
      //       // storage % thưởng nhi cap
      //       this.storage.set('thuong_nhi_cap', data.data.percent_point.thuong_nhi_cap / 100);
      //       // storage % tich luy
      //       this.storage.set('tich_luy', data.data.percent_point.tich_luy / 100);
      //       // storage % quy tu thien
      //       this.storage.set('quy_tu_thien', data.data.percent_point.quy_tu_thien / 100);
      //     },(err) => {
      //       this.notiTimeout = true;
      //     });
      //   }
      // });
      // hien thi dai ly hoac ctv
      // set timeout or error 5 phút
      setTimeout(() => {
        if (this.loadingFirst == false) {
          this.notiTimeout = true;
        }
      }, 300000);
      // this.onNotifications();
  } 

  // async onNotifications(){
  //   try {
  //     await this.platform.ready();
  //     FCMPlugin.getToken(data=>{
  //       console.log("FCM Token " + data);
  //       this.storage.set("fcm", data);
  //       this.storage.get("fcm").then( (data) =>{
  //         console.log("FCM saved: " + data);
  //       })
  //     })
  //     FCMPlugin.onNotification(data=>{
  //       this.storage.get('profile').then((profile) => {
  //         if(profile !== null){
  //           const _profile = new Profile(profile.app, profile.account);
  //           if(!_profile.isAccountEmpty){
  //             this.globals.getOwnRewardPoints();
  //             this.globals.getInvitedRewardPoints(_profile.account.code);
  //           }
  //         }
  //       })
   
  //       if(this.platform.is("ios")){
  //         var mes = data.message;
  //         mes = data.aps.alert.body;
  //         var toast = this.toastCtrl.create({
  //           message: mes,
  //           duration: 105000,
  //           position: 'top',
  //           showCloseButton: true,
  //           closeButtonText: "Ok"
  //         });
  //         toast.onDidDismiss(() => {
  //           console.log('Dismissed toast');
  //         });
  //         if(data.wasTapped){
  //           console.log("Received in background");
  //           console.log(data);
  //           toast.present();
  //         } else {
  //           toast.present();
  //           console.log("Received in foreground------------------------");
  //           console.log(mes);
  //           console.log("Received in foreground------------------------");
  //         };
  //       }
        
  //     }, error =>{
  //       console.log(error);
  //     })
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // show page notification
  showNoti() {
    // let modal = this.modalCtrl.create(NotificationsModel, id);
    // modal.present();
    this.navCtrl.push(NotificationsModel);
  }
  // go to search page
  goSearch() {
    this.navCtrl.push(SearchPage);
  }
  // đến trang giỏ hàng
  gotoCart() {
    this.navCtrl.push(CartPage);
  }
  // đến trang collection level 2
  openCollection(event, collectionID, collectionTitle, lv3) {
    var clicked = false;
    if (collectionID == 'tong-dai-ly-mien-bac' || collectionID == 'tong-dai-ly-mien-nam') {
      var obs = this.globals.typeUser.subscribe(typeUser => {
        if(typeUser.toLowerCase().indexOf('đại lý bắc') > -1 && collectionID == 'tong-dai-ly-mien-bac'){
          this.navCtrl.push(CollectionsPage, {
            collectionID: collectionID,
            collectionTitle: collectionTitle,
            menulv3: lv3
          });
        }else if(typeUser.toLowerCase().indexOf('đại lý nam') > -1 && collectionID == 'tong-dai-ly-mien-nam'){
          this.navCtrl.push(CollectionsPage, {
            collectionID: collectionID,
            collectionTitle: collectionTitle,
            menulv3: lv3
          });
        } else {
          let noti = this.alertCtrl.create({
            message: "Bạn không có quyền xem nhóm sản phẩm này!",
          });
          if(!clicked){
            noti.present();
            obs.unsubscribe();
            clicked = true;
          }
          setTimeout(() => {
            if(noti.isOverlay){
              noti.dismiss();
              clicked = false;
            }
          }, 3000);
        }
      });
    }else{
      this.navCtrl.push(CollectionsPage, {
        collectionID: collectionID,
        collectionTitle: collectionTitle,
        menulv3: lv3
      });
    }

  } 
  // Collapse collection
  iconChange(index){
    if(this.selectedIndex == index){
      this.selectedIndex = -1;
    } else{
      this.selectedIndex = index;
    }
    if(index != 0 && index != 1){
      let yOffset = document.getElementById(index).offsetTop - 90;
      this.content.scrollTo(0, yOffset, 500);
    }
  }
}
