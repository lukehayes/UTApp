import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ActionSheetController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any;

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
  authForm: FormGroup;
  public win: any = window;
  authPassForm: FormGroup;
  responseData: any;
  id: any;
  errors = config.errors;
  profile: any;
  result: any;
  response: any;
  is_submit_pass = false;
  userId = localStorage.getItem('userId');
  image_preview: any;
  is_live_image_updated = false;
  live_image_url: any;
  imgBlob: any;
  live_file_name: any;
  image: any;

  currPassType = 'password';
  confirmPassType = 'password';
  newConfirmPassType = 'password';

  profiletab: string = 'basic';
  isAndroid: boolean = false;
  customAlertOptions: any = {
    header: 'Gender',
    translucent: true,
  };
  customAlertOptions1: any = {
    header: 'Weight',
    translucent: true,
  };
  customAlertOptions2: any = {
    header: 'Height',
    translucent: true,
  };
  customAlertOptions3: any = {
    header: 'Activity Level',
    translucent: true,
  };
  customAlertOptions4: any = {
    header: 'Hobbies',
    translucent: true,
  };
  gender = {
    form: null,
  };
  weight = {
    form: null,
  };
  height = {
    form: null,
  };
  activity = {
    form: null,
  };
  hobbies = {
    form: null,
  };
  IMAGES_URL = config.IMAGES_URL;

  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private actionSheetController: ActionSheetController,
    private ref: ChangeDetectorRef,
    public sanitizer: DomSanitizer
  ) {
    this.gender.form = 'male';
    this.weight.form = 'kg';
    this.height.form = 'inches';
    this.activity.form = 'beginner';
    this.hobbies.form = 'gym';
    this.id = activatedRoute.snapshot.paramMap.get('id');
    this.createForm();
  }

  changeType(val) {
    if (val == 1)
      this.currPassType = this.currPassType == 'text' ? 'password' : 'text';

    if (val == 2)
      this.confirmPassType =
        this.confirmPassType == 'text' ? 'password' : 'text';

    if (val == 3)
      this.newConfirmPassType =
        this.newConfirmPassType == 'text' ? 'password' : 'text';
  }

  //define the validators for form fields
  createForm() {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      weight_str: ['', Validators.compose([Validators.required])],
      height: ['', Validators.compose([Validators.required])],

      age: ['', Validators.compose([Validators.required])],
      activity: ['', Validators.compose([Validators.required])],
    });

    this.authPassForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
      confirm_new_password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.getActivityLevels();
  }

  getActivityLevels() {
    this.apiService.post('/get_activity_level', {}, '').subscribe((res) => {
      console.log(res);
      this.response = res;
      this.getProfile();
    });
  }

  getactivityname() {
    var index = this.response.data.findIndex(
      (x) => x._id == this.profile.data.activity_level
    );
    return this.response.data[index].name;
  }

  getProfile() {
    this.apiService
      .post('/getProfile', { _id: this.id }, '')
      .subscribe((res) => {
        console.log(res);
        this.profile = res;
        var index = this.response.data.findIndex(
          (x) => x._id == this.profile.data.activity_level
        );

        this.image = this.profile.data.image;
        this.authForm.patchValue({
          email: this.profile.data.email,
          name: this.profile.data.name,
          gender: this.profile.data.gender,
          weight: this.profile.data.weight,
          weight_str: this.profile.data.weight_str,
          height: this.profile.data.height,
          height_str: this.profile.data.height_str,
          age: this.profile.data.age,
          activity: this.response.data[index].name,
        });
      });
  }

  submit() {
    console.log(this.authForm.value);
    const controls = this.authForm.controls;
    console.log(this.authForm);
    if (this.authForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.apiService.presentLoading();

    this.apiService
      .post(
        '/updateProfile/' +
          this.authForm.value.email +
          '/' +
          this.profile.data._id,
        {
          email: this.authForm.value.email,
          name: this.authForm.value.name,
          gender: this.authForm.value.gender,
          image: this.authForm.value.image,
          weight: this.authForm.value.weight,
          weight_str: this.authForm.value.weight_str,
          height: this.authForm.value.height,
          height_str: this.authForm.value.height_str,
          age: this.authForm.value.age,
          activity_level: this.authForm.value.activity,
          hobbies: this.profile.data.hobbies,
          description: this.profile.data.description,
          _id: this.profile.data._id,
        },
        ''
      )
      .subscribe((res) => {
        this.responseData = res;
        console.log('res = ', res);
        this.events.publishSomeData({});
        this.apiService.stopLoading();
        if (this.responseData.status == 0) {
          this.apiService.presentToast(this.responseData.error, 'danger');
        } else {
          this.apiService.presentToast(this.responseData.msg, 'success');
          localStorage.setItem('userId', this.responseData.data._id);
          localStorage.setItem(
            'userObj',
            JSON.stringify(this.responseData.data)
          );
          localStorage.setItem(
            'profile',
            JSON.stringify(this.responseData.data)
          );

          var user = {
            _id: this.responseData.data._id,
            name: this.responseData.data.name,
            email: this.responseData.data.email,
            created_on: this.responseData.data.created_on,
            age:
              this.errors.indexOf(this.responseData.data.age) == -1
                ? this.responseData.data.age
                : '',
            gender:
              this.errors.indexOf(this.responseData.data.gender) == -1
                ? this.responseData.data.gender
                : '',
            height:
              this.errors.indexOf(this.responseData.data.height) == -1
                ? this.responseData.data.height
                : '',
            weight:
              this.errors.indexOf(this.responseData.data.weight) == -1
                ? this.responseData.data.weight
                : '',
            acitvity_level:
              this.errors.indexOf(this.responseData.data.acitvity_level) == -1
                ? this.responseData.data.acitvity_level
                : '',
          };

          localStorage.setItem('userObj', JSON.stringify(user));
        }
      });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.authForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  isControlHasErrorPass(controlName: string, validationType: string): boolean {
    const control = this.authPassForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  submitPass() {
    this.is_submit_pass = true;
    const controls = this.authPassForm.controls;
    console.log(this.authPassForm);
    if (this.authPassForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    if (
      this.authPassForm.value.confirm_password !=
      this.authPassForm.value.confirm_new_password
    ) {
      return false;
    }

    let dict = {
      _id: localStorage.getItem('userId'),
      password: this.authPassForm.value.password,
      confirm_password: this.authPassForm.value.confirm_password,
    };
    console.log(dict);

    this.apiService.presentLoading();
    this.apiService.post('/updatePassword', dict, '').subscribe((result) => {
      this.apiService.stopLoading();
      this.result = result;
      if (this.result.status == 1) {
        this.authPassForm.reset();

        this.is_submit_pass = false;
        this.apiService.presentToast(this.result.msg, 'success');
      } else {
        this.apiService.presentToast(this.result.msg, 'danger');
      }
    });
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
      if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
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
      self.uploadImage();
    };
    reader.readAsArrayBuffer(file);
  }

  uploadImage() {
    console.log('upload image ');
    const frmData = new FormData();
    console.log('this.imgBlob = ', this.imgBlob);
    console.log('this.live_file_name = ', this.live_file_name);
    frmData.append('file', this.imgBlob, this.live_file_name);
    frmData.append('userId', localStorage.getItem('userId'));
    this.apiService.post('/upload_user_image', frmData, '').subscribe(
      (result) => {
        console.log('result = ', result);
        this.image = result;
        this.ref.detectChanges();
        this.apiService.presentToast(
          'Profile image updated successfully',
          'success'
        );
        //this.submit();
        this.events.publishSomeData({});
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
}
