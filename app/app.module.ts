import { Globals } from './providers/globals';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule} from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

import { SplashScreen } from '@ionic-native/splash-screen';
// number noti: icon app
import { Badge } from '@ionic-native/badge';
// show noti in the device' noti area
import { LocalNotifications } from '@ionic-native/local-notifications';
// copy to clipboard
// import { Clipboard } from '@ionic-native/clipboard';
// nap xu
import { HTTP } from '@ionic-native/http';

import { PayxuPage } from '../pages/payxu/payxu';
// rut tien
import { WithdrawPage } from '../pages/withdraw/withdraw';
// hướng dẫn rút tiền, nạp xu
import { InfoXuPage } from '../pages/info-xu/info-xu';
// storage
import { IonicStorageModule } from '@ionic/storage';
// zoom image
import { IonicImageViewerModule } from 'ionic-img-viewer';
// in app browser
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';

import { MyApp} from './app.component';
import { HomePage, RoundPipe } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
// collection page
import { CollectionsPage } from '../pages/collections/collections';
// Product page
import { ProductPage, viewVariant } from '../pages/product/product';
// Notifications Model
import { NotificationsModel } from '../pages/notifications/notifications';
// Policy page
import { PolicyPage } from '../pages/policy/policy';
// page other
import { OtherPage } from '../pages/other/other';
// page search
import { SearchPage } from '../pages/search/search';
// page about
import { AboutPage } from '../pages/about/about';
import { CommissionPage } from '../pages/commission/commission';
import { DropdownHeaderPage } from '../pages/dropdown-header/dropdown-header';

// hide header
import { HideHeaderDirective } from '../directives/hide-header/hide-header';
// page user
import {UserPage} from '../pages/user/user';
// page order
import { OrderPage } from '../pages/order/order';
// detail order modal
import { DetailOrderPage } from '../pages/detail-order/detail-order';
// detail noti modal
import { DetailNotiPage } from '../pages/detail-noti/detail-noti';
// page cart
import { CartPage } from '../pages/cart/cart';
// FireDatabase
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { AuthService } from './providers/auth.service';
import { CustomerService } from '../services/customer.service';
import { NotificationsService } from '../services/notifications.service';
// import { FCM } from '@ionic-native/fcm';
import { AppUpdate } from '@ionic-native/app-update';

export const firebaseConfig = {
  apiKey: "AIzaSyA8bcDVlp09koWgUTGJU_n3tkYGZkgtf-c",
  authDomain: "dogo-app-6381a.firebaseapp.com",
  databaseURL: "https://dogo-app-6381a.firebaseio.com",
  projectId: "dogo-app-6381a",
  storageBucket: "dogo-app-6381a.appspot.com",
  messagingSenderId: "220349868760"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RoundPipe,
    AccountPage,
    CollectionsPage,
    ProductPage,
    viewVariant,
    NotificationsModel,
    PolicyPage,
    OtherPage,
    SearchPage,
    AboutPage,
    DropdownHeaderPage,
    UserPage,
    OrderPage,
    DetailOrderPage,
    CartPage,
    CommissionPage,
    DetailNotiPage,
    PayxuPage,
    WithdrawPage,
    HideHeaderDirective,
    InfoXuPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: "md-arrow-back",
      // iconMode: "ios",
      tabsPlacement: "bottom",
      platforms: {
        ios: {
          // tabsHideOnSubPages: true
          // statusbarPadding: false,
          menuType: 'overlay'
        }
      }
    }),
    IonicPageModule.forChild(OtherPage),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule
  ],
  // exports: [RouterModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AccountPage,
    CollectionsPage,
    ProductPage,
    viewVariant,
    NotificationsModel,
    PolicyPage,
    SearchPage,
    AboutPage,
    UserPage,
    DropdownHeaderPage,
    OrderPage,
    DetailOrderPage,
    CartPage,
    CommissionPage,
    DetailNotiPage,
    PayxuPage,
    WithdrawPage,
    InfoXuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FormBuilder,
    CurrencyPipe,
    CustomerService,
    AuthService,
    InAppBrowser,
    Keyboard,
    AppUpdate,
    // FCM,
    ThemeableBrowser,
    Badge,
    HTTP,
    Globals,
    NotificationsService,
    LocalNotifications,
    // Clipboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
//   constructor(public navCtrl: NavController){
// }

}
