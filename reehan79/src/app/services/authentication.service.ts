import {ApplicationRef, Injectable} from '@angular/core';
import { Platform } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {BehaviorSubject} from 'rxjs';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {LoadingService} from '../../providers/loading/loading.service';
import {FirebaseAuthentication} from '@ionic-native/firebase-authentication/ngx';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  startUpModalShow = new BehaviorSubject(true);
  firebaseUser = new BehaviorSubject('null');
  constructor(
      public storage: Storage,
      private plt: Platform,
      public shared: SharedDataService,
      private applicationRef: ApplicationRef,
      public loading: LoadingService,
      private firebaseAuthentication: FirebaseAuthentication,

  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get('customerToken').then(res => {
      if (res) {
        console.log('Token True');
        this.authenticationState.next(true);
      }
    })
        .catch(err => {
          console.log('Token False');
          this.authenticationState.next(false);
        });
  }

  login(token) {
    this.shared.customerToken = token;
    this.storage.set('customerToken', this.shared.customerToken).then(() => {
    return this.authenticationState.next(true);
    });
    this.applicationRef.tick();
  }

  logout() {
    this.loading.autoHide(500);
    this.storage.remove('customerData');
    this.storage.remove('firsttimeApp');

    //this.storage.set('cartProducts', []);
    this.shared.emptyCart();
    console.log('Cart Products Removed');
    this.shared.resetData();
    return this.storage.remove('customerToken').then(() => {
      this.firebaseAuthentication.signOut().then(() => {
        this.authenticationState.next(false);
      });
    })
        .catch( err => {
          console.log('Error in logging out');
        });
  }
  isAuthenticated() {
    return this.authenticationState.value;
  }
startUpModalHide() {
  this.startUpModalShow.next(false);
}
isStartUpModalShow() {
  return this.startUpModalShow.value;
}
}
