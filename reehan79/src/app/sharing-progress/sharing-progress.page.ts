import {Component, Input, OnInit} from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ModalController, ToastController} from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Clipboard } from '@ionic-native/clipboard/ngx';


@Component({
  selector: 'app-sharing-progress',
  templateUrl: './sharing-progress.page.html',
  styleUrls: ['./sharing-progress.page.scss'],
})
export class SharingProgressPage implements OnInit {
    @Input('p') p;
    @Input('h') h;
    @Input('clicked') clicked;

  //  p: any;
  //  h: any;
   // clicked: any;
public filePathArray  = [];
public progressCount = 0;
public descProgressCount = 0;
public descriptionNew = '';
  constructor(
      private file: File,
      private http: HTTP,
      private socialSharing: SocialSharing,
      private modalController: ModalController,
      public toastController: ToastController,
      public platform: Platform,
      private firebaseAnalytics: AngularFireAnalytics,
      private clipboard: Clipboard,
  ) {

  }

  ionViewWillEnter() {
      this.descriptionNew = this.p.description.replace(/<[^>]*>/g, '');

      if (this.clicked === 'download') {
          this.firebaseAnalytics.logEvent('share_via_download', {page: "share_product"})
              .then((res: any) =>  { console.log('Logged'); })
              .catch((error: any) => console.error(error));
          this.shareViaDownLoad();
      } else if (this.clicked === 'facebook') {
          this.firebaseAnalytics.logEvent('share_via_facebook', {page: "share_product"})
              .then((res: any) => console.log(res))
              .catch((error: any) => console.error(error));
          this.shareViaFaceBook();
      } else if (this.clicked === 'others') {
          this.firebaseAnalytics.logEvent('share_via_others', {page: "share_product"})
              .then((res: any) => console.log(res))
              .catch((error: any) => console.error(error));
          this.shareViaOthers();
      } else if (this.clicked === 'whatsapp') {
          this.firebaseAnalytics.logEvent('share_via_whatsapp', {page: "share_product"})
              .then((res: any) => console.log(res))
              .catch((error: any) => console.error(error));
          this.shareViaWhatsApp();
      } else {
          this.modalController.dismiss();
      }
  }

  //////////////////////////////////////////////////
    shareViaDownLoad() {
        this.clipboard.copy(this.descriptionNew);
        if (this.platform.is('ios')) {
          this.descProgressCount = 0;
          this.downloadImage().then(() => {
                  this.socialSharing.saveToPhotoAlbum(this.filePathArray).then((result) => {
                      this.msgToast('Images are saved in Photo Album');
                      this.dismiss();
                  }).catch(err => {
                      this.msgToast(err);
                      this.dismiss();
                  });
              }
          ).catch(err => {
              this.msgToast(err);
              this.dismiss();
          });
      } else {
          this.descProgressCount = 0;
          this.downloadImage().then(() => {
                  const msg = 'Images are downloaded in ' + this.file.dataDirectory;
                  this.msgToast(msg);
                  this.dismiss();
              }
          ).catch(err => {
              this.msgToast(err);
              this.dismiss();
          });
      }
    }

    ///////////////////////////////////////////////
    shareViaFaceBook() {
        this.descProgressCount = 0;
        this.downloadImage().then(() => {
                const imageArrayLength  =  Object.keys(this.filePathArray).length;
                if (imageArrayLength === this.p.number_of_images) {
                    this.clipboard.copy(this.descriptionNew);
                    this.descProgressCount = 0.9;
                    this.socialSharing.shareViaFacebook(null,this.filePathArray,null).then(() => {
                        console.log('Image Sharing Ok');
                        this.dismiss();
                    }).catch(() => {
                        console.log('Image Sharing Error');
                        this.dismiss();
                    });
                } else {
                    console.log('The array numbers do not match');
                    this.dismiss();
                }
            }
        );
    }
/////////////////////////////////
    shareViaOthers() {
        this.descProgressCount = 0;
        this.clipboard.copy(this.descriptionNew);
        this.downloadImage().then(() => {
                const imageArrayLength  =  Object.keys(this.filePathArray).length;
                if (imageArrayLength === this.p.number_of_images) {
                    const options = {
                        message: this.p.description, // not supported on some apps (Facebook, Instagram)
                        subject: '', // fi. for email
                        files: this.filePathArray, // an array of filenames either locally or remotely
                        url: '',
                        chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
                        //appPackageName: , // Android only, you can provide id of the App you want to share with
                        iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
                    };
                    this.socialSharing.shareWithOptions(options).then((result) => {
                        console.log(result);
                        this.descProgressCount = 0.9;
                        this.dismiss();
                    }).catch(() => {
                        this.msgToast('Image Sharing Error').then(() =>{
                            console.log('Image Sharing Error');
                            this.dismiss();
                        });
                    });
                } else {
                    console.log('The array numbers do not match');
                    this.dismiss();
                }
            }
        );
    }


//////////////////////////////////////////
    shareViaWhatsApp() {
      this.descProgressCount = 0;
    this.downloadImage().then(() => {
          console.log(this.filePathArray);
          const imageArrayLength  =  Object.keys(this.filePathArray).length;
          console.log(imageArrayLength);
          if (imageArrayLength === this.p.number_of_images) {
              this.clipboard.copy(this.descriptionNew);
              if (this.platform.is('ios')) {
                  this.descProgressCount = 0.9;
                  this.socialSharing.shareViaWhatsApp(null, this.filePathArray, null).then(() => {
                      console.log('description shared ok ');
                      this.dismiss();
                  }).catch(() => {
                      console.log('Description Sharing Error');
                      this.dismiss();
                  });
              } else {
                  this.socialSharing.shareViaWhatsApp(null, this.filePathArray, null).then(() => {
                      console.log('Image Sharing Ok');
                      this.descProgressCount = 0.9;
                      this.dismiss();
                  }).catch(() => {
                      console.log('Image Sharing Error');
                      this.dismiss();
                  });
              }
          } else {
            console.log('The array numbers do not match');
              this.dismiss();
          }
        }
    );
  }

  async  downloadImage() {
      let promises = [];
      this.filePathArray = [];
      this.progressCount = 0;
      let progressCounttmp = 0;
      for (let i = 0; i < this.p.number_of_images; i++) {
      let fileUri = this.p.images[i].shop_catalog.toString();
      fileUri = fileUri.replace('-324x324', '');
      console.log(fileUri);
      const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const filePath = this.file.cacheDirectory + fileName;
       this.filePathArray.push(filePath);
      // console.log(filePath);
        promises.push(this.http.downloadFile(fileUri, {}, {}, filePath).then( () => {
            //this.progressCount = (i + 1) / (this.p.number_of_images);
            progressCounttmp = progressCounttmp + 1;
            this.progressCount = progressCounttmp / (this.p.number_of_images);
        }).catch(error => {
            // console.log('Error function call');
            this.msgToast(error).then(() => {
                console.log(error);
                this.dismiss();
            });
        }));
    }

      const results = await Promise.all(promises);
      console.log(results);
  }

    async msgToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    dismiss() {
        this.modalController.dismiss();
    }
  ngOnInit() {

  }

}
