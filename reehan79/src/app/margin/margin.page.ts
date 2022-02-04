import { Component, OnInit, ViewChild } from '@angular/core';
import {NavController} from '@ionic/angular';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import {IonInput} from '@ionic/angular';

@Component({
  selector: 'app-margin',
  templateUrl: './margin.page.html',
  styleUrls: ['./margin.page.scss'],
})
export class MarginPage implements OnInit {
@ViewChild('totalInput', {  static: false })  inputElement: IonInput;

  totalPrice = this.shared.totalCartPrice;
  retailPrice = this.totalPrice + 0.3 * this.totalPrice;
  cashToCollectFromCustomer: number;
  earnedMargin: number;
  showToolTip = false;
  showToolTipRetail = false;
  proceedDisabled = true;
constructor(
      public navCtrl: NavController,
      public shared: SharedDataService,
  ) { }

  updateMargin() {
    const earnedMarginTmp = this.cashToCollectFromCustomer - this.totalPrice;
    this.retailPrice = this.totalPrice + 0.3 * this.totalPrice;
    // console.log(this.cashToCollectFromCustomer);
   console.log('retail Price:   ' + this.retailPrice);
   console.log('Earned Margin:  ' + earnedMarginTmp);
  if (earnedMarginTmp >= 0 && this.cashToCollectFromCustomer <= this.retailPrice) {
    this.showToolTip = false;
    this.showToolTipRetail = false;
    this.earnedMargin = earnedMarginTmp;
    this.shared.totalMarginPrice = this.earnedMargin;
    this.shared.cashToCollectFromCustomer = this.cashToCollectFromCustomer;
    this.proceedDisabled = false;
  } else if (earnedMarginTmp < 0) {
    this.showToolTip = true;
    this.showToolTipRetail = false;
    this.earnedMargin = null;
    this.proceedDisabled = true;
  } else if (this.cashToCollectFromCustomer > this.retailPrice) {
    this.showToolTip = false;
    this.showToolTipRetail = true;
    this.earnedMargin = null;
    this.proceedDisabled = true;
  } else {
    this.earnedMargin = null;
    this.proceedDisabled = true;
  }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.inputElement.setFocus();
    }, 400);
  }

  proceedToAddresses() {
    this.navCtrl.navigateForward("all-addresses");
  }

  closeChip() {
    this.showToolTip = false;
    this.showToolTipRetail = false;
  }
  ngOnInit() {
  }

}
