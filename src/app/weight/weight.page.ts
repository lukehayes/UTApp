import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Location } from '@angular/common';
@Component({
  selector: 'app-weight',
  templateUrl: './weight.page.html',
  styleUrls: ['./weight.page.scss'],
})
export class WeightPage implements OnInit {
  weight = 0;
  value = 2.205;
  string = 'lbs';
  errors = config.errors;

  constructor(
    public location: Location,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService
  ) {}

  ngOnInit() {}

  submit() {
    if (this.weight == 0) {
      this.apiService.presentToast('Please enter your weight', 'danger');
      return false;
    }
    var userDetail = JSON.parse(localStorage.getItem('userObj'));
    var user = JSON.parse(localStorage.getItem('userObj'));
    user.weight = this.weight;
    user.weight_str = this.string;
    localStorage.setItem('userObj', JSON.stringify(user));
    this.router.navigate(['/age']);
  }

  change(event) {
    console.log(event.detail.value);
    this.weight = event.detail.value;
  }

  changeValue(str) {
    console.log(str);
    this.string = str;
    if (str == 'lbs') {
      this.weight = Math.round(this.weight * this.value);
    } else {
      this.weight = Math.round(this.weight / this.value);
    }
  }
  goBack() {
    this.location.back();
  }
}
