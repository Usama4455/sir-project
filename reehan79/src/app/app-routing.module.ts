import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{
  // path: '',
  //redirectTo: 'home',
  // pathMatch: 'full'
  //},
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsPageModule' },
  { path: 'add-review/:id', loadChildren: './add-review/add-review.module#AddReviewPageModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },
  { path: 'contact-us', loadChildren: './contact-us/contact-us.module#ContactUsPageModule' },
  { path: 'downloads', loadChildren: './downloads/downloads.module#DownloadsPageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'my-account', loadChildren: './my-account/my-account.module#MyAccountPageModule' },
  { path: 'my-orders', loadChildren: './my-orders/my-orders.module#MyOrdersPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'news-detail', loadChildren: './news-detail/news-detail.module#NewsDetailPageModule' },
  { path: 'news-list/:id/:name', loadChildren: './news-list/news-list.module#NewsListPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  { path: 'order', loadChildren: './order/order.module#OrderPageModule' },
  { path: 'product-detail/:id', loadChildren: './product-detail/product-detail.module#ProductDetailPageModule' },
  { path: 'products/:id/:name/:type', loadChildren: './products/products.module#ProductsPageModule' },
  { path: 'reviews/:id', loadChildren: './reviews/reviews.module#ReviewsPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },

  { path: 'store/:id', loadChildren: './store/store.module#StorePageModule' },
  
  { path: 'categories', loadChildren: './categorie-pages/categories/categories.module#CategoriesPageModule' },
  { path: 'categories/:parent/:name', loadChildren: './categorie-pages/categories/categories.module#CategoriesPageModule' },
  { path: 'home', loadChildren: './home-pages/home/home.module#HomePageModule' },
  { path: 'my-order-detail', loadChildren: './my-order-detail/my-order-detail.module#MyOrderDetailPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'margin', loadChildren: './margin/margin.module#MarginPageModule' },
  { path: 'all-addresses', loadChildren: './all-addresses/all-addresses.module#AllAddressesPageModule' },
  { path: 'add-edit-address', loadChildren: './add-edit-address/add-edit-address.module#AddEditAddressPageModule' },
  { path: 'order-api', loadChildren: './order-api/order-api.module#OrderApiPageModule' },
  { path: 'payment-history', loadChildren: './payment-history/payment-history.module#PaymentHistoryPageModule' },
  { path: 'view-payment-mode', loadChildren: './view-payment-mode/view-payment-mode.module#ViewPaymentModePageModule' },
  { path: 'edit-payment-mode', loadChildren: './edit-payment-mode/edit-payment-mode.module#EditPaymentModePageModule' },
  { path: 'sharing-progress', loadChildren: './sharing-progress/sharing-progress.module#SharingProgressPageModule' },
  { path: 'login-phone', loadChildren: './modals/login-phone/login-phone.module#LoginPhonePageModule' },
  { path: 'update-profile', loadChildren: './modals/update-profile/update-profile.module#UpdateProfilePageModule' },
  { path: 'first-page', loadChildren: './first-page/first-page.module#FirstPagePageModule' },
  { path: 'order-confirm', loadChildren: './modals/order-confirm/order-confirm.module#OrderConfirmPageModule' },

  // { path: 'scratch-card', loadChildren: './scratch-card/scratch-card.module#ScratchCardPageModule' },
  // { path: 'select-country', loadChildren: './select-country/select-country.module#SelectCountryPageModule' },
  // { path: 'select-zones', loadChildren: './select-zones/select-zones.module#SelectZonesPageModule' },
  // { path: 'refund-policy', loadChildren: './refund-policy/refund-policy.module#RefundPolicyPageModule' },
  // { path: 'privacy-policy', loadChildren: './privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  // { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  // { path: 'currency-list', loadChildren: './currency-list/currency-list.module#CurrencyListPageModule' },
  // { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  // { path: 'language', loadChildren: './language/language.module#LanguagePageModule' },
  // { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpPageModule' },
  // { path: 'term-services', loadChildren: './term-services/term-services.module#TermServicesPageModule' },
  // { path: 'blank-modal', loadChildren: './src/modals/blank-modal/blank-modal.module#BlankModalPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
