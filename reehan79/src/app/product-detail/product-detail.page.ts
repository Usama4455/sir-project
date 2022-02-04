import { Component, OnInit, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { HttpClient } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  public product;

  selectAttributes = new Array;
  selectedVariation = null;
  quantity = 1;
  discount_price;
  product_price;
  releatedItems = []; // <!-- 2.0 updates -->
  reviews = [];// <!-- 2.0 updates -->
  ratingStarsValue = null;// <!-- 2.0 updates -->
  allVariableAttributes = [];
  tempAllVariableAttributes = [];
  attributes = [];
  public isLiked = 0;
  public wishArray = [];
  public disableCartButton = false;
  public variations = new Array;
  public groupProducts = new Array;
  public variationPrice = null;
  public loaderWcVendorInfo = false;
  public wcVendorInfo: any;
  public loaderProductVariations = false;
  pId: any;
  sliderConfigReleatedItems = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public shared: SharedDataService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public iab: InAppBrowser,
    private storage: Storage,
    public http: HttpClient,

    private applicationRef: ApplicationRef,
    private socialSharing: SocialSharing,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.pId = this.activatedRoute.snapshot.paramMap.get('id');
    this.product = JSON.parse(JSON.stringify(this.getProductData(this.pId)));

    if (this.product.hasOwnProperty('attributes')) {
      this.attributes = JSON.parse(JSON.stringify(this.product.attributes));
    }

    this.storage.get('wishListProducts').then((val) => {
      this.wishArray = val;
      this.checkWishList();
    });
    this.enableDisbaleCartButton();
    if (this.product.type == 'variable') { this.getVariations(); }
    if (this.product.type == 'grouped') { this.getGroupProducts(); }
    this.getRelatedItems();
    this.getProductReviews();

    if (this.config.showWcVendorInfo) this.getWcVendorInfo();
  }
  ionViewWillEnter() {
    this.enableDisbaleCartButton();
  }
  getProductData(id) {
    let p;
    this.shared.singleProductPageData.forEach(element => {
      if (element.id == id) {
        p = element;
      }
    });
    return p;
  }
  ngOnInit() {

  }
  //=================================================================================================================================================================================
  getGroupProducts() {
    //this.loading.show();
    let count = 0;
    for (let value of this.product.grouped_products) {
      count++;
      this.config.getWoo("products/" + value + "?" + this.config.productsArguments).then(data => {
        this.groupProducts.push(Object.assign(data, { quantity: 0 }));
        this.applicationRef.tick();
      });
      if (count == this.product.grouped_products.length) {
        //this.loading.hide();
      }
    }
  }
  //===============================================================================================================================
  getVariations() {
    let count = 0;
    this.loaderProductVariations = true;
    for (let value of this.product.variations) {
      this.config.getWoo("products/" + value + "?" + this.config.productsArguments).then(data => {
        count++;
        let d = data
        this.variations.push(d);
        this.initializeAllVariationAttributes(d);
        //console.log(count);
        if (count == this.product.variations.length) {
          this.loaderProductVariations = false;
          this.applicationRef.tick();
          console.log('variation: ' + this.variations);
        }
      });
    }
  }
  //===============================================================================================================================
  initializeAllVariationAttributes(p) {
    let ob: { [k: string]: any } = {};
    ob.id = p.id;
    ob.select = false;
    for (let val of this.attributes) {
      if (val.variation == false) continue;
      ob[val.name] = 'any';
      for (let v2 of p.attributes) {
        if (val.name.toUpperCase() == v2.name.toUpperCase()) ob[val.name] = v2.option;
      }
    }
    this.allVariableAttributes.push(ob);
    if (this.allVariableAttributes.length == this.product.variations.length) this.sortAllVariationAttributes();
  }
  //===============================================================================================================================
  sortAllVariationAttributes() {
    let array = [];
    for (let val of this.product.variations) {
      for (let v2 of this.allVariableAttributes) {
        if (val == v2.id) array.push(v2);
      }
    }
    this.allVariableAttributes = array;
    console.log(this.allVariableAttributes);
  }
  availableOption(name, val) {
    if (this.selectAttributes.length == 0) return true;
    for (let value of this.tempAllVariableAttributes) {
      if (value.select == true) {
        if (value[name] == 'any') return true;
        if (value[name] == val) return true;
      }
    }
  }
  //checking avalability of option in all variations
  sortAttributes() {
    this.tempAllVariableAttributes = JSON.parse(JSON.stringify(this.allVariableAttributes));
    let count = 0;
    for (let x of this.selectAttributes) {

      for (let y of this.tempAllVariableAttributes) {
        if (y[x.key] == x.value || y[x.key] == 'any') {

          if (count == 0) { y.select = true; }
          else {
            if (y.select == true) y.select = true;
            else y.select = false;
          }
          console.log(y[x.key] + "   ---  " + x.value);
        }
        else y.select = false;

      }
      count++;
    }
    console.log("attributes after select");
    console.log(this.tempAllVariableAttributes);
  }
  // reset attributes and selection
  resetAttributes() {
    console.log("reset att");
    this.tempAllVariableAttributes = JSON.parse(JSON.stringify(this.allVariableAttributes));
    this.selectAttributes = [];
    this.attributes = JSON.parse(JSON.stringify(this.product.attributes));
    this.selectedVariation = null;
    this.enableDisbaleCartButton();
    this.product = JSON.parse(JSON.stringify(this.getProductData(this.pId)));
  }
  //===============================================================================================================================
  getAttributesLength() {
    let count = 0;
    for (let a of this.attributes) {
      if (a.variation) count++;
    }
    return count;
  }

  //===============================================================================================================================
  enableDisbaleCartButton() {
    // if (this.product.type == 'external') this.disableCartButton = true;
    // else
    if (this.product.type != 'variable' && this.product.stock_status == 'instock') this.disableCartButton = false;
    else if (this.selectAttributes.length == this.getAttributesLength() && this.product.stock_status == 'instock')
      this.disableCartButton = false; else this.disableCartButton = true;
    console.log("disbale cart button " + this.disableCartButton);
    this.applicationRef.tick();
  }
  //===============================================================================================================================
  checkWishList() {
    //getting wishList items from local storage
    let count = 0;
    if (this.wishArray != null)
      for (let value of this.wishArray) {
        if (value.id == this.product.id) count++;
      }
    if (count != 0) this.isLiked = 1; else this.isLiked = 0;

  }
  //===============================================================================================================================
  openProduct() {
    this.loading.autoHide(2000);
    this.iab.create(this.product.external_url, "blank");
  }

  addToCartProduct() {
    let total = 0;

    //this.loading.autoHide(500);
    console.log(this.selectAttributes);
    if (this.product.type == 'variable') {
      console.log(this.selectedVariation);
      console.log(this.selectAttributes);
      this.shared.addToCart(this.product, this.selectedVariation, this.quantity, this.selectAttributes);
      this.navCtrl.pop();

      //this.navCtrl.push(CartPage);
    }
    if (this.product.type == 'simple') {
      this.shared.addToCart(this.product, null, this.quantity, null);
      this.navCtrl.pop();
      //this.navCtrl.push(CartPage);
    }
    if (this.product.type == 'grouped') {

      for (let a of this.groupProducts) {
        total = total + a.quantity;
      }
      if (total == 0) this.shared.translateString("Please Add Quantity").then((res) => { this.shared.showAlert(res); });
      else
        for (let value of this.groupProducts) {
          if (value.quantity != 0) this.shared.addToCart(value, null, value.quantity, null);
        }
      if (total != 0) {
        this.navCtrl.pop();
        //this.navCtrl.push(CartPage);
      }
    }


  }

  //===============================================================================================================================
  //function adding attibute into array
  fillAttributes = function (val, key, position) {
    console.log(key + "  " + val);
    let count = 0;
    this.selectAttributes.forEach((value, index) => {
      if (value.position == position) { value.value = val; count++; }
      if (val == 'choose' && value.position == position) { this.selectAttributes.splice(index, 1); console.log("splice " + value.key + "  " + value.value); }

    });
    if (count == 0 && val != "choose") this.selectAttributes.push({ key: key, value: val, position: position });

    this.sortAttributes();
    if (this.getAttributesLength() == this.selectAttributes.length)
      this.selectVariation();
    if (this.selectAttributes.length != this.getAttributesLength()) {
      this.updateProductDetail(JSON.parse(JSON.stringify(this.getProductData(this.pId))));
      this.variationPrice = null;
    }
    console.log(this.selectAttributes);
    this.enableDisbaleCartButton();
  }

  //===============================================================================================================================
  selectVariation() {
    let pId = null;
    for (let i of this.tempAllVariableAttributes) {
      if (i.select == true) { pId = i.id; break; }
    }
    for (let i of this.variations) {
      if (i.id == pId) { this.selectedVariation = i; break; }
    }
    if (this.selectAttributes != null)
      this.updateProductDetail(this.selectedVariation);
    console.log(this.product);
  }
  //===============================================================================================================================
  updateProductDetail(p) {
    // console.log(p);
    let oldProduct = JSON.parse(JSON.stringify(this.getProductData(this.pId)));
    this.product.name = p.name;
    this.product.price_html = p.price_html;

    if (p.images[0].shop_catalog.indexOf('placeholder') == -1) {
      this.product.images = this.removeDuplication(p.images.concat(oldProduct.images));
    }

  }
  removeDuplication(array) {

    var a = array.concat();
    console.log(a);
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i].src === a[j].src)
          a.splice(j--, 1);
      }
    }
    console.log(a);
    return a;
  }
  //==============================================================================================================================================  
  //calculating total price  
  calculatingTotalPrice = function () {
    var price = parseFloat(this.product.products_price.toString());
    if (this.product.discount_price != null || this.product.discount_price != undefined)
      price = this.product.discount_price;
    var totalPrice = this.shared.calculateFinalPriceService(this.attributes) + parseFloat(price.toString());

    if (this.product.discount_price != null || this.product.discount_price != undefined)
      this.discount_price = totalPrice;
    else
      this.product_price = totalPrice;
    //  console.log(totalPrice);
  };
  //===============================================================================================================================
  checkProductNew() {
    var pDate = new Date(this.product.date_created);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }
  //===============================================================================================================================
  qunatityGroupPlus = function (p) {
    //console.log(p.quantity);
    if (p.stock_quantity == null || p.stock_quantity > p.quantity) p.quantity++;
    else if (p.stock_quantity == p.quantity)
      this.shared.translateString("Product Quantity is Limited!").then((res) => { this.shared.showAlert(res); });
    this.applicationRef.tick();
    // console.log(p);
  }
  //===============================================================================================================================
  //function decreasing the quantity
  qunatityGroupMinus = function (p) {
    if (p.quantity != 0) {
      p.quantity--;
    }
    this.applicationRef.tick();
  }
  //===============================================================================================================================
  qunatityPlus = function () {
    if (this.product.stock_quantity == null || this.product.stock_quantity > this.quantity) this.quantity++;
    else if (this.product.stock_quantity == this.quantity)
      this.shared.translateString("Product Quantity is Limited!").then((res) => { this.shared.showAlert(res); });
    this.applicationRef.tick();
  }
  //===============================================================================================================================
  //function decreasing the quantity
  qunatityMinus = function () {
    if (this.quantity != 1) {
      this.quantity--;
    }
    this.applicationRef.tick();
  }

  quantityChange() {
    console.log("quantity updated");

    if (this.product.stock_quantity == null) { console.log("quantity is unlimited"); }
    else if (this.product.stock_quantity > this.quantity) { console.log("quantity is less than stock quantity"); }
    else if (this.product.stock_quantity < this.quantity) {
      this.shared.translateString("Product Quantity is Limited!").then((res) => {
        if (this.product.stock_quantity == null)
          this.quantity = 1;
        else
          this.quantity = parseInt(this.product.stock_quantity);
        this.shared.showAlert(res);
      })
    }
    if (this.quantity == null || this.quantity == 0 || this.quantity < 0) { this.quantity = 1; }
    this.applicationRef.tick();
  }

  //===============================================================================================================================
  showProductDetail(id) {

    this.loading.show();
    this.config.getWoo("products/" + id + "?" + this.config.productsArguments).then((data: any) => {
      //this.shared.showAlert("loaded");
      this.loading.hide();
      let p = data
      this.shared.singleProductPageData.push(p);
      this.navCtrl.navigateForward("product-detail/" + p.id);
    }, err => {
      this.loading.hide();
      console.log(err);
    });

    this.shared.addToRecent(this.product);

  }
  //===============================================================================================================================
  share() {
    this.loading.autoHide(1000);
    // Share via email
    /** this.socialSharing.share(
      this.product.name,
      this.product.name,
      this.product.images[0].src,
      this.product.permalink); */

    this.socialSharing.shareViaWhatsApp('Hello,', null, null)
        .then((res) => {
          console.log('Message Shared');
        })
        .catch((err) => {
          console.log(err);
        });

  }
  //===============================================================================================================================
  clickWishList() {

    if (this.isLiked == 0) { this.addWishList(); }
    else { this.removeWishList(); }
  }
  //===============================================================================================================================
  addWishList() {
    this.shared.addWishList(this.product);
  }
  //===============================================================================================================================
  removeWishList() {
    this.shared.removeWishList(this.product);
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  getRelatedItems() {
    this.config.getWoo("products/?include=" + this.product.related_ids + "&" + this.config.productsArguments).then((data: any) => {
      this.releatedItems = data
      this.applicationRef.tick();
    });
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  getProductReviews() {
    this.config.getWoo("products/reviews/?" + this.config.productsArguments + "&product=" + [this.pId]).then((data: any) => {
      this.reviews = data
      this.applicationRef.tick();
      this.totalRating();
    });
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  openReviewsPage() {
    this.navCtrl.navigateForward("/reviews/" + this.product.id);
  }
  //===============================================================================================================================
  // <!-- 2.0 updates -->
  totalRating() {
    let total = 0;
    for (let value of this.reviews) {
      total = total + value.rating;
    }

    let result = (total / this.reviews.length) * 20;
    if (total == 0) result = 0;
    this.ratingStarsValue = result;
    this.applicationRef.tick();


    //return result;
  }

  //==============================================================
  openStore(value) {
    if (this.config.showWcVendorInfo) {

      this.shared.storePageData.push(value);
      let id;
      if (value.ID) id = value.ID; if (value.id) id = value.id;
      this.navCtrl.navigateForward("/store/" + id);

    }
    else {
      this.loading.show();
      this.config.getWithUrl(this.config.url + "/wp-json/dokan/v1/stores/" + this.product.store.id).then((data: any) => {
        this.loading.hide();
        let d = data;

        this.shared.storePageData.push(d);
        let id;
        if (d.ID) id = d.ID; if (d.id) id = d.id;
        this.navCtrl.navigateForward("/store/" + id);

        this.applicationRef.tick();
      });
    }
  }

  getWcVendorInfo() {
    this.loaderWcVendorInfo = true;
    this.config.getWithUrl(this.config.url + "/api/appsettings/get_vendor_info/?insecure=cool&product_id=" + this.product.id).then((data: any) => {
      this.loaderWcVendorInfo = false;
      let d = data;
      this.wcVendorInfo = data.data[0];
      this.applicationRef.tick();
    });
  }



}
