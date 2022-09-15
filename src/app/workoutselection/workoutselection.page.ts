import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-workoutselection',
  templateUrl: './workoutselection.page.html',
  styleUrls: ['./workoutselection.page.scss'],
})
export class WorkoutselectionPage implements OnInit {
  response: any;
  IMAGES_URL = config.IMAGES_URL;
  errors = config.errors;
  constructor(
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getWorkoutCategory();
  }

  getWorkoutCategory() {
    this.apiService.post('/category_list', {}, '').subscribe((res) => {
      console.log(res);
      this.response = res;
    });
  }
}
