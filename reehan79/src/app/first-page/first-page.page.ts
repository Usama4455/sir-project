import { Component, OnInit } from '@angular/core';
import {LoginPhonePage} from '../modals/login-phone/login-phone.page';
import {ModalController} from '@ionic/angular';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.page.html',
  styleUrls: ['./first-page.page.scss'],
})
export class FirstPagePage implements OnInit {

  constructor(
      public modalCtrl: ModalController,
      private fireAna: AngularFireAnalytics,
  ) { }

  async goToSignUpPage() {
    this.fireAna.logEvent('clicked_signup');
    const modal = await this.modalCtrl.create({
      component: LoginPhonePage,
    });
    return await modal.present();
  }

  ngOnInit() {
  }

}
