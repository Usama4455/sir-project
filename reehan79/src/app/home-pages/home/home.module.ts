import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { HomePage } from './home.page';
import { ShareModule } from 'src/components/share/share.module';
import { PipesModule } from 'src/pipes/pipes.module';
import {SharedProductsModule} from '../../shared-products/shared-products.module';
import {IonicImageLoader} from 'ionic-image-loader';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ShareModule,
        PipesModule,
        SharedProductsModule,
        IonicImageLoader
    ],
  declarations: [HomePage]
})
export class HomePageModule {}
