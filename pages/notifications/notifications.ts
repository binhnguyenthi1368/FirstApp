import { HTTP } from '@ionic-native/http';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component} from '@angular/core';
import { IonicPage,Platform, ViewController, NavParams, ModalController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NotificationsService } from '../../services/notifications.service';
import { Observable } from 'rxjs/Observable';
import { DetailNotiPage } from '../detail-noti/detail-noti';
import { Globals } from './../../app/providers/globals';
// import { FCM } from '@ionic-native/fcm';
@IonicPage()
@Component({selector: 'page-notifications',templateUrl: 'notifications.html'})
export class NotificationsModel {
  notis: any[] = [];
  counts: number = 0;
  notisOber: Observable<any>;
  errNoti: boolean = false;
  loadingFirst: boolean = false;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,  
    private notiService: NotificationsService,
    private storage: Storage,
    private httpClient: Http,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    private globals: Globals,
    private httpNative: HTTP
    // private fcm: FCM
  ){
    this.storage.get('notifications').then((notis) => {
      if(typeof notis !== undefined && notis !== null){
        this.notis = notis;
        this.loadingFirst = true;
        this.httpNative.get('https://do4go.com/blogs/dogo-app-thong-bao?view=dogo.json',{},{}).then(res => {
          let blog = JSON.parse(res.data);
          console.log(blog)
          if(typeof blog !== "undefined" && blog !== null){
            if (blog !== this.notis) {
              this.notis = blog.articles;
            }
          }else{
            this.notis = notis;
          }
          this.loadingFirst = true;
          this.storage.set('notifications', this.notis);
          this.storage.get('notiseen').then((notiseen)=>{
            if(typeof notiseen !== "undefined" && notiseen !== null){
              var count = this.notis.length - notiseen.length;
              this.notis.forEach(article => {
                if(notiseen.some(x => x === article.url)){
                  article.seen = true;
                }
              })
              this.globals.setNotiCounts(count);
            }else{
              this.globals.setNotiCounts(this.notis.length);
            }
          })
        },(err) => {
          console.log(err);
          this.errNoti = true;
        });
      }else{
        this.httpNative.get('https://do4go.com/blogs/dogo-app-thong-bao?view=dogo.json',{},{}).then(res => {
          var blog = JSON.parse(res.data);
          if(typeof blog !== "undefined" && blog !== null){
            this.notis = blog.articles;
            this.storage.set('notifications', this.notis);
          }else{
            this.notis = [];
            this.storage.set('notifications', []);
          }
          this.globals.setNotiCounts(this.notis.length);
          this.loadingFirst = true;
        },(err) => {
          console.log(err);
          this.errNoti = true;
        });
      }
    });

    // this.fcmPlugin();
    
    // fcm.getToken().then(token=>{
    //   storage.set("fcm", token);
    // })
    
    // fcm.onNotification().subscribe(data=>{
    //   if(data.wasTapped){
    //     console.log("Received in background");
    //   } else {
    //     console.log("Received in foreground");
    //   };
    // })
    
    // fcm.onTokenRefresh().subscribe(token=>{
    //   storage.set("fcm", token);
    // })
  }
  viewNotification(noti: any){
    var url = noti.url;
    console.log(noti);
    noti.seen = true;
    if(typeof url !== undefined && url !== ""){
      this.navCtrl.push(DetailNotiPage, {
        urlNoti: url
      });
      this.storage.get('notiseen').then((notiseen)=>{
        console.log(notiseen);
        //viewd = {["handle"]};
        if(typeof notiseen !== "undefined" && notiseen !== null){
          console.log(notiseen.some(x => x === url))
          if(!notiseen.some(x => x === url)){
              notiseen.push(url);
              this.storage.set('notiseen', notiseen);
          };
        }else{
          notiseen = [];
          notiseen.push(url);
          this.storage.set('notiseen', notiseen);
        }
        var count = this.notis.length - notiseen.length;
        this.globals.setNotiCounts(count);
      })
    }
  }
  removeNotification(id) {
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}