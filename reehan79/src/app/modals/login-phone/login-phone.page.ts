import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController} from '@ionic/angular';
import {FirebaseAuthentication} from '@ionic-native/firebase-authentication/ngx';
import {LoadingService} from '../../../providers/loading/loading.service';
import {SharedDataService} from '../../../providers/shared-data/shared-data.service';
import {Md5} from 'ts-md5';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../providers/config/config.service';
import {Storage} from '@ionic/storage';
import {AuthenticationService} from '../../services/authentication.service';
import {UpdateProfilePage} from '../update-profile/update-profile.page';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Component({
  selector: 'app-login-phone',
  templateUrl: './login-phone.page.html',
  styleUrls: ['./login-phone.page.scss'],
})
export class LoginPhonePage implements OnInit {


    constructor(
      public modalCtrl: ModalController,
      private firebaseAuthentication: FirebaseAuthentication,
      public loading: LoadingService,
      public shared: SharedDataService,
      public toastController: ToastController,
      public http: HttpClient,
      public config: ConfigService,
      public storage: Storage,
      public auth: AuthenticationService,
      private authenticationService: AuthenticationService,
      private fireAna: AngularFireAnalytics,
    ) {

    }
  phoneNumber = '';
  errorMessage = '';
  verID = '';
  aA = '';
  bB = '';
  cC = '';
  dD = '';
  eE = '';
  fF = '';
timeLeft = 50;
interval;
otpButtonText = 'Send';
otpButtonDisable = false;
verifyButtonDisable = false;
showVerificationFields = false;
username = '';
email = '';
password = '';
progressBarValue = 0;
awaitingSms = false;
credential: any;
//////////////////////////////////////////////////
   /** initialLoginTwo() {
        this.username = this.phoneNumber.toString();
        this.password = Md5.hashStr(this.username).toString();
        // this.loading.show();
        this.errorMessage = '';
        const countryCode = '+92';
        this.shared.phoneNumber = countryCode.concat(this.phoneNumber.toString().substring(1));
        console.log(this.shared.phoneNumber.toString());
        const timeOutDuration = 60;
        this.fireX.verifyPhoneNumber((credential: any) => {
            console.log(true);
            this.hideVerifyFieldsObs.next(false);
            this.changeRef.detectChanges();
            if (credential.instantVerification) {
                if (this.awaitingSms) {
                    this.awaitingSms = false;
                }
                this.signInWithCredential(credential);
           } else {
               this.awaitingSms = true;
               this.presentToast('OTP sent successfully!');
              /** this.infoVerify().then((otpCode) => {
                   this.awaitingSms = false;
                   credential.code = otpCode;
                   this.signInWithCredential(credential);
               }).catch((err) => {console.log('Err:  ' + err); });
           }
        }, error => {
            this.presentToast(error);
            this.resetData();
            console.log('From function' + error);
        }, this.shared.phoneNumber.toString(), timeOutDuration ).then(() => {
            console.log('test');
        });
    } */

   /** resetData() {
        this.aA = ''; this.bB = ''; this.cC = ''; this.dD = ''; this.eE = ''; this.fF = '';
        this.showVerificationFields = false;
        this.verifyButtonDisable = true ;
        clearInterval(this.interval);
        this.otpButtonText = 'Resend OTP';
        this.otpButtonDisable = false;
    } */



  /**  infoVerify() {
        return new Promise(((resolve, reject) => {
            this.verifyClick.subscribe((success: boolean) => {
                if (success) {
                    const otpCode = this.verifyOTP();
                    if (otpCode) {
                        resolve (otpCode);
                    } else {
                        this.presentToast('Please enter OTP Correctly!');
                      //  reject ('OTP code entered incorrectly!');
                    }
                } else {
                // reject(' Click wrong');
                }
            });
        }));
    } */

  /**  verifyClicked() {
        console.log('Verify Clicked');
        this.verifyClick.next(true);
    } */

