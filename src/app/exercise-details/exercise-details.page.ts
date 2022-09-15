import { Component, OnInit } from '@angular/core';
import { StartWorkoutPage } from '../start-workout/start-workout.page';
import { SelectWorkoutsPage } from '../select-workouts/select-workouts.page';
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

import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
declare var Branch;

import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.page.html',
  styleUrls: ['./exercise-details.page.scss'],
})
export class ExerciseDetailsPage implements OnInit {
  response: any;
  myWorkouts: any;
  uncheckedWorkouts: any = [];
  myWorkoutsForSelection = [];
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
  selectedWorkouts = [];

  constructor(
    public pdfGenerator: PDFGenerator,
    public socialSharing: SocialSharing,
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService,
    private activatedRoute: ActivatedRoute,
    public file: File,
    public transfer: FileTransfer,
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
  }

  ngOnInit() {
    this.getSubCategoryWorkoutExerciseDetail();
  }

  getSubCategoryWorkoutExerciseDetail() {
    this.apiService
      .post(
        '/sub_category_workout_exercise_detail',
        { _id: this.id, userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.response = res;
        this.detail = this.response.data;
        if (this.errors.indexOf(localStorage.getItem('downloadExer')) == -1) {
        } else {
          this.exerciseArray = JSON.parse(localStorage.getItem('downloadExer'));
        }
        this.myWorkoutsList();
      });
  }

  //downoad the video in documents
  public download() {
    let url = encodeURI(this.IMAGES_URL + this.detail.video);
    var date = new Date();
    var imagePath =
      this.file.documentsDirectory +
      '/UnconventionalApp/' +
      date.getTime() +
      'video.webm';
    const fileTransfer = this.transfer.create();
    fileTransfer.download(url, imagePath).then(
      (entry) => {
        var n = imagePath.lastIndexOf('/');
        var result = imagePath.substring(n + 1);
        this.exerciseArray.push({
          name: this.detail.title,
          _id: this.detail._id,
          sets: this.detail.sets,
          duration: this.detail.duration,
          url: entry.toURL(),
          imagename: result,
        });

        localStorage.setItem(
          'downloadExer',
          JSON.stringify(this.exerciseArray)
        );
        this.apiService.presentToast(
          'download completed: ' + imagePath,
          'success'
        );
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

  myWorkoutsList() {
    this.apiService
      .post(
        '/list_my_workout',
        {
          userId: localStorage.getItem('userId'),
        },
        ''
      )
      .subscribe((res) => {
        this.myWorkouts = res;
        let dict = {};
        if (this.myWorkouts.data.length > 0) {
          this.myWorkouts.data.forEach((element, index) => {
            if (element.exercises.indexOf(this.detail._id) >= 0) {
              this.myWorkouts.data[index].checked = true;
            } else {
              this.myWorkouts.data[index].checked = false;
            }

            dict = {
              type: 'checkbox',
              label: element.title,
              value: element._id,
              checked: this.myWorkouts.data[index].checked,
            };
            this.myWorkoutsForSelection.push(dict);
          });
        }
      });
  }

  async presentAlertConfirm() {
    debugger;
    const modal = await this.modalController.create({
      component: SelectWorkoutsPage,
      componentProps: {
        id: this.detail._id,
      },
      cssClass: 'SelectWorkoutsPage',
    });
    return await modal.present();
  }
  async presentAlertConfirm1() {
    this.alertController
      .create({
        header: 'Select Workouts',
        inputs: this.myWorkoutsForSelection,
        buttons: [
          {
            text: 'Cancel',
            handler: (data: any) => {
              console.log('Canceled', data);
            },
          },
          {
            text: 'Done!',
            handler: (data: any) => {
              data.forEach((element) => {
                var index = this.myWorkouts.data.findIndex(
                  (x) => x._id === element
                );
                var exercises = this.myWorkouts.data[index].exercises;
                if (exercises.indexOf(this.detail._id) == -1) {
                  exercises.push(this.detail._id);
                }

                this.selectedWorkouts.push({
                  workoutId: this.myWorkouts.data[index]._id,
                  exercises: exercises,
                });
              });
              this.myWorkouts.data.forEach((element, index) => {
                if (element.checked == false) {
                  this.uncheckedWorkouts.push(element);
                }
              });
              this.updateExerciseWorkout(this.selectedWorkouts);
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  updateExerciseWorkout(selectedWorkouts) {
    this.apiService
      .post(
        '/update_exercise_in_my_workout',
        {
          selectedWorkouts: selectedWorkouts,
          uncheckedWorkouts: this.uncheckedWorkouts,
        },
        ''
      )
      .subscribe((res) => {});
  }
}
