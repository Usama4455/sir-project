import { Injectable } from '@angular/core';
//import {AngularFirestore} from '@angular/fire/firestore';
//import {AngularFireAuth} from '@angular/fire/auth';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../providers/config/config.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private subject = new Subject<any>();
  updateCategoriesSubject = new BehaviorSubject(false);
  updateProductsSubject = new BehaviorSubject(false);

  constructor(
      //private afs: AngularFirestore,
      //public afAuth: AngularFireAuth,
      private http: HttpClient,
      public config: ConfigService,
      private rtdb: AngularFireDatabase,
  ) { }

  updateCategories() {
    this.updateCategoriesSubject.next(true);
  }

  updateProducts() {
    this.updateProductsSubject.next(true);
  }
/**
  async deleteDoc(coll: string, docId: string) {
    const id = docId;
    const docRef = this.afs.collection(coll).doc(id);
    return await docRef.delete();
  } */

/**
  async setNewDoc(coll: string, data: any, docId: string) {
    const id = docId;
    // console.log(id);
    const docRef = this.afs.collection(coll).doc(id);
    return await docRef.set(data);
  } */

/**
  async updateDoc(coll: string, data: any, docId: string) {
    const id = docId;
    // console.log(id);
    const docRef = this.afs.collection(coll).doc(id);
    return await docRef.update(data);
  } */

/**
  async getDoc(coll: string, docId: string) {
    return this.afs.collection(coll).doc(docId).get().toPromise();
  } */

  get timestamp() {
    const d = new Date();
    return d;
    //return firebase.firestore.FieldValue.serverTimestamp();
  }

/**
  queryProducts(coll: string, fieldDoc: string, operatorSym, valueData, limitData: number, orderBy, direction) {
    return this.afs.collection(coll, ref =>
        ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction)
    ).valueChanges();
  }*/

/**
queryProducts(coll: string, fieldDoc: string, operatorSym, valueData, limitData: number, orderBy, direction, startValue, page) {
  if (page === 1) {
    return this.afs.collection(coll, ref =>
        ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction)
    ).get();
  } else {
    return this.afs.collection(coll, ref =>
        ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction).startAfter(startValue)
    ).get();
  }

} */

/**
  queryProductsTest(coll: string, fieldDoc: string, operatorSym, valueData, limitData: number, orderBy, direction, startValue, page) {
    if (page === 1) {
      return this.afs.collection(coll, ref =>
          ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction)
      ).valueChanges();
    } else {
      return this.afs.collection(coll, ref =>
          ref.where(fieldDoc, operatorSym, valueData).limit(limitData).orderBy(orderBy , direction).startAfter(startValue)
      ).valueChanges();
    }

  } */

/**
  queryProductsShadow(coll: string, valueData) {
    return this.afs.collection(coll, ref =>
        ref.where('on_sale', '==', false).limit(10)
    ).valueChanges();
  } */


  getRtdb(path: string) {
    return this.rtdb.object(path).valueChanges();
  }

 /** getFirestoreWhereEqualTo(coll: string, docId: string) {
    return this.afs.collection(coll, ref =>
        ref.where('on_sale','==', false).limit(10)
    ).valueChanges();
  }*/

}
