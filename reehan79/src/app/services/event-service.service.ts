import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
 deepLinkService = new Subject();
 homePageService = new Subject();
 subCategoryService = new Subject();
 settingsLoadedService = new Subject();

    constructor() { }

  publishDeepLinkService() {
    this.deepLinkService.next();
  }

  publishHomePageService() {
    this.homePageService.next();
  }

  publishSubCategoryService() {
    this.subCategoryService.next();
  }

}
