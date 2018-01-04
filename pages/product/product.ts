import { Globals } from './../../app/providers/globals';
import { Component, ViewChild } from '@angular/core';
import { ViewController, NavController,Content, NavParams, Platform, PopoverController, MenuController, Slides, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser'
import { Http } from '@angular/http';
// storage
import { Storage, IonicStorageModule } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// in app browser
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { CurrencyPipe } from '@angular/common';
// home page
import { HomePage } from '../home/home';
// collection page
import { CollectionsPage } from '../collections/collections';
// // view variant
import { ProductService } from '../../services/product.service';
import { ProductDetail, Product } from '../../interfaces/product';
// other page
import { OtherPage } from '../other/other';
// Notifications Model
import { NotificationsModel } from '../notifications/notifications';
import { SearchPage } from '../search/search';
// cart page
import { CartPage } from '../cart/cart';

//firebase login
import { AuthService } from '../../app/providers/auth.service';
// customer service
import { CustomerService } from '../../services/customer.service';
import { Profile, IApp } from '../../interfaces/profiles';
import { Observable } from 'rxjs/Observable';

@Component({selector: 'page-product',templateUrl: 'product.html', providers:[ProductService]})
export class ProductPage {
@ViewChild(Content) content: Content;
@ViewChild(Slides) slides: Slides;
// collection
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  // product
  productAsync: Observable<any>;
  public productId;
  productDetail: ProductDetail;
  public contentProduct;
  public video: SafeUrl;
  public loadingFirst: boolean = false;
  public isProductLoaded: boolean = false;
  products: Product[] = [];
  public productSelected;
  listSeenProducts: any = [];
  addFavor: boolean = false;
  public qtyItemCart: number = 0;
  // rut gon detail product
  showdes: boolean = true;
  // rut gon thong so product
  showdes1: boolean = true;
  // timeout or empty
  notiTimeout: boolean = false;
  // so thong bao
  public notiCounts: number = 0;
  // handle cua collection cung nha sx voi sp nay
  related_collection;
  typeUser = '';
  // checkWholeSale: boolean = false;
  isAgencyRegular: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public http: Http,
    private sanitized: DomSanitizer,
    public curency: CurrencyPipe,
    public pservice: ProductService,
    public storage: Storage,
    public toastCtrl: ToastController,
    public alerCtrl: AlertController,
    public globals: Globals,
    public authService: AuthService,
    ) {
      // storage noti
      this.globals.notiCounts.subscribe(data => {
        this.notiCounts = data;
      });
      // hien thi dai ly hoac ctv
      var obs = this.globals.typeUser.subscribe(data => {
        this.typeUser = data;
      });

      // this.storage.get('profile').then((profile) => {
      //   if(profile !== null){
      //     const _profile = new Profile(profile.app, profile.account);
      //     console.log(_profile);
      //     if(!_profile.isAppEmpty()){
      //       console.log('Home settings was loaded!');
      //     }
      //     if(!_profile.isAccountEmpty()){
      //       console.log('Account is already logged');
      //       _profile.init();
      //       this.typeUser = _profile.type.name;
      //       if(_profile.account.name == ""){
      //         this.globals.typeUser.subscribe(data => {
      //           this.typeUser = data;
      //         });
      //       }
      //     }
      //   }
      // });
      // storage product trong giỏ hàng
      this.storage.get('itemCarts').then((data) => {
        if (data == null) {
          this.qtyItemCart = 0;
        }else{
          this.qtyItemCart = data.length;
        }
        globals.setCartCounts(this.qtyItemCart);
        globals.cartCounts.subscribe(data => {
          this.qtyItemCart = data;
        });
      });
      // so thong bao
      this.productId = navParams.get('product');
      // thông tin chi tiết sp, sp cung nha san xuat, handle collection
      // this.productAsync = this.pservice.get(this.productId);
      this.pservice.get(this.productId).then((res) => {
        // chi tiet sp
        console.log(JSON.parse(res.data));
        this.productDetail = this.toProductDetail(JSON.parse(res.data));
        console.log(this.productDetail)
        // if(this.productDetail.isWholeSale === 'true'){
        //   this.checkWholeSale = true;
        // }
        if(this.typeUser.indexOf('tổng đại lý') > -1){
          this.isAgencyRegular = true;
        }
        console.log(this.typeUser);
        console.log(this.productDetail.isWholeSale);
        
        // this.checkWholeSale = product.isWholeSale.parseBoolean("true");
        // check sp có thuộc nhóm sp bán buôn?
        if (this.productDetail.isWholeSale) {
          // check có là đại lý?
          if (this.isAgencyRegular == false) {
            console.log(this.productDetail.price);
            // ko là đại lý thì ko hiện giá
            this.productDetail.price = '0₫';
            this.productDetail.compare_at_price = '0₫';
            this.productDetail.sale = '0%'; 
            obs.unsubscribe();
          }else{
            if(this.typeUser.toLowerCase().indexOf('đại lý bắc') > -1 && this.productDetail.related_handle == 'tong-dai-ly-mien-bac'){
              obs.unsubscribe();
            }else if(this.typeUser.toLowerCase().indexOf('đại lý nam') > -1 && this.productDetail.related_handle == 'tong-dai-ly-mien-nam'){
              obs.unsubscribe();
            } else {
              let noti = this.alerCtrl.create({
                message: "Bạn không có quyền xem sản phẩm này!",
              });
              obs.unsubscribe();
              noti.present();
              setTimeout(() => {
                if(noti.isOverlay){
                  noti.dismiss();
                }
              }, 3000);
              this.navCtrl.pop();
            }
          }
        }
        this.products = this.productDetail.related_products;
        this.loadingFirst = true;
        if (this.productDetail.video != "video giới thiệu") {
          this.video = this.sanitized.bypassSecurityTrustResourceUrl(this.productDetail.video);
        }
        // check xem da co trong danh sach yeu thich chua
        this.storage.get('listFavorite').then((data) => {
          if(data != null && data.length != 0) {
            if (this.loadingFirst == true) {
              let lengthFavo: number = data.length;
              let compareIDFavo = this.productDetail.id;
              for(var iFavo = 0; iFavo <= lengthFavo-1; iFavo++) {
                let checkID = data[iFavo].id;
                if (checkID == compareIDFavo) {
                  this.addFavor = true;
                  break;
                }
              }
            }
          }
        });
      },(err) => {
        this.notiTimeout = true;
      });
       // this.video = this.sanitized.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/SLfDIvmLehM');
      // this.pservice.getHandle('thoi-trang-nu', 1).subscribe((products) => {
      //   this.products = products;

      // });
      // get seen product
      this.storage.get('seenProducts').then((data) => {
        this.listSeenProducts = data;
      });

      // set timeout or error 5 phút
      setTimeout(() => {
        if (this.loadingFirst == false) {
          this.notiTimeout = true;
        }
      }, 300000);
    }
 
  // link logo ve trang chu
  goHome() {
    this.navCtrl.popToRoot();
  }
  // den trang gio hang
  gotoCart() {
    this.navCtrl.push(CartPage);
  }
  // hien thi thong bao
  showNoti(id) {
    let modal = this.modalCtrl.create(NotificationsModel, id);
    modal.present();
  }
  // an/hien rut gon detail product
  showMore() {
    // if (this.showdes == true) { 
    //   this.showdes = false;
    // } else {
    //   this.showdes = true;
    // }
    this.navCtrl.push(OtherPage,{
      check: 3,
      detailPro: this.productDetail.body_html
    });
  }
  // an/hien rut gon thong so product
  showMore1() {
    // if (this.showdes1 == true) { 
    //   this.showdes1 = false;
    // } else {
    //   this.showdes1 = true;
    // }
    this.navCtrl.push(OtherPage,{
      check: 5,
      thongSoPro: this.productDetail.thong_so
    });
  }
  // den trang tim kiem
  goSearch() {
    // this.clicked = !this.clicked;
    this.navCtrl.push(SearchPage);
  }
  // them vao list sp yeu thich
  addFavorite() {
    this.addFavor = !this.addFavor;
    // neu add vao favo = true
    if (this.addFavor == true) {
      // storage
      this.storage.get('listFavorite').then((data) => {
        if(data != null && data.length != 0) {
          console.log('func addfavor with not null');
          let lengthFavo: number = data.length;
          let favoDuplicate = 0;
          let compareIDFavo = this.productDetail.id;
          for(var i = 0; i <= lengthFavo-1; i++) {
            let checkID = data[i].id;
            if (checkID == compareIDFavo) {
              favoDuplicate++;
            }
          }
          if (favoDuplicate == 0) {
            data.push(this.productDetail);
            this.storage.set('listFavorite', data);
          }
        } else {
          console.log('func addfavor with null data');
          let arrFavo = [];
          arrFavo.push(this.productDetail);
          this.storage.set('listFavorite', arrFavo);
        }
      });
    }
    // neu add favo = false
    if (this.addFavor == false) {
      // storage
      this.storage.get('listFavorite').then((data) => {
        if(data != null && data.length != 0) {
          let lengthFavo: number = data.length;
          let favoDuplicate = 0;
          let compareIDFavo = this.productDetail.id;
          for(var i = 0; i <= lengthFavo-1; i++) {
            let checkID = data[i].id;
            if (checkID == compareIDFavo) {
              favoDuplicate++;
              console.log(i);
              data.splice(i, 1);
              console.log(data);
              // data.push(data);
              this.storage.set('listFavorite', data);
              break;
            }
          }
        }
      });
    }
  }
  presentVaraint(idProduct) {
    let popover = this.popoverCtrl.create(viewVariant, {
      inforProduct: this.productDetail
    }, {cssClass: 'variant-product'});
    popover.present();
  }
  // xem product co luu vao list da xem
  productTapped($event, product) {
    var lengthPro = this.products.length;
    for (var i = 0; i <= lengthPro-1; i++) {
      if (this.products[i].handle == product) {
        break;
      }
    }
    // That's right, we're pushing to ourselves!
    this.productSelected = this.products[i];
    // storage
    this.storage.get('seenProducts').then((data) => {
      if(data != null && data.length != 0) {
        let lengthArr: number;
        let checkDuplicate = 0;
        lengthArr = data.length;
        let compareID = this.productSelected.id;
        for(var i = 0; i <= lengthArr-1; i++) {
          let checkID = data[i].id;
          if (checkID == compareID) {
            checkDuplicate++;
          }
        }
        if (checkDuplicate == 0) {
          data.push(this.productSelected);
          this.storage.set('seenProducts', data);
        }
      } else {
        let arrID = [];
        arrID.push(this.productSelected);
        this.storage.set('seenProducts', arrID);
      }
    });
    
    this.navCtrl.push(ProductPage, {
      product: product
      // product: this.products
    });
  } 
  // xem sp da co trong list product da xem
  productTappedHasSeen($event, product) {
    this.navCtrl.push(ProductPage, {
      product: product
    });
  }
  // xem tất cả sp đã xem
  viewSeenProduct() {
    this.navCtrl.push(OtherPage, {
      check: 1
    });
  }
  // xem collection khác
  openCollection(event, collectionID, collectionTitle) {
    this.navCtrl.push(CollectionsPage, {
      collectionID: collectionID,
      collectionTitle: collectionTitle
    });
  }
  // go to hash tag
  scrollTo(element: string) {
    // set the scrollLeft to 0px, and scrollTop to 500px
    if (element == "overview") {
      this.slides.slideTo(0, 500);
    }
    if (element == "detail") {
      this.slides.slideTo(1, 500);
    }
    if (element == "video") {
      this.slides.slideTo(2, 500);
    }
    let yOffset = document.getElementById(element).offsetTop - 50;
    this.content.scrollTo(0, yOffset, 500);
  }
  toProductDetail(r:any): ProductDetail{
    let ProductDetail = <ProductDetail>({
      id: r.product.id,
      handle: r.product.handle,
      title: r.product.title,
      body_html: r.product.body_html,
      thong_so: r.product.thong_so,
      video: r.product.video,
      product_type: r.product.product_type,
      original_price: r.product.original_price,
      compare_at_price: r.product.compare_at_price,
      price: r.product.price,
      sale: r.product.sale,
      // // lợi nhuận
      // profit: r.product.price - r.product.original_price,
      // // thưởng nhị cấp
      // reward_points_1: 0.05 * (r.product.price - r.product.original_price),
      // // thưởng tích lũy doanh số
      // reward_points_2: 0.03 * (r.product.price - r.product.original_price),
      // // quỹ từ thiện
      // charity_fund: 0.03 * (r.product.price - r.product.original_price),
      vendor: r.product.vendor,
      tags: r.product.tags,
      images: r.product.images,
      variants: r.product.variants,
      related_products: r.related_products,
      related_handle: r.related_handle,
      related_title:r.related_title,
      isWholeSale: false
    });
    // if (r.variants[0].compare_at_price > 0 && r.variants[0].price > 0 ) {
    //   Product.sale = Math.round((r.variants[0].compare_at_price - r.variants[0].price)/r.variants[0].compare_at_price*100) + "%"
    // }
    // if (r.body_html != null && r.body_html.split('####').length > 1) {
    //   Product.description = r.body_html.split('####')[0];
    //   Product.video = r.body_html.split('####')[1].replace(/<[^>]+>/gm,'');
    // }
    if (r.product.video == null || r.product.video == '' || r.product.video == 'null') {
      ProductDetail.video = 'video giới thiệu';
    }
    if (r.product.body_html == null || r.product.body_html == '' || r.product.body_html == 'null' || r.product.body_html.error == "json not allowed for this object") {
      ProductDetail.body_html = 'Chưa có chi tiết sản phẩm';
    }
    if (r.product.thong_so == null || r.product.thong_so == '' || r.product.thong_so == 'null' || r.product.thong_so.error == "json not allowed for this object") {
      ProductDetail.thong_so = 'Chưa có thông số sản phẩm';
    }
    if(r.isWholeSale === 'true'){
      ProductDetail.isWholeSale = true;
    }
    console.log('Parsed Product:', ProductDetail);
    return ProductDetail;
  }
  ionViewDidLoad() {
  }
}


