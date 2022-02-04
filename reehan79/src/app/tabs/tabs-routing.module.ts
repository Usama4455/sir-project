import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
    {
      path: 'tabs',
      component: TabsPage,
      children:
        [
          {
            path: 'home',
            children:
              [
                {
                  path: '',
                  loadChildren: '../home-pages/home/home.module#HomePageModule',
                  canActivate: [AuthGuard],
                }
              ]
          },
          {
            path: 'categories',
            children:
              [
                {
                  path: '',
                  loadChildren: '../categorie-pages/categories/categories.module#CategoriesPageModule'
                }
              ]
          },
          {
            path: 'orders',
            children:
              [
                {
                  path: '',
                  loadChildren: '../my-orders/my-orders.module#MyOrdersPageModule'
                }
              ]
          },
          {
            path: 'help',
            children:
              [
                {
                  path: '',
                  loadChildren: '../news/news.module#NewsPageModule'
                }
              ]
          },
  
          {
            path: 'account',
            children:
              [
                {
                  path: '',
                  loadChildren: '../settings/settings.module#SettingsPageModule'
                }
              ]
          },
  
          {
            path: '',
            redirectTo: '/tabs/home',
            pathMatch: 'full'
          }
        ]
    },

    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
  
  ];


  @NgModule({
    imports:
      [
        RouterModule.forChild(routes)
      ],
    exports:
      [
        RouterModule
      ]
  })
  export class TabsPageRoutingModule {}
