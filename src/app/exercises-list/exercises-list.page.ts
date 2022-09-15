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

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.page.html',
  styleUrls: ['./exercises-list.page.scss'],
})
export class ExercisesListPage implements OnInit {
  response: any;
  IMAGES_URL = config.IMAGES_URL;
  errors = config.errors;
  alert: any;
  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.getAllExercises();
  }

  getAllExercises() {
    this.apiService
      .post('/sub_category_exercise_list', {}, '')
      .subscribe((res) => {
        this.response = res;
      });
  }

  gotoexercise(doc) {
    localStorage.setItem('cat_id', doc.cat_id);
    localStorage.setItem('ability_id', doc.ref_id);
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
      (localStorage.getItem('price') == '49.99' ||
        localStorage.getItem('price') == '89.99')
    ) {
      this.router.navigate(['/exercise-details/', doc._id]);
    } else if (doc.bonus_video == '0') {
      this.router.navigate(['/exercise-details/', doc._id]);
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
}
