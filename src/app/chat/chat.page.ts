import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  response: any;
  admin: any;
  message: any = '';
  profile: any;
  id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;
  detail: any;
  userId = localStorage.getItem('userId');
  @ViewChild(IonContent, { static: false }) ionContent: IonContent;
  messageListData: any;
  messageList: any = [];
  messageData: any;
  hideMe = false;

  constructor(
    private socket: Socket,
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    var self = this;
    this.id = activatedRoute.snapshot.paramMap.get('id');

    this.getUpdates().subscribe((new_message) => {
      self.getMessage(new_message);
    });
  }

  ngOnInit() {
    this.getAdminProfile();
  }

  ionViewDidLeave() {
    this.socket.disconnect();
  }

  ionViewDidEnter() {
    this.socket.connect(); //connect the socket server for real time chat using ngx-socket npm
  }

  //socket server 'on' event for getting the observable response is get while event is emiitted
  getUpdates() {
    var self = this;
    let observable = new Observable((observer) => {
      self.socket.on('recieve_message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  //format the date/time as time ago
  timeSince(date) {
    return this.apiService.timeSince(date);
  }

  //hide and show the search bar on the header
  toggleClass() {
    this.hideMe = !this.hideMe;
  }

  //check the recieved message is related to logged user which is chatting with admin
  getMessage(new_message) {
    if (new_message.recieverId == this.userId) {
      var dict = {
        created_on: new_message.created_on,
        message: new_message.message,
        read: new_message.read,
        reciever: JSON.parse(localStorage.getItem('profile')),
        recieverId: new_message.recieverId,
        sender: {},
        senderId: new_message.senderId,
      };
      this.messageList.push(dict);
      this.apiService
        .post('/update_read_message', { _id: new_message._id }, '')
        .subscribe((res) => {
          console.log('res = ', res);
        });
    }
  }

  getAdminProfile() {
    this.apiService
      .post('/get_adminprofile', { id: '630738b9e4dd4f1c104b36e0' }, '')
      .subscribe((res) => {
        console.log(res);
        this.admin = res;

        this.getChat();
      });
  }

  //get all chats of user
  getChat() {
    this.apiService
      .post(
        '/get_chat',
        { userId: localStorage.getItem('userId'), userChatId: this.id },
        ''
      )
      .subscribe((res) => {
        this.messageListData = res;
        this.messageList = this.messageListData.data;
        this.ionContent.scrollToBottom();
      });
  }

  sendMessage(msg) {
    if (this.errors.indexOf(msg) >= 0) {
      this.apiService.presentToast("Message can't be empty", 'danger');
      return;
    }

    var dict = {
      senderId: localStorage.getItem('userId'),
      recieverId: this.id,
      message: msg,
    };

    this.apiService.post('/create_message', dict, '').subscribe((res) => {
      this.message = '';
      this.messageData = res;
      var dict = {
        created_on: this.messageData.data.created_on,
        message: this.messageData.data.message,
        read: 0,
        reciever: {},
        recieverId: this.messageData.data.recieverId,
        sender: JSON.parse(localStorage.getItem('profile')),
        senderId: this.messageData.data.senderId,
      };
      this.messageList.push(dict);
      this.ionContent.scrollToBottom();

      //connect with socket server to enable live chat with admin and user
      this.socket.connect();
      this.socket.emit('send_message', this.messageData.data);
    });
  }
}
