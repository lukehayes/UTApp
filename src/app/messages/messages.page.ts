import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  term: string;
  response: any;
  messageListData: any = [];
  result: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService
  ) {}

  ngOnInit() {
    this.getMessages();
  }

  //get all chat users list
  getMessages() {
    var dict = {
      userId: localStorage.getItem('userId'),
    };

    this.apiService.post('/all_chats', dict, '').subscribe((res) => {
      var self = this;
      this.apiService.stopLoading();
      this.messageListData = res;
    });
  }
}
