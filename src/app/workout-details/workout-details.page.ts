import { Component, OnInit } from '@angular/core';
import { StartWorkoutPage } from '../start-workout/start-workout.page';
import {
  ModalController,
  NavController,
  AlertController,
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
import { File, FileEntry } from '@ionic-native/file/ngx';

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
// import jsPDF from 'jspdf';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import html2canvas from 'html2canvas';
// import jspdf from 'jspdf';
// import domtoimage from 'dom-to-image';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
declare var Branch;

import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.page.html',
  styleUrls: ['./workout-details.page.scss'],
})
export class WorkoutDetailsPage implements OnInit {
  response: any;
  result: any;
  id: any;
  workout_id: any;
  response_payment: any;
  cat_id: any;
  ability_id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;
  detail: any;
  content: any;
  price: any = localStorage.getItem('price');
  exerciseArray: any = [];
  alert: any;
  exercises: any;

  constructor(
    public pdfGenerator: PDFGenerator,
    public socialSharing: SocialSharing,
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute,
    public file: File,
    public transfer: FileTransfer,
    private nativeStorage: NativeStorage,
    private navCtrl: NavController,
    public alertController: AlertController
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
    this.workout_id = localStorage.getItem('workout_id');
    this.cat_id = localStorage.getItem('cat_id');
    this.ability_id = localStorage.getItem('ability_id');
    this.events.getObservable().subscribe((data) => {
      this.price = localStorage.getItem('price');
    });

    this.price = localStorage.getItem('price');
  }

  ionViewWillEnter() {
    this.getSubCategoryWorkoutExerciseDetail();
  }

  ngOnInit() {}

  async presentModal() {
    if (this.price == '9.99' || this.price == '89.99') {
      const modal = await this.modalController.create({
        component: StartWorkoutPage,
        cssClass: 'StartWorkoutPage',
      });
      return await modal.present();
    } else {
      this.checkSubscription();
    }
  }

