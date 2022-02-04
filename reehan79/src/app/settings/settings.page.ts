import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpClient } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { PrivacyPolicyPage } from '../modals/privacy-policy/privacy-policy.page';
import { TermServicesPage } from '../modals/term-services/term-services.page';
import { RefundPolicyPage } from '../modals/refund-policy/refund-policy.page';
import {AuthenticationService} from '../services/authentication.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {FirebaseCrashlytics} from '@ionic-native/firebase-crashlytics/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  setting: { [k: string]: any } = {};
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public config: ConfigService,
    private storage: Storage,
    public loading: LoadingService,
    public http: HttpClient,
    public shared: SharedDataService,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public plt: Platform,
    private appVersion: AppVersion,
    private auth: AuthenticationService,
    private fireAna: AngularFireAnalytics,
    private firebaseCrashlytics: FirebaseCrashlytics,

  ) {
  }
  ionViewDidEnter() {
      this.fireAna.setCurrentScreen('settings');
  }



  updateSetting() {
    console.log(this.setting);
    this.storage.set('setting', this.setting);
  }

  logOut() {
   // this.shared.logOut();
    this.auth.logout().then(() => {
      this.fireAna.logEvent('clicked_logout', {user_name: this.shared.userName});
    });
  }
  openAccountPage() {
    this.navCtrl.navigateForward("my-account", );
  }

  //============================================================================================
  //turning on off local  notification
/**
  hideShowFooterMenu() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }
  hideShowCartButton() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  } */
  async showModal(value) {
    if (value == 'privacyPolicy') {
      let modal = await this.modalCtrl.create({
        component: PrivacyPolicyPage
      });
      return await modal.present();
    }
    else if (value == 'termServices') {
      let modal = await this.modalCtrl.create({
        component: TermServicesPage
      });
      return await modal.present();
    }
    else {
      let modal = await this.modalCtrl.create({
        component: RefundPolicyPage
      });
      return await modal.present();
    }
  }
  ionViewDidLoad() {
    this.storage.get('setting').then((val) => {
      if (val != null || val != undefined) {
        this.setting = val;

      }
      else {
        this.setting.localNotification = true;
        this.setting.notification = true;
        this.setting.cartButton = true;
        this.setting.footer = true;
      }
    });
  }

  openPaymentMode() {
    this.navCtrl.navigateForward("view-payment-mode");
  }

  rateUs() {
  /** this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
      });
    } */
  // this.navCtrl.navigateRoot("view-payment-mode");
 // this.navCtrl.navigateRoot("payment-history");
  // this.fireAna.logEvent('setting_click', {id: 21});
  // this.shared.toast('done');
   // this.navCtrl.navigateRoot("first-page");

  //  console.log(this.shared.customerData);
  }
  share() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        this.config.packgeName.toString(),
        this.config.appName,
        this.config.packgeName.toString(),
        this.config.packgeName.toString()
      );
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.config.appName,
          this.config.appName,
          "",
          "https://play.google.com/store/apps/details?id=" + val
        );
      });
    }
  }

  checkAvatar() {
    return this.shared.checkAvatar();
  }
  getNameFirstLetter() {
    return this.shared.getNameFirstLetter();
  }

  openPaymentHistory() {
    this.navCtrl.navigateForward("payment-history");
  }

  showSharedCatalogHistory(){
   this.firebaseCrashlytics.crash();
   this.firebaseCrashlytics.logException('From Settings');

  }





  ngOnInit() {
  }

}
