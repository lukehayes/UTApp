import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  price: any = localStorage.getItem('price');
  response_payment: any;
  active = false;
  alert: any;

  constructor(
    public router: Router,
    public events: EventsService,
    public apiService: ApiService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) {
    this.events.getObservable().subscribe((data) => {
      console.log('price------')
      this.price = localStorage.getItem('price');
      console.log(this.price)
    });

    this.price = localStorage.getItem('price');
  }

  gotocalender() {
    
    if(this.price == '9.99' || this.price == '89.99'){
      this.navCtrl.navigateRoot('/tabs/calender');
    }else{
      this.presentAlertConfirm();
    }
    
  }

  doSomething(){
    console.log('ffffffffffff')
  }

  onTabsWillChange(event){
    console.log('ffffffffffff' ,event);
    if(event.tab == 'calender'){
      this.active = true;
    }else{
      this.active = false;
    }
  }

  async presentAlertConfirm() {
    this.alert = await this.alertController.create({
      header: 'Upgrade Your Plan',
      message:
        'Please upgrade your plan to premium, in order to view this feature of our application. Do you want to upgrade it now?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
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
        console.log(res);
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
            // this.apiService.presentToast(
            //   'You does not have premium plan',
            //   'danger'
            // );
          }
        }
      });
  }
}
