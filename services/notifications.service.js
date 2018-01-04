var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Globals } from './../app/providers/globals';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
var NotificationsService = /** @class */ (function () {
    function NotificationsService(localNotifications, storage, globals) {
        var _this = this;
        this.localNotifications = localNotifications;
        this.storage = storage;
        this.globals = globals;
        this.count = 0;
        this.list = [{
                title: "Dogo App",
                text: "Test service",
                badge: 1,
                at: 5000
            }];
        this.storage.get('notifications').then(function (notis) {
            if (typeof notis !== undefined && notis !== null) {
                _this.globals.setNotiCounts(notis.length);
                console.log(notis.length);
            }
            else {
                notis = [];
                _this.globals.setNotiCounts(notis.length);
            }
        });
    }
    NotificationsService.prototype.push = function (noti) {
        this.localNotifications.schedule(noti);
        this.updateToStorage(noti);
    };
    NotificationsService.prototype.notiWelcome = function () {
        var notiContent = {
            id: 1,
            title: "Chào mừng bạn đến với Dogo",
            text: "Mua sắm thả ga, tích xu đổi thưởng!",
            badge: 1,
            at: new Date(new Date().getTime() + 1000 * 60 * 100)
        };
        this.localNotifications.schedule(notiContent);
    };
    NotificationsService.prototype.notiCartNotCheckout = function (isNoti) {
        if (isNoti) {
            var notiContent = {
                id: 2,
                title: "Tích điểm ngay",
                text: "Có một giỏ hàng đang chờ bạn!",
                badge: 1,
                at: new Date(new Date().getTime() + 1000 * 60 * 15)
            };
            this.localNotifications.schedule(notiContent);
        }
        else {
            this.localNotifications.cancel(2);
        }
    };
    NotificationsService.prototype.updateToStorage = function (noti) {
        var _this = this;
        this.storage.get('notifications').then(function (notis) {
            if (typeof notis !== undefined && notis !== null) {
                notis.push(noti);
                _this.storage.set('notifications', notis);
                _this.globals.setNotiCounts(notis.length);
            }
            else {
                _this.storage.set('notifications', [noti]);
                console.log('djhfjsjk  ' + [noti].length);
                _this.globals.setNotiCounts([noti].length);
            }
        });
    };
    NotificationsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LocalNotifications, Storage, Globals])
    ], NotificationsService);
    return NotificationsService;
}());
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map