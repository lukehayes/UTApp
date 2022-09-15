import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  ModalController,
  NavController,
  AlertController,
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-edit-exercises-details',
  templateUrl: './edit-exercises-details.page.html',
  styleUrls: ['./edit-exercises-details.page.scss'],
})
export class EditExercisesDetailsPage implements OnInit {
  public id: any;
  response: any;
  description: any;
  completewrkout: any;
  detail: any = [];
  edit = false;
  timer = 0;
  c = 0;
  interval: any = 30;
  t: any;
  timer_is_on = 0;
  timeinterval: any = 0;
  percent: any;
  orginal_per: any;
  IMAGES_URL = config.IMAGES_URL;
  index = 0;
  duration: any;
  count = 0;
  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public alertController: AlertController
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getSubCategoryWorkoutExerciseDetail();
  }

  //get the current time of the video when it is paused
  setCurrentTime(data) {
    if (data.target.paused == true) {
      this.timer_is_on = 0;
    }
    this.timeinterval = this.duration - data.target.currentTime;
    this.percent = (this.timeinterval / this.duration) * 100;
    this.orginal_per = Math.round(
      (data.target.currentTime / this.interval) * 100
    );
  }

  //get the video content which is played
  video(event) {
    this.timer_is_on = 1;
  }

  //getting the video ended event
  vidEnded(event) {
    this.timer_is_on = 0;
  }

  getSubCategoryWorkoutExerciseDetail() {
    this.apiService
      .post(
        '/sub_category_workout_detail',
        { _id: this.id, userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.response = res;
        this.detail = this.response.data.exercises;
        this.index = 0;
        this.description = this.detail.description;

        setTimeout(() => {
          var myVideo: any = document.getElementById('my_video_1');
          console.log(myVideo.duration);
          this.duration = myVideo.duration;
        }, 1000);
      });
  }

  nextExercise() {
    if (this.count < this.detail.length) this.count = this.count + 1;
  }

  //take confirmation from user to complete or end the workout
  async popup() {
    const alert = await this.alertController.create({
      header: 'Delete Confirm',
      message: 'Are you sure to end workout?',

      buttons: [
        {
          text: 'Yes',
          handler: (data) => {
            console.log('Confirm Okay', data);
            this.finishWorkout();
          },
        },
        {
          text: 'No',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  //complete the workout
  finishWorkout() {
    this.apiService
      .post(
        '/updateWorkout',
        {
          workoutId: this.response.data._id,
          userId: localStorage.getItem('userId'),
          complete_status: '1',
          workout: this.response.data,
        },
        ''
      )
      .subscribe((res) => {
        this.completewrkout = res;
        if (this.completewrkout.status == 1) {
          this.apiService.presentToast(this.completewrkout.msg, 'success');
          this.navCtrl.back();
        }
      });
  }
}
