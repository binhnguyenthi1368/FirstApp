import { Component, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { Globals } from './../../app/providers/globals';
import { Platform, ViewController, NavParams, Nav, AlertController, LoadingController, NavController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PolicyPage } from '../policy/policy';
// import { UserData } from '../../providers/user-data';
import { UserOption, UserRegister } from '../../interfaces/user';
import { Profile, IApp, IAccount } from '../../interfaces/profiles';

// import { ConferenceData } from '../../providers/conference-data';
//firebase login
import { AuthService } from '../../app/providers/auth.service';
import { CustomerService } from '../../services/customer.service';
// _JAVA_OPTIONS: -Xmx512M
@IonicPage()
@Component({templateUrl: 'account.html', providers:[CustomerService]})
export class AccountPage {
@ViewChild(Nav) nav: Nav;
  profile: Profile;
  email: string;
  password: string;
  stateActive;
  checkgg: boolean = false;
  // loading first
  isLoading: boolean = false;
  // timeout or empty
  notiTimeout: boolean = false;
  notiTimeout1: boolean = false;
  // check click btn
  clicked: boolean = false;
  agreed: boolean = false;
  // check phone
  phoneVali: boolean = false;
  phoneTypeVali: boolean = false;
  // check ma gioi thieu co thuoc
  isCodeValid: boolean = false;
  tabAcc: string = this.params.get('charNum');
  isAndroid: boolean = false;
  public type = 'password';
  public showPass = false;
  public iconPass = 'eye-off';
  
  login: UserOption = { email: '', password: '' };
  submitted1 = false;
  submitted2 = false;

  signup: UserRegister = {
    first_name: '',
    email: '',
    phone: null,
    birthday: '',
    tags: '',
    invited_code: null, //the code which customer inserted
    password: '',
    password_confirmation: '',
    accepts_marketing: true,
    accepts_agency: false,
    type: '',
    address: '',
    gender: 0,
    fcm_token: ''
  };

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public authService: AuthService,
    public cusService: CustomerService,
    public alerCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public navCtrl: NavController,
    public globals: Globals,
  ) {
    this.storage.get("fcm").then( (data) =>{
      this.signup.fcm_token = data;
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  openPolicy() {
   this.navCtrl.push(PolicyPage);
  }
  showPassword() {
    this.showPass = !this.showPass;
    if(this.showPass){
      this.type = 'text';
      this.iconPass = 'eye';
    } else {
      this.type = 'password';
      this.iconPass = 'eye-off';
    }
  }
  // noti state login/regis
  notiActive(noti) {
    let alert = this.alerCtrl.create({
      message: noti,
    });
    alert.present();
    setTimeout(() => {
      if (alert.isOverlay) {
          alert.dismiss();
      }
    }, 3000);
  }
  //firebase login testing
  loginFirebase(form: NgForm) {
    this.clicked = true;
    this.isLoading = true;
    setTimeout(() => {
      this.clicked = false;
    }, 3000);
    this.submitted1 = true;
    if (form.valid) {
      this.authService.emailLogin(this.login.email, this.login.password).then((data) => {
        // sai pass
        if (this.authService.test == 'The password is invalid or the user does not have a password.') {
          this.stateActive = 'Địa chỉ email hoặc mật khẩu không đúng!'
          this.notiActive(this.stateActive);
          this.isLoading = false;
        } else {
          // hợp lệ
          if (this.authService.test == 'ok') {
         
            // check acc đại lý
            this.cusService.get(this.login.email).subscribe((customer) => {
              this.setProfile(customer);
              // neu la dai ly nhung chua duoc xac nhan tai khoan => ko login
              // tags customer phải có AGENCY or AGENCY-GENERAL or AGENCY-NORTH or AGENCY-SOUTH, NOT-VERIFIED hoặc VERIFIED
              if (customer.agency.indexOf("AGENCY") != -1 && customer.agency_verified == 'NOT-VERIFIED') {
                this.logoutAgency();
                this.viewCtrl.dismiss();
                this.stateActive = 'Tài khoản của bạn đang chờ được xác nhận.';
                this.notiActive(this.stateActive);
              }else{
                if ((customer.agency.indexOf("AGENCY") != -1 && customer.agency_verified == 'VERIFIED') || (customer.agency == '' && customer.agency_verified == '')) {
                  console.log(this.login.email);
                  // la dai ly da xac nhan acc va acc ctv 
                  // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
                  if (customer.agency.indexOf("AGENCY") != -1 && customer.agency_verified == 'VERIFIED') {
                    // type user = Tổng Đại lý Bắc
                    if (customer.agency.indexOf("AGENCY-NORTH") != -1) {
                      this.globals.setTypeUser('tổng đại lý Bắc');
                    }else{
                      // type user = Tổng Đại lý Nam
                      if (customer.agency.indexOf("AGENCY-SOUTH") != -1) {
                        this.globals.setTypeUser('tổng đại lý Nam');
                      }else{
                        this.globals.setTypeUser('đại lý');
                      }
                    }
                    // this.globals.typeUser.subscribe(data => {
                    // });
                  }else{
                    // type user = CTV
                    this.globals.setTypeUser('Cộng tác viên');
                  }
                  // id
                  this.storage.set('customer_id', customer.id);
                  // invite code
                  this.storage.set('invite_code', customer.invited_code);
                  // sdt
                  this.storage.set('phone', customer.code);
                  // lưu email
                  this.storage.set('infoAccount', this.login.email);
                  // firstname user
                  this.globals.setFirstName(customer.first_name);
                  this.email = this.password = '';
                  this.viewCtrl.dismiss();
                  this.stateActive = 'Đăng nhập thành công!',
                  this.notiActive(this.stateActive);
                  this.isLoading = false;
                }else{
                  // neu chỉ có AGENCY thì sẽ tính tài khoản ko hợp lệ, ko cho login
                  this.logoutAgency();
                  this.viewCtrl.dismiss();
                  this.stateActive = 'Tài khoản của bạn xảy ra lỗi. Liên hệ Admin để khắc phục';
                  this.notiActive(this.stateActive);
                }
              }
            });
          }else{
            // sai email
            if (this.authService.test == 'There is no user record corresponding to this identifier. The user may have been deleted.') {
              this.stateActive = 'Địa chỉ email không đúng hoặc không tồn tại!'
              this.notiActive(this.stateActive);
              this.isLoading = false;
            }else{
              // lỗi khác
              this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
              this.notiActive(this.stateActive);
              this.isLoading = false;
            }
          }
        }
        // set timeout or error 3 phút
        setTimeout(() => {
          if (this.isLoading == false) {
            this.notiTimeout = true;
          }
        }, 180000);
      },(err) => {
        this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
        this.notiActive(this.stateActive);
        this.isLoading = false;
      });
    }else{
      this.stateActive = 'Bạn vui lòng điền chính xác thông tin!'
      this.notiActive(this.stateActive);
      this.isLoading = false;
      this.clicked = false;
    }
  }

  setProfile(customer){
    this.storage.get('profile').then((profile) => {
      if(profile !== null){
        const _profile = new Profile(profile.app, profile.account);
        _profile.account = {
          id: customer.id,
          code: customer.code,
          invited_code: customer.invited_code,
          tags: customer.tags,
          email: customer.email,
          name: customer.first_name,
        }
        _profile.init();
        this.globals.setTypeUser(_profile.type.name);
        this.globals.setFirstName(_profile.account.name);
        this.globals.setXu(0);
        this.globals.setXu2(0);
        this.storage.set('profile', _profile);
        setTimeout(()=>{
          this.globals.getOwnRewardPoints();
          this.globals.getInvitedRewardPoints(_profile.account.code);
        }, 1000)
        console.log(_profile);
      }
    });
  }

  logout() {
    this.authService.signOut();
    this.storage.get('infoAccount').then((data) => {
      this.storage.remove('infoAccount');
    });
    // id
    this.storage.get('customer_id').then((data) => {
      this.storage.remove('customer_id');
    });
    // invite code
    this.storage.get('invite_code').then((data) => {
      this.storage.remove('invite_code');
    });
    // sdt
    this.storage.get('phone').then((data) => {
      this.storage.remove('phone');
    });
    // check logout success?
    setTimeout(() => {
      this.notiActive('Bạn đã đăng xuất!');
    }, 2000); 
  }
  
  logoutAgency() {
    this.authService.signOut();
    this.storage.get('infoAccount').then((data) => {
      this.storage.remove('infoAccount');
    });
    // id
    this.storage.get('customer_id').then((data) => {
      this.storage.remove('customer_id');
    });
    // invite code
    this.storage.get('invite_code').then((data) => {
      this.storage.remove('invite_code');
    });
    // sdt
    this.storage.get('phone').then((data) => {
      this.storage.remove('phone');
    });
  }

  loginGoogle(){
    this.clicked = true;
    setTimeout(() => {
      this.clicked = false;
    }, 3000);
    this.authService.googleLogin().then((data) => {
      if (this.authService.authState != null) {
        // gg login success
        console.log('state:  '+ this.authService.authState);
        setTimeout(() => {
          this.viewCtrl.dismiss();
          this.notiActive('Đăng nhập thành công!');
        }, 3000);
        // luu email
        this.storage.get('infoAccount').then((data) => {
          this.storage.set('infoAccount', this.authService.authState.email);
          this.isLoading = true;
        });
        // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
        this.cusService.get(this.authService.authState.email).subscribe((customer) => {
          
          // id
          this.storage.get('customer_id').then((data) => {
            this.storage.set('customer_id', customer.id);
          });
          // invite code
          this.storage.get('invite_code').then((data) => {
            this.storage.set('invite_code', customer.invited_code);
          });
          // sdt
          this.storage.get('phone').then((data) => {
            this.storage.set('phone', customer.code);
          });
        });
        // set timeout or error 3 phút
        setTimeout(() => {
          if (this.isLoading == false) {
            this.notiTimeout = true;
          }
        }, 180000);
      }else{
        this.notiActive('Đăng nhập không thành công! Vui lòng kiểm tra lại kết nối');
      }
    });
  }

  onLogin(form: NgForm) {
    this.submitted1 = true;

    if (form.valid) {
      // this.userData.login(this.login.username);
      // this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    // this.navCtrl.push(SignupPage);
  }

  signupFirebase(form: NgForm, readedPolicy) {
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
        this.http.get(`https://suplo-app.herokuapp.com/dogo-app/customer-code-validate/${this.signup.invited_code}`).map(res => res.json()).subscribe(data => {
          if (data.data.metafields.length > 0) {
            this.isCodeValid = true;
          }else{
            this.isCodeValid = false;
          }
          // check sđt của acc mới đký đã đc dùng chưa?
          this.http.get(`https://suplo-app.herokuapp.com/dogo-app/customer-code-validate/${this.signup.phone}`).map(res => res.json()).subscribe(data => {
            if (data.data.metafields.length == 0) {
              this.phoneVali = true;
            }else{
              this.phoneVali = false;
            }
            if (this.isCodeValid == true && this.phoneVali == true) {
              console.log(this.signup.email);
              if (this.signup.accepts_agency == true){
                this.signup.type = 'agency';
              }else{
                this.signup.type = 'partner';
              }
              this.authService.emailSignUp(this.signup).then((data) => {
                if (this.authService.test == 'The email address is already in use by another account.') {
                  this.stateActive = 'Địa chỉ email này đã được sử dụng bởi tài khoản khác!'
                  this.notiActive(this.stateActive);
                  this.isLoading = false;
                  this.clicked = false;
                }else{
                  if (this.authService.test == 'ok') {
                    if (this.signup.accepts_agency == true) {
                        this.viewCtrl.dismiss();
                        this.isLoading = false;
                        this.clicked = false;
                        this.signup.type = 'agency';
                        this.stateActive = 'Đăng ký tài khoản đại lý thành công! Tài khoản của bạn đang chờ được xác nhận.';
                        this.notiActive(this.stateActive);
                    }else{
                      // la dai ly da xac nhan acc va acc ctv 
                      // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
                      // lưu thông tin cần thiết (id, invitecode) của acc vào local storage để các page khác load tốt hơn
                      this.cusService.get(this.signup.email).subscribe((customer) => {
                        // id
                        this.storage.get('customer_id').then((data) => {
                          this.storage.set('customer_id', customer.id);
                        });
                        // invite code
                        this.storage.get('invite_code').then((data) => {
                          this.storage.set('invite_code', customer.invited_code);
                        });
                        // sdt
                        this.storage.get('phone').then((data) => {
                          this.storage.set('phone', customer.code);
                        });
                      });
                      // luu email
                      this.storage.get('infoAccount').then((data) => {
                        this.storage.set('infoAccount', this.signup.email);
                      });
                      // type user
                      this.globals.setTypeUser('Cộng tác viên');
                      this.signup.type = 'partner';
                      // firstname user
                      this.globals.setFirstName(this.signup.first_name);
                      this.viewCtrl.dismiss();
                      this.stateActive = 'Đăng ký thành công! Bạn đã đăng nhập.',
                      this.notiActive(this.stateActive);
                      this.isLoading = false;
                      this.clicked = false;
                    }
                  }else{
                    this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                    this.notiActive(this.stateActive);
                    this.isLoading = false;
                    this.clicked = false;
                  }
                }
                // set timeout or error 3 phút
                setTimeout(() => {
                  if (this.isLoading == false) {
                    this.notiTimeout1 = true;
                  }
                }, 180000);
              },(err) => {
                this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
                this.notiActive(this.stateActive);
                this.isLoading = false;
                this.clicked = false;
              });
            }else{
              if (this.isCodeValid == false && this.phoneVali == true) {
                // setTimeout(() => {
                  this.stateActive = 'Mã giới thiệu không thuộc bất kỳ tài khoản nào.';
                  this.notiActive(this.stateActive);
                  this.clicked = false;
                // }, 4000);
              }else{
                if (this.isCodeValid == true && this.phoneVali == false) {
                  // setTimeout(() => {
                    this.stateActive = 'Số điện thoại '+this.signup.phone+' đã được sử dụng bởi tài khoản khác.';
                    this.notiActive(this.stateActive);
                    this.clicked = false;
                  // }, 4000);
                }else{
                  if (this.isCodeValid == false && this.phoneVali == false) {
                    // setTimeout(() => {
                      this.stateActive = 'Thông tin điền vào không chính xác.';
                      this.notiActive(this.stateActive);
                      this.clicked = false;
                    // }, 4000);
                  }
                }
              }
              this.isLoading = false;
            }
          },(err) => {
            this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
            this.notiActive(this.stateActive);
            this.isLoading = false;
            this.clicked = false;
          });
        },(err) => {
          this.stateActive = 'Kết nối chậm! Vui lòng kiểm tra lại kết nối Internet của bạn.';
          this.notiActive(this.stateActive);
          this.isLoading = false;
          this.clicked = false;
        });
      }else{
        this.stateActive = 'Bạn vui lòng điền chính xác thông tin!'
        this.notiActive(this.stateActive);
        this.isLoading = false;
        this.clicked = false;
      }  
    }else{
      this.stateActive = 'Bạn vui lòng đọc điều khoản và chính sách của chúng tôi!'
      this.notiActive(this.stateActive);
      this.isLoading = false;
      this.clicked = false;
    }
  }

  onRegis(form: NgForm) {
    this.submitted2 = true;

    if (form.valid) {
      
      // this.userData.signup(this.signup.username);
      // this.navCtrl.push(TabsPage);
    }
  }
  resetPassWord(){
    let prompt = this.alerCtrl.create({
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
          handler: data => {
            console.log('Hủy');
          }
        },
        {
          text: 'Gửi',
          handler: data => {
            this.authService.resetPassword(data.email).then((email) => {
              this.notiActive('Một email xác nhận đã được gửi đến '+data.email);
              prompt.dismiss();
            }).catch( (err)=> {
              if (err.message == 'There is no user record corresponding to this identifier. The user may have been deleted.') {
                this.notiActive('Email '+data.email+' không thuộc bất kỳ tài khoản nào!');
              }else if (err.message == 'The email address is badly formatted.') {
                this.notiActive('Định dạng email không đúng!');
              }else{
                this.notiActive('Xảy ra lỗi!');
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }
  doAgreed(){
    return !this.agreed;
  }
}