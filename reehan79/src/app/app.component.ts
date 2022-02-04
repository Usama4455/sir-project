import { Component } from '@angular/core';

import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {AuthenticationService} from './services/authentication.service';
import {FirebaseService} from './services/firebase.service';
import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {environment} from '../environments/environment';
import {EventServiceService} from './services/event-service.service';
import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import {LoginPhonePage} from './modals/login-phone/login-phone.page';
import { NgZone } from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pathCategories = '_categories';
  pathProducts = 'products';
  pathAttributes = '_attributes';
  rootPage: any;
  appPages = [];
  // For all pages

  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router,
    private navCtrl: NavController,
    public platform: Platform,
    public modalCtrl: ModalController,
    public storage: Storage,
    public network: Network,
    public loading: LoadingService,
    public plt: Platform,
    private appVersion: AppVersion,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private deeplinks: Deeplinks,
    private splashScreen: SplashScreen,
    private firebaseAuthentication: FirebaseAuthentication,
    private authenticationService: AuthenticationService,
    private rtdb: FirebaseService,
    private codePush: CodePush,
    private screenOrientation: ScreenOrientation,
    private eventSubscribe: EventServiceService,
    private firebaseCrashlytics: FirebaseCrashlytics,
    private loginPage: LoginPhonePage,
    private ngZone: NgZone,
    private fireAna: AngularFireAnalytics,
  ) {
    this.initializeApp();
    let connectedToInternet = true;
    network.onDisconnect().subscribe(() => {
      connectedToInternet = false;
      this.shared.showAlertWithTitle("Please Connect to the Internet!", "Disconnected");
      //  console.log('network was disconnected :-(');
    });


    network.onConnect().subscribe(() => {
      if (!connectedToInternet) {
        window.location.reload();
        this.shared.showAlertWithTitle("Network connected Reloading Data" + '...', "Connected");
      }
    });
    document.documentElement.dir = this.config.appDirection;
    shared.dir = this.config.appDirection;


    this.eventSubscribe.deepLinkService.subscribe((value) => {
      this.naviagateDeeplink(value);
    });


    this.eventSubscribe.homePageService.subscribe(() => {
      this.openHomePage();
    });

   this.eventSubscribe.subCategoryService.subscribe((value) => {
     this.openSubcategoryPage(value);
   });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (environment.sync === true) {
        this.checkCodePush();
      }
      console.log('abc');

      const crashlytics = this.firebaseCrashlytics.initialise();
     // crashlytics.logException('my caught exception');
      this.firebaseAuthentication.onAuthStateChanged().subscribe(userInfo => {
        if (userInfo) {
          let tel = userInfo.phoneNumber;
          tel = tel.substring(3);
          tel = '0' + tel;
          console.log('firebase Login  ' + tel);
          this.loginPage.username = tel;
          this.shared.userName = tel.toString();
          this.ngZone.run(() => this.loginPage.successLoginFirebase());
          this.fireAna.setUserId(this.shared.userName);

          //this.loginPage.successLoginFirebase();
         // this.authenticationService.firebaseUser.next(this.loginPage.username);

        } else {
          console.log('Firebase No User');
          //this.authenticationService.firebaseUser.next('null');
        }
      });
      /* setTimeout(() => {
        this.splashScreen.hide();
      }, 1000); */

      this.rtdb.getRtdb('/' + this.pathCategories).subscribe((data) => {
        this.shared.allCategories = [];
        this.shared.categories = [];
        this.shared.realAllCategories = Object.values(data);
        this.shared.subCategories = [];

        this.shared.getAllCategories();
        this.rtdb.updateCategoriesSubject.next(true);
        //console.log(data);
        console.log('From App');
      });
      this.rtdb.getRtdb('/' + this.pathProducts).subscribe(data => {
        this.shared.realAllProducts = Object.values(data);
        this.rtdb.updateProductsSubject.next(true);
        console.log('Subscribe to Products');
      });

      this.rtdb.getRtdb('/' + this.pathAttributes).subscribe(data => {
        this.shared.realAllAttributes = Object.values(data);
        // console.log(this.shared.realAllAttributes );
      });
      this.screenOrientation.lock('portrait');

      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
         // this.navCtrl.navigateRoot("/tabs");
          this.loadHomePage();
          console.log('navigated to Tabs on start');
          console.log('State is :   ' + state);
        } else {
          console.log('navigated to Login on start');
          console.log('State is :   ' + state);

          this.storage.get('firsttimeApp').then((val) => {
             if (val === 'firstTime') {
               if (environment.production === true) {
                 this.navCtrl.navigateRoot("first-page");
               } else {
                 this.navCtrl.navigateRoot("first-page");
               }
             } else {
               this.navCtrl.navigateRoot("intro");
               this.storage.set('firsttimeApp', 'firstTime');
             }
          }).catch(() => {
            console.log('FirstTimeApp not stored in storage   :');
            this.navCtrl.navigateRoot("intro");
            this.storage.set('firsttimeApp', 'firstTime');
          });
        }
      });

      this.platform.resume.subscribe((result) => {
        if (environment.sync === true) {
          this.checkCodePush();
        }
      });


      this.config.siteSetting().then((value) => {
       // this.loadHomePage(); //Based on Auth Service.. Moving it to Auth Subscribe
       // this.getLeftItems();
      });
      if (this.platform.is('cordova')) {
        this.initializeDeepLinks();
      }

    });

  }

  // loading home page =========================================================================
  loadHomePage() {
    this.openHomePage();
    this.config.checkingNewSettingsFromServer();
    setTimeout(() => {
      //this.events.publish("openDeepLink");
      this.eventSubscribe.deepLinkService.next();
    }, 500);
  }
  // starting admob =========================================================================

  // preparing admob =========================================================================

  //=========================================================================

  //=========================================================================

  openHomePage() {
    //if (this.config.homePage == 1) { this.navCtrl.navigateRoot("/home"); }
    if (this.config.homePage == 1) { this.navCtrl.navigateRoot("/tabs"); }
  }

  openSubcategoryPage(parent) {
    let i = "/" + parent.id + "/" + parent.name;
    if (this.config.categoryPage == 1) { this.navCtrl.navigateForward("categories" + i); }
  }


  rateUs() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
      });
    }
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


  public link = "empty";
  public linkArgs: any;
  public deepUrl = "";
  initializeDeepLinks() {
    //this.deeplinks.routeWithNavController(this.nav, {
    this.deeplinks.route({
    }).subscribe(match => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      this.deepUrl = match.$link.url;

      this.link = match.$link.path;

      this.linkArgs = match.$args;

      console.log(match);
      console.log(match.$args);
      console.log('Successfully matched route', match);
      //if (this.rootPage != undefined) this.naviagateDeeplink();
    }, nomatch => {
      // nomatch.$link - the full link data
      this.deepUrl = nomatch.$link.url;
      //if (this.rootPage != undefined) this.naviagateDeeplink();
      console.error('Got a deeplink that didn\'t match', nomatch);
    });

  }

  naviagateDeeplink(value: any) {

    //console.log(this.deepUrl)
    if (this.deepUrl.indexOf('/shop') != -1 && value != "openCategoryInShop") {
      this.navCtrl.navigateForward("/products/0/0/newest");
      console.log("navigate to Shop");
    }
    if (this.link == "/shop/" && value != "openCategoryInShop") {
      console.log("navigate to Shop with sorting");
    }
    if (this.link == "/product/" && value != "openCategoryInShop") {
      console.log("navigate to product detail");
    }

    if (this.deepUrl.indexOf('product=') != -1 && value != "openCategoryInShop") {
      let linkk = this.deepUrl;
      let arr = linkk.split("=");
      let slug = "";
      for (let val of arr) {
        if (val.indexOf('product') == -1)
          slug = val;

      }
      this.getSingleProductDetail(slug);
      console.log("navigate to product detail with = Slug");
    }

    if (this.deepUrl.indexOf('/product/') != -1 && value != "openCategoryInShop") {
      let arr = this.deepUrl.split("/");
      let count = 0;
      for (let val of arr) {
        count++;
        if (val == "product") { break; }
      }
      let slug = arr[count];

      this.getSingleProductDetail(slug);
      console.log("navigate to product detail with / Slug :" + slug);
    }

    if (this.deepUrl.indexOf('/product-category/') != -1) {
      //'http://vc.com/product-category/watches/gold-watches/ooo'
      let arr = this.deepUrl.split("/");
      let count = 0;
      let arr2 = [];
      for (let val of arr) {
        if (count == 1 && val != "") arr2.push(val);
        if (val == "product-category") count = 1;
      }
      let slug = arr2[(arr2.length) - 1];


      console.log(slug);
      console.log("navigate to shop page with category . Slug :" + slug);
      console.log(value);
      if (value == "openCategoryInShop") {
        for (let val of this.shared.allCategories) {
          console.log(val);
          if (val.slug == slug) {
            console.log("id matched : " + val.id);
            console.log(val);

            let navigationExtras: NavigationExtras = {
              queryParams: {
                id: val.id,
                name: "",
                sortOrder: 'newest'
              }
            };
            this.navCtrl.navigateForward("/products/" + val.id + "/0/newest");
          }
        }
      }
    }


  }


  getSingleProductDetail(slug) {
    this.loading.show();
    this.config.getWoo("products/" + "?" + this.config.productsArguments + "&slug=" + slug).then((data: any) => {
      this.loading.hide();
      let p = data[0];
      this.shared.singleProductPageData.push(p);
      this.navCtrl.navigateForward("product-detail/" + p.id);
    }, err => {
      this.loading.hide();
      console.log(err);
    });
  }

  //==============================================================
  //for
  expandItem(i) {
    if (i.expanded == false) i.expanded = true;
    else i.expanded = false;
  }
  showImg() {
    return !this.config.defaultIcons;
  }

  checkCodePush() {

    this.codePush.sync({
    /**  updateDialog: {
        appendReleaseDescription: true,
        descriptionPrefix: "\n\nChange log:\n"
      },
      installMode: InstallMode.IMMEDIATE */
    }).subscribe(
        (data) => {
          console.log('CODE PUSH SUCCESSFUL: ' + data);

        },
        (err) => {
          console.log('CODE PUSH ERROR: ' + err);

        }
    );
  }





}
