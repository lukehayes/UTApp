import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  response: any;
  detail: any;
  IMAGES_URL = config.IMAGES_URL;
  id: any;

  constructor(
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {}
  ionViewDidEnter() {
    this.getWorkoutCategory();
  }

  getWorkoutCategory() {
    this.detail = '';
    this.apiService.post('/get_cms', { type: this.id }, '').subscribe((res) => {
      console.log(res);
      this.response = res;
      this.detail = this.response.data;
    });
  }
}
