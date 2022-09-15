import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-all-workout',
  templateUrl: './all-workout.page.html',
  styleUrls: ['./all-workout.page.scss'],
})
export class AllWorkoutPage implements OnInit {
  sub_category_list: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;

  constructor(
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getSubCategory();
  }

  //get the list of workouts dynamically
  getSubCategory() {
    this.apiService
      .post('/sub_category_workout_list', { ref_id: this.id }, '')
      .subscribe((res) => {
        this.sub_category_list = res;
      });
  }

  gotoexercise(doc) {
    localStorage.setItem('cat_id', doc.cat_id);
    localStorage.setItem('ability_id', doc.ref_id);
    this.router.navigate(['/workout-details/', doc._id]);
  }
}
