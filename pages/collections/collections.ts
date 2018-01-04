import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
// storage
import { Storage } from '@ionic/storage';
// import { CurrencyPipe } from '@angular/common';
// cart page
import { CartPage } from '../cart/cart';
// search page
import { SearchPage } from '../search/search';

// Product page
import { ProductPage } from '../product/product';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { DropdownHeaderPage } from '../dropdown-header/dropdown-header';
import { Globals } from '../../app/providers/globals';
import { IonicImageLoader, ImageLoader,ImgLoader, ImageLoaderConfig } from 'ionic-image-loader';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { HTTP, HTTPResponse } from '@ionic-native/http';

@Component({selector: 'page-collections',templateUrl: 'collections.html',providers:[ProductService]})
export class CollectionsPage {
  @ViewChild(Content) content: Content;
  // @ViewChild(Nav) nav: Nav;
  // loading first
  loadingFirst: boolean = false;
  // collection
  selectedCollection;
  selectedCollectionFirst;
  titleCollection;
  titleCollectionFirst;
  menuLv3;
  // product
  public productSelected;
  public product: number = 0;
  products: Product[] = [];
  sortSelected: boolean = false;
  // test infinite scroll
  items: any[] = [];
  page = 1;
  loading: boolean = true;
  totalPages = 1;
  // timeout or empty
  notiTimeout: boolean = false;
  typeUser;
  isAgencyRegular: boolean = false;
  selectedRadio: boolean = true;
  sortType: string = 'created-descending';
  sortLists:any[] = [
    "created-descending","price-descending","price-ascending","title-ascending","title-descending"
  ];
 
  public qtyItemCart: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public http: Http,
    public pservice: ProductService,
    public globals: Globals,
    public storage: Storage,
    public popoverCtrl: PopoverController,
    public httpNative: HTTP
    ) {
      // storage: lay so product dang co trong giỏ hàng
      this.storage.get('itemCarts').then((data) => {
        if (data == null) {
          this.qtyItemCart = 0;
        }else{
          this.qtyItemCart = data.length;
        }
        this.globals.setCartCounts(this.qtyItemCart);
        this.globals.cartCounts.subscribe(data => {
          this.qtyItemCart = data;
        });
      });
      this.storage.get('profile').then((profile) => {
        // console.log(profile);
      });
      // hien thi dai ly hoac ctv
      this.globals.typeUser.subscribe(data => {
        this.typeUser = data;
      });
      if(this.typeUser.indexOf('tổng đại lý') > -1){
        this.isAgencyRegular = true;
      }
       // get collection_id, collection_title, menu lv3
      this.selectedCollection = navParams.get('collectionID');
      this.titleCollection = navParams.get('collectionTitle');
      this.menuLv3 = navParams.get('menulv3');
      this.selectedCollectionFirst = navParams.get('collectionID');
      this.titleCollectionFirst = navParams.get('collectionTitle');

      this.getListProduct(this.selectedCollection, this.sortType);
      
      // set timeout or error 5 phút
      setTimeout(() => {
        if (this.loadingFirst == false) {
          this.notiTimeout = true;
        }
      }, 300000);
    }
  // dropdown menu
  dropdownPopover() { 
    let popover = this.popoverCtrl.create(DropdownHeaderPage,{
      estest: '11'
    },{
      cssClass: 'dropdown-header'
    });
    popover.present();
  }
  // đến trang giỏ hàng
  gotoCart() {
    this.navCtrl.push(CartPage);
  }
  // go to search page
  goSearch() {
    this.navCtrl.push(SearchPage);
  }
  getListProduct(selectCol, sortType){
    // get product by collection_handle
    this.pservice.getHandle(selectCol, 1, this.sortType).then((res) => {
      try {
        this.products = null;
        this.products = JSON.parse(res.data).products.map(this.toProduct);
        this.totalPages = JSON.parse(res.data).paginate.pages;
        this.loadingFirst = true;
      } catch (error) {
        console.log(error);
      }
      //  this.autoLoadMore(selectCol,sortType);
    },(err) => {
      console.log(err);
      this.notiTimeout = true;
    });
  }

  autoLoadMore(selectCol,sortType){
    if (this.page < this.totalPages) {
      if(this.page < 3){
        setTimeout(()=>{
          this.page++;
          console.log(this.page);
          this.pservice.getHandle(selectCol, this.page, sortType).then((res) => {
            this.products = this.products.concat(JSON.parse(res.data).products.map(this.toProduct));
            this.autoLoadMore(selectCol,sortType);
          });
        }, 500)
      }
    }
  }

  viewCollection(handle, title, sortType){
    this.selectedRadio = false;
    this.loadingFirst = false;
    this.items = [];
    this.page = 1;
    this.loading = true;
    this.selectedCollection = handle;
    this.titleCollection = title;
    this.content.scrollTo(0, 0, 700);
    this.getListProduct(handle, sortType);
  }
  // test infinite scroll
  doInfinite(infiniteScroll) {
    if (this.page < this.totalPages) {
      setTimeout(() => {
        this.loading = true;
        this.page++;
        this.pservice.getHandle(this.selectedCollection, this.page, this.sortType).then((res) => {
          this.products = this.products.concat(JSON.parse(res.data).products.map(this.toProduct));
        });
        infiniteScroll.complete();
      }, 1000);
    }else{
      this.loading = false;
      infiniteScroll.complete();
    }
  }

  // xem chi tiết sp
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
          if((this.productSelected.isWholeSale && !this.isAgencyRegular)){
            this.productSelected.price_format = '0₫';
            this.productSelected.compare_at_price = 0;
            this.productSelected.sale = '-0%';
          }
          data.push(this.productSelected);
          this.storage.set('seenProducts', data);
        }
      } else {
        let arrID = [];
        if((this.productSelected.isWholeSale && !this.isAgencyRegular)){
          this.productSelected.price_format = '0₫';
          this.productSelected.compare_at_price = 0;
          this.productSelected.sale = '-0%';
        }
        arrID.push(this.productSelected);
        this.storage.set('seenProducts', arrID);
      }
    });
    
    this.navCtrl.push(ProductPage, {
      product: product
      // product: this.products
    });
  } 
  onSelectChange(selectedValue: any) {
    if(selectedValue !== this.sortType){
      this.sortType = selectedValue;
      this.sortSelected = true;
      this.content.scrollTo(0, 0, 700);
      this.page = 1;
      this.loading = true;
      this.getListProduct(this.selectedCollection, selectedValue);
    }
  }
  openCollection(event, collectionID, collectionTitle) {
    this.navCtrl.push(CollectionsPage, {
      collectionID: collectionID,
      collectionTitle: collectionTitle
    });
  }

  // getHandle(handle: string, page: number, sortType: string): Promise<HTTPResponse> {
  //   let productCol$ = this.httpNative
  //   .get(`https://dogobtgroup.myharavan.com/collections/${handle}?page=${page}&sort_by=${sortType}&view=dogo.json`, {}, {"Content-Type": "application/json"});
  //   return productCol$;
  // }
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
    // console.log('parse product:   '+ JSON.stringify(Product) );
    // if (r.variants[0].compare_at_price > 0 && r.variants[0].price > 0 ) {
    //   Product.sale = Math.round((r.variants[0].compare_at_price - r.variants[0].price)/r.variants[0].compare_at_price*100) + "%"
    // }
    if(r.isWholeSale === 'true'){
      Product.isWholeSale = true;
    }
    return Product;
  }
  ionViewDidLoad() {
  }
}
