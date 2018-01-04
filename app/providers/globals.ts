import { CustomerService } from './../../services/customer.service';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Badge } from '@ionic-native/badge';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Profile } from '../../interfaces/profiles';
@Injectable()
export class Globals {
  private _cartCountsSource: BehaviorSubject<number> = new BehaviorSubject(0); 
  public cartCounts = this._cartCountsSource.asObservable();

  private _notiCountsSource: BehaviorSubject<number> = new BehaviorSubject(1); 
  public notiCounts = this._notiCountsSource.asObservable();

  private _typeUser: BehaviorSubject<string> = new BehaviorSubject(''); 
  public typeUser = this._typeUser.asObservable();

  private _firstName: BehaviorSubject<string> = new BehaviorSubject(''); 
  public firstName = this._firstName.asObservable();

  private _xu: BehaviorSubject<number> = new BehaviorSubject(0); 
  public xu = this._xu.asObservable();

  private _xu2: BehaviorSubject<number> = new BehaviorSubject(0); 
  public xu2 = this._xu2.asObservable();

  constructor(
    private storage: Storage, 
    private badge: Badge, 
    private http: Http,
    private cusService: CustomerService
  ){

  }
  
  //so luong gio hang
  public setCartCounts(value: number) {
      this._cartCountsSource.next(value);
  }

  //so luong tin thong bao chua doc
  public setNotiCounts(value: number) {
    if(value > 0){
      this.badge.set(value);
    }else{
      this.badge.clear();
    }
    this._notiCountsSource.next(value);
  }
  
  //loai khach hang (dai ly, tong dai ly, thanh vien, ..)
  public setTypeUser(value: string) {
    this._typeUser.next(value);
  }
  
  //ten khach hang
  public setFirstName(value: string) {
    this._firstName.next(value);
  }

  public setXu(value: number) {
    this._xu.next(value);
  }
  public setXu2(value: number) {
    this._xu2.next(value);
  }
  getTotalReward(){

  }

  getOwnRewardPoints(){
    this.storage.get('profile').then(profile=>{
      var total:number = 0;
      if(profile !== null){
        const _profile = new Profile(profile.app, profile.account);
        console.log("test" + _profile);
        if(!_profile.isAccountEmpty()){
          this.cusService.getReward(_profile.account.id).subscribe((orders) => {
            orders.forEach(order => {
              try {
                total = total +  Math.round(order.reward_points_2);
              } catch (error) {
                console.log("Giá trị nhập sai!") 
              }
            });
            this._xu.next(total);
            return total;
          }, (err) => {
              console.log("Lỗi mạng!")
              return total = 0;
          });
        }
      }
    });
  }

  //lấy ra xu từ mã giới thiệu
  getInvitedRewardPoints(code){
    var total: number  = 0;
    console.log(code);
    this.http.get(`https://suplo-app.herokuapp.com/dogo-app/customers-applied-code/${code}`).map(res => res.json())
    .subscribe(customers => {
      customers.data.metafields.forEach(customer => {
        this.cusService.getReward(customer.owner_id).subscribe((orders) => {
          orders.forEach(order => {
              total += Math.round(order.reward_points_1);
          });
          this._xu2.next(total);
          return total;
        });
      });
    }, (err) => {console.log(err); return total = 0});
  }
}
