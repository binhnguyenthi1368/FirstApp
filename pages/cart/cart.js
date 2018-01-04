var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NotificationsService } from './../../services/notifications.service';
import { Globals } from './../../app/providers/globals';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
// storage
import { Storage } from '@ionic/storage';
// in app browser
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
// customer service
import { CustomerService } from '../../services/customer.service';
// Product page
import { ProductPage } from '../product/product';
//firebase login
import { Profile } from '../../interfaces/profiles';
import { AuthService } from '../../app/providers/auth.service';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CartPage = /** @class */ (function () {
    function CartPage(navCtrl, navParams, storage, cusService, alertCtrl, loadingCtrl, tb, globals, authService, viewCtrl, notiService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.cusService = cusService;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.tb = tb;
        this.globals = globals;
        this.authService = authService;
        this.viewCtrl = viewCtrl;
        this.notiService = notiService;
        // list sp trong giỏ
        this.itemCarts = [];
        // lưu danh sách index của sp không tích chọn checked checkbox
        this.listUnChecked = [];
        // tổng tiền
        this.total = 0;
        this.profit = 0;
        // % tich luy
        this.tich_luy = 0;
        // thưởng tích lũy doanh số
        this.reward_points_2 = 0;
        // % nhi cap
        this.thuong_nhi_cap = 0;
        // thưởng nhị cấp
        this.reward_points_1 = 0;
        // % quy tu thien
        this.quy_tu_thien = 0;
        // quỹ từ thiện
        this.charity_fund = 0;
        this.qtyItemCart = 0;
        // checkbox/reset all
        this.checkbox = true;
        this.isSelectedAll = true;
        // checkout
        this.data_post_structor = {
            "line_items": [],
            "full_name": "",
            "email": "",
            "phone": "",
            "address": "",
            "ln": 0,
            "tldt": 0,
            "tnc": 0,
            "qtt": 0
        };
        this.item = {
            "variant_id": '',
            "quantity": 1
        };
        // btn checkout clicked
        this.clicked = false;
        this.options2 = {
            statusbar: {
                color: '#db3235'
            },
            toolbar: {
                height: 44,
                color: '#db3235'
            },
            title: {
                color: '#ffffff',
                staticText: 'Thanh toán đơn hàng'
            },
            closeButton: {
                wwwImage: 'assets/icon/back.png',
                align: 'left',
                event: 'closePressed'
            },
            // clearcache: true,
            // clearsessioncache: true,
            backButtonCanClose: true
        };
    }
    CartPage.prototype.ngOnInit = function () {
        var _this = this;
        this.storage.get('profile').then(function (profile) {
            console.log(profile);
            if (profile !== null) {
                var _profile = new Profile(profile.app, profile.account);
                console.log(_profile);
                if (!_profile.isAppEmpty()) {
                    console.log('Home settings was loaded!');
                    _this.quy_tu_thien = _profile.app.percent.quy_tu_thien / 100;
                    _this.thuong_nhi_cap = _profile.app.percent.thuong_nhi_cap / 100;
                }
                if (!_profile.isAccountEmpty()) {
                    console.log('Account is already logged');
                    _profile.init();
                    _this.tich_luy = _profile.type.percent / 100;
                }
            }
            _this.storage.get('itemCarts').then(function (data) {
                _this.itemCarts = data;
                _this.itemCarts.forEach(function (item) {
                    //thêm biến kiểm tra xem item đã được chọn hay chưa
                    item.selected = true;
                });
                _this.totalCash(_this.itemCarts);
            });
        });
        // this.globals.typeUser.subscribe(data => {
        //   if (data != null && data != undefined && data != '') {
        //     if (data.indexOf('đại lý') > -1) {
        //       if (data == 'tổng đại lý Bắc') {
        //         // lay chiet khau dai ly bac neu là đại lý Bắc
        //         this.storage.get('dai_ly_bac').then((dai_ly_bac) => {
        //           this.tich_luy = dai_ly_bac;
        //         });
        //       }else{
        //         if (data == 'tổng đại lý Nam') {
        //           console.log('type user1:  '+data);
        //           // lay chiet khau dai ly bac neu là đại lý Nam
        //           this.storage.get('dai_ly_nam').then((dai_ly_nam) => {
        //             this.tich_luy = dai_ly_nam;
        //           console.log('type user1:  '+dai_ly_nam);
        //           });
        //         }else{
        //           console.log('type user2:  '+data);
        //           // lay tich luy neu la dai ly
        //           this.storage.get('dai_ly').then((dai_ly) => {
        //             this.tich_luy = dai_ly;
        //           });
        //         }
        //       }
        //     }else{
        //       // lay tich luy neu la ctv
        //       this.storage.get('tich_luy').then((tich_luy) => {
        //         this.tich_luy = tich_luy;
        //       });
        //     }
        //     // lay thuong nhi cap
        //     this.storage.get('thuong_nhi_cap').then((data) => {
        //       this.thuong_nhi_cap = data;
        //     });
        //     // lay quy tich luy
        //     this.storage.get('quy_tu_thien').then((data) => {
        //       this.quy_tu_thien = data;
        //     });
        //   }else{
        //     this.tich_luy = 0.;
        //     this.thuong_nhi_cap = 0;
        //     this.quy_tu_thien = 0;
        //   }
        //   // storage product trong giỏ hàng
        //   this.storage.get('itemCarts').then((data) => {
        //     this.itemCarts = data;
        //     this.notiService.notiCartNotCheckout(true);
        //     this.totalCash();
        //   });
        // });
    };
    // tinh tong tien
    CartPage.prototype.totalCash = function (line_items) {
        this.itemCarts = line_items;
        if (this.itemCarts != null && this.itemCarts.length > 0) {
            // so item trong cart - 1
            var countItemLine = this.itemCarts.length - 1;
            // loai tru cac sp co index nam trong listUnChecked
            if (this.listUnChecked.length > 0) {
                // tổng tiền
                this.total = 0;
                // loi nhuan
                this.profit = 0;
                // thưởng nhị cấp
                this.reward_points_1 = 0;
                // thưởng tích lũy doanh số
                this.reward_points_2 = 0;
                // quỹ từ thiện
                this.charity_fund = 0;
                var check = 0;
                // vong lap de tinh tong tien
                for (var indexItem1 = 0; indexItem1 <= countItemLine; indexItem1++) {
                    if (this.itemCarts[indexItem1].selected) {
                        check = 0;
                        for (var ichecked = 0; ichecked <= this.listUnChecked.length - 1; ichecked++) {
                            if (this.itemCarts[indexItem1].variant.id == this.listUnChecked[ichecked]) {
                                check++;
                            }
                            console.log(this.listUnChecked[ichecked]);
                        }
                        if (check == 0) {
                            this.total = this.total + this.itemCarts[indexItem1].quantity * this.itemCarts[indexItem1].variant.price;
                            if (parseInt(this.itemCarts[indexItem1].original_price) > parseInt(this.itemCarts[indexItem1].variant.price)) {
                                this.itemCarts[indexItem1].original_price = this.itemCarts[indexItem1].variant.price;
                            }
                            this.profit = this.profit + this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
                            this.reward_points_1 = this.reward_points_1 + this.thuong_nhi_cap * this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
                            this.reward_points_2 = this.reward_points_2 + this.tich_luy * this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
                            this.charity_fund = this.charity_fund + this.quy_tu_thien * this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
                        }
                    }
                }
            }
            else {
                // tổng tiền
                this.total = 0;
                // loi nhuan
                this.profit = 0;
                // thưởng nhị cấp
                this.reward_points_1 = 0;
                // thưởng tích lũy doanh số
                this.reward_points_2 = 0;
                // quỹ từ thiện
                this.charity_fund = 0;
                for (var indexItem2 = 0; indexItem2 <= countItemLine; indexItem2++) {
                    if (this.itemCarts[indexItem2].selected) {
                        this.total = this.total + this.itemCarts[indexItem2].quantity * this.itemCarts[indexItem2].variant.price;
                        if (parseInt(this.itemCarts[indexItem2].original_price) > parseInt(this.itemCarts[indexItem2].variant.price)) {
                            this.itemCarts[indexItem2].original_price = this.itemCarts[indexItem2].variant.price;
                        }
                        this.profit = this.profit + this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
                        this.reward_points_1 = this.reward_points_1 + this.thuong_nhi_cap * this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
                        this.reward_points_2 = this.reward_points_2 + this.tich_luy * this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
                        this.charity_fund = this.charity_fund + this.quy_tu_thien * this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
                    }
                }
            }
        }
        else {
            this.total = 0;
            this.reward_points_2 = 0;
        }
    };
    // view chi tiet khi click vào sp trong trang sp đã xem
    CartPage.prototype.productTapped = function ($event, product) {
        this.navCtrl.push(ProductPage, {
            product: product
            // product: this.products
        });
    };
    // giảm số lượng sản phẩm đi 1
    CartPage.prototype.doMinus = function (qty, i, check) {
        var _this = this;
        // giảm khi số lượng sp > 1
        if (qty > 1) {
            qty--;
            // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
            this.itemCarts[i].quantity = qty;
            this.storage.get('itemCarts').then(function (data) {
                // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
                data[i].quantity = qty;
                _this.storage.set('itemCarts', data);
                console.log('tang so luong san pham them 1');
            });
            if (check == true) {
                // tinh lai tong tien
                this.totalCash(this.itemCarts);
            }
        }
        else {
            // số lg sp < 1 thì gọi func xóa sp khỏi giỏ hàng
            this.removeItem(i);
        }
    };
    // tăng số lượng sản phẩm lên 1
    CartPage.prototype.doPlus = function (qty, i, check) {
        var _this = this;
        if (qty < this.itemCarts[i].variant.inventory_quantity) {
            qty++;
            this.itemCarts[i].quantity = qty;
            this.storage.get('itemCarts').then(function (data) {
                // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
                data[i].quantity = qty;
                _this.storage.set('itemCarts', data);
                console.log('tang so luong san pham them 1');
            });
            if (check == true) {
                // tinh lai tong tien
                this.totalCash(this.itemCarts);
            }
        }
        else {
            this.itemCarts[i].quantity = this.itemCarts[i].variant.inventory_quantity;
            this.storage.get('itemCarts').then(function (data) {
                // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
                data[i].quantity = _this.itemCarts[i].variant.inventory_quantity;
                _this.storage.set('itemCarts', data);
                console.log('tang so luong san pham them 1');
            });
            if (check == true) {
                // tinh lai tong tien
                this.totalCash(this.itemCarts);
            }
            var alert_1 = this.alertCtrl.create({
                message: 'Số sản phẩm trong kho không đủ!',
            });
            alert_1.present();
            setTimeout(function () {
                if (alert_1.isOverlay) {
                    alert_1.dismiss();
                }
            }, 3000);
        }
    };
    // thay doi so luong sp theo giá trị nhập vào thẻ input
    CartPage.prototype.changeNum = function (qty, i, check) {
        var _this = this;
        if (qty <= this.itemCarts[i].variant.inventory_quantity) {
            // setTimeout(() => {
            this.itemCarts[i].quantity = parseInt(qty);
            this.storage.get('itemCarts').then(function (data) {
                // setTimeout(() => {
                // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
                // set timeout de ko gap loi ko xac dinh
                data[i].quantity = qty;
                if (qty == 0 || qty == undefined) {
                    data[i].quantity = 1;
                }
                _this.storage.set('itemCarts', data);
                // }, 3000);
                console.log('thay doi so luong san pham');
            });
            if (check == true) {
                // tinh lai tong tien
                // setTimeout(() => {
                this.totalCash(this.itemCarts);
                // }, 2000);
            }
            // }, 3000);
        }
        else {
            this.itemCarts[i].quantity = parseInt(this.itemCarts[i].variant.inventory_quantity);
            this.storage.get('itemCarts').then(function (data) {
                // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
                // set timeout de ko gap loi ko xac dinh
                data[i].quantity = _this.itemCarts[i].variant.inventory_quantity;
                if (qty == 0 || qty == undefined) {
                    data[i].quantity = 1;
                }
                _this.storage.set('itemCarts', data);
                console.log('thay doi so luong san pham');
            });
            if (check == true) {
                // tinh lai tong tien
                this.totalCash(this.itemCarts);
            }
            var alert_2 = this.alertCtrl.create({
                message: 'Số sản phẩm trong kho không đủ!',
            });
            alert_2.present();
            setTimeout(function () {
                if (alert_2.isOverlay) {
                    alert_2.dismiss();
                }
            }, 3000);
        }
    };
    // xóa từng sp trong gio hang
    CartPage.prototype.removeItem = function (i) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            // title: 'XÓA SẢN PHẨM',
            message: 'Xóa sản phẩm này khỏi giỏ hàng?',
            buttons: [
                {
                    text: 'Không',
                    handler: function () {
                        console.log('Không');
                    }
                },
                {
                    text: 'Xóa',
                    handler: function () {
                        for (var uncheck = 0; uncheck <= _this.listUnChecked.length - 1; uncheck++) {
                            if (_this.listUnChecked[uncheck] == i) {
                                _this.listUnChecked.splice(uncheck, 1);
                                break;
                            }
                        }
                        _this.storage.get('itemCarts').then(function (data) {
                            // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
                            _this.itemCarts.splice(i, 1);
                            _this.storage.set('itemCarts', _this.itemCarts);
                            _this.totalCash(_this.itemCarts);
                            _this.globals.setCartCounts(data.length - 1);
                        });
                    }
                }
            ]
        });
        confirm.present();
    };
    // xóa tất cả sp trong giỏ
    CartPage.prototype.removeAll = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            // title: 'XÓA SẢN PHẨM',
            message: 'Xóa sản phẩm này khỏi giỏ hàng?',
            buttons: [
                {
                    text: 'Không',
                    handler: function () {
                        console.log('Không');
                    }
                },
                {
                    text: 'Xóa',
                    handler: function () {
                        _this.clearCart();
                    }
                }
            ]
        });
        confirm.present();
    };
    CartPage.prototype.clearCart = function () {
        var _this = this;
        console.log("clearcart");
        this.storage.get('itemCarts').then(function (data) {
            _this.itemCarts = [];
            _this.storage.set('itemCarts', _this.itemCarts);
            // this.storage.remove('itemCarts');
            _this.totalCash(_this.itemCarts);
            _this.globals.setCartCounts(0);
        });
        this.notiService.notiCartNotCheckout(false);
    };
    // checked/unchecked khi click btn chọn tất cả
    CartPage.prototype.selectAllItems = function (isSelectedAll) {
        isSelectedAll = isSelectedAll;
        if (isSelectedAll) {
            this.itemCarts.forEach(function (item) {
                item.selected = true;
            });
        }
        else {
            this.itemCarts.forEach(function (item) {
                item.selected = false;
            });
        }
        this.totalCash(this.itemCarts);
        // this.isSelectedAll = !this.isSelectedAll;
        // if (this.checkbox == true && this.isSelectedAll == true) {
        //   setTimeout(() => {
        //     this.checkbox = true;
        //   }, 0);
        //   this.checkbox = false;
        //   this.isSelectedAll = true;
        // }else{
        //   this.checkbox = this.checkall;
        // }
        // if(this.checkall == true){
        //   this.listUnChecked = [];
        //   this.totalCash();
        // }else{
        //   this.total = 0;
        //   this.reward_points_2 = 0;
        // }
    };
    // unchecked cho btn chọn tất cả khi click checkbox của bất kỳ item nào
    CartPage.prototype.selectItem = function (index, selected) {
        var _this = this;
        selected = !selected;
        console.log(this.itemCarts);
        if (selected == false) {
            this.isSelectedAll = false;
            // this.itemCarts[index].selected = false;
        }
        else {
            // this.itemCarts[index].selected = true;
            this.isSelectedAll = true;
            for (var i = 0; i <= this.itemCarts.length - 1; i++) {
                if (index !== i) {
                    if (this.itemCarts[i].selected == false) {
                        this.isSelectedAll = false;
                        break;
                    }
                }
            }
        }
        setTimeout(function () {
            _this.totalCash(_this.itemCarts);
        }, 300);
    };
    CartPage.prototype.checkOut = function () {
        var _this = this;
        this.clicked = true;
        // info account
        this.storage.get('infoAccount').then(function (data) {
            // neu dang nhap roi thi co thong tin nguoi dung
            if (data != null && data != '') {
                // lay thong tin nguoi dung
                _this.cusService.get(data).subscribe(function (customer) {
                    _this.infoAccount = customer;
                    // lay itemcarts storage
                    _this.storage.get('itemCarts').then(function (data) {
                        if (data != null && data.length != 0) {
                            var lengthArr = void 0;
                            // let checkDuplicate = 0;
                            lengthArr = data.length;
                            // ds bỏ chọn có bản ghi nào ko
                            if (_this.listUnChecked.length > 0) {
                                var check = 0;
                                var lengthUncheck = _this.listUnChecked.length;
                                // tất cả sp trong itemcarts
                                for (var iItem = 0; iItem <= lengthArr - 1; iItem++) {
                                    // kiem tra xem sp co trong ds bỏ chọn ko
                                    console.log('this.listUnChecked  ' + JSON.stringify(_this.listUnChecked));
                                    for (var unchecki = 0; unchecki <= lengthUncheck - 1; unchecki++) {
                                        if (data[iItem].variant.id !== _this.listUnChecked[unchecki]) {
                                            var item = { "variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity };
                                            // push từng sp trong cart
                                            _this.data_post_structor.line_items.push(item);
                                        }
                                    }
                                }
                            }
                            else {
                                // tất cả sp trong itemcarts
                                for (var iItem = 0; iItem <= lengthArr - 1; iItem++) {
                                    var item = { "variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity };
                                    // push từng sp trong cart
                                    _this.data_post_structor.line_items.push(item);
                                }
                            }
                            // thông tin email
                            _this.data_post_structor.email = _this.infoAccount.email;
                            // check first name = null ko
                            if (_this.infoAccount.first_name == null) {
                                _this.infoAccount.first_name = '';
                            }
                            // check default_address 
                            if (_this.infoAccount.default_address != null && _this.infoAccount.default_address != undefined) {
                                // thông tin địa chỉ
                                _this.data_post_structor.address = _this.infoAccount.default_address.address1;
                                // check địa chỉ = null ko
                                if (_this.infoAccount.default_address.address1 == null) {
                                    _this.infoAccount.default_address.address1 = '';
                                }
                            }
                            // check last name = null ko
                            if (_this.infoAccount.last_name == null) {
                                _this.infoAccount.last_name = '';
                            }
                            // thông tin fullname = first + last name
                            _this.data_post_structor.full_name = _this.infoAccount.first_name + _this.infoAccount.last_name;
                            // loi nhuan
                            _this.data_post_structor.ln = _this.profit;
                            // thuong nhi cap
                            _this.data_post_structor.tnc = Math.round(_this.reward_points_1);
                            // thuong tich luy
                            _this.data_post_structor.tldt = Math.round(_this.reward_points_2);
                            // quy tu thien
                            _this.data_post_structor.qtt = Math.round(_this.charity_fund);
                            // json và encode
                            var data_post_encode = encodeURIComponent(JSON.stringify(_this.data_post_structor));
                            //tao url
                            var url = "https://dogobtgroup.myharavan.com/cart?data=" + data_post_encode + "&view=dogo&themeid=1000281853";
                            // let url = "https://dogobtgroup.myharavan.com/cart?line_items=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%2C%22full_name%22%3A%22pham%20the%20loi%22%2C%22email%22%3A%22phamtheloi%40gmail.com%22%2C%22phone%22%3A982839923%2C%22address%22%3A%22test%201%22%7D&view=dogo&themeid=1000281853";
                            // let url = "https://dogobtgroup.myharavan.com/cart?test=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%7D&view=dogo&themeid=1000281853";
                            var brower_1 = _this.tb.create(url, '_blank', _this.options2);
                            brower_1.on("loadstop").subscribe(function (error) {
                                brower_1.insertCss({
                                    "code": "body{background-color: red;}"
                                });
                            });
                            brower_1.on("ThemeableBrowserError").subscribe(function (error) {
                                console.log(error);
                                _this.clicked = false;
                                brower_1.close();
                            });
                            //  brower.on("backToCart").subscribe(data =>{
                            //    console.log("test :  " + data.url.indexOf('thank_you'))
                            //    if(data.url.indexOf('thank_you') !== -1){
                            //     this.clearCart()
                            //     brower.close();
                            //    }else{
                            //     brower.close();
                            //     this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
                            //       let index = this.viewCtrl.index;
                            //       this.navCtrl.remove(index);
                            //     })
                            //    }
                            //    this.clicked = false;
                            //   });
                            brower_1.on("closePressed").subscribe(function (data) {
                                console.log("test2 :  " + data.url.indexOf('thank_you'));
                                if (data.url.indexOf('thank_you') !== -1) {
                                    _this.clearCart();
                                    brower_1.close();
                                }
                                else {
                                    brower_1.close();
                                    _this.navCtrl.push(_this.navCtrl.getActive().component).then(function () {
                                        var index = _this.viewCtrl.index;
                                        _this.navCtrl.remove(index);
                                    });
                                }
                                _this.clicked = false;
                            });
                            brower_1.on("loadfail").subscribe(function (error) {
                                console.log(error);
                                var noti = _this.alertCtrl.create({
                                    message: "Kiểm tra lại kết nối!"
                                });
                                noti.present();
                                setTimeout(function () {
                                    if (noti.isOverlay) {
                                        noti.dismiss();
                                    }
                                }, 3000);
                                brower_1.close();
                                _this.clicked = false;
                            });
                            brower_1.on("unexpected").subscribe(function (error) {
                                console.log(error);
                                brower_1.close();
                                _this.clicked = false;
                            });
                            brower_1.on("undefined").subscribe(function (error) {
                                console.log(error);
                                brower_1.close();
                                _this.clicked = false;
                            });
                            brower_1.on("ThemeableBrowserWarning").subscribe(function (error) {
                                console.log(error);
                                _this.clicked = false;
                            });
                            brower_1.on("critical").subscribe(function (error) {
                                console.log(error);
                                _this.clicked = false;
                            });
                        }
                    });
                });
            }
            else {
                // lay itemcarts storage
                _this.storage.get('itemCarts').then(function (data) {
                    if (data != null && data.length != 0) {
                        var lengthArr = void 0;
                        // let checkDuplicate = 0;
                        lengthArr = data.length;
                        // ds bỏ chọn có bản ghi nào ko
                        if (_this.listUnChecked.length > 0) {
                            var check = 0;
                            var lengthUncheck = _this.listUnChecked.length;
                            // tất cả sp trong itemcarts
                            for (var iItem = 0; iItem <= lengthArr - 1; iItem++) {
                                // kiem tra xem sp co trong ds bỏ chọn ko
                                for (var unchecki = 0; unchecki <= lengthUncheck - 1; unchecki++) {
                                    if (data[iItem].variant.id !== _this.listUnChecked[unchecki]) {
                                        var item = { "variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity };
                                        // push từng sp trong cart
                                        _this.data_post_structor.line_items.push(item);
                                    }
                                }
                            }
                        }
                        else {
                            // tất cả sp trong itemcarts
                            for (var iItem = 0; iItem <= lengthArr - 1; iItem++) {
                                var item = { "variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity };
                                // push từng sp trong cart
                                _this.data_post_structor.line_items.push(item);
                            }
                        }
                        // loi nhuan
                        _this.data_post_structor.ln = _this.profit;
                        // thuong nhi cap
                        _this.data_post_structor.tnc = _this.reward_points_1;
                        // thuong tich luy
                        _this.data_post_structor.tldt = _this.reward_points_2;
                        // quy tu thien
                        _this.data_post_structor.qtt = _this.charity_fund;
                        var data_post_encode = encodeURIComponent(JSON.stringify(_this.data_post_structor));
                        //tao url
                        var url = "https://dogobtgroup.myharavan.com/cart?data=" + data_post_encode + "&view=dogo&themeid=-1";
                        var brower_2 = _this.tb.create(url, '_blank', _this.options2);
                        brower_2.on("ThemeableBrowserError").subscribe(function (error) {
                            console.log(error);
                            brower_2.close();
                            _this.clicked = false;
                        });
                        // brower.on("backToCart").subscribe(data =>{
                        //   console.log("test2 :  " + data.url.indexOf('thank_you'))
                        //   if(data.url.indexOf('thank_you') !== -1){
                        //     this.clearCart();
                        //     brower.close();
                        //   }else{
                        //     brower.close();
                        //     this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
                        //       let index = this.viewCtrl.index;
                        //       this.navCtrl.remove(index);
                        //     })
                        //   }
                        //   this.clicked = false;
                        // });
                        brower_2.on("closePressed").subscribe(function (data) {
                            console.log("test2 :  " + data.url.indexOf('thank_you'));
                            if (data.url.indexOf('thank_you') !== -1) {
                                _this.clearCart();
                                brower_2.close();
                            }
                            else {
                                brower_2.close();
                                _this.navCtrl.push(_this.navCtrl.getActive().component).then(function () {
                                    var index = _this.viewCtrl.index;
                                    _this.navCtrl.remove(index);
                                });
                            }
                            _this.clicked = false;
                        });
                        brower_2.on("loadfail").subscribe(function (error) {
                            console.log(error);
                            var noti = _this.alertCtrl.create({
                                message: "Kiểm tra lại kết nối!"
                            });
                            noti.present();
                            setTimeout(function () {
                                if (noti.isOverlay) {
                                    noti.dismiss();
                                }
                            }, 3000);
                            brower_2.close();
                            _this.clicked = false;
                        });
                        brower_2.on("unexpected").subscribe(function (error) {
                            console.log(error);
                            brower_2.close();
                            _this.clicked = false;
                        });
                        brower_2.on("undefined").subscribe(function (error) {
                            console.log(error);
                            brower_2.close();
                            _this.clicked = false;
                        });
                        brower_2.on("ThemeableBrowserWarning").subscribe(function (error) {
                            console.log(error);
                            _this.clicked = false;
                        });
                        brower_2.on("critical").subscribe(function (error) {
                            console.log(error);
                            _this.clicked = false;
                        });
                    }
                });
            }
        });
    };
    CartPage.prototype.callCheckOut = function () {
        this.checkOut();
    };
    CartPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad CartPage');
    };
    CartPage.prototype.callNotiCheckout = function () {
        var _this = this;
        this.storage.get('itemCarts').then(function (data) {
            if (data !== null) {
                if (data.length > 0) {
                    _this.notiService.notiCartNotCheckout(true);
                }
                else {
                    _this.notiService.notiCartNotCheckout(false);
                }
            }
        });
    };
    CartPage.prototype.OnDestroy = function () {
        this.callNotiCheckout();
    };
    CartPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cart',
            templateUrl: 'cart.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Storage,
            CustomerService,
            AlertController,
            LoadingController,
            ThemeableBrowser,
            Globals,
            AuthService,
            ViewController,
            NotificationsService])
    ], CartPage);
    return CartPage;
}());
export { CartPage };
//# sourceMappingURL=cart.js.map