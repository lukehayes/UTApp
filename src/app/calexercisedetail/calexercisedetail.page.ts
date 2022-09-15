import { Component, OnInit } from '@angular/core';
import { StartWorkoutPage } from '../start-workout/start-workout.page';
import { ModalController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-calexercisedetail',
  templateUrl: './calexercisedetail.page.html',
  styleUrls: ['./calexercisedetail.page.scss'],
})
export class CalexercisedetailPage implements OnInit {
  response: any;
  response1: any;
  id: any;
  exer_id: any;
  workout_id: any;
  cat_id: any;
  ability_id: any;
  errors = config.errors;
  IMAGES_URL = config.IMAGES_URL;
  detail: any;
  comment_response: any;
  comment = '';
  commentList = [];

  constructor(
    public location: Location,
    public alertController: AlertController,
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');
    this.cat_id = activatedRoute.snapshot.paramMap.get('cat_id');
    this.exer_id = activatedRoute.snapshot.paramMap.get('exer_id');
  }

  ngOnInit() {
    this.getSubCategoryWorkoutExerciseDetail();
  }

  //get the details of the exercise 
  getSubCategoryWorkoutExerciseDetail() {
    this.apiService
      .post(
        '/sub_category_workout_exercise_detail',
        { _id: this.exer_id, userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.response = res;
        this.detail = this.response.data;
        this.getSubCategoryWorkoutExerciseComments();
      });
  }

  //get the list of comments on particular exercise
  getSubCategoryWorkoutExerciseComments() {
    this.apiService
      .post('/exer_comments_list', { exerId: this.exer_id }, '')
      .subscribe((res) => {
        this.response1 = res;
        this.commentList = this.response1.data;
      });
  }

  //add the comment on the exercise 
  addComment() {
    if (this.comment == '') {
      this.apiService.presentToast('Please enter your comment', 'danger');
      return;
    }

    this.apiService
      .post(
        '/add_exer_comment',
        {
          userId: localStorage.getItem('userId'),
          comment: this.comment,
          exerId: this.id,
        },
        ''
      )
      .subscribe((res) => {
        this.comment_response = res;
        var dict = {
          comment: this.comment_response.data.comment,
          created_on: this.comment_response.data.created_on,
          exerId: this.comment_response.data.exerId,
          userId: this.comment_response.data.userId,
          userinfo: JSON.parse(localStorage.getItem('userObj')),
          _id: this.comment_response.data._id,
        };

        this.commentList.push(dict);
        this.comment = '';

      });
  }

  //take confirmation from user to complete the exercise
  async presentAlert(status) {
    const alert = await this.alertController.create({
      cssClass: 'popClass1',
      header:
        status == '1'
          ? 'Do you want to mark this video as Complete?'
          : 'Do you want to change the status?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Okay',
          handler: () => {
            this.completeExercise(status);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  completeExercise(status) {
    this.apiService
      .post(
        '/complete_status_exercise',
        { id: this.id, complete_status: status },
        ''
      )
      .subscribe((res) => {
        this.detail.completed_status = status;
      });
  }

  //format the date according to time ago
  timeSince(date) {
    return this.apiService.timeSince(date);
  }

  //take confirmation from user to delete the exercise from scheduled list
  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      cssClass: 'popClass1',
      header: 'Are you sure to remove exercise from shcedule list?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Okay',
          handler: () => {
            this.deleteExerciseFromScheculeList();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  deleteExerciseFromScheculeList() {
    this.apiService
      .post(
        '/delete_schedule_exercise',
        { id: this.id, exerId: this.exer_id },
        ''
      )
      .subscribe((res) => {
        this.detail.complete_status = status;
        this.apiService.presentToast(
          'Deleted from list successfully',
          'success'
        );
        this.location.back();
        this.events.publishSomeData({});
      });
  }
}
