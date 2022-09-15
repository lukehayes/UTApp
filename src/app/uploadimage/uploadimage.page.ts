import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ActionSheetController, NavController,Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any;
import { Location } from '@angular/common';
@Component({
  selector: 'app-uploadimage',
  templateUrl: './uploadimage.page.html',
  styleUrls: ['./uploadimage.page.scss'],
})
export class UploadimagePage implements OnInit {
  public win: any = window;
  is_live_image_updated = false;
  imgBlob: any;
  live_file_name: any;
  live_image_url: any;
  image: any;
  errors = config.errors;

  constructor(
    public location: Location,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private ref: ChangeDetectorRef,
    private actionSheetController: ActionSheetController,
    public sanitizer: DomSanitizer,
    public navCtrl: NavController,
    public platform : Platform
  ) {}

  ngOnInit() {}

  skip() {
    localStorage.setItem('skip', '1');
    // this.router.navigate(['/readytogo']);
    this.navCtrl.navigateRoot('/readytogo');
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath).then((filePath) => {
          this.startUpload(imagePath);
        });
      } else {
        this.startUpload(imagePath);
      }
    });
  }

  startUpload(imgEntry) {
    this.live_image_url = imgEntry;
    console.log('imgEntry = ', imgEntry);
    this.ref.detectChanges();
    this.file
      .resolveLocalFilesystemUrl(imgEntry)
      .then((entry) => {
        (<FileEntry>entry).file((file) => this.readFile(file, imgEntry));
      })
      .catch((err) => {
        this.apiService.presentToast('Error while reading file.', 'danger');
      });
  }

  readFile(file: any, imgEntry) {
    var self = this;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], {
        type: file.type,
      });
      console.log('file = ', file);
      console.log('imgEntry = ', imgEntry);
      self.is_live_image_updated = true;
      self.imgBlob = imgBlob;
      self.live_file_name = file.name;
    
      self.ref.detectChanges();
      // self.uploadImage();
    };
    reader.readAsArrayBuffer(file);
  }

  submit(){
    var user = JSON.parse(localStorage.getItem('userObj'));
    user.image = this.image;
    localStorage.setItem('skip', '0');
    localStorage.setItem('userObj', JSON.stringify(user));
  }

  uploadImage() {

    if(this.errors.indexOf(this.live_image_url) >= 0){
      this.apiService.presentToast('Please select image', 'danger');
      return false;
    }
    this.apiService.presentLoading();
    console.log('upload image ');
    const frmData = new FormData();
    console.log('this.imgBlob = ', this.imgBlob);
    console.log('this.live_file_name = ', this.live_file_name);
    frmData.append('file', this.imgBlob, this.live_file_name);
    frmData.append('userId', localStorage.getItem('userId'));
    this.apiService.post('/upload_image', frmData, '').subscribe(
      (result) => {
        console.log('result = ', result);
        this.image = result;
        this.ref.detectChanges();
        this.apiService.stopLoading();
        var user = JSON.parse(localStorage.getItem('userObj'));
        user.image = this.image;
        localStorage.setItem('skip', '0');
        localStorage.setItem('userObj', JSON.stringify(user));
        // this.router.navigate(['/readytogo']);
        this.navCtrl.navigateRoot('/readytogo');
        // this.events.publishSomeData1({});
        
      },
      (err) => {
        console.log('errrrrrrrrrrrrrrrr = ', err);
        this.apiService.presentToast(
          'Technical error,Please try after some time',
          'danger'
        );
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
