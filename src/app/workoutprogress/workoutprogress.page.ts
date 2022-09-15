import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { ChartType } from 'chart.js';
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {
  ActionSheetController,
  NavController,
  AlertController,
  Platform,
  IonSlides,
} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
declare var window: any;
import { Location } from '@angular/common';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-workoutprogress',
  templateUrl: './workoutprogress.page.html',
  styleUrls: ['./workoutprogress.page.scss'],
})
export class WorkoutprogressPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) ionSlides: IonSlides;
  response: any;
  IMAGES_URL = config.IMAGES_URL;
  public win: any = window;
  is_live_image_updated = false;
  imgBlob: any;
  live_file_name: any;
  live_image_url: any;
  image: any;
  errors = config.errors;
  dateLabels = [];
  dateLabelsDays = [];
  weekWorkouts = [];
  monthWorkouts = [];
  monthnameables = [];
  monthdateLables = [];
  exercises: any = 0;
  calories_burned: any = 0;
  lastdayweek: any;
  firstdayweek: any;
  clickedChartFilterValue = 'week';
  imagesData = [];

  constructor(
    public platform: Platform,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private ref: ChangeDetectorRef,
    private actionSheetController: ActionSheetController,
    public sanitizer: DomSanitizer,
    public alertController: AlertController
  ) {}

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3.3,
    speed: 400,
    spaceBetween: 10,
  };

  ngOnInit() {
    // this.groupImages([]);
    if (this.clickedChartFilterValue == 'month') {
      this.getcurrentmonth();
    } else {
      this.getweeks();
    }
  }

  getcurrentmonth() {
    var today = new Date(); // current date
    var end = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // end date of month
    var result = [];

    for (let i = 1; i <= end; i++) {
      let dattee = new Date(
        today.getFullYear() +
          '-' +
          (today.getMonth() + 1 < 10
            ? '0' + (today.getMonth() + 1)
            : today.getMonth() + 1) +
          '-' +
          (i < 10 ? '0' + i : i)
      );
      // dattee.setHours(0,0,0,0);
      let isodate = dattee.toISOString();
      let month = dattee.toLocaleString('default', { month: 'short' });

      let dict = {
        date: dattee,
        isodate: isodate,
        monthname: (i < 10 ? '0' + i : i) + ' ' + month,
      };
      this.monthdateLables.push(dict);
      this.monthnameables.push(dict.monthname);
    }
    console.log('this.monthdateLables = ', this.monthdateLables);
    console.log('this.monthnameables = ', this.monthnameables);
    this.lineChartLabels = this.monthnameables;
    this.getWorkoutCategory();
  }

  getweeks() {
    let curr = new Date();

    var first1 = curr.getDate();
    var firstday = new Date(curr.setDate(first1))
      .toISOString()
      .substring(0, 10);
    var currentday = new Date(curr.setDate(first1))
      .toISOString()
      .substring(0, 10);

    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first)).toISOString().substring(0, 10);
      let date = new Date(curr.setDate(first));

      let orgdate = new Date(day);
      orgdate.setHours(0, 0, 0, 0);
      let dayName = orgdate.toString().split(' ')[0];
      this.dateLabels.push({
        day: dayName,
        date: orgdate,
        isodate: date.toISOString(),
      });
      this.dateLabelsDays.push(dayName);
    }
    this.lineChartLabels = this.dateLabelsDays;
    this.getWorkoutCategory();
  }

  timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + '.' + rminutes;
  }

  clickedFilter(str) {
    this.clickedChartFilterValue = str;
    this.dateLabels = [];
    this.dateLabelsDays = [];
    this.weekWorkouts = [];
    this.monthWorkouts = [];
    this.monthnameables = [];
    this.monthdateLables = [];
    this.calories_burned = 0;
    this.exercises = 0;

    if (this.clickedChartFilterValue == 'month') {
      this.getcurrentmonth();
    } else {
      this.getweeks();
    }
  }

  getWorkoutCategory() {
    var exerciseTimeweek = 0;
    var exerciseTimemonth = 0;
    this.apiService
      .post('/workoutProgress', { userId: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        console.log(res);
        this.response = res;
        this.getuploadedProgressImages();
        for (var i = 0; i < this.response.data.length; i++) {
          this.exercises =
            this.exercises + this.response.data[i].workout.exercises.length;
          for (
            var j = 0;
            j < this.response.data[i].workout.exercises.length;
            j++
          ) {
            this.calories_burned =
              this.calories_burned +
              parseInt(this.response.data[i].workout.exercises[j].calorie_burn);
          }
        }
        const groups = this.response.data.reduce((groups, game) => {
          const date = game.created_on.split('T')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(game);
          return groups;
        }, {});
        const groupArrays = Object.keys(groups).map((date) => {
          return {
            date,
            workout: groups[date],
          };
        });

        if (this.clickedChartFilterValue == 'month') {
          for (var j = 0; j < this.monthdateLables.length; j++) {
            exerciseTimeweek = 0;
            for (var i = 0; i < groupArrays.length; i++) {
              if (
                this.monthdateLables[j].isodate.split('T')[0] ==
                groupArrays[i].date
              ) {
                for (var a = 0; a < groupArrays[i].workout.length; a++) {
                  for (
                    var b = 0;
                    b < groupArrays[i].workout[a].workout.exercises.length;
                    b++
                  ) {
                    exerciseTimeweek =
                      exerciseTimeweek +
                      parseInt(
                        groupArrays[i].workout[a].workout.exercises[b].duration
                      );

                    console.log('month exer time =', exerciseTimeweek);
                  }
                }
              } else {
              }
            }
            this.monthWorkouts.push(this.timeConvert(exerciseTimeweek));
          }
          console.log('this.monthWorkouts = ', this.monthWorkouts);

          this.lineChartData = [
            {
              data: this.monthWorkouts,
              label: 'Workouts Duration in hours',
            },
          ];
        } else {
          for (var j = 0; j < this.dateLabels.length; j++) {
            exerciseTimemonth = 0;
            for (var i = 0; i < groupArrays.length; i++) {
              if (
                this.dateLabels[j].isodate.split('T')[0] == groupArrays[i].date
              ) {
                for (var a = 0; a < groupArrays[i].workout.length; a++) {
                  for (
                    var b = 0;
                    b < groupArrays[i].workout[a].workout.exercises.length;
                    b++
                  ) {
                    exerciseTimemonth =
                      exerciseTimemonth +
                      parseInt(
                        groupArrays[i].workout[a].workout.exercises[b].duration
                      );
                    console.log(
                      'cccccccccccccccccccccccccccccccc',
                      exerciseTimemonth
                    );
                  }
                }
              } else {
              }
            }
            this.weekWorkouts.push(this.timeConvert(exerciseTimemonth));
          }
          console.log('this.weekWorkouts =', this.weekWorkouts);
          this.lineChartData = [
            {
              data: this.weekWorkouts,
              label: 'Workouts Duration in hours',
            },
          ];
        }
      });
  }

  getuploadedProgressImages() {
    // alert('working');
    // this.image = [];
    this.imagesData = [];
    this.apiService
      .post(
        '/get_upload_progress_images',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.image = res;
        this.imagesData = this.image.data;
        this.apiService.stopLoading();
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
    if (this.errors.indexOf(this.live_image_url) >= 0) {
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
    this.apiService.post('/upload_progress_image', frmData, '').subscribe(
      (result) => {
        console.log('result = ', result);
        this.image = result;

        this.imagesData.unshift(this.image.data[this.image.data.length - 1]);
        this.ref.detectChanges();
        this.ionSlides.update().then(() => {
          console.log('updated');
        });
        this.apiService.stopLoading();

        // this.imagesData = this.image.data;
        // this.getuploadedProgressImages();
        // this.ref.detectChanges();
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

  groupImages(data) {
    var array = [
      { fecha: '2019-02-01', key1: 0, key2: 1, key3: 0 },
      { fecha: '2019-02-04', key1: 1, key2: 4, key3: 5 },
      { fecha: '2019-02-11', key1: 2, key2: 3, key3: 3 },
      { fecha: '2019-05-01', key1: 1, key2: 4, key3: 2 },
      { fecha: '2019-05-11', key1: 0, key2: 1, key3: 1 },
    ];

    // this gives an object with dates as keys
    const groups = array.reduce((groups, game) => {
      const date = game.fecha.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        games: groups[date],
      };
    });

    console.log(groupArrays);
  }

  async popup() {
    const alert = await this.alertController.create({
      header: 'Workout Progess',
      message: 'Choose one',
      inputs: [
        {
          type: 'radio',
          label: 'Weekly',
          value: 'week',
        },
        {
          type: 'radio',
          label: 'Monthly',
          value: 'month',
        },
      ],
      buttons: [
        {
          text: 'Yes',
          handler: (data) => {
            console.log('Confirm Okay', data);
            this.clickedFilter(data);
          },
        },
        {
          text: 'No',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  // Array of different segments in chart
  lineChartData: ChartDataSets[] = [{ data: [], label: 'Product A' }];

  //Labels shown on the x-axis
  lineChartLabels: Label[] = [];

  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
          },
          display: true,
          ticks: {
            max: 24,
            min: 0,
            stepSize: 5,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: true,
          },
          display: true,
          ticks: {
            stepSize: 5,
          },
        },
      ],
    },
  };

  // Define colors of chart segments
  lineChartColors: Color[] = [
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
    },
    {
      // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
    },
  ];

  // Set true to show legends
  lineChartLegend = true;

  // Define type of chart
  public lineChartType: ChartType = 'line';

  lineChartPlugins = [];

  // events
  chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
    console.log(event, active);
  }
}
