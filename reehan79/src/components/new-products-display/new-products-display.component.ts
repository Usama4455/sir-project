import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfigService} from '../../providers/config/config.service';
import {SharedDataService} from '../../providers/shared-data/shared-data.service';
import { ModalController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {LoadingService} from '../../providers/loading/loading.service';
import {SharingProgressPage} from '../../app/sharing-progress/sharing-progress.page';

@Component({
  selector: 'app-new-products-display',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './new-products-display.component.html',
  styleUrls: ['./new-products-display.component.scss'],
})
export class NewProductsDisplayComponent implements OnInit {
  @Input('data') p;//product data
  @Input('type') type;
  public isLiked = 0;
  public wishArray = [];
  public progress = 0;
  clicked = '';
  constructor(
      public config: ConfigService,
      public shared: SharedDataService,
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      private storage: Storage,
      public loading: LoadingService,
  ) {

    this.storage.get('wishListProducts').then((val) => {
      this.wishArray = val;
      this.checkWishList();
    });
  }

  ionViewDidEnter() {
  }


  checkWishList() {
    //getting wishList items from local storage
    let count = 0;
    if (this.wishArray != null)
      for (let value of this.wishArray) {
        if (value.id == this.p.id) count++;
      }
    if (count != 0) this.isLiked = 1; else this.isLiked = 0;

  }
  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.p.regular_price);
    var p2 = parseInt(this.p.sale_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }

  showProductDetail() {
    this.shared.singleProductPageData.push(this.p);
    this.navCtrl.navigateForward("product-detail/" + this.p.id);

    if (this.type != 'recent') {
      this.shared.addToRecent(this.p);
    }

  }

  checkProductNew() {
    var pDate = new Date(this.p.date_modified);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false;
  }

  addToCart() {
    this.shared.addToCart(this.p, null, null, null);
    //this.navCtrl.push(CartPage);
  }

  isInCart() {
    var found = false;

    for (let value of this.shared.cartProducts) {
      if (value.product_id == this.p.id) { found = true; }
    }

    if (found == true) return true;
    else return false;
  }
  removeRecent() {
    this.shared.removeRecent(this.p);
  }

  clickWishList() {
    // this.loading.autoHide(500);
    if (this.isLiked == 0) { this.addWishList(); }
    else { this.removeWishList(); }


  }
  addWishList() {
    this.shared.addWishList(this.p);
  }
  removeWishList() {
    this.shared.removeWishList(this.p);
  }

  ngOnChanges() {

  }
/**
  whatsAppShare() {
  this.downloadImage().then(() => {
    console.log(this.filePathArray);
    const imageArrayLength  =  Object.keys(this.filePathArray).length;
    console.log(imageArrayLength);
      if (imageArrayLength === this.p.number_of_images) {
        // cordova.plugins.socialsharing.shareViaWhatsApp('hello',this.filePathArray,null);


        this.socialSharing.shareViaWhatsApp('hello', this.filePathArray, null).then(() => {
          console.log('Ok');
        }).catch(() => {
          console.log('Error');
        });
        } else {
          console.log('The array numbers do not match');
        }
      }
  );
  } */

/**
 async  downloadImage() {
    this.filePathArray = [];
    for (let i = 0; i < this.p.number_of_images; i++) {
      const fileUri = this.p.images[i].src.toString();
      const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const filePath = this.file.cacheDirectory + fileName;
     // console.log(filePath);
      await this.http.downloadFile(fileUri, {}, {}, filePath).then(data => {
        console.log('success function call');
      //  console.log(data);
        this.filePathArray.push(filePath.toString());
      })
          .catch(error => {
            console.log('Error function call');
            console.log(error);
          });
    }
    } */
shareFunction() {
  this.openShareModal().then(() => {
    console.log('Successfully shared');
  });
}

  async openShareModal() {
    let modal = await this.modalCtrl.create({
      component: SharingProgressPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        p : this.p,
        h : 'hello',
        clicked: this.clicked,
      }
    });
    return await modal.present();
  }

  clickWhatsApp() {
  this.clicked = 'whatsapp';
  this.shareFunction();
  }

  clickFacebook() {
  this.clicked = 'facebook';
  this.shareFunction();
  }

  clickDownload() {
  this.clicked = 'download';
  this.shareFunction();
  }

  clickOthers() {
  this.clicked = 'others';
  this.shareFunction();
  }
  ngOnInit() {}

}
