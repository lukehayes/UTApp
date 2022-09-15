import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  profile: any;
  price: any = localStorage.getItem('price');
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;
  constructor(
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService
  ) {
    this.events.getObservable().subscribe((data) => {
      this.getProfile();
      this.price = localStorage.getItem('price');
    });

    this.price = localStorage.getItem('price');
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.apiService
      .post('/getProfile', { _id: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        console.log(res);
        this.profile = res;
      });
  }

  gotosusbscription() {
    this.router.navigate(['/getstarted']);
  }

  logout() {
    localStorage.clear();
  }

  goto(route) {
    if (localStorage.getItem('subsexits') == 'yes') {
      this.router.navigate([route]);
    } else if (
      localStorage.getItem('price') == '9.99' ||
      localStorage.getItem('price') == '89.99'
    ) {
      this.router.navigate([route]);
    } else {
      this.apiService.presentToast(
        'This feature is only available in premium subscription.',
        'danger'
      );
    }
  }

  gotochat() {
    // routerLink="/messages"
    // this.router.navigate(['/chat/', '']);
    if (localStorage.getItem('subsexits') == 'yes') {
      this.router.navigate(['/chat/', '']);
    } else if (
      this.errors.indexOf(localStorage.getItem('price')) == -1 &&
      localStorage.getItem('price') != '0'
    ) {
      this.router.navigate(['/chat/', '']);
    } else {
      this.apiService.presentToast(
        'Please upgrade your plan to initiate chat',
        'danger'
      );
    }
  }
}
