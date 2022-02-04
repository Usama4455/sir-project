import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductsPage } from './products.page';
import { PipesModule } from 'src/pipes/pipes.module';
import { ShareModule } from 'src/components/share/share.module';
import {NewProductsDisplayComponent} from '../../components/new-products-display/new-products-display.component';
import {IonicImageLoader} from 'ionic-image-loader';
import {SharedProductsModule} from '../shared-products/shared-products.module';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage
  }
];

@NgModule({
  exports: [
    NewProductsDisplayComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    ShareModule,
    IonicImageLoader,
    SharedProductsModule,
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
