import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
// storage
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
// Product page
import { ProductPage } from '../product/product';
import { IonicImageLoader, ImageLoader,ImgLoader, ImageLoaderConfig } from 'ionic-image-loader';
import { Globals } from '../../app/providers/globals';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',providers:[ProductService]
})
export class SearchPage {
  searchQuery: string = '';
  // ket qua tim kiem tra ve
  mentionWords: string[];
  results: any[];
  loadingFirst: boolean = true;
  public productResult;
  // timeout or empty
  notiTimeout: boolean = false;
  typeUser;
  isAgencyRegular: boolean = false;
  page = 1;
  totalPages = 1;


  constructor(private keyboard: Keyboard, public pservice: ProductService,public alertCtrl: AlertController, public globals: Globals, public navCtrl: NavController, public navParams: NavParams,public storage: Storage,public http: Http) {
    // hien thi dai ly hoac ctv
    this.globals.typeUser.subscribe(data => {
      this.typeUser = data;
    });
    if(this.typeUser.indexOf('tổng đại lý') > -1){
      this.isAgencyRegular = true;
    }
  }
  // bo dau tieng viet
  eventHandler(keyCode, ev) {
    if (keyCode == 13) {
      this.keyboard.close();
      this.notiTimeout = false;
      this.loadingFirst = false;
      let val = ev.target.value;
      let newVal = encodeURIComponent(val);
      // get kết quả tìm kiếm
      this.pservice.gotoSearch(val, 1).then((results) => {
        this.results = null;
        console.log(results.data);
        this.results = JSON.parse(results.data).products.map(this.toProduct);
        this.totalPages = JSON.parse(results.data).paginate.pages;
        this.loadingFirst = true;
        this.autoLoadMore(val);
        console.log(this.notiTimeout + ' '+this.loadingFirst);
        if (this.totalPages == 0) {
          this.notiTimeout = true;
        }
      }).catch(err=>{
        this.notiTimeout = true;
        this.loadingFirst = true;
        console.log(this.notiTimeout + ' '+this.loadingFirst)
      });
      // set timeout or error 5 phút
      setTimeout(() => {
        if (this.loadingFirst == false) {
          this.loadingFirst = true;
        }
      }, 300000);
    }
  }

  autoLoadMore(value){
    if (this.page < this.totalPages) {
      if(this.page < 5){
        setTimeout(()=>{
          this.page++;
          console.log(this.page);
          this.pservice.gotoSearch(value, this.page).then((results) => {
            this.results = this.results.concat(JSON.parse(results.data).products.map(this.toProduct));
            this.autoLoadMore(value);
          });
        }, 500)
      }
    }
  }
  // click xem chi tiet sp
  productTapped($event, product) {
    console.log(product)
    var lengthPro = this.results.length;
    for (var i = 0; i <= lengthPro-1; i++) {
      if (this.results[i].handle == product) {
        break;
      }
    }
    // That's right, we're pushing to ourselves!
    this.productResult = this.results[i];
    // neu sp thuoc nhom ban buon
    if (this.productResult.isWholeSale) {
      // check typeuser
      var obs = this.globals.typeUser.subscribe(typeUser => {
        if(typeUser.toLowerCase().indexOf('tổng đại lý') > -1){
          this.navCtrl.push(ProductPage, {
            product: product
          });
        }else {
          let noti = this.alertCtrl.create({
            message: "Bạn không có quyền xem sản phẩm này!",
          });
          obs.unsubscribe();
          noti.present();
          setTimeout(() => {
            if(noti.isOverlay){
              noti.dismiss();
            }
          }, 3000);
        }
      });
    }else{
      // storage
      this.storage.get('seenProducts').then((data) => {
        if(data != null && data.length != 0) {
          let lengthArr: number;
          let checkDuplicate = 0;
          lengthArr = data.length;
          let compareID = this.productResult.id;
          for(var i = 0; i <= lengthArr-1; i++) {
            let checkID = data[i].id;
            if (checkID == compareID) {
              checkDuplicate++;
            }
          }
          if (checkDuplicate == 0) {
            if((this.productResult.isWholeSale && !this.isAgencyRegular)){
              this.productResult.price_format = '0₫';
              this.productResult.compare_at_price = 0;
              this.productResult.sale = '-0%';
            }
            data.push(this.productResult);
            this.storage.set('seenProducts', data);
          }
        } else {
          let arrID = [];
          if((this.productResult.isWholeSale && !this.isAgencyRegular)){
            this.productResult.price_format = '0₫';
            this.productResult.compare_at_price = 0;
            this.productResult.sale = '-0%';
          }
          arrID.push(this.productResult);
          this.storage.set('seenProducts', arrID);
        }
      });
      
      this.navCtrl.push(ProductPage, {
        product: product
        // product: this.products
      });
    }
    
  }
  toProduct(r:any): Product{
   
    let Product = <Product>({
      id: r.id,
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
    });
    console.log(' test -- ' + r.isWholeSale);
    if(r.isWholeSale == "true"){
      Product.isWholeSale = true;
    }
    // console.log('parse product:   '+ JSON.stringify(Product) );
    // if (r.variants[0].compare_at_price > 0 && r.variants[0].price > 0 ) {
    //   Product.sale = Math.round((r.variants[0].compare_at_price - r.variants[0].price)/r.variants[0].compare_at_price*100) + "%"
    // }
    return Product;
  }
  ionViewDidLoad() {
  }

}
