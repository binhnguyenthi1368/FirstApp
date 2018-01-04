import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

// customer service
import { CustomerService } from '../../services/customer.service';
/**
 * Generated class for the DetailOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-order',
  templateUrl: 'detail-order.html',
})
export class DetailOrderPage {
  public idOrder;
  detail;
  // check loading
  loadingFirst: boolean = false;
  // timeout or empty
  notiTimeout: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public cusService: CustomerService,
    ) {
  	this.idOrder = navParams.get('idorder');
    this.cusService.getDetailOrder(this.idOrder).subscribe((data) => {
      this.detail = data;
      this.loadingFirst = true;
    },(err) => {
      this.notiTimeout = true;
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DetailOrderPage');
  }

}
