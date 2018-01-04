import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

// storage
import { Storage } from '@ionic/storage';
// other page
import { OtherPage } from '../other/other';
// customer service
import { CustomerService } from '../../services/customer.service';
// interface update user
import { UpdateUser } from '../../interfaces/user';
/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  idAcc;
  emailAccount;
  infoAccount;
  loadingFirst: boolean = false;
  loadingSecond: boolean = false;
  birthday;
  gender;
  accCode;
  addressid;
  // timeout or empty
  notiTimeout: boolean = false;
  newInfo: UpdateUser = {
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
  }
  inforBank;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public toastCtrl: ToastController,
    public alerCtrl: AlertController,
    public storage: Storage,
    public cusService: CustomerService,
  	) {
    // info account
    // this.cusService.getTest().subscribe(data => {
    //  console.log(data);
    // })
    this.cusService.getTest();
    this.storage.get('infoAccount').then((data) => {
      this.cusService.get(data).subscribe((customer) => {
        this.infoAccount = customer;
        // ma code ca nhan
        // this.cusService.getCode(customer.id).subscribe((code) => {
        //   this.accCode = code.code;
        //   console.log('this code  '+ this.accCode);
        // });
        if (customer.birthday != null && customer.birthday != undefined) {
          this.birthday = customer.birthday;
          this.newInfo.birthday = customer.birthday;
        };
        if (customer.default_address != null && customer.default_address != undefined) {
          this.addressid = this.infoAccount.default_address.id;
        };
        this.idAcc = customer.id;
        this.accCode = customer.code;
        this.cusService.getBank(this.idAcc, this.accCode).subscribe((bankdes) => {
          this.inforBank = bankdes;
          this.newInfo.bank = this.inforBank.bank;
          this.newInfo.bank_branch = this.inforBank.bank_branch;
          this.newInfo.account_name = this.inforBank.account_name;
          this.newInfo.account_number = this.inforBank.account_number;
          this.newInfo.individual_tax_number = this.inforBank.individual_tax_number;
          this.loadingFirst = true;
        }, (err) => {
          this.loadingFirst = true;
        })
        this.gender = customer.gender;
        this.newInfo.first_name = customer.first_name;
        this.newInfo.tags = customer.tags;
      }, (err) => {
          // this.loadingFirst = true;
          this.notiTimeout = true;
        });
    }, (err) => {
          // this.loadingFirst = true;
          this.notiTimeout = true;
        });
    // set timeout or error 5 phút
    setTimeout(() => {
      if (this.loadingFirst == false) {
        this.notiTimeout = true;
      }
    }, 300000);
   }
   showCodeUser() {
     let usedCode;
     
     if(this.accCode != '0') {
       usedCode = 'Bạn đã sử dụng mã giới thiệu: '+this.accCode;
     }else{
       usedCode = 'Bạn chưa sử dụng mã giới thiệu';
     }
    const toast = this.toastCtrl.create({
      message: usedCode,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
    if (toast.present()) {
      setTimeout(() => {
        toast.dismiss();
      }, 3000); 
    }
   }

   showYourCode(event, check: number, code) {
   	 this.navCtrl.push(OtherPage, {
   	 	check: check,
      code: code
   	 });
   }
   // update user
   private updateUserInfo(): void{
     this.loadingSecond = true;
     this.newInfo.birthday = this.birthday;
     this.newInfo.gender = this.gender;
    this.cusService.updateCustomer(this.idAcc, this.accCode, this.addressid, this.newInfo).subscribe( user => {
      let alert = this.alerCtrl.create({
        message: 'Thông tin đã được cập nhật!',
      });
      alert.present();
      setTimeout(() => {
        if (alert.present()) {
          alert.dismiss();
        }
      }, 2000);
      this.loadingSecond = false;
    },
    (error) => {
      console.log(error);
      // if (this.loadingSecond == false) {
        this.loadingSecond = false;
        this.notiTimeout = true;
      // }
    })
  }
   ionViewDidLoad() {
   }

}
