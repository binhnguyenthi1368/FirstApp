import { NotificationsService } from './../../services/notifications.service';
import { Globals } from './../../app/providers/globals';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
// storage
import { Storage } from '@ionic/storage';
// in app browser
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
// customer service
import { CustomerService } from '../../services/customer.service';
// Product page
import { ProductPage } from '../product/product';
//firebase login
import { Profile, IApp } from '../../interfaces/profiles';

import { AuthService } from '../../app/providers/auth.service';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage implements OnInit {
  // list sp trong giỏ
  itemCarts: any = [];
  // lưu danh sách index của sp không tích chọn checked checkbox
  listUnChecked: any = [];
  // tổng tiền
  total: number = 0;
  profit: number = 0;
  // % tich luy
  tich_luy: number = 0;
  // thưởng tích lũy doanh số
  reward_points_2: number = 0;
  // % nhi cap
  thuong_nhi_cap: number = 0;
  // thưởng nhị cấp
  reward_points_1: number = 0;
  // % quy tu thien
  quy_tu_thien: number = 0;
  // quỹ từ thiện
  charity_fund: number = 0;
  public qtyItemCart: number = 0;
  // checkbox/reset all
  checkbox: boolean = true;
  isSelectedAll: boolean = true;
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
  infoAccount;
  // btn checkout clicked
  clicked: boolean = false;
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
        staticText: 'Thanh toán đơn hàng'
    },
    closeButton:{
      wwwImage: 'assets/icon/back.png',
      align: 'left',
      event: 'closePressed'
    },
    // clearcache: true,
    // clearsessioncache: true,
    backButtonCanClose: true
  };
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public storage: Storage,
  	public cusService: CustomerService,
  	public alertCtrl: AlertController,
  	public loadingCtrl: LoadingController,
    public tb: ThemeableBrowser,
    public globals: Globals,
    public authService: AuthService,
    public viewCtrl: ViewController,
    public notiService: NotificationsService
  	) {
  }
  ngOnInit() {
    this.storage.get('profile').then(profile=>{
      console.log(profile);
      if(profile !== null){
        const _profile = new Profile(profile.app, profile.account);
        console.log(_profile);
        if(!_profile.isAppEmpty()){
          console.log('Home settings was loaded!');
          this.quy_tu_thien = _profile.app.percent.quy_tu_thien/100;
          this.thuong_nhi_cap = _profile.app.percent.thuong_nhi_cap/100;
        }
        if(!_profile.isAccountEmpty()){
          console.log('Account is already logged');
          _profile.init();
          this.tich_luy = _profile.type.percent/100;
        }
      }
      this.storage.get('itemCarts').then((data) => {
        this.itemCarts = data;
        this.itemCarts.forEach(item => {
          //thêm biến kiểm tra xem item đã được chọn hay chưa
          item.selected = true;
        });
        this.totalCash(this.itemCarts);
      });
    });
    // this.globals.typeUser.subscribe(data => {
    //   if (data != null && data != undefined && data != '') {
    //     if (data.indexOf('đại lý') > -1) {
    //       if (data == 'tổng đại lý Bắc') {
    //         // lay chiet khau dai ly bac neu là đại lý Bắc
    //         this.storage.get('dai_ly_bac').then((dai_ly_bac) => {
    //           this.tich_luy = dai_ly_bac;
    //         });
    //       }else{
    //         if (data == 'tổng đại lý Nam') {
    //           console.log('type user1:  '+data);
    //           // lay chiet khau dai ly bac neu là đại lý Nam
    //           this.storage.get('dai_ly_nam').then((dai_ly_nam) => {
    //             this.tich_luy = dai_ly_nam;
    //           console.log('type user1:  '+dai_ly_nam);
    //           });
    //         }else{
    //           console.log('type user2:  '+data);
    //           // lay tich luy neu la dai ly
    //           this.storage.get('dai_ly').then((dai_ly) => {
    //             this.tich_luy = dai_ly;
    //           });
    //         }
    //       }
    //     }else{
    //       // lay tich luy neu la ctv
    //       this.storage.get('tich_luy').then((tich_luy) => {
    //         this.tich_luy = tich_luy;
    //       });
    //     }
    //     // lay thuong nhi cap
    //     this.storage.get('thuong_nhi_cap').then((data) => {
    //       this.thuong_nhi_cap = data;
    //     });
    //     // lay quy tich luy
    //     this.storage.get('quy_tu_thien').then((data) => {
    //       this.quy_tu_thien = data;
    //     });
    //   }else{
    //     this.tich_luy = 0.;
    //     this.thuong_nhi_cap = 0;
    //     this.quy_tu_thien = 0;
    //   }
    //   // storage product trong giỏ hàng
    //   this.storage.get('itemCarts').then((data) => {
    //     this.itemCarts = data;
    //     this.notiService.notiCartNotCheckout(true);
    //     this.totalCash();
    //   });
    // });
  }

  // tinh tong tien
  totalCash(line_items){
    this.itemCarts = line_items;
    if (this.itemCarts != null && this.itemCarts.length > 0) {
      // so item trong cart - 1
      let countItemLine = this.itemCarts.length - 1;
      // loai tru cac sp co index nam trong listUnChecked
      if (this.listUnChecked.length > 0) {
        // tổng tiền
        this.total = 0;
        // loi nhuan
        this.profit = 0;
        // thưởng nhị cấp
        this.reward_points_1 = 0;
        // thưởng tích lũy doanh số
        this.reward_points_2 = 0;
        // quỹ từ thiện
        this.charity_fund = 0;
        let check: number = 0;
        // vong lap de tinh tong tien
        for (let indexItem1 = 0; indexItem1 <= countItemLine; indexItem1++) {
          if(this.itemCarts[indexItem1].selected){
            check = 0;
            for (let ichecked = 0; ichecked <= this.listUnChecked.length - 1; ichecked++) {
              if(this.itemCarts[indexItem1].variant.id == this.listUnChecked[ichecked]){
                check++;
              }
              console.log(this.listUnChecked[ichecked]);
            }
            if (check == 0) {
              this.total = this.total + this.itemCarts[indexItem1].quantity * this.itemCarts[indexItem1].variant.price;
              if (parseInt(this.itemCarts[indexItem1].original_price) > parseInt(this.itemCarts[indexItem1].variant.price)) {
                this.itemCarts[indexItem1].original_price = this.itemCarts[indexItem1].variant.price;
              }
              this.profit = this.profit+this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
              this.reward_points_1 = this.reward_points_1 + this.thuong_nhi_cap * this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
              this.reward_points_2 = this.reward_points_2 + this.tich_luy * this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
              this.charity_fund = this.charity_fund + this.quy_tu_thien * this.itemCarts[indexItem1].quantity * (this.itemCarts[indexItem1].variant.price - this.itemCarts[indexItem1].original_price);
            }
          }
        }
      } else {
        // tổng tiền
        this.total = 0;
        // loi nhuan
        this.profit = 0;
        // thưởng nhị cấp
        this.reward_points_1 = 0;
        // thưởng tích lũy doanh số
        this.reward_points_2 = 0;
        // quỹ từ thiện
        this.charity_fund = 0;
        for (let indexItem2 = 0; indexItem2 <= countItemLine; indexItem2++) {
          if(this.itemCarts[indexItem2].selected){
          this.total = this.total + this.itemCarts[indexItem2].quantity * this.itemCarts[indexItem2].variant.price;
          if (parseInt(this.itemCarts[indexItem2].original_price) > parseInt(this.itemCarts[indexItem2].variant.price)) {
            this.itemCarts[indexItem2].original_price = this.itemCarts[indexItem2].variant.price;
          }
          this.profit = this.profit+this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
          this.reward_points_1 = this.reward_points_1 + this.thuong_nhi_cap * this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
          this.reward_points_2 = this.reward_points_2 + this.tich_luy * this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
          this.charity_fund = this.charity_fund + this.quy_tu_thien * this.itemCarts[indexItem2].quantity * (this.itemCarts[indexItem2].variant.price - this.itemCarts[indexItem2].original_price);
        }
      }
      
      }
    }else{
      this.total = 0;
      this.reward_points_2 = 0;
    }
  }
  // view chi tiet khi click vào sp trong trang sp đã xem
  productTapped($event, product) {
    this.navCtrl.push(ProductPage, {
      product: product
      // product: this.products
    });
  }
  // giảm số lượng sản phẩm đi 1
  doMinus(qty, i, check){
    // giảm khi số lượng sp > 1
    if (qty > 1) {
      qty--;
      // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
      this.itemCarts[i].quantity = qty;
      this.storage.get('itemCarts').then((data) => {
        // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
        data[i].quantity = qty;
        this.storage.set('itemCarts', data);
        console.log('tang so luong san pham them 1');
      });
      if(check == true) {
        // tinh lai tong tien
        this.totalCash(this.itemCarts);
      }
    } else {
      // số lg sp < 1 thì gọi func xóa sp khỏi giỏ hàng
      this.removeItem(i);
    }
  }
  // tăng số lượng sản phẩm lên 1
  doPlus(qty, i, check){
    if (qty < this.itemCarts[i].variant.inventory_quantity) {
      qty++;
      this.itemCarts[i].quantity = qty;
      this.storage.get('itemCarts').then((data) => {
        // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
        data[i].quantity = qty;
        this.storage.set('itemCarts', data);
        console.log('tang so luong san pham them 1');
      });
      if(check == true) {
        // tinh lai tong tien
        this.totalCash(this.itemCarts);
      }
    }else{
      this.itemCarts[i].quantity = this.itemCarts[i].variant.inventory_quantity;
      this.storage.get('itemCarts').then((data) => {
        // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
        data[i].quantity = this.itemCarts[i].variant.inventory_quantity;
        this.storage.set('itemCarts', data);
        console.log('tang so luong san pham them 1');
      });
      if(check == true) {
        // tinh lai tong tien
        this.totalCash(this.itemCarts);
      }
      let alert = this.alertCtrl.create({
        message: 'Số sản phẩm trong kho không đủ!',
      });
      alert.present();
      setTimeout(() => {
        if(alert.isOverlay){
          alert.dismiss();
        }
      }, 3000);
    }
  }
  // thay doi so luong sp theo giá trị nhập vào thẻ input
  changeNum(qty, i, check) {
    if (qty <= this.itemCarts[i].variant.inventory_quantity) {
      // setTimeout(() => {
          this.itemCarts[i].quantity = parseInt(qty);
          this.storage.get('itemCarts').then((data) => {
            // setTimeout(() => {
            // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
            // set timeout de ko gap loi ko xac dinh
              data[i].quantity = qty;
              if (qty == 0 || qty == undefined) {
                data[i].quantity = 1;
              }
              this.storage.set('itemCarts', data);
            // }, 3000);
            console.log('thay doi so luong san pham');
          });
          if(check == true) {
            // tinh lai tong tien
            // setTimeout(() => {
              this.totalCash(this.itemCarts);
            // }, 2000);
          }
      // }, 3000);
    }else{
      this.itemCarts[i].quantity = parseInt(this.itemCarts[i].variant.inventory_quantity);
      this.storage.get('itemCarts').then((data) => {
        // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
        // set timeout de ko gap loi ko xac dinh
        data[i].quantity = this.itemCarts[i].variant.inventory_quantity;
        if (qty == 0 || qty == undefined) {
          data[i].quantity = 1;
        }
        this.storage.set('itemCarts', data);
        console.log('thay doi so luong san pham');
      });
      if(check == true) {
        // tinh lai tong tien
        this.totalCash(this.itemCarts);
      }
      let alert = this.alertCtrl.create({
        message: 'Số sản phẩm trong kho không đủ!',
      });
      alert.present();
      setTimeout(() => {
        if(alert.isOverlay){
          alert.dismiss();
        }
      }, 3000);
    }
  }
  // xóa từng sp trong gio hang
  removeItem(i) {
    let confirm = this.alertCtrl.create({
        // title: 'XÓA SẢN PHẨM',
        message: 'Xóa sản phẩm này khỏi giỏ hàng?',
        buttons: [
          {
            text: 'Không',
            handler: () => {
              console.log('Không');
            }
          },
          {
            text: 'Xóa',
            handler: () => {
              for (let uncheck = 0; uncheck <= this.listUnChecked.length - 1; uncheck++) {
                if (this.listUnChecked[uncheck] == i) {
                  this.listUnChecked.splice(uncheck, 1);
                  break;
                }
              }
              this.storage.get('itemCarts').then((data) => {
                // thay đổi số lượng sp vị trí thứ i của list sp trong giỏ
                this.itemCarts.splice(i,1);
                this.storage.set('itemCarts', this.itemCarts);
                this.totalCash(this.itemCarts);
                this.globals.setCartCounts(data.length - 1);
              });
            }
          }
        ]
      });
    confirm.present();
  }
  // xóa tất cả sp trong giỏ
  removeAll(){
  	let confirm = this.alertCtrl.create({
        // title: 'XÓA SẢN PHẨM',
        message: 'Xóa sản phẩm này khỏi giỏ hàng?',
        buttons: [
          {
            text: 'Không',
            handler: () => {
              console.log('Không');
            }
          },
          {
            text: 'Xóa',
            handler: () => {
              this.clearCart()
            }
          }
        ]
      });
    confirm.present();
  }

  clearCart(){
    console.log("clearcart")
    this.storage.get('itemCarts').then((data) => {
      this.itemCarts = [];
      this.storage.set('itemCarts', this.itemCarts);
      // this.storage.remove('itemCarts');
      this.totalCash(this.itemCarts);
      this.globals.setCartCounts(0);
    });
    this.notiService.notiCartNotCheckout(false);
  }
  // checked/unchecked khi click btn chọn tất cả
  selectAllItems(isSelectedAll) {
    isSelectedAll = isSelectedAll;
    if(isSelectedAll){
      this.itemCarts.forEach(item => {
        item.selected = true;
      });
    }else{
      this.itemCarts.forEach(item => {
        item.selected = false;
      });
    }
    this.totalCash(this.itemCarts);
    // this.isSelectedAll = !this.isSelectedAll;
    // if (this.checkbox == true && this.isSelectedAll == true) {
    //   setTimeout(() => {
    //     this.checkbox = true;
    //   }, 0);
    //   this.checkbox = false;
    //   this.isSelectedAll = true;

    // }else{
    //   this.checkbox = this.checkall;
    // }
    // if(this.checkall == true){
    //   this.listUnChecked = [];
    //   this.totalCash();
    // }else{
    //   this.total = 0;
    //   this.reward_points_2 = 0;
    // }
  }
  // unchecked cho btn chọn tất cả khi click checkbox của bất kỳ item nào
  selectItem(index:number, selected: boolean) {
    selected = !selected;
    console.log(this.itemCarts);
    if(selected == false){
      this.isSelectedAll = false;
      // this.itemCarts[index].selected = false;
    }else{
      // this.itemCarts[index].selected = true;
      this.isSelectedAll = true;
      for (let i = 0; i <= this.itemCarts.length - 1; i++) {
        if(index !== i){
          if (this.itemCarts[i].selected == false) {
            this.isSelectedAll = false;
            break;
          }
        }
      }
    }
    setTimeout(()=>{
      this.totalCash(this.itemCarts);
    }, 300)
  }
  checkOut() {
    this.clicked = true;
    // info account
    this.storage.get('infoAccount').then((data) => {
      // neu dang nhap roi thi co thong tin nguoi dung
      if (data != null && data != '') {
        // lay thong tin nguoi dung
        this.cusService.get(data).subscribe((customer) => {
          this.infoAccount = customer;
          // lay itemcarts storage
          this.storage.get('itemCarts').then((data) => {
            if(data != null && data.length != 0) {
              let lengthArr: number;
              // let checkDuplicate = 0;
              lengthArr = data.length;
              // ds bỏ chọn có bản ghi nào ko
              if (this.listUnChecked.length > 0) {
                let check: number = 0;
                let lengthUncheck = this.listUnChecked.length;
                // tất cả sp trong itemcarts
                for(let iItem = 0; iItem <= lengthArr-1; iItem++) {
                // kiem tra xem sp co trong ds bỏ chọn ko
                console.log('this.listUnChecked  '+ JSON.stringify(this.listUnChecked));
                  for (let unchecki = 0; unchecki <= lengthUncheck - 1; unchecki++) {
                    if (data[iItem].variant.id !== this.listUnChecked[unchecki]) {
                      let item = {"variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity};
                      // push từng sp trong cart
                      this.data_post_structor.line_items.push(item);
                    }
                  }
                }
              }else{
                // tất cả sp trong itemcarts
                for(let iItem = 0; iItem <= lengthArr-1; iItem++) {
                  let item = {"variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity};
                  // push từng sp trong cart
                  this.data_post_structor.line_items.push(item);
                }
              }

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
              this.data_post_structor.ln = this.profit;
              // thuong nhi cap
              this.data_post_structor.tnc = Math.round(this.reward_points_1);
              // thuong tich luy
              this.data_post_structor.tldt = Math.round(this.reward_points_2);
              // quy tu thien
              this.data_post_structor.qtt = Math.round(this.charity_fund);
              // json và encode
              let data_post_encode = encodeURIComponent(JSON.stringify(this.data_post_structor));
              //tao url
              let url = "https://dogobtgroup.myharavan.com/cart?data="+data_post_encode+"&view=dogo&themeid=1000281853"
                // let url = "https://dogobtgroup.myharavan.com/cart?line_items=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%2C%22full_name%22%3A%22pham%20the%20loi%22%2C%22email%22%3A%22phamtheloi%40gmail.com%22%2C%22phone%22%3A982839923%2C%22address%22%3A%22test%201%22%7D&view=dogo&themeid=1000281853";
                // let url = "https://dogobtgroup.myharavan.com/cart?test=%7B%22line_items%22%3A%5B%7B%22variant_id%22%3A1019715605%2C%22quanlity%22%3A12%7D%2C%7B%22variant_id%22%3A1019715476%2C%22quanlity%22%3A1%7D%5D%7D&view=dogo&themeid=1000281853";
              let brower = this.tb.create(url,'_blank', this.options2);
             
              brower.on("loadstop").subscribe(error =>{
                brower.insertCss({
                  "code": "body{background-color: red;}"
                })
              })
             brower.on("ThemeableBrowserError").subscribe(error =>{
                console.log(error);
                this.clicked = false;
                brower.close();
              });
            //  brower.on("backToCart").subscribe(data =>{
            //    console.log("test :  " + data.url.indexOf('thank_you'))
            //    if(data.url.indexOf('thank_you') !== -1){
            //     this.clearCart()
            //     brower.close();
            //    }else{
            //     brower.close();
            //     this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
            //       let index = this.viewCtrl.index;
            //       this.navCtrl.remove(index);
            //     })
            //    }
            //    this.clicked = false;
            //   });
              brower.on("closePressed").subscribe(data =>{
                console.log("test2 :  " + data.url.indexOf('thank_you'))
                if(data.url.indexOf('thank_you') !== -1){
                  this.clearCart();
                  brower.close();
                }else{
                  brower.close();
                  this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
                    let index = this.viewCtrl.index;
                    this.navCtrl.remove(index);
                  })
                }
                this.clicked = false;
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
               this.clicked = false;
              });
             brower.on("unexpected").subscribe(error =>{
                console.log(error);
               brower.close();
               this.clicked = false;
              });
             brower.on("undefined").subscribe(error =>{
                console.log(error);
               brower.close();
               this.clicked = false;
              });
             brower.on("ThemeableBrowserWarning").subscribe(error =>{
                console.log(error);
                this.clicked = false;
              });
             brower.on("critical").subscribe(error =>{
                console.log(error);
                this.clicked = false;
              });
            } 
          });
        });
      }else {
        // lay itemcarts storage
        this.storage.get('itemCarts').then((data) => {
          if(data != null && data.length != 0) {
            let lengthArr: number;
            // let checkDuplicate = 0;
            lengthArr = data.length;
            // ds bỏ chọn có bản ghi nào ko
            if (this.listUnChecked.length > 0) {
              let check: number = 0;
              let lengthUncheck = this.listUnChecked.length;
              // tất cả sp trong itemcarts
              for(let iItem = 0; iItem <= lengthArr-1; iItem++) {
              // kiem tra xem sp co trong ds bỏ chọn ko
                for (let unchecki = 0; unchecki <= lengthUncheck - 1; unchecki++) {
                  if (data[iItem].variant.id !== this.listUnChecked[unchecki]) {
                    let item = {"variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity};
                    // push từng sp trong cart
                    this.data_post_structor.line_items.push(item);
                  }
                }
              }
            }else{
              // tất cả sp trong itemcarts
              for(let iItem = 0; iItem <= lengthArr-1; iItem++) {
                let item = {"variant_id": data[iItem].variant.id, "quantity": data[iItem].quantity};
                // push từng sp trong cart
                this.data_post_structor.line_items.push(item);
              }
            }
            // loi nhuan
            this.data_post_structor.ln = this.profit;
            // thuong nhi cap
            this.data_post_structor.tnc = this.reward_points_1;
            // thuong tich luy
            this.data_post_structor.tldt = this.reward_points_2;
            // quy tu thien
            this.data_post_structor.qtt = this.charity_fund;
            let data_post_encode = encodeURIComponent(JSON.stringify(this.data_post_structor));
            //tao url
            let url = "https://dogobtgroup.myharavan.com/cart?data="+data_post_encode+"&view=dogo&themeid=-1"
            let brower = this.tb.create(url,'_blank', this.options2);
            brower.on("ThemeableBrowserError").subscribe(error =>{
              console.log(error);
              brower.close();
              this.clicked = false;
            });
            // brower.on("backToCart").subscribe(data =>{
            //   console.log("test2 :  " + data.url.indexOf('thank_you'))
            //   if(data.url.indexOf('thank_you') !== -1){
            //     this.clearCart();
            //     brower.close();
            //   }else{
            //     brower.close();
            //     this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
            //       let index = this.viewCtrl.index;
            //       this.navCtrl.remove(index);
            //     })
            //   }
            //   this.clicked = false;
            // });
            brower.on("closePressed").subscribe(data =>{
              console.log("test2 :  " + data.url.indexOf('thank_you'))
              if(data.url.indexOf('thank_you') !== -1){
                this.clearCart();
                brower.close();
              }else{
                brower.close();
                this.navCtrl.push(this.navCtrl.getActive().component).then(() => {
                  let index = this.viewCtrl.index;
                  this.navCtrl.remove(index);
                })
              }
              this.clicked = false;
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
              this.clicked = false;
            });
            brower.on("unexpected").subscribe(error =>{
              console.log(error);
              brower.close();
              this.clicked = false;
            });

            brower.on("undefined").subscribe(error =>{
              console.log(error);
              brower.close();
              this.clicked = false;
            });
            brower.on("ThemeableBrowserWarning").subscribe(error =>{
              console.log(error);
              this.clicked = false;
            });
            brower.on("critical").subscribe(error =>{
              console.log(error);
              this.clicked = false;
            });
          } 
        });
      }
    });
  }
  callCheckOut(){
    this.checkOut();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad CartPage');
  }
  callNotiCheckout(){
    this.storage.get('itemCarts').then((data) => {
      if(data !== null){
        if(data.length > 0 ){
          this.notiService.notiCartNotCheckout(true);
        }else{
          this.notiService.notiCartNotCheckout(false);
        }
      }
    });
  }
  OnDestroy(){
    this.callNotiCheckout();
  }
}
