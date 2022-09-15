import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { NavController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-readytogo',
  templateUrl: './readytogo.page.html',
  styleUrls: ['./readytogo.page.scss'],
})
export class ReadytogoPage implements OnInit {
  price = localStorage.getItem('price');
  response_payment: any;
  response: any;
  freeTrial: any;

  constructor(
    public navCtrl: NavController,
    public apiService: ApiService,
    public events: EventsService,
    public router: Router,
    public location: Location
  ) {
    this.events.getObservable().subscribe((data) => {
      this.price = localStorage.getItem('price');
    });

    this.price = localStorage.getItem('price');
  }

  ngOnInit() {
    console.log('ss');
  }

  goBack() {
    this.location.back();
  }

  goto(route) {
    // this.checkSubscription(route);
    var userData = JSON.parse(localStorage.getItem('userObj'));
    var user = {
      name: userData.name,
      email: userData.email,
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      weight: userData.weight,
      weight_str: userData.weight_str,
      activity_level: userData.activity_level,
      not_choose: userData.not_choose,
      image: userData.image,
      filename: userData.filename,
      password: userData.password,
      workout_pref: JSON.parse(userData.workout_pref),
      workout_type: userData.workout_type,
    };
    this.apiService.post('/registerUser', user, '').subscribe((res) => {
      console.log(res);
      this.response = res;
      if (this.response.status == 1) {
        localStorage.setItem('userId', this.response.data._id);
        localStorage.setItem('userEmail', this.response.data.email);

        this.checkSubscription();
        this.router.navigateByUrl('/tabs/workoutselection', {
          replaceUrl: true,
        });
        this.events.publishSomeData1({});
        // this.navCtrl.navigateRoot('/tabs/workoutselection');
      } else {
        this.apiService.presentToast(this.response.msg, 'danger');
      }
    });
  }
  checkSubscription() {
    this.apiService
      .post(
        '/check_payment_subscription',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.response_payment = res;

        if (this.response_payment.status == 1) {
          localStorage.setItem('subsexits', 'no');
          localStorage.setItem('price', '0');
          this.navCtrl.navigateRoot('/getstarted');
        } else {
          this.response_payment = res;
          localStorage.setItem('price', this.response_payment.data.price);
          localStorage.setItem('subsexits', 'yes');
        }
      });
  }

  freetrialcheck() {
    this.apiService
      .post('/check_free_trial', { userId: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        this.freeTrial = res;
        if (this.freeTrial.status == 1 || this.freeTrial.status == 0) {
          localStorage.setItem('freetrial', 'no');
          this.checkSubscription();
        } else {
          localStorage.setItem('freetrial', 'yes');
        }
      });
  }
}
