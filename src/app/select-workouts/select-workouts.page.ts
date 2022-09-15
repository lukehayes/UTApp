import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  AlertController,
  NavParams,
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-select-workouts',
  templateUrl: './select-workouts.page.html',
  styleUrls: ['./select-workouts.page.scss'],
})
export class SelectWorkoutsPage implements OnInit {
  myWorkouts: any = [];
  myWorkoutsForSelection = [];
  id: any;
  responseGet = false;
  response: any;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,

    public events: EventsService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public alertController: AlertController,
    public navParams: NavParams
  ) {
    this.id = this.navParams.get('id');
  }

  ngOnInit() {
    this.myWorkoutsList();
  }

  myWorkoutsList() {
    console.log();
    this.apiService.presentLoading();
    this.apiService
      .post(
        '/list_my_workout',
        {
          userId: localStorage.getItem('userId'),
        },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.myWorkouts = res;
        let dict = {};
        if (this.myWorkouts.data.length > 0) {
          this.myWorkouts.data.forEach((element, index) => {
            console.log(element.exercises.indexOf(this.id));
            if (element.exercises.indexOf(this.id) >= 0) {
              this.myWorkouts.data[index].checked = true;
            } else {
              this.myWorkouts.data[index].checked = false;
            }
          });
          this.myWorkoutsForSelection = this.myWorkouts.data;
          console.log(this.myWorkoutsForSelection);
          this.responseGet = true;
          this.apiService.stopLoading();
        }
      });
  }
  toggleComponent(event, doc, index) {
    console.log(event, doc, index);
    var index1 = this.myWorkoutsForSelection[index].exercises.indexOf(this.id);
    if (event.detail.checked == false) {
      if (index1 == -1) {
      } else {
        this.myWorkoutsForSelection[index].exercises.splice(index1, 1);
      }
    } else {
      if (index1 == -1) {
        this.myWorkoutsForSelection[index].exercises.push(this.id);
      } else {
      }
    }
  }

  submit() {
    this.updateExerciseWorkout(this.myWorkoutsForSelection);
  }

  updateExerciseWorkout(selectedWorkouts) {
    this.apiService
      .post(
        '/update_exercise_in_my_workout',
        {
          selectedWorkouts: selectedWorkouts,
        },
        ''
      )
      .subscribe((res) => {
        this.response = res;
        if (this.response.data.nModified == 1) {
          this.apiService.presentToast('Updated successfully', 'success');
        }
        this.events.publishSomeData('workut library selection');

        this.modalController.dismiss();
      });
  }

  goBack() {
    this.modalController.dismiss();
  }
}
