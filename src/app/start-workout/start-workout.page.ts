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
import { File, FileEntry } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit {
  public value = this.navParams.get('workoutId');
  response: any;
  description: any;
  detail: any;
  edit = false;
  selectedIndex = -1;
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
  ) {}
  popcontent: boolean = false;
  popcontent1: boolean = false;
  popnote: boolean = false;

  popClick(i) {
    this.popcontent = !this.popcontent;
    this.selectedIndex = i;
  }

  popClick1() {
    this.popcontent1 = !this.popcontent1;
  }

  popupNote(i) {
    this.popnote = !this.popnote;
    this.selectedIndex = i;
  }

  ngOnInit() {
    console.log(this.value);
    this.getSubCategoryWorkoutExerciseDetail();
  }

  addNote(doc, i, str) {
    this.detail.exercises[i].disabled = false;
    this.detail.exercises[i].note = true;
    this.selectedIndex = -1;
  }

  getSubCategoryWorkoutExerciseDetail() {
    this.apiService
      .post(
        '/sub_category_workout_detail',
        { _id: this.value, userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.response = res;
        this.detail = this.response.data;
        this.description = this.detail.description;
        this.detail.exercises.forEach((element) => {
          element.disabled = true;
          element.note = element.description != '' ? true : false;
        });
      });
  }

  async presentAlert(str) {
    const alert = await this.alertController.create({
      cssClass: 'popClass',
      header:
        str == 'warm' ? 'Warm Up' : str == 'drop' ? 'Drop Set' : 'Failure',
      message:
        str == 'warm'
          ? 'Warmup sets are an important part of your training routine. Properly executed, warmup sets effectively prepare you to perform your heavy work sets to the best of your ability.'
          : str == 'drop'
          ? 'A drop set is an advanced resistance training technique in which you focus on completing a set until failure — or the inability to do another repetition. '
          : "Short for concentric failure, failure is the point at which whatever part of your body you're working out literally gives out and you physically can't complete another repetition with good form. ",
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  addUpdateNote(doc, i, str) {
    // alert(doc)
    this.selectedIndex = i;

    this.apiService
      .post(
        '/update_exercise',
        {
          str: str,
          id: doc._id,
          workoutNote: this.description,
          exerNote: str == 'workout' ? '' : doc.description,
          sets: str == 'workout' ? [] : doc.sets,
          userId: localStorage.getItem('userId'),
        },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        // this.apiService.presentToast('Updated successfully', 'success')
      });
  }

  changeUnit(doc, i, unit) {
    this.apiService
      .post(
        '/update_exercise_weight_unit',
        { id: doc._id, weight_unit: unit },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.detail.exercises[i].weight_unit = unit;
        this.selectedIndex = -1;
        // this.apiService.presentToast('Updated successfully', 'success')
      });
  }

  async presentAlert1(doc, i) {
    const alert = await this.alertController.create({
      header: 'Change weight unit',
      message: 'Choose to select with below options:',
      inputs: [
        {
          type: 'radio',
          label: 'kg',
          value: '1',
        },
        {
          type: 'radio',
          label: 'lbs',
          value: '2',
        },
      ],
      buttons: [
        {
          text: 'Yes',
          handler: (data) => {
            console.log('Confirm Okay', data);
            var unit = data == 1 ? 'kg' : 'lbs';
            this.changeUnit(doc, i, unit);
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

  async presentAlertRemoveExerecise(doc, i) {
    const alert = await this.alertController.create({
      cssClass: 'popClass',
      header: 'Confirm delete',
      message: 'Do you want to rmeove this exercise from the workout?',
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            console.log('Confirm Okay', data);
            this.removeExercise(doc, i);
          },
        },
        {
          text: 'Cancel',
          handler: () => {
            this.selectedIndex = -1;
          },
        },
      ],
    });

    await alert.present();
  }

  removeExercise(doc, i) {
    this.apiService
      .post('/remove_exercise', { id: doc._id }, '')
      .subscribe((res) => {
        console.log(res);
        this.detail.exercises.splice(i, 1);
        this.selectedIndex = -1;
        // this.apiService.presentToast('Updated successfully', 'success')
      });
  }

  onsetChecked(doc, i, indx, event) {
    console.log(doc, i, indx, event);
    this.detail.exercises[i].sets[indx].complete =
      event.detail.checked == true ? '1' : '0';
    this.apiService
      .post(
        '/update_exercisesets',
        { id: doc._id, sets: this.detail.exercises[i].sets },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        // this.detail.exercises.splice(i,1);
        // this.selectedIndex = -1;
        // this.apiService.presentToast('Updated successfully', 'success')
      });
  }

  updateSet(doc, i, indx) {
    console.log(this.detail.exercises[i].sets);
    this.apiService
      .post(
        '/update_exercisesets',
        { id: doc._id, sets: this.detail.exercises[i].sets },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        // this.detail.exercises.splice(i,1);
        this.selectedIndex = -1;
        // this.apiService.presentToast('Updated successfully', 'success')
      });
  }

  addSet(doc, i, str) {
    var dict = {
      name: str == 'warm' ? 'Warm Up' : str == 'drop' ? 'Drop Set' : 'Failure',
      reps: '',
      weight: '',
    };
    this.detail.exercises[i].sets.push(dict);

    // if(dict.reps == '' || dict.weight == '' ){
    //   this.apiService.presentToast('please fill all fields', 'danger');
    //   return;
    // }
  }

  startWorkout(value) {
    this.modalController.dismiss();
    this.router.navigate(['/edit-exercises-details/', value]);
  }

  deleteSet(doc, i, indx, str) {
    this.detail.exercises[i].sets.splice(indx, 1);
    this.apiService
      .post(
        '/update_exercise',
        {
          id: doc._id,
          exerNote: doc.description,
          sets: this.detail.exercises[i].sets,
        },
        ''
      )
      .subscribe((res) => {
        console.log(res);
      });

    this.apiService
      .post(
        '/update_exercise',
        {
          str: str,
          id: doc._id,
          workoutNote: this.description,
          exerNote: str == 'workout' ? '' : doc.description,
          sets: str == 'workout' ? [] : doc.sets,
        },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        // this.apiService.presentToast('Updated successfully', 'success')
      });
  }
}
