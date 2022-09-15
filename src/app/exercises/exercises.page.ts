import { Component, OnInit } from '@angular/core';
import { ExercisesFilterPage } from '../exercises-filter/exercises-filter.page';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {
  response: any;
  result: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getSubCategoryWorkoutExercise();
  }

  ionViewDidLeave() {
    var selected_cats = [];
    localStorage.setItem('selected_cats', JSON.stringify(selected_cats));
  }

  gotodetail(doc) {
    localStorage.setItem('workout_id', doc.ref_id);
    this.router.navigate(['/exercise-details/', doc._id]);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ExercisesFilterPage,
      cssClass: 'ExercisesFilterPage',
    });

    modal.onDidDismiss().then((data) => {
      this.getSubCategoryWorkoutExercise();
    });
    return await modal.present();
  }

  getSubCategoryWorkoutExercise() {
    this.apiService
      .post(
        '/sub_category_workout_exercise_list',
        {
          ref_id: this.id,
          userId: localStorage.getItem('userId'),
          selected_cats: JSON.parse(localStorage.getItem('selected_cats')),
        },
        ''
      )
      .subscribe((res) => {
        this.response = res;
      });
  }

  fav_unfav(doc, i, fav) {
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
        this.result = res;
        this.response.data[i].fav = fav;
        if (this.result.status == 1) {
          this.apiService.presentToast(this.result.msg, 'success');
        }
      });
  }
}
