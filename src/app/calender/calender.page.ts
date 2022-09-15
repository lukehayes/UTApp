import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';
import {
  ModalController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.page.html',
  styleUrls: ['./calender.page.scss'],
})
export class CalenderPage implements OnInit {
  dateRange: any;
  type: 'string';
  status: boolean = false;
  msg1: boolean = false;
  dateLabels: any = [];
  current_month: any;
  IMAGES_URL = config.IMAGES_URL;
  current_year: any;
  activeButton: any;
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  response: any;
  response2: any;
  price: any = localStorage.getItem('price');
  alert: any;
  selected_date: any;
  response_payment: any;

  optionsRange: CalendarComponentOptions = {
    pickMode: 'single',
    showMonthPicker: false,
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  };

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public modalController: ModalController,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService
  ) {
    //get the latest value which is emitted from the observer
    this.events.getObservable().subscribe((data) => {
      this.price = localStorage.getItem('price');
      this.getScheduleExerciseList();
    });
  }

  ionViewDidLeave() {
    this.events.publishSomeData({});
  }

  ngOnInit() {
    this.getweeks();
  }

  getweeks() {
    let curr = new Date();

    this.current_month = this.monthNames[curr.getMonth()];
    this.current_year = curr.getFullYear();
    this.activeButton = curr.getDay();

    for (let i = 0; i < 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first)).toISOString().substring(0, 10);
      let date = new Date(curr.setDate(first));

      let orgdate = new Date(day);
      orgdate.setHours(0, 0, 0, 0);
      let dayName = orgdate.toString().split(' ')[0];
      let dayNameFirstLetter = dayName.split('')[0];
      let datenumber = date.getDate();
      this.dateLabels.push({
        day: dayName,
        first_letter: dayNameFirstLetter,
        date_only: datenumber,
        date: date,
      });
    }
    this.getScheduleExerciseList();
  }

  select_date(doc, i) {
    this.activeButton = i;
    this.current_month = this.monthNames[doc.date.getMonth()];
    this.current_year = doc.date.getFullYear();
    var formatted_month = (doc.date.getMonth() + 1).toString();
    var formatted_date = doc.date.getDate().toString();

    this.selected_date =
      doc.date.getFullYear() +
      '-' +
      (formatted_month.length == 1 ? '0' + formatted_month : formatted_month) +
      '-' +
      (formatted_date.length == 1 ? '0' + formatted_date : formatted_date);
    this.getScheduleExerciseList();
  }

  onChange(event) {
    this.current_month = this.monthNames[event._d.getMonth()];
    this.current_year = event._d.getFullYear();
    var formatted_month = (event._d.getMonth() + 1).toString();
    var formatted_date = event._d.getDate().toString();

    this.selected_date =
      event._d.getFullYear() +
      '-' +
      (formatted_month.length == 1 ? '0' + formatted_month : formatted_month) +
      '-' +
      (formatted_date.length == 1 ? '0' + formatted_date : formatted_date);

    this.getScheduleExerciseList();
  }

  getScheduleExerciseList() {
    this.apiService
      .post(
        '/schedule_exercises_list',
        {
          selected_date: this.selected_date,
          userId: localStorage.getItem('userId'),
        },
        ''
      )
      .subscribe((res) => {
        this.response = res;
      });
  }

  deleteScheduledExercise(doc, i) {
    this.apiService
      .post('/delete_schedule_exercise', { id: doc._id }, '')
      .subscribe((res) => {
        this.response2 = res;
        this.response.data.splice(i, 1);
        if (this.response2.status == 1) {
          this.apiService.presentToast(this.response2.error, 'success');
        } else {
          this.apiService.presentToast(this.response2.error, 'danger');
        }
      });
  }

  async presentAlertConfirm(doc, i) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure to delete?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deleteScheduledExercise(doc, i);
          },
        },
        {
          text: 'Cancel',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  fav_unfav(doc, i, fav) {
    this.apiService
      .post(
        '/fav_unfav_exercise',
        {
          exerciseId: doc.exer._id,
          userId: localStorage.getItem('userId'),
          fav: fav,
        },
        ''
      )
      .subscribe((res) => {
        this.response.data[i].fav = fav;
      });
  }

  checkSubs(str, doc, i) {
    if (this.price == '9.99' || this.price == '89.99') {
      if (str == 'delete') {
        this.presentAlertConfirm(doc, i);
      } else if (str == 'reschedule') {
        this.router.navigate(['/rescheduleexercise/', doc.cat_id, doc._id]);
      } else if (str == 'fav') {
        this.fav_unfav(doc, i, 1);
      } else if (str == 'unfav') {
        this.fav_unfav(doc, i, 0);
      } else {
        this.router.navigate(['/scheduleallexercises']);
      }
    } else {
      if (localStorage.getItem('subsexits') == 'yes') {
        if (str == 'delete') {
          this.presentAlertConfirm(doc, i);
        } else if (str == 'reschedule') {
          this.router.navigate(['/rescheduleexercise/', doc.cat_id, doc._id]);
        } else if (str == 'fav') {
          this.fav_unfav(doc, i, 1);
        } else if (str == 'unfav') {
          this.fav_unfav(doc, i, 0);
        } else {
          this.router.navigate(['/scheduleallexercises']);
        }
      } else {
        this.presentAlertConfirmCheckSubs(str, doc, i);
      }
    }
  }

  async presentAlertConfirmCheckSubs(str, doc, i) {
    this.alert = await this.alertController.create({
      header: 'Upgrade Your Plan',
      message:
        'Please upgrade your plan to premium, in order to view this feature of our application. Do you want to upgrade it now?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.checkSubscription();
          },
        },
        {
          text: 'No',
          handler: () => {},
        },
      ],
    });

    await this.alert.present();
  }

  checkSubscription() {
    this.apiService
      .post(
        '/check_payment_subscription',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.response_payment = res;

        if (this.response_payment.status == 1) {
          localStorage.setItem('subsexits', 'no');
          this.navCtrl.navigateRoot('/getstarted');
        } else {
          this.response_payment = res;
          localStorage.setItem('subsexits', 'yes');
          localStorage.setItem('days', this.response_payment.data.days);
          localStorage.setItem('price', this.response_payment.data.price);
          this.events.publishSomeData({});
          if (
            localStorage.getItem('price') == '9.99' ||
            localStorage.getItem('price') == '89.99'
          ) {
            this.alert.dismiss();
          } else {
            this.router.navigate(['/getstarted']);
          }
        }
      });
  }
}
