var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
// storage
import { Storage } from '@ionic/storage';
import { Profile } from '../../interfaces/profiles';
// customer service
import { CustomerService } from '../../services/customer.service';
// detail order modal
import { DetailOrderPage } from '../detail-order/detail-order';
var CommissionPage = /** @class */ (function () {
    function CommissionPage(navCtrl, navParams, alertCtrl, storage, cusService, modalCtrl, 
        // public clipboard: Clipboard,
        http) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.cusService = cusService;
        this.modalCtrl = modalCtrl;
        this.http = http;
        // rut gon ds don hang trang hoa hong
        this.showdes = true;
        this.loadingDone1 = false;
        this.loadingDone2 = false;
        // timeout or empty
        this.notiTimeout = false;
        // ds giao dich da xu ly cat chuoi hoan thien
        this.allCommission = [];
        // tong diem tich luy tu don hang ca nhan
        this.score1 = 0;
        // tổng thưởng nhị cấp của toàn bộ độ hàng của tất cả khách hàng dùng mã giới thiệu
        this.score2 = 0;
        this.usedPoints = 0; //tong diem thuong da dung
    }
    CommissionPage.prototype.ngOnInit = function () {
        var _this = this;
        // id
        //
        this.getOwnRewardPoints();
        //
        this.getInvitedRewardPoints();
        // set timeout 3 phút
        setTimeout(function () {
            if (_this.loadingDone1 == false || _this.loadingDone2 == false) {
                _this.notiTimeout = true;
                _this.loadingDone1 = true;
                _this.loadingDone2 = true;
            }
        }, 180000);
    };
    //lấy ra xu tích luỹ của khách hàng
    CommissionPage.prototype.getOwnRewardPoints = function () {
        var _this = this;
        this.storage.get('profile').then(function (profile) {
            console.log(profile);
            if (profile !== null) {
                var _profile = new Profile(profile.app, profile.account);
                if (!_profile.isAccountEmpty()) {
                    console.log('Account is already logged');
                    _this.phone = _profile.account.code;
                    _profile.init();
                    _this.cusService.getReward(_profile.account.id).subscribe(function (order) {
                        _this.ordersReward2 = order;
                        // tinh tổng tích lũy cá nhân
                        var lengthOrdersReward2 = _this.ordersReward2.length;
                        _this.score1 = 0;
                        for (var i = 0; i <= lengthOrdersReward2 - 1; i++) {
                            _this.score1 = _this.score1 + parseInt(_this.ordersReward2[i].reward_points_2);
                        }
                        // this.loadingDone = true;
                    }, function (err) {
                        _this.notiTimeout = true;
                        _this.loadingDone1 = true;
                        _this.loadingDone2 = true;
                    });
                }
            }
        });
    };
    //lấy ra xu từ mã giới thiệu
    CommissionPage.prototype.getInvitedRewardPoints = function () {
        var _this = this;
        this.storage.get('profile').then(function (profile) {
            console.log(profile);
            if (profile !== null) {
                var _profile = new Profile(profile.app, profile.account);
                if (!_profile.isAccountEmpty()) {
                    console.log('Account is already logged');
                    _profile.init();
                    // get số người da dung ma cua minh va tinh diem thuong nhi cap tu nhung nguoi do
                    _this.http.get("https://suplo-app.herokuapp.com/dogo-app/customers-applied-code/" + _profile.account.code).map(function (res) { return res.json(); }).subscribe(function (data) {
                        _this.countUsed = data.data.metafields.length;
                        // lay tung id cua tung acc da dung ma gioi thieu cua minh
                        for (var j = 0; j <= _this.countUsed - 1; j++) {
                            // lay tung order cua tung acc do
                            _this.cusService.getReward(data.data.metafields[j].owner_id).subscribe(function (order) {
                                _this.ordersReward1 = order;
                                // tinh tổng thuong nhi cap
                                var lengthOrdersReward1 = _this.ordersReward1.length;
                                _this.score2 = 0;
                                // lay ma nhi cap cua tung order
                                for (var i = 0; i <= lengthOrdersReward1 - 1; i++) {
                                    _this.score2 = _this.score2 + parseInt(_this.ordersReward1[i].reward_points_1);
                                }
                            });
                        }
                        _this.loadingDone1 = true;
                        // console.log('parse meta:  '+ JSON.stringify(data.data.metafields));
                    }, function (err) {
                        _this.notiTimeout = true;
                        _this.loadingDone1 = true;
                        _this.loadingDone2 = true;
                    });
                    // lich su giao dich & diem tich luy da dung
                    _this.http.get("https://suplo-app.herokuapp.com/dogo-app/commission/histories/" + _profile.account.code).map(function (res) { return res.json(); }).subscribe(function (data) {
                        _this.commissionHistories = data;
                        // this.commissionHistories = data.data.metafields[0].value;
                        // console.log('parse meta:  '+ JSON.stringify(data.data.metafields));
                        if (_this.commissionHistories != 'True' && _this.commissionHistories != null && _this.commissionHistories != undefined && _this.commissionHistories.length > 0) {
                            var commission = _this.commissionHistories.split('@##@');
                            var lengthCommiss = commission.length;
                            if (lengthCommiss > 0) {
                                // lay ra lich su giao dich
                                for (var i = 0; i <= lengthCommiss - 2; i++) {
                                    var commissionOne = commission[i].split('##');
                                    // mot giao dich da xu ly cat chuoi
                                    var commissionHistory = {
                                        "date": '',
                                        "value": null,
                                        "desciption": '',
                                    };
                                    // ngay thanh toan
                                    commissionHistory.date = commissionOne[0];
                                    // so tien
                                    commissionHistory.value = commissionOne[1];
                                    // mo ta
                                    commissionHistory.desciption = commissionOne[2];
                                    _this.allCommission.push(commissionHistory);
                                }
                                // tinh diem thuong da dung
                                _this.usedPoints = 0;
                                var lengthUsed = _this.allCommission.length;
                                for (var i = 0; i <= lengthUsed - 1; i++) {
                                    _this.usedPoints = _this.usedPoints + parseInt(_this.allCommission[i].value);
                                }
                            }
                        }
                        else {
                            _this.usedPoints = 0;
                        }
                        _this.loadingDone2 = true;
                    }, function (err) {
                        _this.notiTimeout = true;
                        _this.loadingDone1 = true;
                        _this.loadingDone2 = true;
                    });
                }
            }
        });
    };
    // view chi tiet don hang
    CommissionPage.prototype.viewDetailOrder = function (detail) {
        console.log(detail);
        var modal = this.modalCtrl.create(DetailOrderPage, {
            idorder: detail
        });
        modal.present();
    };
    // an/hien rut gon thong tin
    CommissionPage.prototype.showMore = function () {
        if (this.showdes == true) {
            this.showdes = false;
        }
        else {
            this.showdes = true;
        }
        // this.showdes != this.showdes;
    };
    CommissionPage.prototype.ionViewDidLoad = function () {
    };
    CommissionPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-commission',
            templateUrl: 'commission.html'
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AlertController,
            Storage,
            CustomerService,
            ModalController,
            Http])
    ], CommissionPage);
    return CommissionPage;
}());
export { CommissionPage };
//# sourceMappingURL=commission.js.map