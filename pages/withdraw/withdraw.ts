import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';

import { Storage } from '@ionic/storage';
// import { CartPage } from '../cart/cart';
// import { viewVariant } from '../product/product';
import { CoinService } from '../../services/coin.service';
// import { ProductService } from '../../services/product.service';
// in app browser
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
// customer service
import { CustomerService } from '../../services/customer.service';
import { Globals } from '../../app/providers/globals';
import { Product } from '../../interfaces/product';

/**
 * Generated class for the WithdrawPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
  providers:[CoinService/*, CartPage, viewVariant, ProductService*/]
})
export class WithdrawPage {
	items;
  infoAccount;
  totalXu = 0;
  // loading first
  loadingClick: boolean = false;
  // timeout or empty
  notiTimeout: boolean = false;
	// checkout
  	public data_post_structor = {
	   "line_items":[],
	   "full_name": "",
	   "email": "",
	   "phone": "",
	   "address": "",
	   "ln": 0,
	   "tldt": 0,
	   "tnc": 0,
	   "qtt": 0
  };
  public item = {
    "variant_id": '',
     "quantity": 1 
  };
	options2: ThemeableBrowserOptions = {
    statusbar: {
        color: '#db3235'
    },
    toolbar: {
        height: 44,
        color: '#db3235'
    },
    title: {
        color: '#ffffff',
        staticText: 'Rút tiền mặt'
    },
    closeButton:{
      wwwImage: 'assets/icon/close.png',
      align: 'right',
      event: 'closePressed'
    },
    customButtons: [
      {
        wwwImage: 'assets/icon/back.png',
        align: 'left',
        event: 'backToCart'
      }
    ],
    // clearcache: true,
    // clearsessioncache: true,
    backButtonCanClose: true
  };

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public cservice: CoinService,
  	public storage: Storage,
  	public cusService: CustomerService,
  	public tb: ThemeableBrowser,
  	public viewCtrl: ViewController,
  	public alertCtrl: AlertController,
    public globals: Globals,
  	) {
      this.cservice.getHandle('nap-xu', 1, "price-ascending").then((res) => {
        this.items = JSON.parse(res.data).products.map(this.toProduct);
      },(err) => {
        this.notiTimeout = true;
      });

      this.globals.xu.subscribe(data => {
        this.totalXu += Math.round(data);
      });
      this.globals.xu2.subscribe(data => {
        this.totalXu += Math.round(data);
      });
      setTimeout(()=>{
        console.log("total xu: " + this.totalXu)
      },10000)
  }
  toProduct(r:any): Product {
    let Product = <Product>({
      id: r.first_variant,
      title: r.title,
      featured_image: r.featured_image,
      handle: r.handle,
      compare_at_price: r.compare_at_price,
      compare_at_price_format: r.compare_at_price_format,
      price: r.price,
      price_format: r.price_format,
      available: r.available,
      sale: r.sale,
      isWholeSale: false
    })
    if(r.isWholeSale === 'true'){
      Product.isWholeSale = true;
    }
    return Product;
  }
  // pay
  productTapped(id, price) {
    this.loadingClick = true;
    setTimeout(() => {
      this.loadingClick = false;
    }, 2000);
    price = price/100;
    // check xem số xu của acc đó có thể rút mệnh giá này không
    console.log(price+'  '+this.totalXu);
    if (this.totalXu >= price) {
      // info account
      this.storage.get('infoAccount').then((data) => {
        // neu dang nhap roi thi co thong tin nguoi dung
        if (data != null && data != '') {
          // lay thong tin nguoi dung
          this.cusService.get(data).subscribe((customer) => {
            this.infoAccount = customer;
            // lay itemcarts storage
            let item = {"variant_id": id, "quantity": 1};
            this.data_post_structor.line_items.push(item);
            // thông tin email
            this.data_post_structor.email = this.infoAccount.email;
            // check first name = null ko
            if (this.infoAccount.first_name == null) {
              this.infoAccount.first_name = '';
            }
            // check default_address 
            if (this.infoAccount.default_address != null && this.infoAccount.default_address != undefined) {
              // thông tin địa chỉ
              this.data_post_structor.address = this.infoAccount.default_address.address1;
              // check địa chỉ = null ko
              if (this.infoAccount.default_address.address1 == null) {
                this.infoAccount.default_address.address1 = '';
              }
            }
            // check last name = null ko
            if (this.infoAccount.last_name == null) {
              this.infoAccount.last_name = '';
            }
            // thông tin fullname = first + last name
            this.data_post_structor.full_name = this.infoAccount.first_name + this.infoAccount.last_name;
            
            
            // loi nhuan
            this.data_post_structor.ln = 0;
            // thuong nhi cap
            this.data_post_structor.tnc = 0;
            // thuong tich luy
            this.data_post_structor.tldt = -price/100;
            // quy tu thien
            this.data_post_structor.qtt = 0;
            // json và encode
            let data_post_encode = encodeURIComponent(JSON.stringify(this.data_post_structor));
            //tao url
            let url = "https://dogobtgroup.myharavan.com/cart?data="+data_post_encode+"&view=dogo&themeid=1000281853"
              // let url = "https://dogobtgroup.myharavan.com/cart?line_items=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%2C%22full_name%22%3A%22pham%20the%20loi%22%2C%22email%22%3A%22phamtheloi%40gmail.com%22%2C%22phone%22%3A982839923%2C%22address%22%3A%22test%201%22%7D&view=dogo&themeid=1000281853";
              // let url = "https://dogobtgroup.myharavan.com/cart?test=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%7D&view=dogo&themeid=1000281853";
              let brower = this.tb.create(url,'_blank', this.options2);
           brower.on("ThemeableBrowserError").subscribe(error =>{
              console.log(error);
             brower.close();
            });
           brower.on("backToCart").subscribe(error =>{
             brower.close();
           //   this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
           //    let index = this.viewCtrl.index;
           //    this.navCtrl.remove(index);
           // })
            });
           brower.on("closePressed").subscribe(error =>{
            // this.clearCart()
             brower.close();
            });
           brower.on("loadfail").subscribe(error =>{
              console.log(error);
              let noti = this.alertCtrl.create({
                message: "Kiểm tra lại kết nối!"
              });
              noti.present();
              setTimeout(() => {
                if(noti.isOverlay){
                  noti.dismiss();
                }
              }, 3000);
             brower.close();
            });
           brower.on("unexpected").subscribe(error =>{
              console.log(error);
             brower.close();
            });
           brower.on("undefined").subscribe(error =>{
              console.log(error);
             brower.close();
            });
           brower.on("ThemeableBrowserWarning").subscribe(error =>{
              console.log(error);
            });
           brower.on("critical").subscribe(error =>{
              console.log(error);
            });
          });
        }
      });
    }else{
      let noti = this.alertCtrl.create({
        message: "Số xu trong tài khoản không đủ!",
      });
      noti.present();
      setTimeout(() => {
        if(noti.isOverlay){
          noti.dismiss();
        }
      }, 3000);
    }
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawPage');
  }

}
