import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-age',
  templateUrl: './age.page.html',
  styleUrls: ['./age.page.scss'],
})
export class AgePage implements OnInit {
  gadgets: any[] = [];
  gadgetsyears: any[] = [];
  gadgetsmonths: any[] = [];
  ageArray: any = [];

  age: any = '';
  day: any = '';
  month: any = '';
  year: any = '';
  errors = config.errors;
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years = [];
  numColumns: number = 1; // number of columns to display on picker over lay
  numOptions: number = 5; // number of items (or rows) to display on picker over lay

  constructor(
    private pickerController: PickerController,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService,
    public location: Location
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    for (var i = 1; i <= 31; i++) {
      this.ageArray.push(i);
    }

    this.gadgets.push(this.ageArray);

    const currentYear = new Date().getFullYear();
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    this.years = range(currentYear, 1900, -1);
    this.gadgetsyears.push(this.years);

    this.gadgetsmonths.push(this.months);
  }

  async showPicker(str) {
    let options: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (value: any) => {
            if (str == 'year') this.year = value.col.text;
            if (str == 'day') this.day = value.col.text;
            if (str == 'month') this.month = value.col.text;
          },
        },
      ],

      columns: this.getColumns(str),
    };
    let picker = await this.pickerController.create(options);
    picker.present();
  }

  //get all columns displayed in picker for DOB
  getColumns(str) {
    let columns = [];
    for (let i = 0; i < this.numColumns; i++) {
      columns.push({
        name: 'col',
        options: this.getColumnOptions(i, str),
      });
    }
    return columns;
  }

  // get the list of selected option for day, month and year
  getColumnOptions(columIndex: number, str) {
    let options = [];
    if (str == 'year') {
      for (let i = 0; i < this.years.length; i++) {
        options.push({
          text: this.gadgetsyears[columIndex][i % this.years.length],
          value: i,
        });
      }
      return options;
    }
    if (str == 'month') {
      for (let i = 0; i < this.months.length; i++) {
        options.push({
          text: this.gadgetsmonths[columIndex][i % this.months.length],
          value: i,
        });
      }
      return options;
    }
    if (str == 'day') {
      for (let i = 0; i < this.ageArray.length; i++) {
        options.push({
          text: this.gadgets[columIndex][i % this.ageArray.length],
          value: i,
        });
      }
      return options;
    }
  }

  submit() {
    //validations for empty day, month and year columns
    if (this.errors.indexOf(this.day) >= 0) {
      this.apiService.presentToast('Please select day', 'danger');
      return false;
    }
    if (this.errors.indexOf(this.month) >= 0) {
      this.apiService.presentToast('Please select month', 'danger');
      return false;
    }
    if (this.errors.indexOf(this.year) >= 0) {
      this.apiService.presentToast('Please select year', 'danger');
      return false;
    }

    var user = JSON.parse(localStorage.getItem('userObj')); //get the previous user info from local storage

    //modification of month number with concatenation with 0 if less than 10
    var month =
      this.months.indexOf(this.month) < 10
        ? '0' + String(this.months.indexOf(this.month) + 1)
        : String(this.months.indexOf(this.month) + 1);
    var day = this.day < 10 ? '0' + String(this.day) : String(this.day);

    //updation in user details
    user.age = String(day) + '-' + String(month) + '-' + String(this.year);
    localStorage.setItem('userObj', JSON.stringify(user));

    this.router.navigate(['/height']);
  }
}
