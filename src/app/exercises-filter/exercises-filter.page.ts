import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-exercises-filter',
  templateUrl: './exercises-filter.page.html',
  styleUrls: ['./exercises-filter.page.scss'],
})
export class ExercisesFilterPage implements OnInit {
  response: any;
  result: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;
  selected_cats = [];

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.selected_cats = JSON.parse(localStorage.getItem('selected_cats'));
  }

  ngOnInit() {
    this.getFilterCategoryList();
  }

  dismiss1() {
    this.modalController.dismiss({
      dismissed: true,
      data: [],
    });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data

    localStorage.setItem('selected_cats', JSON.stringify(this.selected_cats));
    this.modalController.dismiss({
      dismissed: true,
      data: this.selected_cats,
    });
  }

  getFilterCategoryList() {
    this.apiService.post('/filter_cat_list', {}, '').subscribe((res) => {
      console.log(res);
      this.response = res;

      this.response.data.forEach((obj) => {
        console.log('obj=', obj._id);

        var index = this.selected_cats.indexOf(obj._id);
        if (index >= 0) {
          obj.checked = true;
        } else {
          obj.checked = false;
        }
      });
    });
  }

  selectedcheck(doc, i) {
    console.log('kk');
    if (this.selected_cats.indexOf(doc._id) >= 0) {
      console.log('if');
      this.selected_cats.splice(i, 1);
      this.response.data[i].checked = false;
    } else {
      console.log('else');
      this.selected_cats.push(doc._id);
      this.response.data[i].checked = true;
    }
  }

  clear() {
    this.selected_cats = [];
    this.response.data.forEach((obj) => {
      obj.checked = false;
    });
    localStorage.removeItem('selected_cats');
    this.modalController.dismiss({
      dismissed: true,
      data: [],
    });
  }
}
