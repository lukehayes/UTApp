import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-favorite-exercises',
  templateUrl: './favorite-exercises.page.html',
  styleUrls: ['./favorite-exercises.page.scss'],
})
export class FavoriteExercisesPage implements OnInit {
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
    this.getFavExerciseList();
  }

  getFavExerciseList() {
    this.apiService
      .post(
        '/fav_exercise_list',
        { userId: localStorage.getItem('userId') },
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
        if (fav == 0) {
          this.response.data.splice(i, 1);
        }
      });
  }
}
