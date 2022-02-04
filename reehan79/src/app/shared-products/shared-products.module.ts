import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NewProductsDisplayComponent} from '../../components/new-products-display/new-products-display.component';
import {IonicModule} from '@ionic/angular';
import {IonicImageLoader} from 'ionic-image-loader';



@NgModule({
  exports: [NewProductsDisplayComponent],
  declarations: [NewProductsDisplayComponent],
  imports: [
    CommonModule,
    IonicModule,
    IonicImageLoader
  ]
})
export class SharedProductsModule { }
