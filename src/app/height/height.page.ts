import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { Location } from '@angular/common';
@Component({
  selector: 'app-height',
  templateUrl: './height.page.html',
  styleUrls: ['./height.page.scss'],
})
export class HeightPage implements OnInit {
  gadgets: any[] = [['168 cm', '169 cm', '170 cm', '171 cm', '172 cm']];

  heightArray = [];
  heightArray1 = [];
  height: any = '';
  errors = config.errors;
  is_submit = false;

  numColumns: number = 1; // number of columns to display on picker over lay
  numOptions: number = 5; // number of items (or rows) to display on picker over lay
  constructor(
    public location: Location,
    private pickerController: PickerController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService
  ) {
    for (var i = 122; i <= 220; i++) {
      this.heightArray1.push(i + ' cm');
    }
    this.heightArray.push(this.heightArray1);
  }

  ngOnInit() {}

  //picker contains the height values
  async showPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler: (value: any) => {
            this.height = value.col.text;
          },
        },
      ],
      columns: this.getColumns(),
    };
    let picker = await this.pickerController.create(options);
    picker.present();
  }

  getColumns() {
    let columns = [];
    for (let i = 0; i < this.numColumns; i++) {
      columns.push({
        name: 'col',
        options: this.getColumnOptions(i),
      });
    }
    return columns;
  }

  getColumnOptions(columIndex: number) {
    let options = [];
    for (let i = 0; i < this.heightArray1.length; i++) {
      options.push({
        text: this.heightArray[columIndex][i % this.heightArray1.length],
        value: i,
      });
    }
    return options;
  }

  submit() {
    this.is_submit = true;
    if (this.errors.indexOf(this.height) >= 0) {
      this.apiService.presentToast('Please select your height', 'danger');
      return false;
    }
    var userDetail = JSON.parse(localStorage.getItem('userObj'));
    var user = JSON.parse(localStorage.getItem('userObj'));
    user.height = this.height;
    localStorage.setItem('userObj', JSON.stringify(user));
    this.router.navigate(['/activitylevel']);
  }

  goBack() {
    this.location.back();
  }
}
