import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../providers/loading/loading.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../providers/config/config.service';
import {AlertController, NavController} from '@ionic/angular';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-view-payment-mode',
  templateUrl: './view-payment-mode.page.html',
  styleUrls: ['./view-payment-mode.page.scss'],
})
export class ViewPaymentModePage implements OnInit {
  easyPaisa = false;
  jazzCash = false;
  bank = false;
  accountTitle = '';
  accountNumber = '';
  accountNumberReenter = '';
  bankName = '';
  jazzCashDisable = false;
  easyPaisaDisable = false;
  bankDisable = false;
  submitButtonDisable = true;

  response: any;
  constructor(
      public loading: LoadingService,
      public http: HttpClient,
      public config: ConfigService,
      public navCtrl: NavController,
      public shared: SharedDataService,
      public alertController: AlertController,
) {

  }

  ionViewWillEnter() {
    this.fetch_payment_info();
  }

  async fetch_payment_info() {
    this.loading.show();
    const url = this.config.url + '/wp-json/my-life/v1/payment-info';
    await this.config.getWithUrlAuth(url).then((data) => {
      this.response = data;
      console.log(data);
      if (this.response[0].jazzcash.value) {
        this.jazzCash = this.response[0].jazzcash.value;
        this.easyPaisa = false;
        this.easyPaisaDisable = true;
        this.bank = false;
        this.bankDisable = true;
        this.submitButtonDisable = false;
      } else if (this.response[0].easypaisa.value) {
       this.easyPaisa = this.response[0].easypaisa.value;
       this.jazzCash = false;
       this.jazzCashDisable = true;
       this.bank = false;
       this.bankDisable = true;
       this.submitButtonDisable = false;
      } else if (this.response[0].bank.value) {
        this.bank = this.response[0].bank.value;
        this.accountTitle = this.response[0].bank.account_title;
        this.accountNumber = this.response[0].bank.account_number;
        this.bankName = this.response[0].bank.bank_name;
        this.jazzCash = false;
        this.jazzCashDisable = true;
        this.easyPaisa = false;
        this.easyPaisaDisable = true;
        this.submitButtonDisable = false;
      }
      this.loading.hide();

    }).catch((err) => {
      this.loading.hide();
      console.log(err);
    });



    this.loading.hide();
    console.log(this.response);
  }

  onSubmit() {
    this.loading.show().then(() => {
      this.submitButtonDisable = true;
      if (this.bank) {
        if (this.accountTitle === '' && this.accountNumber === '' && this.accountNumberReenter === ''
            && this.bankName === '') {
          this.loading.hide();
          this.submitButtonDisable = false;
          this.presentAlert('Please fill all the fields');
          return;
        }

        if (this.accountNumber !== this.accountNumberReenter) {
          this.loading.hide();
          this.submitButtonDisable = false;
          this.presentAlert('Account number does not match');
          return;
        }
      }


      this.postData().then((data) => {
        this.shared.toast('Data updated successfully');
        console.log(data);
        this.loading.hide();
      } ).catch(err => {
        this.shared.toast(err);
        console.log(err);
      });
    });
  }

  async postData() {
    const url = this.config.url + '/wp-json/my-life/v1/update-payment-info';
    const data = this.prepareData();
    return await this.config.postWithUrlAuth(url, data);
  }

  prepareData() {
    return {
      jazzcash : {
        value : this.jazzCash,
        id: this.shared.customerData.username,
      },
      easypaisa : {
        value : this.easyPaisa,
        id: this.shared.customerData.username,
      },
      bank : {
        value: this.bank,
        account_title : this.accountTitle,
        account_number : this.accountNumber,
        bank_name : this.bankName,
      }
    };
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Error!',
      subHeader: '',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
  editPaymentInfo(){
    this.navCtrl.navigateRoot("edit-payment-mode");
  }

  jazzCashChange() {
   if (this.jazzCash) {
     this.easyPaisa = false;
     this.easyPaisaDisable = true;
     this.bank = false;
     this.bankDisable = true;
     this.submitButtonDisable = false;
   } else {
     this.easyPaisa = false;
     this.easyPaisaDisable = false;
     this.bank = false;
     this.bankDisable = false;
     this.submitButtonDisable = true;
   }
  }

  easyPaisaChange() {
    if (this.easyPaisa) {
      this.jazzCash = false;
      this.jazzCashDisable = true;
      this.bank = false;
      this.bankDisable = true;
      this.submitButtonDisable = false;
    } else {
      this.jazzCash = false;
      this.jazzCashDisable = false;
      this.bank = false;
      this.bankDisable = false;
      this.submitButtonDisable = true;

    }
  }


  bankChange() {
    if (this.bank) {
      this.jazzCash = false;
      this.jazzCashDisable = true;
      this.easyPaisa = false;
      this.easyPaisaDisable = true;
      this.submitButtonDisable = false;
    } else {
      this.jazzCash = false;
      this.jazzCashDisable = false;
      this.easyPaisa = false;
      this.easyPaisaDisable = false;
      this.submitButtonDisable = true;

    }
  }
  ngOnInit() {
  }

}
