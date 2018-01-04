import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController} from 'ionic-angular';
// storage
import { Storage } from '@ionic/storage';
// show noti in the device' noti area
import { LocalNotifications } from '@ionic-native/local-notifications';
// Product page
import { ProductPage } from '../product/product';
// detail order modal
import { DetailOrderPage } from '../detail-order/detail-order';
// customer service
import { CustomerService } from '../../services/customer.service';
import { Profile, IApp } from '../../interfaces/profiles';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage implements OnInit {
  @ViewChild(Slides) slides: Slides;
  public query : string = 'slide0';
  // check loading
  loadingFirst: boolean = false;
  idCustomer;
  orders;
  orderDone = [];
  orderPending = [];
  // timeout or empty
  notiTimeout: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public cusService: CustomerService,
    ) {
  }
	ngOnInit() {
		// view đơn hàng
    this.storage.get('profile').then((profile) => {
      console.log(profile);
      if(profile !== null){
        const _profile = new Profile(profile.app, profile.account);
        if(!_profile.isAccountEmpty()){
          console.log('Account is already logged');
          _profile.init();
          this.cusService.getOrder(_profile.account.id).subscribe((order) => {
            this.orders = order;
            console.log(this.orders);
            for (var iorder =  0; iorder <= this.orders.length - 1; iorder++) {
              if ((this.orders[iorder].fulfillment_status == 'fulfilled' && this.orders[iorder].financial_status == 'paid') || this.orders[iorder].cancelled_status == 'cancelled') {
                this.orderDone.push(this.orders[iorder]);
              }else{
                // if (this.orders[iorder].financial_status == 'pending' || this.orders[iorder].financial_status == 'refunded') {
                  this.orderPending.push(this.orders[iorder]);
                // }
              }
            }
            this.loadingFirst = true;
          },(err) => {
            this.notiTimeout = true;
          });
        }
      }
    });
    // set timeout or error 3 phút
    // set timeout or error 3 phút
    setTimeout(() => {
      if (this.loadingFirst == false) {
        this.notiTimeout = true;
      }
    }, 180000);
	}

// 2 tab segment của đơn hàng
  slideChanged(){
    if(this.slides._activeIndex == 0){
        this.query = 'slide0';
    }
    if(this.slides._activeIndex == 1){
        this.query = 'slide1';
    }
    // let currentIndex = this.slides.getActiveIndex();
  }
  showdata(){
    if(this.query == 'slide0') {
      this.slides.slideTo(0,0);
      // this.slides.ionSlideWillChange.
    }
    if(this.query == 'slide1') {      
      this.slides.slideTo(1,0);
    }
    // this.slides.getActiveIndex();
  }
    // view chi tiet khi click vào sp trong trang sp đã xem
  productTapped($event, product) {
    this.navCtrl.push(ProductPage, {
      product: product
      // product: this.products
    });
    
  }
  // view chi tiet don hang
  viewDetailOrder(id) {
    console.log(id);
    let modal = this.modalCtrl.create(DetailOrderPage, {
      idorder: id
    });
    modal.present();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OrderPage');
  }

}
