var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HomePage } from './../pages/home/home';
import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, MenuController, ModalController, AlertController } from 'ionic-angular';
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
// about page
import { AboutPage } from '../pages/about/about';
//commission page
import { CommissionPage } from '../pages/commission/commission';
//firebase login
import { AuthService } from './providers/auth.service';
import { Profile } from '../interfaces/profiles';
import { PayxuPage } from '../pages/payxu/payxu';
// rut tien
import { WithdrawPage } from '../pages/withdraw/withdraw';
// hướng dẫn rút tiền, nạp xu
import { InfoXuPage } from '../pages/info-xu/info-xu';
import { AppUpdate } from '@ionic-native/app-update';
import { HTTP } from '@ionic-native/http';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, modalCtrl, menu, authService, events, storage, http, alerCtrl, globals, appUpdate, httpNative, keyboard) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.modalCtrl = modalCtrl;
        this.menu = menu;
        this.authService = authService;
        this.events = events;
        this.storage = storage;
        this.http = http;
        this.alerCtrl = alerCtrl;
        this.globals = globals;
        this.appUpdate = appUpdate;
        this.httpNative = httpNative;
        this.keyboard = keyboard;
        this.rootPage = HomePage;
        this.xu = 0;
        this.xu2 = 0;
        var updateUrl = 'http://suplo-app.herokuapp.com/update.xml';
        this.appUpdate.checkAppUpdate(updateUrl).then(function (app) {
            console.log("updated: " + app);
        });
        // let status bar overlay webview
        this.statusBar.overlaysWebView(true);
        // set status bar to white
        this.initializeApp();
    }
    // nap xu
    MyApp.prototype.payXu = function () {
        this.nav.push(PayxuPage);
        this.menu.close();
    };
    // rut tien
    MyApp.prototype.withDraw = function () {
        this.nav.push(WithdrawPage);
        this.menu.close();
    };
    // thông tin thêm về nạp xu, rút tiền
    MyApp.prototype.infoXu = function () {
        var modal = this.modalCtrl.create(InfoXuPage);
        modal.present();
        this.menu.close();
    };
    MyApp.prototype.gotoAccount = function () {
        this.nav.push(UserPage);
        this.menu.close();
    };
    MyApp.prototype.gotoOrder = function () {
        this.nav.push(OrderPage);
        this.menu.close();
    };
    MyApp.prototype.gotoCommission = function () {
        if (this.authService.authState != null) {
            this.nav.push(CommissionPage);
        }
        else {
            var modal = this.modalCtrl.create(AccountPage, { charNum: 'loginTab' });
            modal.present();
        }
        this.menu.close();
    };
    // logout
    MyApp.prototype.logout = function () {
        var _this = this;
        var confirm = this.alerCtrl.create({
            message: 'Bạn có chắc muốn đăng xuất?',
            buttons: [
                {
                    text: 'Hủy',
                    handler: function () {
                        console.log('Hủy');
                    }
                },
                {
                    text: 'Đăng xuất',
                    handler: function () {
                        _this.authService.signOut();
                        _this.storage.get("profile").then(function (profile) {
                            if (profile !== null) {
                                profile.account = null;
                                profile.type = null;
                                _this.storage.set('profile', profile);
                            }
                        });
                        // type user
                        _this.globals.setTypeUser('');
                        // name
                        _this.globals.setFirstName('');
                        // check logout success?
                        // setTimeout(() => {
                        var alert = _this.alerCtrl.create({
                            message: 'Bạn đã đăng xuất!',
                        });
                        alert.present();
                        if (alert.present()) {
                            setTimeout(function () {
                                alert.dismiss();
                            }, 2000);
                        }
                    }
                }
            ]
        });
        confirm.present();
    };
    // login and regis
    MyApp.prototype.openModal = function (characterNum) {
        var modal = this.modalCtrl.create(AccountPage, characterNum);
        modal.present();
        // this.nav.push(AccountPage, characterNum);
        this.menu.close();
    };
    // go to user page or other page
    MyApp.prototype.gotoPage = function (page, check) {
        this.nav.push(page, {
            check: check
        });
        this.menu.close();
    };
    // check login: if login go to oder page else go to login page
    MyApp.prototype.checkLogin = function (charLogin) {
        if (this.authService.authState != null) {
            this.nav.push(OrderPage);
            this.menu.close();
        }
        else {
            var modal = this.modalCtrl.create(AccountPage, charLogin);
            modal.present();
        }
    };
    // hien thi modal notification
    MyApp.prototype.showNoti = function (id) {
        var modal = this.modalCtrl.create(NotificationsModel, id);
        modal.present();
    };
    // go to page
    MyApp.prototype.openPage = function (page) {
        // page home, all collections
        this.menu.close();
        this.nav.push(page.component);
    };
    // goto home page
    MyApp.prototype.openHome = function () {
        this.nav.popToRoot();
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.backgroundColorByHexString('#dc0e1d');
            _this.splashScreen.hide();
            _this.keyboard.hideKeyboardAccessoryBar(false);
            _this.pagesOther = [
                { title: 'Chính sách', component: PolicyPage, icon: 'help-buoy', color: 'blue-1' },
                { title: 'Về chúng tôi', component: AboutPage, icon: 'information-circle', color: 'pink-1' }
            ];
            _this.storage.get('profile').then(function (profile) {
                console.log(profile);
                if (profile !== null) {
                    var _profile = new Profile(profile.app, profile.account);
                    console.log(_profile);
                    if (!_profile.isAppEmpty()) {
                        console.log('Home settings was loaded!');
                    }
                    else {
                        console.log('Home settings not loaded');
                    }
                    if (!_profile.isAccountEmpty()) {
                        console.log('Account is already logged');
                        console.log(_profile.account);
                        _profile.init();
                        _this.globals.getOwnRewardPoints();
                        _this.globals.getInvitedRewardPoints(_profile.account.code);
                        _this.globals.setTypeUser(_profile.type.name);
                        _this.globals.setFirstName(_profile.account.name);
                        _this.globals.xu.subscribe(function (data) {
                            _this.xu = Math.round(data) || 0;
                        });
                        _this.globals.xu2.subscribe(function (data) {
                            _this.xu2 = Math.round(data) || 0;
                        });
                        _this.globals.typeUser.subscribe(function (data) {
                            _this.typeUser = data;
                        });
                        _this.globals.firstName.subscribe(function (data) {
                            _this.displayName = data;
                        });
                    }
                    _this.globals.xu.subscribe(function (data) {
                        _this.xu = Math.round(data) || 0;
                    });
                    _this.globals.xu2.subscribe(function (data) {
                        _this.xu2 = Math.round(data) || 0;
                    });
                    _this.globals.typeUser.subscribe(function (data) {
                        _this.typeUser = data;
                    });
                    _this.globals.firstName.subscribe(function (data) {
                        _this.displayName = data;
                    });
                }
                else {
                    _this.globals.xu.subscribe(function (data) {
                        _this.xu = Math.round(data) || 0;
                    });
                    _this.globals.xu2.subscribe(function (data) {
                        _this.xu2 = Math.round(data) || 0;
                    });
                    _this.globals.typeUser.subscribe(function (data) {
                        _this.typeUser = data;
                    });
                    _this.globals.firstName.subscribe(function (data) {
                        _this.displayName = data;
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
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({ templateUrl: 'app.html' }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            SplashScreen,
            ModalController,
            MenuController,
            AuthService,
            Events,
            Storage,
            Http,
            AlertController,
            Globals,
            AppUpdate,
            HTTP,
            Keyboard])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map