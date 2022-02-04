import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../providers/loading/loading.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../providers/config/config.service';
import {NavController} from '@ionic/angular';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {
  tolalPaid = "";
  paidLastmonth = 0;
  floatingBalance = "";
  nextPaymentAmount = "";
  response: any;
  paymentHistory: any;
  todayDate: any;

  constructor(
      public loading: LoadingService,
      public http: HttpClient,
      public config: ConfigService,
      public navCtrl: NavController,
      public shared: SharedDataService,
  ) {
    this.getPaymentHistoryData();
    this.todayDate = formatDate(new Date(), 'dd-MM-yyyy', 'en');

  }
  async getPaymentHistoryData(){
    this.loading.show();
    const url = this.config.url + '/wp-json/my-life/v1/payment-history';
    this.response = await this.config.getWithUrlAuth(url);
    this.loading.hide();
    if (this.response !== '') {
      this.tolalPaid = (this.response.paid_amount[0].paid_amount);
      if (this.tolalPaid === null) {this.tolalPaid = (0).toString();}
      this.nextPaymentAmount = this.response.next_payment[0].to_be_paid;
      this.floatingBalance = this.response.floating[0].floating;
      this.paymentHistory = this.response.payment_history;
      this.loading.hide();

      console.log(this.tolalPaid);
    }
  }

  ngOnInit() {
  }

}
