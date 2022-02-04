import { Component, OnInit } from '@angular/core';
import {ConfigService} from '../../providers/config/config.service';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {LoadingService} from '../../providers/loading/loading.service';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {SelectZonesPage} from '../modals/select-zones/select-zones.page';
import {OrderConfirmPage} from '../modals/order-confirm/order-confirm.page';

@Component({
  selector: 'app-order-api',
  templateUrl: './order-api.page.html',
  styleUrls: ['./order-api.page.scss'],
})
export class OrderApiPage implements OnInit {

  fullName = '';
  addressFirst ='';
  addressLast ='';
  cityCountry ='';
  constructor(
      public config: ConfigService,
      public shared: SharedDataService,
      public loading: LoadingService,
      public toastController: ToastController,
      public navCtrl: NavController,
      public modalCtrl: ModalController,
  ) {
    this.fullName = this.shared.shipping.first_name + ' ' + this.shared.shipping.last_name;
    this.addressFirst = this.shared.shipping.address_1 + ',';
    this.addressLast = this.shared.shipping.address_2;
    this.cityCountry = this.shared.shipping.city + ' , ' + this.shared.shipping.state +
        ' , ' + this.shared.shippingCountryName + ' , ' + this.shared.shipping.postcode;
  }


  async proceedToPlaceOrder() {
 this.loading.show();
    let data = {
      payment_method: 'cod',
      payment_method_title: 'Cash on delivery',
      set_paid: false,
      status: 'processing',
      customer_id: this.shared.customerData.id,
      billing: {
        first_name: '',
        last_name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        email: '',
        phone: ''
      },
      shipping: {
        first_name: '',
        last_name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: ''
      },
      line_items: [],
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: '0'
        }
      ],
      fee_lines: [
        {
          name: 'margin',
          total: this.shared.totalMarginPrice.toString(),
        }
      ]
    };

    data.billing.first_name = this.shared.shipping.first_name;
    data.billing.last_name = this.shared.shipping.last_name;
    data.billing.address_1 = this.shared.shipping.address_1;
    data.billing.address_2 = this.shared.shipping.address_2;
    data.billing.city = this.shared.shipping.city;
    data.billing.state = this.shared.shipping.state;
    data.billing.postcode = this.shared.shipping.postcode;
    data.billing.country = this.shared.shipping.country;
    data.billing.phone = this.shared.shipping.company.toString();
    data.billing.email =  'rehan_59@hotmail.com';

    data.shipping.first_name = this.shared.shipping.first_name;
    data.shipping.last_name = this.shared.shipping.last_name;
    data.shipping.address_1 = this.shared.shipping.address_1;
    data.shipping.address_2 = this.shared.shipping.address_2;
    data.shipping.city = this.shared.shipping.city;
    data.shipping.state = this.shared.shipping.state;
    data.shipping.postcode = this.shared.shipping.postcode;
    data.shipping.country = this.shared.shipping.country;

    if (this.shared.cartquantity !== 0) {
      const cartProducts = [];
      const cartProductsItems = {
        product_id: "",
        quantity: ""
      };
      const cartProductsItemsVariation = {
        product_id: "",
        variation_id: "",
        quantity: ""
      };

      this.shared.cartProducts.forEach((value, index) => {
        if (value.variation_id != undefined) {
          cartProductsItemsVariation.product_id = value.product_id;
          cartProductsItemsVariation.variation_id = value.variation_id;
          cartProductsItemsVariation.quantity = value.quantity;
          data.line_items.push(cartProductsItemsVariation);
          console.log("Variation Cart Products: " + cartProductsItemsVariation);

        } else {
          cartProductsItems.product_id = value.product_id;
          cartProductsItems.quantity = value.quantity;
          data.line_items.push(cartProductsItems);
          console.log("Simple Cart Products: " + cartProductsItems);
          console.log("Cart Products: " + cartProducts);
        }
      });
      //const url = this.config.url + '/wp-json/wc/v3/orders';
      const url = this.config.url + '/wp-json/my-life/v1/place_order';

        await this.config.postWithUrlAuth(url, data).then((res) => {
        console.log(res);
        this.shared.orderComplete();
        this.loading.hide();
        this.openConfirmation(res).then(() => {
            this.navCtrl.navigateRoot("/tabs");
        });
      }).catch((err) => {
        console.log(err);
        this.loading.hide();
        this.presentToastOrder();
      });
     // this.presentToastOrder();
     // await this.navCtrl.navigateForward("home");
    } else {
      this.loading.hide();
        this.presentToast();

    }


    }

  async openConfirmation(order) {
    const modal = await this.modalCtrl.create({
      component: OrderConfirmPage,
      componentProps: {
        order: order,
      }
    });
    return await modal.present();
  }

  async presentToastOrder() {
    const toast = await this.toastController.create({
      message: 'Unable to place order',
      duration: 3000
    });
    toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'The Shopping Cart is Empty',
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

}
