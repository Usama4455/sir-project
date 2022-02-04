import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import {Platform, NavController, ModalController} from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import {SelectZonesPage} from '../modals/select-zones/select-zones.page';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  myAccountData: { [k: string]: any } = {};
  password = '';
  addressOne = '';
  addressTwo = '';
  city = '';
  province = '';
  first_name = '';
  last_name = '';
  user_email = '';

  constructor(
    public http: HttpClient,
    public config: ConfigService,
    public shared: SharedDataService,
    public platform: Platform,
    public navCtrl: NavController,
    public applicationRef: ApplicationRef,
    public loading: LoadingService,
    public modalCtrl: ModalController,
    private storage: Storage,
  ) {
  }


  ngOnInit() {
  }

  async getUserMeta(){
    const url = this.config.url + '/wp-json/my-life/v1/get_user_meta';
    this.loading.show();
    return await this.config.getWithUrlAuth(url);
  }

  ionViewWillEnter() {
    this.first_name = this.shared.customerData.first_name;
    this.last_name = this.shared.customerData.last_name;
    this.user_email = this.shared.customerData.user_email;
    this.getUserMeta().then((data) => {
      console.log(data);
      this.addressOne = data[0].own_address_1;
      this.addressTwo = data[0].own_address_2;
      this.city = data[0].own_city;
      this.province = data[0].own_province;

      this.loading.hide();
        }).catch((err) => {
          this.loading.hide();
          console.log(err);
    });
  }


 async updateUserMeta() {
    this.loading.show();
  const new_meta_data = {
    own_address_1 : this.addressOne,
    own_address_2 : this.addressTwo,
    own_city : this.city,
    own_province: this.province,
    first_name: this.first_name,
    last_name: this.last_name,
    user_email: this.user_email,
  };
  const url = this.config.url + '/wp-json/my-life/v1/update_user_meta';
  const res = await this.config.postWithUrlAuth(url, new_meta_data).then(() => {
    this.config.getWoo("customers/" + this.shared.customerData.id + "?" + this.config.productsArguments).then((dataW: any) => {
      this.storage.set('customerData', dataW);
     // console.log(dataW);
      this.shared.customerData = dataW;
      this.shared.toast('Profile Updated');
      this.navCtrl.navigateRoot("/settings");
      this.loading.hide();
    }).catch(err => {
      this.loading.hide();
      this.shared.toast('Unable to update profile');
      this.navCtrl.navigateRoot("/settings");
    });
  }).catch((err) => {
    console.log(err);
    this.loading.hide();
    this.shared.toast('Unable to update profile');
    this.navCtrl.navigateRoot("/settings");
  });
}


}
