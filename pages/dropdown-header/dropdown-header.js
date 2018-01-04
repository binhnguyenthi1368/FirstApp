var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, App, ViewController, Nav, ModalController } from 'ionic-angular';
// user page
import { UserPage } from '../user/user';
import { AccountPage } from '../account/account';
//firebase login
import { AuthService } from '../../app/providers/auth.service';
var DropdownHeaderPage = /** @class */ (function () {
    function DropdownHeaderPage(navCtrl, appCtrl, viewCtrl, authService, modalCtrl) {
        this.navCtrl = navCtrl;
        this.appCtrl = appCtrl;
        this.viewCtrl = viewCtrl;
        this.authService = authService;
        this.modalCtrl = modalCtrl;
    }
    DropdownHeaderPage.prototype.openUser = function () {
        if (this.authService.authState != null) {
            this.navCtrl.push(UserPage);
        }
        else {
            var modal = this.modalCtrl.create(AccountPage, { charNum: 'loginTab' });
            modal.present();
        }
    };
    DropdownHeaderPage.prototype.openHome = function () {
        this.viewCtrl.dismiss();
        // this.nav.setPages([HomePage]);
        this.appCtrl.getRootNav().popTo(0);
        // this.appCtrl.getRootNav().push(HomePage);
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], DropdownHeaderPage.prototype, "nav", void 0);
    DropdownHeaderPage = __decorate([
        Component({
            template: "\n    <ion-list class=\"popover-page\">\n      <ion-item class=\"text-athelas\" tappable (tap)=\"openHome()\">\n        <ion-label>Trang ch\u1EE7</ion-label>\n      </ion-item>\n      <ion-item class=\"text-charter\" tappable (tap)=\"openUser()\">\n        <ion-label>Qu\u1EA3n l\u00FD t\u00E0i kho\u1EA3n</ion-label>\n      </ion-item>\n    </ion-list>\n  "
        }),
        __metadata("design:paramtypes", [NavController, App, ViewController, AuthService, ModalController])
    ], DropdownHeaderPage);
    return DropdownHeaderPage;
}());
export { DropdownHeaderPage };
//# sourceMappingURL=dropdown-header.js.map