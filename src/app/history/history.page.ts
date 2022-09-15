import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { NavController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  response: any;

  constructor(
    public location: Location,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController,
    activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getWorkoutProgres();
  }

  getWorkoutProgres() {
    var exerciseTimeweek = 0;
    var exerciseTimemonth = 0;
    this.apiService
      .post('/workoutProgress', { userId: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        this.response = res;
      });
  }

  caluclateweight(exer) {
    var count = 0;
    for (var j = 0; j < exer.length; j++) {
      for (var i = 0; i < exer[j].sets.length; i++) {
        count = count + parseInt(exer[j].sets[i].weight);
      }
    }
    return count;
  }

  caluclateCalories(exer) {
    var count = 0;
    for (var j = 0; j < exer.length; j++) {
      count = count + parseInt(exer[j].calorie_burn);
    }
    return count;
  }
}
