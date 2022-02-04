import {Component, OnInit, ViewChild, ElementRef, ApplicationRef} from '@angular/core';
import { IonInfiniteScroll, IonSlides} from '@ionic/angular';
import { NavController, IonContent } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { NavigationExtras, Router } from '@angular/router';
import {FirebaseService} from '../../services/firebase.service';
import {LoadingService} from '../../../providers/loading/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild('recentSlider', {static: false}) slider: IonSlides;
  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;
  parent: any;
  products: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  productIndex = 0;
  page = 1;
  categories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  cat = 1;

  segments = "topSeller"//first segment by default 
  scrollTopButton = false;//for scroll down fab 
  //for product slider after banner
  sliderConfig = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }


  constructor(
      public nav: NavController,
      public config: ConfigService,
      public router: Router,
      public shared: SharedDataService,
      private applicationRef: ApplicationRef,
      private fireService: FirebaseService,
      public loading: LoadingService,
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }

  ionViewWillEnter() {
    this.getCategories();
    this.getFilterdProducts();
    // this.fbService.updateCategoriesSubject.next(true);
  }


  // For FAB Scroll
  onScroll(e) {
    if (e.detail.scrollTop >= 500) {
      this.scrollTopButton = true;
    }
    if (e.detail.scrollTop < 500) {
      this.scrollTopButton = false;
    }
  }

  // For Scroll To Top Content
  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }

  openProducts(value) {
    this.nav.navigateForward("/products/0/0/" + value);
  }

  openProductsShadow(id, name) {
    /** let count = 0;
     for (let val of this.shared.allCategories) {
      if (val.parent == id) {
        count++;
      }
    } */
    this.nav.navigateForward("/products/" + id + "/" + name + "/newest");
    //this.router.navigateByUrl("/products/" + id + "/" + name + "/newest");
  }

  ngAfterContentChecked() {
    //this.content.resize();
  }

  enableDisableInfiniteScroll(val) {
    this.infinite.disabled = !val;
  }

  getFilterdProducts() {
    this.fireService.updateProductsSubject.subscribe(state => {
      if (state) {
        if (this.page === 1) {
          this.products = [];
        }
        if (this.shared.realAllProducts.length !== 0) {
          this.page++;
        }
        const totalProducts = this.shared.realAllProducts.length;
        const tmpIndex = this.productIndex;
        for (let i = this.productIndex; i < totalProducts; i++) {
          this.productIndex = Number(i);
          this.products.push(this.shared.realAllProducts[i]);
          this.productIndex = this.productIndex + 1;
          if (i === (tmpIndex + 9)) {
            this.enableDisableInfiniteScroll(true);
            break;
          } else {
            this.enableDisableInfiniteScroll(false);
          }
        }
        this.infinite.complete();
        this.applicationRef.tick();
      } else {
        console.log(state);
      }
    });
  }

  /****************************************/
  getCategories() {
    this.fireService.updateCategoriesSubject.subscribe(state => {
      if (state) {

        if (this.cat === 1) {
          this.categories = [];
        }
        if (this.shared.categories.length !== 0) {
          this.cat++;
        }
        this.categories = this.shared.getCategoriesPageItems(this.parent);
      } else {
        console.log(state);
      }
    });
  }
}
