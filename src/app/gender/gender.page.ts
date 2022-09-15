import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Location } from '@angular/common';
@Component({
  selector: 'app-gender',
  templateUrl: './gender.page.html',
  styleUrls: ['./gender.page.scss'],
})
export class GenderPage implements OnInit {
  gender = '';

  constructor(
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public location: Location
  ) {}

  ngOnInit() {}

  getGender(str) {
    this.gender = str;
  }

  submit(str) {
    if (this.gender == '' && str == 'choose') {
      this.apiService.presentToast('Please choose your gender', 'danger');
      return false;
    }

    var user = JSON.parse(localStorage.getItem('userObj'));
    user.gender = this.gender;
    user.not_choose = str;
    localStorage.setItem('userObj', JSON.stringify(user));
    this.router.navigate(['/weight']);
  }

  goBack() {
    this.location.back();
  }
}
