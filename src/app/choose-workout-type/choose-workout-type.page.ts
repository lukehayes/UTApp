import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-choose-workout-type',
  templateUrl: './choose-workout-type.page.html',
  styleUrls: ['./choose-workout-type.page.scss'],
})
export class ChooseWorkoutTypePage implements OnInit {
  response: any;
  workout_type: any;
  errors = config.errors;
  selected_type = [];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public location: Location
  ) {}

  ngOnInit() {}

  selectType(event) {
    console.log(event);
    if (this.selected_type.indexOf(event.target.value) == -1) {
      this.selected_type.push(event.target.value);
    } else {
      this.selected_type.splice(
        this.selected_type.indexOf(event.target.value),
        1
      );
    }
  }

  getActivityLevels() {
    this.apiService.post('/get_activity_level', {}, '').subscribe((res) => {
      this.response = res;
    });
  }

  submit() {
    console.log(this.workout_type);
    if (this.selected_type.length == 0) {
      this.apiService.presentToast('Please choose workout type', 'danger');
      return;
    }
    var userDetail = JSON.parse(localStorage.getItem('userObj'));

    var user = JSON.parse(localStorage.getItem('userObj'));
    user.workout_type = this.selected_type;
    localStorage.setItem('skip', '0');
    localStorage.setItem('userObj', JSON.stringify(user));
    this.router.navigate(['/workout-preference']);
  }

  goBack() {
    this.location.back();
  }
}
