import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';

import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any;

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  authForm: FormGroup;
  public win: any = window;
  authPassForm: FormGroup;
  responseData: any;
  errors = config.errors;
  profile: any;
  result: any;
  response: any;
  is_submit_pass = false;
  image_preview: any;
  is_live_image_updated = false;
  live_image_url: any;
  imgBlob: any;
  live_file_name: any;
  image: any;
  dob: any;
  monthname: any;
  gadgets: any[] = [];
  gadgetsyears: any[] = [];
  gadgetsmonths: any[] = [];
  ageArray: any = [];
  years = [];
  numColumns: number = 1; // number of columns to display on picker over lay
  numOptions: number = 5; // number of items (or rows) to display on picker over lay
  day: any = '';
  month: any = '';
  year: any = '';
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

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
    private pickerController: PickerController,
    public platform: Platform,
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
    this.createForm();
    for (var i = 1; i <= 31; i++) {
      this.ageArray.push(i);
    }

    this.gadgets.push(this.ageArray);

    const currentYear = new Date().getFullYear();
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    this.years = range(currentYear, 1900, -1);
    console.log(this.years);
    this.gadgetsyears.push(this.years);

    this.gadgetsmonths.push(this.months);
  }

  //hide/show the password section
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
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(
            /[a-zA-Z][\w\.-]*[a-zA-Z0-9]{0,}@([a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]{2,})/
          ),
        ]),
      ],
      name: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      weight_str: ['', Validators.compose([Validators.required])],
      height: ['', Validators.compose([Validators.required])],
      activity: ['', Validators.compose([Validators.required])],
    });

    this.authPassForm = this.formBuilder.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^.{6,}$/),
        ]),
      ],
      confirm_password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^.{6,}$/),
        ]),
      ],
      confirm_new_password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^.{6,}$/),
        ]),
      ],
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

  getProfile() {
    this.apiService
      .post('/getProfile', { _id: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        console.log(res);
        this.profile = res;
        this.image = this.profile.data.image;
        this.dob = parseInt(this.profile.data.age.split('-')[1]);
        console.log(this.dob);
        this.monthname = this.months[this.dob - 1];
        console.log(this.monthname);
        this.day = this.profile.data.age.split('-')[0];
        this.month = this.monthname;
        this.year = this.profile.data.age.split('-')[2];

        //set the dynamic value of the user to form
        this.authForm.patchValue({
          email: this.profile.data.email,
          name: this.profile.data.name,
          gender: this.profile.data.gender,
          weight: this.profile.data.weight,
          weight_str: this.profile.data.weight_str,
          height: this.profile.data.height,
          height_str: this.profile.data.height_str,
          activity: this.profile.data.activity_level,
        });
      });
  }

  submit() {
    console.log(this.authForm.value);
    const controls = this.authForm.controls;
    if (this.authForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    if (this.errors.indexOf(this.day) >= 0) {
      this.apiService.presentToast('Please select day', 'danger');
      return false;
    }
    if (this.errors.indexOf(this.month) >= 0) {
      this.apiService.presentToast('Please select month', 'danger');
      return false;
    }
    if (this.errors.indexOf(this.year) >= 0) {
      this.apiService.presentToast('Please select year', 'danger');
      return false;
    }

    this.apiService.presentLoading();
    var index =
      this.months.indexOf(this.month) < 10
        ? '0' + String(this.months.indexOf(this.month) + 1)
        : String(this.months.indexOf(this.month) + 1);

    var day = this.day < 10 ? '0' + String(this.day) : String(this.day);
    var age = String(this.day) + '-' + String(index) + '-' + String(this.year);
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
          image: this.image,
          weight: this.authForm.value.weight,
          weight_str: this.authForm.value.weight_str,
          height: this.authForm.value.height,
          height_str: this.authForm.value.height_str,
          age: age,
          activity_level: this.authForm.value.activity,
          hobbies: this.profile.data.hobbies,
          description: this.profile.data.description,
          _id: this.profile.data._id,
        },
        ''
      )
      .subscribe((res) => {
        this.responseData = res;
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
      if (
        this.platform.is('android') &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
      ) {
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
      self.is_live_image_updated = true;
      self.imgBlob = imgBlob;
      self.live_file_name = file.name;
      self.ref.detectChanges();
      self.uploadImage();
    };
    reader.readAsArrayBuffer(file);
  }

  uploadImage() {
    const frmData = new FormData();
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
        this.events.publishSomeData({});
      },
      (err) => {
        this.apiService.presentToast(
          'Technical error,Please try after some time',
          'danger'
        );
      }
    );
  }

  //DOB picker acc to day , month and year
  async showPicker(str) {
    let options: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (value: any) => {
            if (str == 'year') this.year = value.col.text;
            if (str == 'day') this.day = value.col.text;
            if (str == 'month') this.month = value.col.text;
          },
        },
      ],
      columns: this.getColumns(str),
    };
    let picker = await this.pickerController.create(options);
    picker.present();
  }

  //get all columns displayed in picker for DOB
  getColumns(str) {
    let columns = [];
    for (let i = 0; i < this.numColumns; i++) {
      columns.push({
        name: 'col',
        options: this.getColumnOptions(i, str),
      });
    }
    return columns;
  }

  // get the list of selected option for day, month and year
  getColumnOptions(columIndex: number, str) {
    let options = [];
    if (str == 'year') {
      for (let i = 0; i < this.years.length; i++) {
        options.push({
          text: this.gadgetsyears[columIndex][i % this.years.length],
          value: i,
        });
      }
      return options;
    }
    if (str == 'month') {
      for (let i = 0; i < this.months.length; i++) {
        options.push({
          text: this.gadgetsmonths[columIndex][i % this.months.length],
          value: i,
        });
      }
      return options;
    }
    if (str == 'day') {
      for (let i = 0; i < this.ageArray.length; i++) {
        options.push({
          text: this.gadgets[columIndex][i % this.ageArray.length],
          value: i,
        });
      }
      return options;
    }
  }
}
