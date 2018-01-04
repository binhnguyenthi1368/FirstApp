var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CustomerService } from './../../services/customer.service';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Profile } from '../../interfaces/profiles';
var Globals = /** @class */ (function () {
    function Globals(storage, badge, http, cusService) {
        this.storage = storage;
        this.badge = badge;
        this.http = http;
        this.cusService = cusService;
        this._cartCountsSource = new BehaviorSubject(0);
        this.cartCounts = this._cartCountsSource.asObservable();
        this._notiCountsSource = new BehaviorSubject(1);
        this.notiCounts = this._notiCountsSource.asObservable();
        this._typeUser = new BehaviorSubject('');
        this.typeUser = this._typeUser.asObservable();
        this._firstName = new BehaviorSubject('');
        this.firstName = this._firstName.asObservable();
        this._xu = new BehaviorSubject(0);
        this.xu = this._xu.asObservable();
        this._xu2 = new BehaviorSubject(0);
        this.xu2 = this._xu2.asObservable();
    }
    //so luong gio hang
    Globals.prototype.setCartCounts = function (value) {
        this._cartCountsSource.next(value);
    };
    //so luong tin thong bao chua doc
    Globals.prototype.setNotiCounts = function (value) {
        if (value > 0) {
            this.badge.set(value);
        }
        else {
            this.badge.clear();
        }
        this._notiCountsSource.next(value);
    };
    //loai khach hang (dai ly, tong dai ly, thanh vien, ..)
    Globals.prototype.setTypeUser = function (value) {
        this._typeUser.next(value);
    };
    //ten khach hang
    Globals.prototype.setFirstName = function (value) {
        this._firstName.next(value);
    };
    Globals.prototype.setXu = function (value) {
        this._xu.next(value);
    };
    Globals.prototype.setXu2 = function (value) {
        this._xu2.next(value);
    };
    Globals.prototype.getTotalReward = function () {
    };
    Globals.prototype.getOwnRewardPoints = function () {
        var _this = this;
        this.storage.get('profile').then(function (profile) {
            var total = 0;
            if (profile !== null) {
                var _profile = new Profile(profile.app, profile.account);
                console.log("test" + _profile);
                if (!_profile.isAccountEmpty()) {
                    _this.cusService.getReward(_profile.account.id).subscribe(function (orders) {
                        orders.forEach(function (order) {
                            try {
                                total = total + Math.round(order.reward_points_2);
                            }
                            catch (error) {
                                console.log("Giá trị nhập sai!");
                            }
                        });
                        _this._xu.next(total);
                        return total;
                    }, function (err) {
                        console.log("Lỗi mạng!");
                        return total = 0;
                    });
                }
            }
        });
    };
    //lấy ra xu từ mã giới thiệu
    Globals.prototype.getInvitedRewardPoints = function (code) {
        var _this = this;
        var total = 0;
        console.log(code);
        this.http.get("https://suplo-app.herokuapp.com/dogo-app/customers-applied-code/" + code).map(function (res) { return res.json(); })
            .subscribe(function (customers) {
            customers.data.metafields.forEach(function (customer) {
                _this.cusService.getReward(customer.owner_id).subscribe(function (orders) {
                    orders.forEach(function (order) {
                        total += Math.round(order.reward_points_1);
                    });
                    _this._xu2.next(total);
                    return total;
                });
            });
        }, function (err) { console.log(err); return total = 0; });
    };
    Globals = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Storage,
            Badge,
            Http,
            CustomerService])
    ], Globals);
    return Globals;
}());
export { Globals };
//# sourceMappingURL=globals.js.map