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
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
// storage
import { Storage } from '@ionic/storage';
// other page
import { OtherPage } from '../other/other';
// customer service
import { CustomerService } from '../../services/customer.service';
/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var UserPage = /** @class */ (function () {
    function UserPage(navCtrl, navParams, toastCtrl, alerCtrl, storage, cusService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.alerCtrl = alerCtrl;
        this.storage = storage;
        this.cusService = cusService;
        this.loadingFirst = false;
        this.loadingSecond = false;
        // timeout or empty
        this.notiTimeout = false;
        this.newInfo = {
            first_name: '',
            birthday: '',
            address1: null,
            bank: '',
            bank_branch: '',
            account_name: '',
            account_number: null,
            individual_tax_number: null,
            tags: '',
            gender: null
        };
        // info account
        // this.cusService.getTest().subscribe(data => {
        //  console.log(data);
        // })
        this.cusService.getTest();
        this.storage.get('infoAccount').then(function (data) {
            _this.cusService.get(data).subscribe(function (customer) {
                _this.infoAccount = customer;
                // ma code ca nhan
                // this.cusService.getCode(customer.id).subscribe((code) => {
                //   this.accCode = code.code;
                //   console.log('this code  '+ this.accCode);
                // });
                if (customer.birthday != null && customer.birthday != undefined) {
                    _this.birthday = customer.birthday;
                    _this.newInfo.birthday = customer.birthday;
                }
                ;
                if (customer.default_address != null && customer.default_address != undefined) {
                    _this.addressid = _this.infoAccount.default_address.id;
                }
                ;
                _this.idAcc = customer.id;
                _this.accCode = customer.code;
                _this.cusService.getBank(_this.idAcc, _this.accCode).subscribe(function (bankdes) {
                    _this.inforBank = bankdes;
                    _this.newInfo.bank = _this.inforBank.bank;
                    _this.newInfo.bank_branch = _this.inforBank.bank_branch;
                    _this.newInfo.account_name = _this.inforBank.account_name;
                    _this.newInfo.account_number = _this.inforBank.account_number;
                    _this.newInfo.individual_tax_number = _this.inforBank.individual_tax_number;
                    _this.loadingFirst = true;
                }, function (err) {
                    _this.loadingFirst = true;
                });
                _this.gender = customer.gender;
                _this.newInfo.first_name = customer.first_name;
                _this.newInfo.tags = customer.tags;
            }, function (err) {
                // this.loadingFirst = true;
                _this.notiTimeout = true;
            });
        }, function (err) {
            // this.loadingFirst = true;
            _this.notiTimeout = true;
        });
        // set timeout or error 5 phút
        setTimeout(function () {
            if (_this.loadingFirst == false) {
                _this.notiTimeout = true;
            }
        }, 300000);
    }
    UserPage.prototype.showCodeUser = function () {
        var usedCode;
        if (this.accCode != '0') {
            usedCode = 'Bạn đã sử dụng mã giới thiệu: ' + this.accCode;
        }
        else {
            usedCode = 'Bạn chưa sử dụng mã giới thiệu';
        }
        var toast = this.toastCtrl.create({
            message: usedCode,
            showCloseButton: true,
            closeButtonText: 'Ok'
        });
        toast.present();
        if (toast.present()) {
            setTimeout(function () {
                toast.dismiss();
            }, 3000);
        }
    };
    UserPage.prototype.showYourCode = function (event, check, code) {
        this.navCtrl.push(OtherPage, {
            check: check,
            code: code
        });
    };
    // update user
    UserPage.prototype.updateUserInfo = function () {
        var _this = this;
        this.loadingSecond = true;
        this.newInfo.birthday = this.birthday;
        this.newInfo.gender = this.gender;
        this.cusService.updateCustomer(this.idAcc, this.accCode, this.addressid, this.newInfo).subscribe(function (user) {
            var alert = _this.alerCtrl.create({
                message: 'Thông tin đã được cập nhật!',
            });
            alert.present();
            setTimeout(function () {
                if (alert.present()) {
                    alert.dismiss();
                }
            }, 2000);
            _this.loadingSecond = false;
        }, function (error) {
            console.log(error);
            // if (this.loadingSecond == false) {
            _this.loadingSecond = false;
            _this.notiTimeout = true;
            // }
        });
    };
    UserPage.prototype.ionViewDidLoad = function () {
    };
    UserPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-user',
            templateUrl: 'user.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ToastController,
            AlertController,
            Storage,
            CustomerService])
    ], UserPage);
    return UserPage;
}());
export { UserPage };
//# sourceMappingURL=user.js.map