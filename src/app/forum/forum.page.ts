import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ForumfilterPage } from './forumfilter/forumfilter.page';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {
  response: any;
  forumList: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;
  @ViewChild('whatsNew', { static: false }) whatsNew: ElementRef;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.events.getObservable().subscribe((data) => {
      this.getForumList();
    });
  }

  //get the inner HTML inner text only
  getInnerText(el) {
    return el.innerText;
  }

  //format the date/time as time ago
  timeSince(date) {
    return this.apiService.timeSince(date);
  }

  ngOnInit() {
    this.getForumList();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ForumfilterPage,
      cssClass: 'filtermodal',
    });
    return await modal.present();
  }

  getForumList() {
    this.apiService
      .post('/forum_list', { userId: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        this.response = res;
        this.forumList = this.response.data;
      });
  }

  add_like(doc, i) {
    this.apiService
      .post(
        '/add_like',
        { forumId: doc._id, userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        if (doc.like == 0) {
          this.forumList[i].like = 1;
          this.forumList[i].like_count += 1;
        } else {
          this.forumList[i].like = 0;
          this.forumList[i].like_count -= 1;
        }
      });
  }
}
