import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { NavController, AlertController, IonItemSliding } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-workouts',
  templateUrl: './my-workouts.page.html',
  styleUrls: ['./my-workouts.page.scss'],
})
export class MyWorkoutsPage implements OnInit {
  response: any;
  addworkout: any;
  @ViewChild(IonItemSliding, { static: false }) itemSliding: IonItemSliding;
  constructor(
    private navCtrl: NavController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private alertController: AlertController,
    public location: Location
  ) {}

  ngOnInit() {
    this.getMyWorkouts();
  }

  gobackone() {
    alert('aa');
    this.navCtrl.back();
  }

  getMyWorkouts() {
    this.apiService.presentLoading();
    this.apiService
      .post('/list_my_workout', { userId: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        this.apiService.stopLoading();
        this.response = res;
      });
  }

  async presentAlertConfirm(doc, i, str) {
    let prompt = await this.alertController.create({
      header: str == 'add' ? 'Add New Workout' : 'Edit Workout',
      cssClass: 'error my-workouts-modal',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Title',
          placeholder: 'Enter title',
          value: doc != '' ? doc.title : '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            this.itemSliding.close();
          },
        },
        {
          text: 'Done!',
          handler: (data: any) => {
            if (data.title == '') {
              prompt.message =
                '<b style="color: red;font-size: 12px;">Please enter your workout title</b>';
              return false;
            } else {
              //make HTTP call
              if (doc == '') {
                this.addWorkout(data);
              } else {
                this.editworkout(data, i, doc);
              }
            }
          },
        },
      ],
    });
    await prompt.present();
  }

  addWorkout(data) {
    this.apiService.presentLoading();
    this.apiService
      .post(
        '/add_new_my_workout',
        {
          userId: localStorage.getItem('userId'),
          workoutId: '',
          title: data.title,
          exercises: [],
        },
        ''
      )
      .subscribe((res) => {
        this.addworkout = res;
        this.apiService.stopLoading();
        this.apiService.presentToast('Added successfully', 'success');
        this.response.data.push(this.addworkout.data);
      });
  }
  editworkout(data, i, doc) {
    this.apiService.presentLoading();
    this.apiService
      .post(
        '/edit_my_workout',
        {
          userId: localStorage.getItem('userId'),
          workoutId: doc._id,
          title: data.title,
          exercises: doc.exercises,
        },
        ''
      )
      .subscribe((res) => {
        this.addworkout = res;
        this.apiService.stopLoading();
        this.apiService.presentToast('Updated successfully', 'success');
        this.response.data[i].title = data.title;
        this.itemSliding.close();
      });
  }

  async deleteAlertConfirm(doc, i) {
    this.alertController
      .create({
        header: 'Delete Confirm',
        message: 'Are you sure to delete this?',
        buttons: [
          {
            text: 'Cancel',
            handler: (data: any) => {
              this.itemSliding.close();
            },
          },
          {
            text: 'OK',
            handler: (data: any) => {
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
    this.apiService.presentLoading();
    this.apiService
      .post('/delete_my_workout', { workoutId: doc._id }, '')
      .subscribe((res) => {
        this.apiService.stopLoading();
        this.apiService.presentToast('Workout deleted successfully', 'success');
        this.response.data.splice(i, 1);
        this.itemSliding.close();
      });
  }

  goBack() {
    this.location.back();
  }
}
