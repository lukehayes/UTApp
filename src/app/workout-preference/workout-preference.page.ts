import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-workout-preference',
  templateUrl: './workout-preference.page.html',
  styleUrls: ['./workout-preference.page.scss'],
})
export class WorkoutPreferencePage implements OnInit {
  response: any;
  activity_level: any;
  errors = config.errors;
  workout_preferences = [
    {
      displayName: 'Mobility',
      value: 'mobility',
      image: 'mobility.png',
    },
    {
      displayName: 'Yoga',
      value: 'yoga',
      image: 'yoga.png',
    },
    {
      displayName: 'Steel Mace',
      value: 'steelmace',
      image: 'steelmace.png',
    },
    {
      displayName: 'Kettlebells',
      value: 'kettlebells',
      image: 'kettleball.png',
    },
    {
      displayName: 'Primal Movement',
      value: 'primalmovement',
      image: 'primalmovement.png',
    },
    {
      displayName: 'Body Building',
      value: 'bodybuilding',
      image: 'bodybuilding.png',
    },
    {
      displayName: 'Weight Lifting',
      value: 'weightlifting',
      image: 'weightlifting.png',
    },
  ];
  selected_preference = [];

  constructor(
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public location: Location
  ) {}

  ngOnInit() {
    this.getActivityLevels();
  }

  getActivityLevels() {
    this.apiService.post('/get_activity_level', {}, '').subscribe((res) => {
      console.log(res);
      this.response = res;
    });
  }

  selectPreference(event, i) {
    console.log(event, i);
    if (this.selected_preference.indexOf(event.target.value) == -1) {
      this.selected_preference.push(event.target.value);
    } else {
      this.selected_preference.splice(
        this.selected_preference.indexOf(event.target.value),
        1
      );
    }

    console.log(this.selected_preference);
  }

  submit() {
    console.log(this.selected_preference);
    if (this.selected_preference.length == 0) {
      this.apiService.presentToast(
        'Please choose workout preferences',
        'danger'
      );
      return;
    }
    var userDetail = JSON.parse(localStorage.getItem('userObj'));

    var user = JSON.parse(localStorage.getItem('userObj'));
    user.workout_pref = JSON.stringify(this.selected_preference);
    localStorage.setItem('skip', '0');
    localStorage.setItem('userObj', JSON.stringify(user));
    this.router.navigate(['/uploadimage']);
  }
  goBack() {
    this.location.back();
  }
}
