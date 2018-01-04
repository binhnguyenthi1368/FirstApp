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
import { Http } from '@angular/http';
import { Globals } from './../../app/providers/globals';
import { Platform, ViewController, NavParams, Nav, AlertController, LoadingController, NavController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PolicyPage } from '../policy/policy';
import { Profile } from '../../interfaces/profiles';
// import { ConferenceData } from '../../providers/conference-data';
//firebase login
import { AuthService } from '../../app/providers/auth.service';
import { CustomerService } from '../../services/customer.service';
// _JAVA_OPTIONS: -Xmx512M
var AccountPage = /** @class */ (function () {
    function AccountPage(platform, params, viewCtrl, storage, authService, cusService, alerCtrl, loadingCtrl, http, navCtrl, globals) {
        var _this = this;
        this.platform = platform;
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.storage = storage;
        this.authService = authService;
        this.cusService = cusService;
        this.alerCtrl = alerCtrl;
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.navCtrl = navCtrl;
        this.globals = globals;
        this.checkgg = false;
        // loading first
        this.isLoading = false;
        // timeout or empty
        this.notiTimeout = false;
        this.notiTimeout1 = false;
        // check click btn
        this.clicked = false;
        this.agreed = false;
        // check phone
        this.phoneVali = false;
        this.phoneTypeVali = false;
        // check ma gioi thieu co thuoc
        this.isCodeValid = false;
        this.tabAcc = this.params.get('charNum');
        this.isAndroid = false;
        this.type = 'password';
        this.showPass = false;
        this.iconPass = 'eye-off';
        this.login = { email: '', password: '' };
        this.submitted1 = false;
        this.submitted2 = false;
        this.signup = {
            first_name: '',
            email: '',
            phone: null,
            birthday: '',
            tags: '',
            invited_code: null,
            password: '',
            password_confirmation: '',
            accepts_marketing: true,
            accepts_agency: false,
            type: '',
            address: '',
            gender: 0,
            fcm_token: ''
        };
        this.storage.get("fcm").then(function (data) {
            _this.signup.fcm_token = data;
        });
    }
    AccountPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    AccountPage.prototype.openPolicy = function () {
        this.navCtrl.push(PolicyPage);
    };
    AccountPage.prototype.showPassword = function () {
        this.showPass = !this.showPass;
        if (this.showPass) {
            this.type = 'text';
            this.iconPass = 'eye';
        }
        else {
            this.type = 'password';
            this.iconPass = 'eye-off';
        }
    };
    // noti state login/regis
    AccountPage.prototype.notiActive = function (noti) {
        var alert = this.alerCtrl.create({
            message: noti,
        });
        alert.present();
        setTimeout(function () {
            if (alert.isOverlay) {
                alert.dismiss();
            }
        }, 3000);
    };
    //firebase login testing
    AccountPage.prototype.loginFirebase = function (form) {
        var _this = this;
        this.clicked = true;
        this.isLoading = true;
        setTimeout(function () {
            _this.clicked = false;
        }, 3000);
        this.submitted1 = true;
        if (form.valid) {
            this.authService.emailLogin(this.login.email, this.login.password).then(function (data) {
                // sai pass
                if (_this.authService.test == 'The password is invalid or the user does not have a password.') {
                    _this.stateActive = 'Địa chỉ email hoặc mật khẩu không đúng!';
                    _this.notiActive(_this.stateActive);
                    _this.isLoading = false;
                }
                else {
                    // hợp lệ
                    if (_this.authService.test == 'ok') {
                        // check acc đại lý
                        _this.cusService.get(_this.login.email).subscribe(function (customer) {
                            _this.setProfile(customer);
                            // neu la dai ly nhung chua duoc xac nhan tai khoan => ko login
                            // tags customer phải có AGENCY or AGENCY-GENERAL or AGENCY-NORTH or AGENCY-SOUTH, NOT-VERIFIED hoặc VERIFIED
                            if (customer.agency.indexOf("AGENCY") != -1 && customer.agency_verified == 'NOT-VERIFIED') {
                                _this.logoutAgency();
                                _this.viewCtrl.dismiss();
                                _this.stateActive = 'Tài khoản của bạn đang chờ được xác nhận.';
                                _this.notiActive(_this.stateActive);
                            }
                            else {
                                if ((customer.agency.indexOf("AGENCY") != -1 && customer.agency_verified == 'VERIFIED') || (customer.agency == '' && customer.agency_verified == '')) {
                                    console.log(_this.login.email);
                                    // la dai ly da xac nhan acc va acc ctv 
                                    // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
                                    if (customer.agency.indexOf("AGENCY") != -1 && customer.agency_verified == 'VERIFIED') {
                                        // type user = Tổng Đại lý Bắc
                                        if (customer.agency.indexOf("AGENCY-NORTH") != -1) {
                                            _this.globals.setTypeUser('tổng đại lý Bắc');
                                        }
                                        else {
                                            // type user = Tổng Đại lý Nam
                                            if (customer.agency.indexOf("AGENCY-SOUTH") != -1) {
                                                _this.globals.setTypeUser('tổng đại lý Nam');
                                            }
                                            else {
                                                _this.globals.setTypeUser('đại lý');
                                            }
                                        }
                                        // this.globals.typeUser.subscribe(data => {
                                        // });
                                    }
                                    else {
                                        // type user = CTV
                                        _this.globals.setTypeUser('Cộng tác viên');
                                    }
                                    // id
                                    _this.storage.set('customer_id', customer.id);
                                    // invite code
                                    _this.storage.set('invite_code', customer.invited_code);
                                    // sdt
                                    _this.storage.set('phone', customer.code);
                                    // lưu email
                                    _this.storage.set('infoAccount', _this.login.email);
                                    // firstname user
                                    _this.globals.setFirstName(customer.first_name);
                                    _this.email = _this.password = '';
                                    _this.viewCtrl.dismiss();
                                    _this.stateActive = 'Đăng nhập thành công!',
                                        _this.notiActive(_this.stateActive);
                                    _this.isLoading = false;
                                }
                                else {
                                    // neu chỉ có AGENCY thì sẽ tính tài khoản ko hợp lệ, ko cho login
                                    _this.logoutAgency();
                                    _this.viewCtrl.dismiss();
                                    _this.stateActive = 'Tài khoản của bạn xảy ra lỗi. Liên hệ Admin để khắc phục';
                                    _this.notiActive(_this.stateActive);
                                }
                            }
                        });
                    }
                    else {
                        // sai email
                        if (_this.authService.test == 'There is no user record corresponding to this identifier. The user may have been deleted.') {
                            _this.stateActive = 'Địa chỉ email không đúng hoặc không tồn tại!';
                            _this.notiActive(_this.stateActive);
                            _this.isLoading = false;
                        }
                        else {
                            // lỗi khác
                            _this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                            _this.notiActive(_this.stateActive);
                            _this.isLoading = false;
                        }
                    }
                }
                // set timeout or error 3 phút
                setTimeout(function () {
                    if (_this.isLoading == false) {
                        _this.notiTimeout = true;
                    }
                }, 180000);
            }, function (err) {
                _this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                _this.notiActive(_this.stateActive);
                _this.isLoading = false;
            });
        }
        else {
            this.stateActive = 'Bạn vui lòng điền chính xác thông tin!';
            this.notiActive(this.stateActive);
            this.isLoading = false;
            this.clicked = false;
        }
    };
    AccountPage.prototype.setProfile = function (customer) {
        var _this = this;
        this.storage.get('profile').then(function (profile) {
            if (profile !== null) {
                var _profile_1 = new Profile(profile.app, profile.account);
                _profile_1.account = {
                    id: customer.id,
                    code: customer.code,
                    invited_code: customer.invited_code,
                    tags: customer.tags,
                    email: customer.email,
                    name: customer.first_name,
                };
                _profile_1.init();
                _this.globals.setTypeUser(_profile_1.type.name);
                _this.globals.setFirstName(_profile_1.account.name);
                _this.globals.setXu(0);
                _this.globals.setXu2(0);
                _this.storage.set('profile', _profile_1);
                setTimeout(function () {
                    _this.globals.getOwnRewardPoints();
                    _this.globals.getInvitedRewardPoints(_profile_1.account.code);
                }, 1000);
                console.log(_profile_1);
            }
        });
    };
    AccountPage.prototype.logout = function () {
        var _this = this;
        this.authService.signOut();
        this.storage.get('infoAccount').then(function (data) {
            _this.storage.remove('infoAccount');
        });
        // id
        this.storage.get('customer_id').then(function (data) {
            _this.storage.remove('customer_id');
        });
        // invite code
        this.storage.get('invite_code').then(function (data) {
            _this.storage.remove('invite_code');
        });
        // sdt
        this.storage.get('phone').then(function (data) {
            _this.storage.remove('phone');
        });
        // check logout success?
        setTimeout(function () {
            _this.notiActive('Bạn đã đăng xuất!');
        }, 2000);
    };
    AccountPage.prototype.logoutAgency = function () {
        var _this = this;
        this.authService.signOut();
        this.storage.get('infoAccount').then(function (data) {
            _this.storage.remove('infoAccount');
        });
        // id
        this.storage.get('customer_id').then(function (data) {
            _this.storage.remove('customer_id');
        });
        // invite code
        this.storage.get('invite_code').then(function (data) {
            _this.storage.remove('invite_code');
        });
        // sdt
        this.storage.get('phone').then(function (data) {
            _this.storage.remove('phone');
        });
    };
    AccountPage.prototype.loginGoogle = function () {
        var _this = this;
        this.clicked = true;
        setTimeout(function () {
            _this.clicked = false;
        }, 3000);
        this.authService.googleLogin().then(function (data) {
            if (_this.authService.authState != null) {
                // gg login success
                console.log('state:  ' + _this.authService.authState);
                setTimeout(function () {
                    _this.viewCtrl.dismiss();
                    _this.notiActive('Đăng nhập thành công!');
                }, 3000);
                // luu email
                _this.storage.get('infoAccount').then(function (data) {
                    _this.storage.set('infoAccount', _this.authService.authState.email);
                    _this.isLoading = true;
                });
                // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
                _this.cusService.get(_this.authService.authState.email).subscribe(function (customer) {
                    // id
                    _this.storage.get('customer_id').then(function (data) {
                        _this.storage.set('customer_id', customer.id);
                    });
                    // invite code
                    _this.storage.get('invite_code').then(function (data) {
                        _this.storage.set('invite_code', customer.invited_code);
                    });
                    // sdt
                    _this.storage.get('phone').then(function (data) {
                        _this.storage.set('phone', customer.code);
                    });
                });
                // set timeout or error 3 phút
                setTimeout(function () {
                    if (_this.isLoading == false) {
                        _this.notiTimeout = true;
                    }
                }, 180000);
            }
            else {
                _this.notiActive('Đăng nhập không thành công! Vui lòng kiểm tra lại kết nối');
            }
        });
    };
    AccountPage.prototype.onLogin = function (form) {
        this.submitted1 = true;
        if (form.valid) {
            // this.userData.login(this.login.username);
            // this.navCtrl.push(TabsPage);
        }
    };
    AccountPage.prototype.onSignup = function () {
        // this.navCtrl.push(SignupPage);
    };
    AccountPage.prototype.signupFirebase = function (form, readedPolicy) {
        var _this = this;
        this.clicked = true;
        this.isLoading = true;
        this.submitted2 = true;
        // check da doc dieu khoan
        if (readedPolicy == true) {
            // form hợp lệ
            if (form.valid) {
                if (this.signup.invited_code == null) {
                    this.signup.invited_code = 0;
                }
                if (this.signup.phone == null) {
                    this.signup.phone = 0;
                }
                // check ma da ton tai chua?
                this.http.get("https://suplo-app.herokuapp.com/dogo-app/customer-code-validate/" + this.signup.invited_code).map(function (res) { return res.json(); }).subscribe(function (data) {
                    if (data.data.metafields.length > 0) {
                        _this.isCodeValid = true;
                    }
                    else {
                        _this.isCodeValid = false;
                    }
                    // check sđt của acc mới đký đã đc dùng chưa?
                    _this.http.get("https://suplo-app.herokuapp.com/dogo-app/customer-code-validate/" + _this.signup.phone).map(function (res) { return res.json(); }).subscribe(function (data) {
                        if (data.data.metafields.length == 0) {
                            _this.phoneVali = true;
                        }
                        else {
                            _this.phoneVali = false;
                        }
                        if (_this.isCodeValid == true && _this.phoneVali == true) {
                            console.log(_this.signup.email);
                            if (_this.signup.accepts_agency == true) {
                                _this.signup.type = 'agency';
                            }
                            else {
                                _this.signup.type = 'partner';
                            }
                            _this.authService.emailSignUp(_this.signup).then(function (data) {
                                if (_this.authService.test == 'The email address is already in use by another account.') {
                                    _this.stateActive = 'Địa chỉ email này đã được sử dụng bởi tài khoản khác!';
                                    _this.notiActive(_this.stateActive);
                                    _this.isLoading = false;
                                    _this.clicked = false;
                                }
                                else {
                                    if (_this.authService.test == 'ok') {
                                        if (_this.signup.accepts_agency == true) {
                                            _this.viewCtrl.dismiss();
                                            _this.isLoading = false;
                                            _this.clicked = false;
                                            _this.signup.type = 'agency';
                                            _this.stateActive = 'Đăng ký tài khoản đại lý thành công! Tài khoản của bạn đang chờ được xác nhận.';
                                            _this.notiActive(_this.stateActive);
                                        }
                                        else {
                                            // la dai ly da xac nhan acc va acc ctv 
                                            // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
                                            // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
                                            _this.cusService.get(_this.signup.email).subscribe(function (customer) {
                                                // id
                                                _this.storage.get('customer_id').then(function (data) {
                                                    _this.storage.set('customer_id', customer.id);
                                                });
                                                // invite code
                                                _this.storage.get('invite_code').then(function (data) {
                                                    _this.storage.set('invite_code', customer.invited_code);
                                                });
                                                // sdt
                                                _this.storage.get('phone').then(function (data) {
                                                    _this.storage.set('phone', customer.code);
                                                });
                                            });
                                            // luu email
                                            _this.storage.get('infoAccount').then(function (data) {
                                                _this.storage.set('infoAccount', _this.signup.email);
                                            });
                                            // type user
                                            _this.globals.setTypeUser('Cộng tác viên');
                                            _this.signup.type = 'partner';
                                            // firstname user
                                            _this.globals.setFirstName(_this.signup.first_name);
                                            _this.viewCtrl.dismiss();
                                            _this.stateActive = 'Đăng ký thành công! Bạn đã đăng nhập.',
                                                _this.notiActive(_this.stateActive);
                                            _this.isLoading = false;
                                            _this.clicked = false;
                                        }
                                    }
                                    else {
                                        _this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                                        _this.notiActive(_this.stateActive);
                                        _this.isLoading = false;
                                        _this.clicked = false;
                                    }
                                }
                                // set timeout or error 3 phút
                                setTimeout(function () {
                                    if (_this.isLoading == false) {
                                        _this.notiTimeout1 = true;
                                    }
                                }, 180000);
                            }, function (err) {
                                _this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                                _this.notiActive(_this.stateActive);
                                _this.isLoading = false;
                                _this.clicked = false;
                            });
                        }
                        else {
                            if (_this.isCodeValid == false && _this.phoneVali == true) {
                                // setTimeout(() => {
                                _this.stateActive = 'Mã giới thiệu không thuộc bất kỳ tài khoản nào.';
                                _this.notiActive(_this.stateActive);
                                _this.clicked = false;
                                // }, 4000);
                            }
                            else {
                                if (_this.isCodeValid == true && _this.phoneVali == false) {
                                    // setTimeout(() => {
                                    _this.stateActive = 'Số điện thoại ' + _this.signup.phone + ' đã được sử dụng bởi tài khoản khác.';
                                    _this.notiActive(_this.stateActive);
                                    _this.clicked = false;
                                    // }, 4000);
                                }
                                else {
                                    if (_this.isCodeValid == false && _this.phoneVali == false) {
                                        // setTimeout(() => {
                                        _this.stateActive = 'Thông tin điền vào không chính xác.';
                                        _this.notiActive(_this.stateActive);
                                        _this.clicked = false;
                                        // }, 4000);
                                    }
                                }
                            }
                            _this.isLoading = false;
                        }
                    }, function (err) {
                        _this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                        _this.notiActive(_this.stateActive);
                        _this.isLoading = false;
                        _this.clicked = false;
                    });
                }, function (err) {
                    _this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                    _this.notiActive(_this.stateActive);
                    _this.isLoading = false;
                    _this.clicked = false;
                });
            }
            else {
                this.stateActive = 'Bạn vui lòng điền chính xác thông tin!';
                this.notiActive(this.stateActive);
                this.isLoading = false;
                this.clicked = false;
            }
        }
        else {
            this.stateActive = 'Bạn vui lòng đọc điều khoản và chính sách của chúng tôi!';
            this.notiActive(this.stateActive);
            this.isLoading = false;
            this.clicked = false;
        }
    };
    AccountPage.prototype.onRegis = function (form) {
        this.submitted2 = true;
        if (form.valid) {
            // this.userData.signup(this.signup.username);
            // this.navCtrl.push(TabsPage);
        }
    };
    AccountPage.prototype.resetPassWord = function () {
        var _this = this;
        var prompt = this.alerCtrl.create({
            title: 'Lấy lại mật khẩu',
            message: "Điền vào địa chỉ email:",
            inputs: [
                {
                    name: 'email',
                    type: 'email',
                    placeholder: 'Nhập email...'
                },
            ],
            buttons: [
                {
                    text: 'Hủy',
                    handler: function (data) {
                        console.log('Hủy');
                    }
                },
                {
                    text: 'Gửi',
                    handler: function (data) {
                        _this.authService.resetPassword(data.email).then(function (email) {
                            _this.notiActive('Một email xác nhận đã được gửi đến ' + data.email);
                            prompt.dismiss();
                        }).catch(function (err) {
                            if (err.message == 'There is no user record corresponding to this identifier. The user may have been deleted.') {
                                _this.notiActive('Email ' + data.email + ' không thuộc bất kỳ tài khoản nào!');
                            }
                            else if (err.message == 'The email address is badly formatted.') {
                                _this.notiActive('Định dạng email không đúng!');
                            }
                            else {
                                _this.notiActive('Xảy ra lỗi!');
                            }
                        });
                    }
                }
            ]
        });
        prompt.present();
    };
    AccountPage.prototype.doAgreed = function () {
        return !this.agreed;
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], AccountPage.prototype, "nav", void 0);
    AccountPage = __decorate([
        IonicPage(),
        Component({ templateUrl: 'account.html', providers: [CustomerService] }),
        __metadata("design:paramtypes", [Platform,
            NavParams,
            ViewController,
            Storage,
            AuthService,
            CustomerService,
            AlertController,
            LoadingController,
            Http,
            NavController,
            Globals])
    ], AccountPage);
    return AccountPage;
}());
export { AccountPage };
//# sourceMappingURL=account.js.map