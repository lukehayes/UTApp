import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {
  response: any;
  nutritionList: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.events.getObservable().subscribe((data) => {
      this.getNutritionListList();
    });
  }

  ngOnInit() {
    this.getNutritionListList();
  }

  getNutritionListList() {
    this.apiService.post('/nutrition_list', {}, '').subscribe((res) => {
      this.response = res;
      this.nutritionList = this.response.data;
    });
  }
}
