import { Component, OnInit } from '@angular/core';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {SelectZonesPage} from '../modals/select-zones/select-zones.page';
import {ModalController, NavController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../providers/config/config.service';
import {LoadingService} from '../../providers/loading/loading.service';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.page.html',
  styleUrls: ['./add-edit-address.page.scss'],
})
export class AddEditAddressPage implements OnInit {

  constructor(
      public shared: SharedDataService,
      public modalCtrl: ModalController,
      public navCtrl: NavController,
      public http: HttpClient,
      public config: ConfigService,
      public loading: LoadingService,
  ) { }

  async selectZonePage() {
    const modal = await this.modalCtrl.create({
      component: SelectZonesPage,
      componentProps: {
        page: 'shipping'
      }
    });
    return await modal.present();
  }

  async submit() {
    // this.navCtrl.navigateForward("billing-address");
    // this.navCtrl.navigateForward("shipping-method");
    this.loading.show();
    const customerNewAddress = {
      first_name : this.shared.shipping.first_name,
      last_name : this.shared.shipping.last_name,
      company : this.shared.shipping.company,
      country : this.shared.shipping.country,
      address_1 : this.shared.shipping.address_1,
      address_2 : this.shared.shipping.address_2,
      city : this.shared.shipping.city,
      state : this.shared.shipping.state,
      postcode : this.shared.shipping.postcode,
    };
    const url = this.config.url + '/wp-json/my-life/v1/add_address';
    await this.config.postWithUrlAuth(url, customerNewAddress).then((res) => {
      this.navCtrl.navigateForward('order-api');
      this.loading.hide();
    });
  }
  disableButton() {

    if (
        this.shared.shipping.first_name == ''
        || this.shared.shipping.last_name == ''
        || this.shared.shipping.city == ''
        || this.shared.shipping.postcode == ''
        || this.shared.shipping.state == ''
        || this.shared.shipping.country == ''
        || this.shared.shipping.address_1 == ''
        || this.shared.shipping.state == null
        || this.shared.shipping.city == null
        || this.shared.shipping.postcode == null
        || this.shared.shippingStateName == ''
    ) {
      return true;
    } else {
      return false;
    }
  }
  ngOnInit() {
  }

}