 /**   verifyOTP() {
        const otpCode = this.aA + this.bB + this.cC + this.dD + this.eE + this.fF;
        const regex = new RegExp('[0-9]');
        if (regex.test(this.aA) && regex.test(this.bB) && regex.test(this.cC)
            && regex.test(this.dD) && regex.test(this.eE) && regex.test(this.fF)) {
            console.log(otpCode);
            return otpCode;
        } else { return false ; }
    } */

  /**  signInWithCredential(credential) {
            this.progressBarValue = 0;
            this.verifyButtonDisable = true;
            this.fireX.signInWithCredential(credential, () => {
                this.progressBarValue = this.progressBarValue + (1 / 3);
                clearInterval(this.interval);
                this.signUpWordpress().then((resWord: any) => {
                    this.progressBarValue = this.progressBarValue + (1 / 3);
                    console.log(resWord);
                    this.shared.customerToken = resWord.token.token;
                    console.log(this.shared.customerToken);
                    this.config.getWoo('customers/' + resWord.id + '?' + this.config.productsArguments).then((dataW: any) => {
                        this.progressBarValue = this.progressBarValue + (1 / 3);
                        console.log(dataW);
                        this.storage.set('customerData', dataW);
                        this.auth.login(this.shared.customerToken);
                        this.loading.hide();
                        this.presentToast('Logged In Successfully');
                        console.log(dataW.first_name);
                        if (dataW.first_name === '') {
                            this.dismiss().then(() => {
                                this.closeStartUpModal();
                                this.openUpdateProfileModal();
                            }).catch(() => {
                                this.presentToast('Unable to open profile update modal');
                            });
                        } else {
                            this.dismiss().then(() => {
                                this.closeStartUpModal();
                            });
                        }
                    }).catch((error: any) => {
                        console.log(error);
                        this.loading.hide();
                        this.presentToast(error);
                    });
                }).catch((error: any) => {
                    console.log(error);
                    this.loading.hide();
                    this.presentToast(error);
                });
            }, err => {
                this.loading.hide();
                console.log(err);
                this.presentToast('OTP code Wrong! Please enter correct OTP');
                //this.verifyButtonDisable = false;
                this.resetData();
            });
        } */

///////////////////////////////////////////////////
initialLogin() {
this.username = this.phoneNumber.toString();
//this.password = Md5.hashStr(this.username).toString();
this.otpButtonDisable = true;
this.loading.show();
this.errorMessage = '';
const countryCode = '+92';
this.shared.phoneNumber = countryCode.concat(this.phoneNumber.toString().substring(1));
console.log(this.phoneNumber.toString());
this.firebaseAuthentication.verifyPhoneNumber(this.shared.phoneNumber.toString(), 60000).then(
    (res: any) => {
        this.showVerificationFields = true;
        this.startTimer();
        this.verifyButtonDisable = false;
        this.presentToast('OTP sent successfully!');
        this.verID = res;
        this.loading.hide();
        console.log(res);
        console.log('OK');
     // this.dismiss();
    }
)
    .catch(
        (error: any) => {
          this.loading.hide();
          console.error(error);
          this.presentToast(error);
        }
    );
}

