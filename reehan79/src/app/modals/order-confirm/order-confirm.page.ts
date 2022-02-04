import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams} from '@ionic/angular';
import {LoadingService} from '../../../providers/loading/loading.service';
import {SharedDataService} from '../../../providers/shared-data/shared-data.service';
import {SelectZonesPage} from '../select-zones/select-zones.page';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.page.html',
  styleUrls: ['./order-confirm.page.scss'],
})
export class OrderConfirmPage implements OnInit {
  @Input('order') order;
  constructor(
      public modalCtrl: ModalController,
      public loading: LoadingService,
      public shared: SharedDataService,
      public navCtrl: NavController,
  ) {

  }

  ionViewWillEnter(){
   // let order = this.navParams.get('order');
    console.log(this.order);
  }

  dismiss() {
    this.modalCtrl.dismiss().then(() => {
      this.navCtrl.navigateRoot("/tabs");
    });
  }

  ionViewWillLeave() {
    this.dismiss();
  }
  ngOnInit() {
  }

}
