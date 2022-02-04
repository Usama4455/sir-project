import { Component, OnInit } from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {LoadingService} from '../../providers/loading/loading.service';
import {ConfigService} from '../../providers/config/config.service';
import {element} from 'protractor';

@Component({
  selector: 'app-all-addresses',
  templateUrl: './all-addresses.page.html',
  styleUrls: ['./all-addresses.page.scss'],
})
export class AllAddressesPage implements OnInit {

  // tslint:disable-next-line:variable-name
   all_address: any;
  // defaultSelectedRadio = "radio_2";
  // Get value on ionChange on IonRadioGroup
  selectedRadioGroup: any;
  // Get value on ionSelect on IonRadio item
  selectedRadioItem: any;
  getCheckedStatus = false;
  leftButtonText = 'Add New Address';
  constructor(
      public navCtrl: NavController,
      public shared: SharedDataService,
      public loading: LoadingService,
      public config: ConfigService,
      private toastCtrl: ToastController,
  ) {

    /** this.config.getWithUrl(this.config.url + '/wp-json/my-life/v1/address?customer_id=' + this.shared.customerData.id).then((data: any) => {
      this.all_address = data;

      this.loading.hide();
      console.log(this.all_address[0].shipping_first_name);
      console.log(this.all_address);

    }); */

   /** this.config.getWithUrlAuth(this.config.url + '/wp-json/my-life/v1/address?customer_id=' + this.shared.customerData.id).then((data: any) => {
      this.all_address = data;
      this.loading.hide();
      console.log(this.all_address[0].shipping_first_name);
      console.log(this.all_address);
    }); */
  }

  async getAllAddresses() {
    // tslint:disable-next-line:max-line-length
    this.config.getWithUrlAuth(this.config.url + '/wp-json/my-life/v1/address?customer_id=' + this.shared.customerData.id)
        .then(data => {
          this.all_address = data;
          console.log(this.all_address[0].shipping_first_name);
          console.log(this.all_address);
          this.loading.hide();
        })
        .catch((err) => {
          this.loading.hide();
          console.log('No Recently Used Address');
          this.toast(err);
          return;
        });

   /** this.all_address = await this.config.getWithUrlAuth(this.config.url + '/wp-json/my-life/v1/address?customer_id=' + this.shared.customerData.id)
        .catch((err) => {
          console.log(err);
          this.toast(err);
          return;
        });
    console.log(this.all_address[0].shipping_first_name);
    console.log(this.all_address);
    this.loading.hide();*/
    }

  ionViewWillEnter() {

    this.loading.show();
    this.getAllAddresses();
    // console.log(this.all_address.shipping.shipping_first_name);
  }

  radioGroupChange(event) {
    if (event.detail.value == null) {
      this.leftButtonText = 'Add New Address';
      this.getCheckedStatus = false;

      this.shared.shipping.first_name = '';
      this.shared.shipping.last_name = '';
      this.shared.shipping.company = '';
      this.shared.shipping.address_1 = '';
      this.shared.shipping.address_2 = '';
      this.shared.shipping.country = 'PK';
      this.shared.shippingCountryName = 'Pakistan';
      this.shared.shipping.state = null;
      this.shared.shipping.postcode = null;
      this.shared.shipping.city = '';
      this.shared.shippingStateName = '';
    } else {
      this.radioSelect(event);
    }


    console.log(this.getCheckedStatus);
    console.log('radioGroupChange', event.detail);
    this.selectedRadioGroup = event.detail;

  }


  radioSelect(event) {
    this.leftButtonText = 'Edit Address';
    this.getCheckedStatus = true;
    this.shared.shipping.first_name = this.all_address[event.detail.value].shipping_first_name;
    this.shared.shipping.last_name = this.all_address[event.detail.value].shipping_last_name;
    this.shared.shipping.company = this.all_address[event.detail.value].shipping_company;
    this.shared.shipping.address_1 = this.all_address[event.detail.value].shipping_address_1;
    this.shared.shipping.address_2 = this.all_address[event.detail.value].shipping_address_2;
    this.shared.shipping.city = this.all_address[event.detail.value].shipping_city;
    this.shared.shipping.country = 'PK';
    this.shared.shippingCountryName = 'Pakistan';
    this.shared.shipping.state = this.all_address[event.detail.value].shipping_state;
    this.shared.shipping.postcode = this.all_address[event.detail.value].shipping_postcode;
    // this.shared.shippingStateName = this.all_address[event.detail.value].shipping_state;
    console.log('radioSelect', event.detail);
    this.selectedRadioItem = event.detail;
  }


  ifDisabled() {
    if (this.getCheckedStatus === false) {
      return true;
    } else {
      return false;
    }
  }

  proceedToAddNewAddress() {
    this.shared.shipping.country = 'PK';
    this.shared.shippingCountryName = 'Pakistan';
    this.navCtrl.navigateForward('add-edit-address');

  }

  proceedToOrderApi() {
    this.navCtrl.navigateForward('order-api');
  }

  async toast(msg) {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2500,
        position: 'bottom'
      });
      toast.present();
  }

  ngOnInit() {
  }

}
