import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  response: any;
  IMAGES_URL = config.IMAGES_URL;
  errors = config.errors;

  constructor(
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.listNotification();
  }

  timeSince(date) {
    return this.apiService.timeSince(date);
  }
  getimage(img) {
    if (this.errors.indexOf(img) == -1) {
      if (img.includes('https') == true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  listNotification() {
    this.apiService
      .post(
        '/list_notification',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.response = res;
      });
  }

  view(item) {
    this.router.navigate(['/forum/forumcomments/', item.itemId]);
  }
}
