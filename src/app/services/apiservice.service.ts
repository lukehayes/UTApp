import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
  LoadingController,
  ToastController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { config } from './config';
import 'rxjs/add/operator/map';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url: any = config.API_URL;
  seconds: any;
  getdate: any;
  date: any;

  constructor(
    private HttpClient: HttpClient,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    public alertController: AlertController
  ) {}

  //common http post method calling from this service by importing the service
  post(endpoint, data, headers) {
    return this.HttpClient.post(this.url + endpoint, data).map(
      (responseData) => {
        return responseData;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //common dispay the toast message by passing dynamic mesage
  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      color: color,
      duration: 3000,
      buttons: [
        {
          text: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    toast.present();
  }

  //display the loading spinner while getting the http response
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      translucent: true,
      duration: 2000,
    });
    await loading.present();
  }

  async stopLoading() {
    this.loadingCtrl.dismiss();
  }

  //format the date/time according ot time ago method
  timeSince(date) {
    this.date = new Date();
    this.getdate = new Date(date);
    this.seconds = Math.floor((this.date - this.getdate) / 1000);

    var interval = this.seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = this.seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = this.seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = this.seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = this.seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return ' just now';
  }
}
