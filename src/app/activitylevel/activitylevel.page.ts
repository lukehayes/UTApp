import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activitylevel',
  templateUrl: './activitylevel.page.html',
  styleUrls: ['./activitylevel.page.scss'],
})
export class ActivitylevelPage implements OnInit {
  activity_list: any;
  activity_level: any;
  errors = config.errors;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public events: EventsService,
    public location: Location
  ) {}

  ngOnInit() {
    this.getActivityLevels();
  }

  //get the list of all levels of activity
  getActivityLevels() {
    this.apiService.post('/get_activity_level', {}, '').subscribe((res) => {
      this.activity_list = res;
    });
  }

  submit() {
    console.log(this.activity_level);
    if (this.errors.indexOf(this.activity_level) >= 0) {
      this.apiService.presentToast('Please select activity level', 'danger');
      return;
    }

    var user = JSON.parse(localStorage.getItem('userObj')); //get the previous user info from local storage
    user.activity_level = this.activity_level; //update the activity level value in user details
    localStorage.setItem('skip', '0');
    localStorage.setItem('userObj', JSON.stringify(user)); //again set updated value of user info in local storage
    this.router.navigate(['/choose-workout-type']);
  }

  goBack() {
    this.location.back();
  }
}
