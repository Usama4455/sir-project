import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CategoriesPage } from './categories.page';
import { PipesModule } from 'src/pipes/pipes.module';
import {IonicImageLoader} from 'ionic-image-loader';
import {SharedProductsModule} from '../../shared-products/shared-products.module';
// @ts-ignore
const routes: Routes = [
  {
    path: '',
    component: CategoriesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    IonicImageLoader,
    SharedProductsModule,
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}