@Component({selector: 'viewVariant',templateUrl: 'variant-selected.html', providers:[ProductService, ThemeableBrowser]})
export class viewVariant {
  num: number = 1;
  selectedProduct: any;
  variantPrice: string;
  variantComparePrice: string;
  variantQuantity: number;
  variantImage;
  imagesID: any[];
  indexVariant: number = 0;
  private cartCount: BehaviorSubject<number>;
  public lineItem = {
    "id": 0,
    "title": "",
    "handle": "",
    "original_price": 0,
    "quantity": 1,
    "images": null,
    "variant": null,
  };
  infoAccount;
  address;
  typeUser;
  public qtyItemCart: number = 0;
  checkWholeSale: boolean = false;
  isAgencyRegular: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public curency: CurrencyPipe,
    public pservice: ProductService,
    public storage: Storage,
    public toastCtrl: ToastController,
    public alerCtrl: AlertController,
    public viewCtrl: ViewController,
    public authService: AuthService,
    public modalCtrl: ModalController,
    public cusService: CustomerService,
    public loadingCtrl: LoadingController,
    public iab: InAppBrowser,
    public tb: ThemeableBrowser,
    public globals: Globals,
    ) {
    this.selectedProduct = navParams.get('inforProduct');
    // hien thi dai ly hoac ctv
    this.globals.typeUser.subscribe(data => {
      this.typeUser = data;
    });
    if(this.typeUser.indexOf('tổng đại lý') > -1){
      this.isAgencyRegular = true;
    }
    // if(this.selectedProduct.isWholeSale === 'true'){
    //   this.checkWholeSale = true;
    // }
    
    // hiển thị bthg với sp ko thuộc nhóm bán buôn
    this.variantPrice = this.selectedProduct.variants[0].price_format;
    this.variantComparePrice = this.selectedProduct.variants[0].compare_at_price_format;
    this.variantQuantity = this.selectedProduct.variants[0].inventory_quantity;
    if (this.selectedProduct.variants[0].image != '' && this.selectedProduct.variants[0].image != null && this.selectedProduct.variants[0].image != 'http:') {
      this.variantImage = this.selectedProduct.variants[0].image;
    }else{
      this.variantImage = this.selectedProduct.images[0];
    }
  }
  doMinus(){
    if (this.num > 1) {
      this.num = this.num - 1;
      return this.num;
    }
  }
  doPlus(){
    if (this.num < this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
      this.num = this.num + 1;
      return this.num;
    }else{
      this.num = this.selectedProduct.variants[this.indexVariant].inventory_quantity;
      let alert = this.alerCtrl.create({
        message: 'Số sản phẩm trong kho không đủ!',
      });
      alert.present();
      return this.num;
    }
  }
  changeNum(qtynum) {
    if (qtynum <= this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
      this.num = parseInt(qtynum);
      return this.num;
    }else{
      this.num = this.selectedProduct.variants[this.indexVariant].inventory_quantity;
      let alert = this.alerCtrl.create({
        message: 'Số sản phẩm trong kho không đủ!',
      });
      alert.present();
      return this.num;
    }
  }
  changeVariant(num) {
    this.indexVariant = num;
    this.variantPrice = this.selectedProduct.variants[num].price_format;
    this.variantComparePrice = this.selectedProduct.variants[num].compare_at_price_format;
    this.variantQuantity = this.selectedProduct.variants[num].inventory_quantity;
    // lay image:
    if (this.selectedProduct.variants[num].image != '' && this.selectedProduct.variants[num].image != null && this.selectedProduct.variants[num].image != 'http:') {
      this.variantImage = this.selectedProduct.variants[num].image;
    }else{
      this.variantImage = this.selectedProduct.images[0];
    }
  }
  // noti đã thêm sp
  notiAdd(qty) {
    let alert = this.alerCtrl.create({
      message: 'Đã thêm '+qty+' sản phẩm vào giỏ hàng!',
    });
    alert.present();
    if (alert.present()) {
      setTimeout(() => {
        alert.dismiss();
      }, 2000);
    }
  }
  // them vao gio
  addCart(qty) {
    // TH them moi: kiem tra so luong sp co du trong kho ko
    if (qty <= this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
      this.storage.get('itemCarts').then((data) => {
        if(data != null && data.length != 0) {
          let lengthArr: number;
          let checkDuplicate = 0;
          lengthArr = data.length;
          let compareID = this.selectedProduct.variants[this.indexVariant].id;
          // kiem tra variant đâ có trong giỏ chưa
          for(var i = 0; i <= lengthArr-1; i++) {
            let checkID = data[i].variant.id;
            if (checkID == compareID) {
              checkDuplicate++;
            }
          }
          // variant chưa có trong giỏ thì thêm mới
          if (checkDuplicate == 0) {
            this.lineItem.id = this.selectedProduct.id;
            this.lineItem.title = this.selectedProduct.title;
            this.lineItem.original_price = this.selectedProduct.original_price;
            this.lineItem.handle = this.selectedProduct.handle;
            this.lineItem.quantity = qty;
            // gia tri cua image_id trong variant
            if(this.selectedProduct.variants[this.indexVariant].image != null && this.selectedProduct.variants[this.indexVariant].image != '' && this.selectedProduct.variants[this.indexVariant].image != 'http:') {
              console.log('1:  '+ this.selectedProduct.variants[this.indexVariant].image)
              this.lineItem.images = this.selectedProduct.variants[this.indexVariant].image;
            }else{
              this.lineItem.images = this.selectedProduct.images[0];
            }
            this.lineItem.variant = this.selectedProduct.variants[this.indexVariant];
            data.push(this.lineItem);
            this.storage.set('itemCarts', data);
            console.log('da add sp 1 variant ko trung');
            this.viewCtrl.dismiss();
            this.notiAdd(qty);
            this.globals.setCartCounts(lengthArr + 1);
          }
          // variant có trong giỏ thì tăng số lượng thêm
          if (checkDuplicate > 0) {
            let compareID2 = this.selectedProduct.variants[this.indexVariant].id;
            for(var j = 0; j <= lengthArr-1; j++) {
              let checkID = data[j].variant.id;
              if (checkID == compareID2) {
                break;
              }
            }
            let oldItem = data[j];
            let newQty: number = parseInt(oldItem.quantity) + parseInt(qty);
            // kiem tra so luong sp sau khi tang co du trong kho ko
            if (newQty <= this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
              oldItem.quantity = newQty;
              this.storage.set('itemCarts', data);
              console.log('tang so luong san pham them 1');
              this.viewCtrl.dismiss();
              this.notiAdd(qty);
            }else{
              let alert = this.alerCtrl.create({
                message: 'Số sản phẩm trong kho không đủ!',
              });
              alert.present();
            }
          }
        } else {
          // this.qtyItemCart = 1;
          this.pservice.countItem = 1;
          console.log('so item trong cart 2   : ' + this.pservice.countItem);
          let arrLineItem = [];
          this.lineItem.id = this.selectedProduct.id;
          this.lineItem.title = this.selectedProduct.title;
          this.lineItem.original_price = this.selectedProduct.original_price;
          this.lineItem.handle = this.selectedProduct.handle;
          this.lineItem.quantity = qty;
          // gia tri cua image_id trong variant
          if(this.selectedProduct.variants[this.indexVariant].image != null && this.selectedProduct.variants[this.indexVariant].image != '' && this.selectedProduct.variants[this.indexVariant].image != 'http:') {
            console.log('2:  '+ this.selectedProduct.variants[this.indexVariant].image)
            this.lineItem.images = this.selectedProduct.variants[this.indexVariant].image;
          }else{
            this.lineItem.images = this.selectedProduct.images[0];
          }
          this.lineItem.variant = this.selectedProduct.variants[this.indexVariant];
          arrLineItem.push(this.lineItem);
          this.storage.set('itemCarts', arrLineItem);
          this.viewCtrl.dismiss();
          this.notiAdd(qty);
          this.globals.setCartCounts(1);
        }
      });
    }else{
      let alert = this.alerCtrl.create({
        message: 'Số sản phẩm trong kho không đủ!',
      });
      alert.present();
    }
  }
  // den trang gio hang
  gotoCart(qty) {
    if (qty <= this.selectedProduct.variants[this.indexVariant].inventory_quantity) {
      this.addCart(qty);
      this.viewCtrl.dismiss();
      setTimeout(() => {
        this.navCtrl.push(CartPage);
      }, 1000);
    }else{
      let alert = this.alerCtrl.create({
        message: 'Số sản phẩm trong kho không đủ!',
      });
      alert.present();
    }
  }

}


