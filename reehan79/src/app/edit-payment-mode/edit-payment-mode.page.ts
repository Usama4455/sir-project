import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../providers/loading/loading.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../providers/config/config.service';
import {NavController} from '@ionic/angular';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-payment-mode',
  templateUrl: './edit-payment-mode.page.html',
  styleUrls: ['./edit-payment-mode.page.scss'],
})
export class EditPaymentModePage implements OnInit {

  constructor(
      public loading: LoadingService,
      public http: HttpClient,
      public config: ConfigService,
      public navCtrl: NavController,
      public shared: SharedDataService,
      public toastController: ToastController,
  ) { }

  disableButton() {

    if (
        this.shared.bankName == ''
        || this.shared.accountNumber == ''
        || this.shared.branchName == ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  async submit() {
    this.loading.show();
    const updated_payment_info = {
      bank_name : this.shared.bankName,
      account_number : this.shared.accountNumber,
      branch : this.shared.branchName,
    };
    const url = this.config.url + '/wp-json/my-life/v1/update-payment-info';
    const res = await this.config.postWithUrlAuth(url, updated_payment_info);
    this.loading.hide();
    if (res === true) {
      this.successToast()
      this.navCtrl.navigateRoot("view-payment-mode");
      console.log(res);
      this.loading.hide();

    } else {
      this.errorToast();
      console.log(res);
    }

  }

  async successToast() {
    const toast = await this.toastController.create({
      message: 'Payment Info updated successfully',
      duration: 2000
    });
    toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Unable to update payment info',
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

}
