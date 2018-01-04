import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage'
import { Observable } from 'rxjs/Observable';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';
import { Globals } from './../app/providers/globals';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class NotificationsService {
  
  count: number = 0;
  list: ILocalNotification[] = [{
        title: "Dogo App",
        text: "Test service",
        badge: 1,
        at: 5000
      }];
  constructor(private localNotifications: LocalNotifications, private storage: Storage, private globals: Globals){
    this.storage.get('notifications').then((notis) => {
      if(typeof notis !== undefined && notis !== null){
        this.globals.setNotiCounts(notis.length);
        console.log(notis.length);  
      }else{
        notis = [];
        this.globals.setNotiCounts(notis.length);
      }
    });
  }

  push(noti: {}){
    this.localNotifications.schedule(noti);
    this.updateToStorage(noti);
  }
  notiWelcome(){
    var notiContent:ILocalNotification = {
        id: 1,
        title: "Chào mừng bạn đến với Dogo",
        text: "Mua sắm thả ga, tích xu đổi thưởng!",
        badge: 1,
        at: new Date(new Date().getTime() + 1000*60*100)
    };
    this.localNotifications.schedule(notiContent);
  }

  notiCartNotCheckout(isNoti: boolean) {
    if(isNoti){
        var notiContent:ILocalNotification = {
          id: 2,
          title: "Tích điểm ngay",
          text: "Có một giỏ hàng đang chờ bạn!",
          badge: 1,
          at: new Date(new Date().getTime() + 1000*60*15)
      };
      this.localNotifications.schedule(notiContent);
    }else{
      this.localNotifications.cancel(2);
    }
  }

  updateToStorage(noti:{}){
    this.storage.get('notifications').then((notis) => {
      if(typeof notis !== undefined && notis !== null){
        notis.push(noti);
        this.storage.set('notifications', notis);
        this.globals.setNotiCounts(notis.length);
      }else{
        this.storage.set('notifications', [noti]);
        console.log('djhfjsjk  '+[noti].length);
        this.globals.setNotiCounts([noti].length);
      }
    });
  }
}

export interface iNotifications{
  counts: number;
  lists: ILocalNotification[];
}