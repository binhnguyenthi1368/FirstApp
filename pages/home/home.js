var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Badge } from '@ionic-native/badge';
import { Component, ViewChild, Pipe } from '@angular/core';
import { Nav, NavParams, NavController, ModalController, ToastController, Content, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
// storage
import { Globals } from './../../app/providers/globals';
import { Storage } from '@ionic/storage';
// collection page
import { CollectionsPage } from '../collections/collections';
// Notifications Model
import { NotificationsModel } from '../notifications/notifications';
import { SearchPage } from '../search/search';
// cart page
import { Profile } from '../../interfaces/profiles';
import { CartPage } from '../cart/cart';
import { NotificationsService } from '../../services/notifications.service';
import { Platform } from 'ionic-angular/platform/platform';
import { HTTP } from '@ionic-native/http';
// tinh chieu cao cho collections level 2
var RoundPipe = /** @class */ (function () {
    function RoundPipe() {
    }
    /**
     * @param value
     * @returns {number}
     */
    RoundPipe.prototype.transform = function (value) {
        var heightItem = Math.ceil(value / 3);
        return heightItem * 53;
    };
    RoundPipe = __decorate([
        Pipe({ name: 'ceil' })
    ], RoundPipe);
    return RoundPipe;
}());
export { RoundPipe };
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, navParams, modalCtrl, http, storage, globals, notiService, platform, badge, httpNative, alertCtrl, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.http = http;
        this.storage = storage;
        this.globals = globals;
        this.notiService = notiService;
        this.platform = platform;
        this.badge = badge;
        this.httpNative = httpNative;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.qtyItemCart = 0;
        this.notiCounts = 1;
        // settings
        this.settings = [];
        // loading first
        this.loadingFirst = false;
        // timeout or empty
        this.notiTimeout = false;
        this.badge.clear();
        // so thong bao
        this.storage.get('notifications').then(function (data) {
            if (data !== null) {
                _this.storage.get('notiseen').then(function (notiseen) {
                    if (typeof notiseen !== "undefined" && notiseen !== null) {
                        var count = data.length - notiseen.length;
                        _this.globals.setNotiCounts(count);
                    }
                });
            }
            else {
                _this.notiService.notiWelcome();
                _this.globals.setNotiCounts(1);
            }
        });
        this.globals.notiCounts.subscribe(function (data) {
            _this.notiCounts = data;
        });
        this.storage.get('itemCarts').then(function (data) {
            if (data == null) {
                _this.qtyItemCart = 0;
            }
            else {
                _this.qtyItemCart = data.length;
            }
            _this.globals.setCartCounts(_this.qtyItemCart);
            _this.globals.cartCounts.subscribe(function (data) {
                _this.qtyItemCart = data;
            });
        });
        this.selectedIndex = -1;
        // get menu
        //PROFILE --------------------------------------------------------------------
        this.storage.get('profile').then(function (profile) {
            if (profile !== null) {
                var _profile_1 = new Profile(profile.app, profile.account);
                if (!_profile_1.isAppEmpty()) {
                    _this.settings = _profile_1.app.collections;
                    _this.loadingFirst = true;
                    _this.httpNative.get('https://do4go.com/collections/all?view=home.dogo.json&themeid=1000281853', {}, {}).then(function (res) {
                        var app = {
                            collections: null,
                            percent: null
                        };
                        try {
                            app.percent = JSON.parse(res.data).percent_point;
                            app.collections = JSON.parse(res.data).listcollections;
                            if (_this.settings !== app.collections) {
                                _this.settings = app.collections;
                            }
                            _profile_1.setApp(app);
                            _this.storage.set('profile', _profile_1);
                            _this.loadingFirst = true;
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
                else {
                    _this.httpNative.get('https://do4go.com/collections/all?view=home.dogo.json&themeid=1000281853', {}, {}).then(function (res) {
                        var app = {
                            collections: null,
                            percent: null
                        };
                        try {
                            app.percent = JSON.parse(res.data).percent_point;
                            app.collections = JSON.parse(res.data).listcollections;
                            _this.settings = app.collections;
                            _profile_1.setApp(app);
                            _this.storage.set('profile', _profile_1);
                            _this.loadingFirst = true;
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }).catch(function (err) {
                        console.log(err);
                        _this.notiTimeout = true;
                    });
                }
            }
            else {
                _this.httpNative.get('https://do4go.com/collections/all?view=home.dogo.json&themeid=1000281853', {}, {}).then(function (res) {
                    var app = {
                        collections: null,
                        percent: null
                    };
                    try {
                        console.log(JSON.parse(res.data));
                        app.percent = JSON.parse(res.data).percent_point;
                        app.collections = JSON.parse(res.data).listcollections;
                        console.log(app);
                        _this.settings = app.collections;
                        var profile_1 = new Profile(app, null);
                        _this.storage.set('profile', profile_1);
                        _this.loadingFirst = true;
                    }
                    catch (error) {
                        console.log(error);
                    }
                }).catch(function (err) {
                    console.log(err);
                    console.log("tested home error");
                    _this.notiTimeout = true;
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
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.notiTimeout = true;
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
    HomePage.prototype.showNoti = function () {
        // let modal = this.modalCtrl.create(NotificationsModel, id);
        // modal.present();
        this.navCtrl.push(NotificationsModel);
    };
    // go to search page
    HomePage.prototype.goSearch = function () {
        this.navCtrl.push(SearchPage);
    };
    // đến trang giỏ hàng
    HomePage.prototype.gotoCart = function () {
        this.navCtrl.push(CartPage);
    };
    // đến trang collection level 2
    HomePage.prototype.openCollection = function (event, collectionID, collectionTitle, lv3) {
        var _this = this;
        var clicked = false;
        if (collectionID == 'tong-dai-ly-mien-bac' || collectionID == 'tong-dai-ly-mien-nam') {
            var obs = this.globals.typeUser.subscribe(function (typeUser) {
                if (typeUser.toLowerCase().indexOf('đại lý bắc') > -1 && collectionID == 'tong-dai-ly-mien-bac') {
                    _this.navCtrl.push(CollectionsPage, {
                        collectionID: collectionID,
                        collectionTitle: collectionTitle,
                        menulv3: lv3
                    });
                }
                else if (typeUser.toLowerCase().indexOf('đại lý nam') > -1 && collectionID == 'tong-dai-ly-mien-nam') {
                    _this.navCtrl.push(CollectionsPage, {
                        collectionID: collectionID,
                        collectionTitle: collectionTitle,
                        menulv3: lv3
                    });
                }
                else {
                    var noti_1 = _this.alertCtrl.create({
                        message: "Bạn không có quyền xem nhóm sản phẩm này!",
                    });
                    if (!clicked) {
                        noti_1.present();
                        obs.unsubscribe();
                        clicked = true;
                    }
                    setTimeout(function () {
                        if (noti_1.isOverlay) {
                            noti_1.dismiss();
                            clicked = false;
                        }
                    }, 3000);
                }
            });
        }
        else {
            this.navCtrl.push(CollectionsPage, {
                collectionID: collectionID,
                collectionTitle: collectionTitle,
                menulv3: lv3
            });
        }
    };
    // Collapse collection
    HomePage.prototype.iconChange = function (index) {
        if (this.selectedIndex == index) {
            this.selectedIndex = -1;
        }
        else {
            this.selectedIndex = index;
        }
        if (index != 0 && index != 1) {
            var yOffset = document.getElementById(index).offsetTop - 90;
            this.content.scrollTo(0, yOffset, 500);
        }
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], HomePage.prototype, "nav", void 0);
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], HomePage.prototype, "content", void 0);
    HomePage = __decorate([
        Component({ selector: 'page-home', templateUrl: 'home.html' }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ModalController,
            Http,
            Storage,
            Globals,
            NotificationsService,
            Platform,
            Badge,
            HTTP,
            AlertController,
            ToastController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map