    /** Verification with google /*
     *
     */
    checkOTPNumbers() {
this.fireAna.logEvent('clicked_loginVerify');
this.progressBarValue =0;
const otpCode = this.aA + this.bB + this.cC + this.dD + this.eE + this.fF;
const regex = new RegExp('[0-9]');
    if (regex.test(this.aA) && regex.test(this.bB) && regex.test(this.cC)
    && regex.test(this.dD) && regex.test(this.eE) && regex.test(this.fF)) {
        console.log(otpCode);
        this.verifyButtonDisable = true;
        this.loading.show();
        this.firebaseAuthentication.signInWithVerificationId(this.verID, otpCode).then((res: any) => {
                //this.successLoginFirebase();
           // this.authenticationService.firebaseUser.next(this.username);
        }).catch((error: any) => {
                    this.loading.hide();
                    console.log(error);
                    this.presentToast('OTP code Wrong! Please enter correct OTP');
                    this.verifyButtonDisable = false;
        });

    } else {
     this.presentToast('Please enter OTP Correctly!');
    }
}

successLoginFirebase() {
    this.progressBarValue = this.progressBarValue + (1 / 3);
    clearInterval(this.interval);
    this.signUpWordpress().then((resWord: any) => {
        this.progressBarValue = this.progressBarValue + (1 / 3);
        console.log(resWord);
        this.shared.customerToken = resWord.token.token;
        console.log(this.shared.customerToken);
        this.config.getWoo("customers/" + resWord.id + "?" + this.config.productsArguments).then((dataW: any) => {
            this.progressBarValue = this.progressBarValue + (1 / 3);
            console.log(dataW);
            this.storage.set('customerData', dataW);
            this.shared.customerData = dataW;
            this.auth.login(this.shared.customerToken);
            this.loading.hide();
            this.presentToast('Logged In Successfully');
            console.log(dataW.first_name);
            if (dataW.first_name === '') {
                this.dismiss().then(() => {
                    this.closeStartUpModal();
                    this.openUpdateProfileModal();
                }).catch(() => {
                    this.presentToast('Unable to open profile update modal');
                });
            } else {
                this.dismiss().then(() => {
                    this.closeStartUpModal();
                });
            }
        }).catch((error: any) => {
            console.log(error);
            this.loading.hide();
            this.presentToast(error);
        });
    }).catch((error: any) => {
        console.log(error);
        this.loading.hide();
        this.presentToast(error);
    });
}

signUpWordpress() {
    const formData = new FormData();
    this.password = Md5.hashStr(this.username).toString();
    formData.append('user', this.username);
    formData.append('password', this.password);
    formData.append('year', 'decoDeRegistER');
    return this.http.post(this.config.url + '/wp-json/my-life/v1/register', formData).toPromise();
}
/**
generateToken(userName, userPassword) {
    this.http.post(this.config.url + '/wp-json/jwt-auth/v1/token', {
        username: userName,
        password: userPassword
    }).toPromise().then((data: any) => {
        this.shared.customerToken = data.token;
        this.storage.set('customerToken', this.shared.customerToken);
        console.log(data);
    }).catch((err: any) => {
        console.log(err);
    });
} */



startTimer() {
    this.timeLeft = 50;
    this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.otpButtonText = this.timeLeft.toString();
        } else {
            // this.timeLeft = 50;
            clearInterval(this.interval);
            this.otpButtonText = 'Resend OTP';
            this.otpButtonDisable = false;
            this.verifyButtonDisable = true;
            this.showVerificationFields = false;

        }
    }, 1000);
}

async presentToast(msg) {
    const toast = await this.toastController.create({
        message: msg,
        duration: 2000
    });
    toast.present();
}

moveFocus(event, nextElement, previousElement) {
    console.log(event);
    const backInfo = event.detail.inputType;
    if (backInfo === 'deleteContentBackward') {
        //  previousElement.setFocus();
      } else {
          nextElement.setFocus();
      }
}

moveFocusFirst(event, nextElement) {
    console.log(event);
    const backInfo = event.detail.inputType;
    if (backInfo === 'deleteContentBackward') {
    } else {
        nextElement.setFocus();
    }
    }
moveFocusLast(event, previousElement) {
    console.log(event);
    const backInfo = event.detail.inputType;
    if (backInfo === 'deleteContentBackward') {
      //  previousElement.setFocus();
    }
}

// close modal
dismiss() {
    return this.modalCtrl.dismiss();
}

async openUpdateProfileModal() {
    const modal = await this.modalCtrl.create({
        component: UpdateProfilePage,
    });
    return await modal.present();
}

closeStartUpModal() {
    this.authenticationService.startUpModalHide();
}
  ngOnInit() {
    /**  this.hideVerifyFieldsObs.subscribe((value: boolean) => {
          console.log('test');
          if (value) {
              this.otpButtonDisable = false;
              this.showVerificationFields = false;
              this.verifyButtonDisable = true;
              clearInterval(this.interval);
          } else {
              this.otpButtonDisable = true;
              this.showVerificationFields = true;
              this.verifyButtonDisable = false;
              this.startTimer();
          }
      } );*/  }

}
