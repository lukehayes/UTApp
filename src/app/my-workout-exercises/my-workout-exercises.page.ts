import { Component, OnInit, ViewChild } from '@angular/core';
import { StartWorkoutPage } from '../start-workout/start-workout.page';
import {
  ModalController,
  NavController,
  AlertController,
  IonItemSliding
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-workout-exercises',
  templateUrl: './my-workout-exercises.page.html',
  styleUrls: ['./my-workout-exercises.page.scss'],
})
export class MyWorkoutExercisesPage implements OnInit {
  id: any;
  response: any;
  exercisesForSelection = [];
  exercises: any;
  allexercises: any;
  IMAGES_URL = config.IMAGES_URL;
  @ViewChild(IonItemSliding, {static: false}) itemSliding: IonItemSliding;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public alertController: AlertController,
    public location: Location
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
    this.events.getObservable().subscribe((data) => {
      this.getMyWorkoutDetail();
    });
  }

  ngOnInit() {
    this.getAllExercises();
  }

  getMyWorkoutDetail() {
    this.apiService.presentLoading();
    this.apiService
      .post(
        '/list_exercises_my_workouts',
        { workoutId: this.id, userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.apiService.stopLoading();
        this.exercises = res;

        this.allexercises.data.forEach((element, index) => {
          var index = this.exercises.exercisesDetails.findIndex(
            (x) => x._id === element._id
          );
          element.checked = false;
          if (index >= 0) {
            element.checked = true;
          } else {
            element.checked = false;
          }

          var dict = {
            type: 'checkbox',
            label: element.title,
            value: element._id,
            checked: element.checked,
            disabled: element.checked,
          };
          this.exercisesForSelection.push(dict);
        });
        
      });
  }

  getAllExercises() {
    this.apiService
      .post('/sub_category_workout_exercise_list_all', {}, '')
      .subscribe((res) => {
        console.log(res);
        this.allexercises = res;
        this.getMyWorkoutDetail();
      });
  }

  async presentAlertConfirm() {
    this.alertController
      .create({
        header: 'Select Exercises',
        inputs: this.exercisesForSelection,
        cssClass: 'wrkt-exrcs-mdl',
        buttons: [
          {
            text: 'Cancel',
            handler: (data: any) => {
              console.log('Canceled', data);
              this.itemSliding.close();
            },
          },
          {
            text: 'Done!',
            handler: (data: any) => {
              console.log('Selected Information', data);
              // var index = this.myWorkouts.data.findIndex(x => x._id ==="yutu");
              this.updateExercises(data);
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  updateExercises(data) {
    this.apiService
      .post(
        '/update_multi_exercise_in_workout',
        { workout: this.id, exercises: data },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.exercisesForSelection = [];
        // this.itemSliding.close();
        this.getMyWorkoutDetail();
      });
  }

  async deleteAlertConfirm(doc, i) {
    this.alertController
      .create({
        header: 'Delete Confirm',
        message: 'Are you sure to remove this exercise?',
        buttons: [
          {
            text: 'Cancel',
            handler: (data: any) => {
              console.log('Canceled', data);
              this.itemSliding.close();
            },
          },
          {
            text: 'OK',
            handler: (data: any) => {
              console.log('Selected Information', data);
              // var index = this.myWorkouts.data.findIndex(x => x._id ==="yutu");
              this.deleteExer(doc, i);
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  deleteExer(doc, i) {
    this.apiService
      .post(
        '/delete_exercise_from_workout',
        { workout: this.id, exerciseId: doc._id },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.apiService.presentToast(
          'Exercise deleted successfully',
          'success'
        );
        this.exercises.exercisesDetails.splice(i, 1);
        this.exercisesForSelection = [];
        this.itemSliding.close();
        this.getAllExercises();
      });
  }

  goBack() {
    this.location.back();
  }

  gotoexercise(doc) {
    // localStorage.setItem('cat_id', doc.cat_id);
    // localStorage.setItem('ability_id', doc.ref_id);
    //this.router.navigate(['/exercises/', doc._id])
    this.router.navigate(['/exercise-details/', doc._id]);
  }
}
