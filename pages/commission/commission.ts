import { ViewChild, Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
// storage
import { Storage } from '@ionic/storage';
import { Profile, IApp } from '../../interfaces/profiles';
// customer service
import { CustomerService } from '../../services/customer.service';
// detail order modal
import { DetailOrderPage } from '../detail-order/detail-order';

@IonicPage()
@Component({
  selector: 'page-commission',
  templateUrl: 'commission.html'
})
export class CommissionPage implements OnInit {
  idCustomer;
  // ds thuong nhi cap
  ordersReward1;
  // ds tich luy ca nhan
  ordersReward2;
  // rut gon ds don hang trang hoa hong
  showdes: boolean = true;
  loadingDone1: boolean = false;
  loadingDone2: boolean = false;
  // timeout or empty
  notiTimeout: boolean = false;
  phone;
  countUsed;
  // ds giao dich lay ve chua cat chuoi
  commissionHistories;
  // ds giao dich da xu ly cat chuoi hoan thien
  allCommission = [];
  // tong diem tich luy tu don hang ca nhan
  score1: number = 0;
  // tổng thưởng nhị cấp của toàn bộ độ hàng của tất cả khách hàng dùng mã giới thiệu
  score2: number = 0;
  usedPoints: number = 0; //tong diem thuong da dung
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storage: Storage,
    public cusService: CustomerService,
    public modalCtrl: ModalController,
    // public clipboard: Clipboard,
    public http: Http,
    ) {
  }
  ngOnInit() {
    // id
    //
    this.getOwnRewardPoints();
    //
    this.getInvitedRewardPoints();
  
    // set timeout 3 phút
    setTimeout(() => {
      if (this.loadingDone1 == false || this.loadingDone2 == false) {
        this.notiTimeout = true;
        this.loadingDone1 = true;
        this.loadingDone2 = true;
      }
    }, 180000);
  }

  //lấy ra xu tích luỹ của khách hàng
  getOwnRewardPoints(){
    this.storage.get('profile').then((profile) => {
      console.log(profile);
      if(profile !== null){
        const _profile = new Profile(profile.app, profile.account);
        if(!_profile.isAccountEmpty()){
          console.log('Account is already logged');
          this.phone = _profile.account.code;
          _profile.init();
          this.cusService.getReward(_profile.account.id).subscribe((order) => {
            this.ordersReward2 = order;
            // tinh tổng tích lũy cá nhân
            let lengthOrdersReward2 = this.ordersReward2.length;
            this.score1 = 0;
            for(let i = 0; i <= lengthOrdersReward2 - 1; i++){
              this.score1 = this.score1 + parseInt(this.ordersReward2[i].reward_points_2);
            }
            // this.loadingDone = true;
          },(err) => {
            this.notiTimeout = true;
            this.loadingDone1 = true;
            this.loadingDone2 = true;
          });
        }
      }
    });
  }

  //lấy ra xu từ mã giới thiệu
  getInvitedRewardPoints(){
    this.storage.get('profile').then((profile) => {
      console.log(profile);
      if(profile !== null){
        const _profile = new Profile(profile.app, profile.account);
        if(!_profile.isAccountEmpty()){
          console.log('Account is already logged');
          _profile.init();
          // get số người da dung ma cua minh va tinh diem thuong nhi cap tu nhung nguoi do
          this.http.get(`https://suplo-app.herokuapp.com/dogo-app/customers-applied-code/${_profile.account.code}`).map(res => res.json()).subscribe(data => {
            this.countUsed = data.data.metafields.length;
            // lay tung id cua tung acc da dung ma gioi thieu cua minh
            for(let j = 0; j <= this.countUsed - 1; j++){
              // lay tung order cua tung acc do
              this.cusService.getReward(data.data.metafields[j].owner_id).subscribe((order) => {
                this.ordersReward1 = order;
                // tinh tổng thuong nhi cap
                let lengthOrdersReward1 = this.ordersReward1.length;
                this.score2 = 0;
                // lay ma nhi cap cua tung order
                for(let i = 0; i <= lengthOrdersReward1 - 1; i++){
                  this.score2 = this.score2 + parseInt(this.ordersReward1[i].reward_points_1);
                }
              });
            }
            this.loadingDone1 = true;
            // console.log('parse meta:  '+ JSON.stringify(data.data.metafields));
          },(err) => {
            this.notiTimeout = true;
            this.loadingDone1 = true;
            this.loadingDone2 = true;
          });
          // lich su giao dich & diem tich luy da dung
          this.http.get(`https://suplo-app.herokuapp.com/dogo-app/commission/histories/${_profile.account.code}`).map(res => res.json()).subscribe(data => {
            this.commissionHistories = data;
            // this.commissionHistories = data.data.metafields[0].value;
            // console.log('parse meta:  '+ JSON.stringify(data.data.metafields));
            if (this.commissionHistories != 'True' && this.commissionHistories != null && this.commissionHistories != undefined && this.commissionHistories.length > 0) {
              let commission = this.commissionHistories.split('@##@');
              let lengthCommiss = commission.length;
              if (lengthCommiss > 0) {
                // lay ra lich su giao dich
                for(let i = 0; i <= lengthCommiss - 2; i++){
                  let commissionOne = commission[i].split('##');
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
                  this.allCommission.push(commissionHistory);
                }
                // tinh diem thuong da dung
                this.usedPoints = 0;
                let lengthUsed = this.allCommission.length;
                for(let i = 0; i <= lengthUsed - 1; i++){
                  this.usedPoints = this.usedPoints + parseInt(this.allCommission[i].value);
                }

              }
            }else{
              this.usedPoints = 0;
            }
            this.loadingDone2 = true;
          },(err) => {
            this.notiTimeout = true;
            this.loadingDone1 = true;
            this.loadingDone2 = true;
          });
        }
      }
    });
  }
  
  // view chi tiet don hang
  viewDetailOrder(detail) {
    console.log(detail);
    let modal = this.modalCtrl.create(DetailOrderPage, {
      idorder: detail
    });
    modal.present();
  }
  // an/hien rut gon thong tin
  showMore() {
    if (this.showdes == true) { 
      this.showdes = false;
    } else {
      this.showdes = true;
    }
    // this.showdes != this.showdes;
  }
  ionViewDidLoad() {
  }

}

export interface iCommissionHistory{
  date: string;
  value: number;
  desciption: string;
}