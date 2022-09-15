import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-nutrition-details',
  templateUrl: './nutrition-details.page.html',
  styleUrls: ['./nutrition-details.page.scss'],
})
export class NutritionDetailsPage implements OnInit {
  response: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;
  detail: any;

  slideOpts = {
    slidesPerView: 2.3,
    spaceBetween: 15,
    speed: 400,
    loop: true,
    autoplay: true,
  };

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getNutritionDetail();
  }

  getNutritionDetail() {
    this.apiService
      .post('/nutrition_detail', { _id: this.id }, '')
      .subscribe((res) => {
        this.response = res;
        this.detail = this.response.data[0];
      });
  }
}
