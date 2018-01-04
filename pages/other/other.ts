import { ViewChild, Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, ModalController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
// storage
import { Storage } from '@ionic/storage';
// copy to clipboard
// import { Clipboard } from '@ionic-native/clipboard';

// Product page
import { ProductPage } from '../product/product';

import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
// customer service
import { CustomerService } from '../../services/customer.service';
// detail order modal
import { DetailOrderPage } from '../detail-order/detail-order';

/**
 * Generated class for the OtherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-other',
  templateUrl: 'other.html',
  providers: [ProductService]
})
export class OtherPage implements OnInit {
  // list sp da xem
  listSeenProducts: any = [];
  // list sp da xem
  listFavoriteProducts: any = [];
  products: Product[] = [];
  public productSelected;
  // product
  productsss: any;
  // mycode
  myCode;
  checkSeenPro: boolean = false;
  checkQr: boolean = false;
  checkFavoriteProduct: boolean = false;
  // value resultView = 1 => view seen Product
  // value resultView = 2 => view sp yeu thich
  // value resultView = 3 => view thông số sp
  // value resultView = 4 => view Mã giới thiệu cá nhân
  // value resultView = 5 => view chi tiết sp
  checkDetailProduct: boolean = false;
  checkThongSoProduct: boolean = false;
  detailProduct;
  thongSoProduct;
  resultView: number;
  // số coin
  coin: number = 0;
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
    this.resultView = this.navParams.get('check');
    this.myCode = this.navParams.get('code');
    // this.clipboard.paste().then(
    //  (resolve: string) => {
    //     alert(resolve);
    //   },
    //   (reject: string) => {
    //     alert('Error: ' + reject);
    //   }
    // );
    // view seen Product
    if(this.resultView == 1) {
      this.checkSeenPro = true;
      this.checkQr = false;
      this.checkFavoriteProduct = false;
      this.checkDetailProduct = false;
      this.checkThongSoProduct = false;
      // get seen product
      this.storage.get('seenProducts').then((data) => {
        this.listSeenProducts = data;
      });
    }
    // view sp yeu thich
    if(this.resultView == 2) {
      this.checkFavoriteProduct = true;
      this.checkSeenPro = false;
      this.checkQr = false;
      this.checkDetailProduct = false;
      this.checkThongSoProduct = false;
      // get seen product
      this.storage.get('listFavorite').then((data) => {
        this.listFavoriteProducts = data;
      });
    }
    // view chi tiết sp
    if(this.resultView == 3) {
      this.detailProduct = this.navParams.get('detailPro');
      this.checkDetailProduct = true;
      this.checkQr = false;
      this.checkSeenPro = false;
      this.checkFavoriteProduct = false;
      this.checkThongSoProduct = false;
    }
    // view Mã giới thiệu cá nhân
    if(this.resultView == 4) {
      this.checkQr = true;
      this.checkSeenPro = false;
      this.checkFavoriteProduct = false;
      this.checkDetailProduct = false;
      this.checkThongSoProduct = false;
    }
    // view thông số kỹ thuật sp
    if(this.resultView == 5) {
      this.thongSoProduct = this.navParams.get('thongSoPro');
      this.checkThongSoProduct = true;
      this.checkQr = false;
      this.checkSeenPro = false;
      this.checkFavoriteProduct = false;
      this.checkDetailProduct = false;
    }
  }
  // copy code to clipboard
  copyCode(){
    // copy ma gioi thieu to clipboard
    // this.clipboard.copy(this.myCode);
    console.log('sdhsd');
  }

  // view chi tiet khi click vào sp trong trang sp đã xem
  productTapped($event, product) {
    this.navCtrl.push(ProductPage, {
      product: product
      // product: this.products
    });
  }
  // view mã code cá nhân
  showYourCode(event, check: number, code) {
 	 this.navCtrl.push(OtherPage, {
 	 	check: check,
    code: code
 	 });
  }
  
  ionViewDidLoad() {
  }

}
