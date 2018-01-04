var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HTTP } from '@ionic-native/http';
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { IonicPage, Platform, ViewController, NavParams, ModalController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NotificationsService } from '../../services/notifications.service';
import { DetailNotiPage } from '../detail-noti/detail-noti';
import { Globals } from './../../app/providers/globals';
// import { FCM } from '@ionic-native/fcm';
var NotificationsModel = /** @class */ (function () {
    function NotificationsModel(platform, params, viewCtrl, notiService, storage, httpClient, modalCtrl, navCtrl, globals, httpNative
        // private fcm: FCM
    ) {
        var _this = this;
        this.platform = platform;
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.notiService = notiService;
        this.storage = storage;
        this.httpClient = httpClient;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.globals = globals;
        this.httpNative = httpNative;
        this.notis = [];
        this.counts = 0;
        this.errNoti = false;
        this.loadingFirst = false;
        this.storage.get('notifications').then(function (notis) {
            if (typeof notis !== undefined && notis !== null) {
                _this.notis = notis;
                _this.loadingFirst = true;
                _this.httpNative.get('https://do4go.com/blogs/dogo-app-thong-bao?view=dogo.json', {}, {}).then(function (res) {
                    var blog = JSON.parse(res.data);
                    console.log(blog);
                    if (typeof blog !== "undefined" && blog !== null) {
                        if (blog !== _this.notis) {
                            _this.notis = blog.articles;
                        }
                    }
                    else {
                        _this.notis = notis;
                    }
                    _this.loadingFirst = true;
                    _this.storage.set('notifications', _this.notis);
                    _this.storage.get('notiseen').then(function (notiseen) {
                        if (typeof notiseen !== "undefined" && notiseen !== null) {
                            var count = _this.notis.length - notiseen.length;
                            _this.notis.forEach(function (article) {
                                if (notiseen.some(function (x) { return x === article.url; })) {
                                    article.seen = true;
                                }
                            });
                            _this.globals.setNotiCounts(count);
                        }
                        else {
                            _this.globals.setNotiCounts(_this.notis.length);
                        }
                    });
                }, function (err) {
                    console.log(err);
                    _this.errNoti = true;
                });
            }
            else {
                _this.httpNative.get('https://do4go.com/blogs/dogo-app-thong-bao?view=dogo.json', {}, {}).then(function (res) {
                    var blog = JSON.parse(res.data);
                    if (typeof blog !== "undefined" && blog !== null) {
                        _this.notis = blog.articles;
                        _this.storage.set('notifications', _this.notis);
                    }
                    else {
                        _this.notis = [];
                        _this.storage.set('notifications', []);
                    }
                    _this.globals.setNotiCounts(_this.notis.length);
                    _this.loadingFirst = true;
                }, function (err) {
                    console.log(err);
                    _this.errNoti = true;
                });
            }
        });
        // this.fcmPlugin();
        // fcm.getToken().then(token=>{
        //   storage.set("fcm", token);
        // })
        // fcm.onNotification().subscribe(data=>{
        //   if(data.wasTapped){
        //     console.log("Received in background");
        //   } else {
        //     console.log("Received in foreground");
        //   };
        // })
        // fcm.onTokenRefresh().subscribe(token=>{
        //   storage.set("fcm", token);
        // })
    }
    NotificationsModel.prototype.viewNotification = function (noti) {
        var _this = this;
        var url = noti.url;
        console.log(noti);
        noti.seen = true;
        if (typeof url !== undefined && url !== "") {
            this.navCtrl.push(DetailNotiPage, {
                urlNoti: url
            });
            this.storage.get('notiseen').then(function (notiseen) {
                console.log(notiseen);
                //viewd = {["handle"]};
                if (typeof notiseen !== "undefined" && notiseen !== null) {
                    console.log(notiseen.some(function (x) { return x === url; }));
                    if (!notiseen.some(function (x) { return x === url; })) {
                        notiseen.push(url);
                        _this.storage.set('notiseen', notiseen);
                    }
                    ;
                }
                else {
                    notiseen = [];
                    notiseen.push(url);
                    _this.storage.set('notiseen', notiseen);
                }
                var count = _this.notis.length - notiseen.length;
                _this.globals.setNotiCounts(count);
            });
        }
    };
    NotificationsModel.prototype.removeNotification = function (id) {
    };
    NotificationsModel.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    NotificationsModel = __decorate([
        IonicPage(),
        Component({ selector: 'page-notifications', templateUrl: 'notifications.html' }),
        __metadata("design:paramtypes", [Platform,
            NavParams,
            ViewController,
            NotificationsService,
            Storage,
            Http,
            ModalController,
            NavController,
            Globals,
            HTTP
            // private fcm: FCM
        ])
    ], NotificationsModel);
    return NotificationsModel;
}());
export { NotificationsModel };
//# sourceMappingURL=notifications.js.map