  checkSubscription() {
    this.apiService
      .post(
        '/check_payment_subscription',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.response_payment = res;

        if (this.response_payment.status == 1) {
          localStorage.setItem('subsexits', 'no');
          this.navCtrl.navigateRoot('/getstarted');
        } else {
          this.response_payment = res;
          localStorage.setItem('subsexits', 'yes');
          localStorage.setItem('days', this.response_payment.data.days);
          localStorage.setItem('price', this.response_payment.data.price);
          this.events.publishSomeData({});
          if (
            localStorage.getItem('price') == '9.99' ||
            localStorage.getItem('price') == '89.99'
          ) {
          } else {
            this.presentAlertConfirm();
            // this.apiService.presentToast(
            //   'This feature is not available in subscription.',
            //   'danger'
            // );
          }
        }
      });
  }

  gotocalender(id) {
    if (this.price == '9.99' || this.price == '89.99') {
      this.router.navigate(['/scheduleexercise/', id]);
    } else {
      this.checkSubscription();
    }
  }

  getSubCategoryWorkoutExerciseDetail() {
    this.apiService
      .post(
        '/sub_category_workout_detail',
        { _id: this.id, userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.response = res;
        this.detail = this.response.data;
        console.log('detail = ', this.detail);

        this.exercises = this.detail.exercises;
      });
  }

  public download() {
    let url = encodeURI(this.IMAGES_URL + this.detail.video);
    var date = new Date();
    // this.writeFile(base64ImageData, "My Picture", "sample.jpeg");
    var imagePath =
      this.file.externalRootDirectory +
      '/UnconventionalApp/' +
      date.getTime() +
      'video.webm';
    const fileTransfer = this.transfer.create();
    fileTransfer.download(url, imagePath).then(
      (entry) => {
        this.exerciseArray.push({
          name: this.detail.title,
          _id: this.detail._id,
          sets: this.detail.sets,
          duration: this.detail.duration,
        });

        localStorage.setItem(
          'downloadExer',
          JSON.stringify(this.exerciseArray)
        );
        console.log('entry = ', entry, entry.toURL());
        this.apiService.presentToast(
          'download completed: ' + imagePath,
          'success'
        );
        //this.photoViewer.show(entry.toURL());
      },
      (error) => {
        console.log('error = ', error);
      }
    );
  }

  exportPdf() {
    const div = document.getElementById('contentToConvert');
    this.content = document.getElementById('contentToConvert').innerHTML;

    let options = {
      documentSize: 'A4',
      type: 'share',
      fileName: 'Order-Invoice.pdf',
    };

    this.pdfGenerator
      .fromData(this.content, options)
      .then((base64) => {
        console.log('OK', base64);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  //scoial share
  socialsharebranch(post) {
    const Branch = window['Branch'];
    const self = this;

    var properties = {
      canonicalIdentifier: 'content/123',
      contentMetadata: {
        exerciseId: post._id,
        exercise: JSON.stringify(post),
      },
    };

    // create a branchUniversalObj variable to reference with other Branch methods
    var branchUniversalObj = null;

    Branch.createBranchUniversalObject(properties)
      .then(function (res) {
        branchUniversalObj = res;

        // optional fields
        var analytics = {
          channel: 'facebook',
          feature: 'onboarding',
        };

        var properties1 = {
          $og_title: 'Unconventional Training',
          $deeplink_path: 'content/123',
          $match_duration: 2000,
          custom_string: 'data',
          custom_integer: Date.now(),
          custom_boolean: true,
        };

        branchUniversalObj
          .generateShortUrl(analytics, properties1)
          .then(function (res) {
            var sendlink = res.url;
            console.log(sendlink);
            var imgUrl = null;
            self.socialSharing.share(
              'Check out the link: ',
              'Unconventional Training',
              imgUrl,
              sendlink
            );
          })
          .catch(function (err) {});
      })
      .catch(function (err) {
        alert('Error: ' + JSON.stringify(err));
      });
  }

  fav_unfav(doc, fav) {
    console.log(doc);
    this.apiService
      .post(
        '/fav_unfav_exercise',
        {
          exerciseId: doc._id,
          userId: localStorage.getItem('userId'),
          fav: fav,
        },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.result = res;
        this.detail.fav = fav;
        if (this.result.status == 1) {
          this.apiService.presentToast(this.result.msg, 'success');
        }
      });
  }
  gotoexercise(doc) {
    localStorage.setItem('cat_id', doc.cat_id);
    localStorage.setItem('ability_id', doc.ref_id);
    //this.router.navigate(['/exercises/', doc._id])

    if (localStorage.getItem('subsexits') == 'yes') {
      this.router.navigate(['/exercise-details/', doc._id]);
    } else if (
      doc.bonus_video == '1' &&
      (localStorage.getItem('price') == '5.99' ||
        localStorage.getItem('price') == '9.99') &&
      localStorage.getItem('subsexits') == 'no'
    ) {
      this.presentAlertConfirm();
    } else if (
      doc.bonus_video == '1' &&
      (localStorage.getItem('price') == '9.99' ||
        localStorage.getItem('price') == '89.99')
    ) {
      this.router.navigate(['/exercise-details/', doc._id]);
    } else if (doc.bonus_video == '0') {
      this.router.navigate(['/exercise-details/', doc._id]);
      //this.presentAlertConfirm();
    } else {
      this.presentAlertConfirm();
    }
  }

  async presentAlertConfirm() {
    this.alert = await this.alertController.create({
      header: 'Upgrade Your Plan',
      message:
        'Please upgrade your plan to premium, in order to view this exercise. Do you want to upgrade it now?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            // this.checkSubscription();
            this.router.navigate(['/getstarted']);
          },
        },
        {
          text: 'No',
          handler: () => {},
        },
      ],
    });

    await this.alert.present();
  }

  async popup() {
    const alert = await this.alertController.create({
      header: 'Start Workout',
      message: 'Do you want to start workout with below options:',
      inputs: [
        {
          type: 'radio',
          label: 'Existing Details',
          value: '1',
        },
        {
          type: 'radio',
          label: 'Edit the Details',
          value: '2',
        },
      ],
      buttons: [
        {
          text: 'Yes',
          handler: (data) => {
            console.log('Confirm Okay', data);
            if (data == 2) {
              // this.router.navigate(['/start-workout'])
              this.presentModal1();
            }

            if (data == 1) {
              this.router.navigate(['/edit-exercises-details/', this.id]);
            }
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

  async presentModal1() {
    const modal = await this.modalController.create({
      component: StartWorkoutPage,
      cssClass: 'StartWorkoutPage',
      componentProps: {
        workoutId: this.id,
      },
    });
    return await modal.present();
  }
}
