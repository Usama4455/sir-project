import {ApplicationRef, Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import {FirebaseService} from '../../services/firebase.service';
import {LoadingService} from '../../../providers/loading/loading.service';
import { NgZone  } from '@angular/core';
import {IonInfiniteScroll, NavController} from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  parent: any;
  name: any;
  categories: any = [];
  productIndex = 0;
  resultArray = [];
  catId;
  products: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  page = 1;
  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;

  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private fbService: FirebaseService,
    public loading: LoadingService,
    public navCtrl: NavController,
    private applicationRef: ApplicationRef,
  ) {
    this.fbService.updateCategoriesSubject.subscribe(state => {
      if (state) {
      let id;
      let name;
      this.loading.hide();
      //this.getFilterdProducts();
      } else {
      this.loading.show();
      }
    });
  }
  ngOnInit() {
    this.parent = this.activatedRoute.snapshot.paramMap.get('parent');
    this.catId = Number(this.parent);
    this.name = this.activatedRoute.snapshot.paramMap.get('name');
    console.log(this.parent);
    console.log(this.name);
  }

  ionViewWillEnter() {
    this.getFilterdProducts();
   // this.fbService.updateCategoriesSubject.next(true);
  }
  openProducts(id, name) {
    let count = 0;
    for (let val of this.shared.allCategories) {
      if (val.parent == id) {
        count++;
      }
    }
    if (count == 0) {
      this.router.navigateByUrl("/products/" + id + "/" + name + "/newest");
    }
    else {
      this.router.navigateByUrl("/categories/" + id + "/" + name);
    }

  }
  openParentProducts() {
    this.router.navigateByUrl("/products/" + this.parent + "/" + this.name + "/newest");
  }

  /****************************************************/
  enableDisableInfiniteScroll(val) {
    this.infinite.disabled = !val;
  }

  findProductsWithCat(catId, productIndex) {
    let resultArray = [];
    const arrayLength = this.shared.realAllProducts.length;
    let i = 0;
    for (i = productIndex; i < arrayLength; i++) {
      const tmp = this.shared.realAllProducts[i];
      for (let j in tmp.cat) {
        if (tmp.cat[j] === Number(catId)) {
          resultArray.push(tmp);
          break;
        }
      }
      this.productIndex = Number(i);
      if (i === (productIndex + 9)) break;
    }
    return resultArray;
  }

  getFilterdProducts() {
    if ( this.catId !== 0) {
      const dat = this.findProductsWithCat(this.catId, this.productIndex);
      if (this.page === 1) { this.products = [];}
      if (dat.length !== 0) { this.page++; }
      for (const value of dat) {
        this.products.push(value);
      }

      if (dat.length == 0 || dat.length < 10) {
        this.enableDisableInfiniteScroll(false);
      } else {
        this.enableDisableInfiniteScroll(true);
      }
      this.infinite.complete();
      this.applicationRef.tick();
    } else {
      const totalProducts = this.shared.realAllProducts.length;
      if (this.page === 1) { this.products = []; this.productIndex = 0;}
      if (totalProducts !== 0) { this.page++;}
      const tmpIndex = this.productIndex;
      for (let i = this.productIndex; i < totalProducts; i++ ) {
        this.productIndex = Number(i);
        this.products.push(this.shared.realAllProducts[i]);
        this.productIndex = this.productIndex + 1;
        if (i === (tmpIndex + 9)) {
          this.enableDisableInfiniteScroll(true);
          break;
        } else { this.enableDisableInfiniteScroll(false); }
      }
      this.infinite.complete();
      this.applicationRef.tick();
    }
  }

  reset() {
    this.page = 1;
    this.resultArray = [];
  }
}

