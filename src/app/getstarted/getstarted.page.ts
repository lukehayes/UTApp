import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { NavController, IonSlides, AlertController } from '@ionic/angular';
import {
  PayPalScriptService,
  IPayPalConfig,
  NgxPaypalComponent,
} from 'ngx-paypal';
import { plans, plansWithTax, yearlyPlans } from '../services/paypalPlans';
import { Location } from '@angular/common';
@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.page.html',
  styleUrls: ['./getstarted.page.scss'],
})
export class GetstartedPage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  @ViewChild('slidesyear', { static: true }) slidesyear: IonSlides;
  slideOpts3 = {
    slidesPerView: 1.85,
    initialSlide: 1,
    spaceBetween: 10,
    speed: 400,
    autoplay: false,
    centeredSlides: true,
  };
  slideOpts4 = {
    slidesPerView: 1.85,
    initialSlide: 1,
    spaceBetween: 10,
    speed: 400,
    autoplay: false,
    centeredSlides: true,
  };
  public payPalConfig?: IPayPalConfig;

  response: any;
  response22: any;
  subs_detail: any;
  selectedDays = 'month';
  monthlyPackages: any = [];
  yearlyPackages: any = [];
  paymentDetails: any;
  planDetail: any;
  monthly: any = false;
  selectedIndex: any = -1;
  selectedIndexYear: any = -1;
  IMAGES_URL = config.IMAGES_URL;
  adminMembershipStatus: any;

  private plans = [];
  private year_plans = [];
  public configs = {};
  public configsYear = {};
  @ViewChild('basic') basicSubscription?: NgxPaypalComponent;
  @ViewChild('advanced') advancedSubscription?: NgxPaypalComponent;
  @ViewChild('basicYear') basicSubscription1?: NgxPaypalComponent;
  @ViewChild('advancedYear') advancedSubscription1?: NgxPaypalComponent;
  plandetail: any;
  response_payment: any;
  response_payment1: any;
  cancelRes: any;
  userId = localStorage.getItem('userId');
  price = localStorage.getItem('price');
  freetrial = localStorage.getItem('freetrial');
  subsexits = localStorage.getItem('subsexits');
  errors = config.errors;
  toggle = false;

  constructor(
    public location: Location,
    public alertController: AlertController,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController,
    private payPalScriptService: PayPalScriptService
  ) {
    this.plans = plansWithTax;
    this.year_plans = yearlyPlans;

    this.events.getObservable().subscribe((data) => {
      this.monthlyPackages = [];
      this.yearlyPackages = [];
      this.getSusbcriptionList();
    });
  }
  gobackone() {
    this.navCtrl.back();
  }

  changePackage(event) {
    this.monthly = event.detail.checked;
    this.selectedIndex = -1;
    this.selectedIndexYear = -1;
    this.yearlyPackages = [];
    if (event.detail.checked == true) {
      this.response.data.forEach((item) => {
        if (item.days == '30') {
        } else {
          this.yearlyPackages.push(item);
        }

        var self = this;
        setTimeout(() => {
          self.slides.slideTo(0);
          self.slidesyear.slideTo(0);
        }, 500);
      });
      this.slidesyear.slideTo(1);
      this.payPalScriptService.registerPayPalScript(
        {
          clientId:
            'AdydrMevylkBHlF-35LoxA9u-P3XV5CVxbRDAgm6HuIWiG55Gdc2gA28YMFN5S5TSjhaWWymp42pSg8n',
          currency: 'USD',
          vault: 'true',
        },
        (payPalApi) => {
          console.log('payPalApi = ', payPalApi);

          if (this.basicSubscription1) {
            this.basicSubscription1.customInit(payPalApi);
          }
          if (this.advancedSubscription1) {
            this.advancedSubscription1.customInit(payPalApi);
          }
        }
      );
    }
  }
  ngOnInit() {}

  checkAdminMembership() {
    this.apiService
      .post(
        '/check_admin_activate_membership',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.adminMembershipStatus = res;

        //Start//check susbcription of the logged user

        this.apiService
          .post(
            '/check_payment_subscription',
            { userId: localStorage.getItem('userId') },
            ''
          )
          .subscribe((res) => {
            this.response_payment = res;
            if (this.response_payment.status == 2) {
              localStorage.setItem('subsexits', 'yes');
            } else {
              if (this.adminMembershipStatus.status == 0) {
                localStorage.setItem('subsexits', 'no');
              } else {
                localStorage.setItem('subsexits', 'yes');
              }
            }
          });
        //End
      });
  }

  ionViewDidEnter() {
    this.getSusbcriptionList();
    this.monthlyPackages = [];
    this.yearlyPackages = [];
    this.toggle = false;
    this.plans.map((plan, i) => {
      this.configs[plan.name] = this.getConfig(i, plan, plan.id);
    });

    this.year_plans.map((plan, i) => {
      this.configsYear[plan.name] = this.getConfigYearly(i, plan, plan.id);
    });

    this.payPalScriptService.registerPayPalScript(
      {
        clientId:
          'AdydrMevylkBHlF-35LoxA9u-P3XV5CVxbRDAgm6HuIWiG55Gdc2gA28YMFN5S5TSjhaWWymp42pSg8n',
        currency: 'USD',
        vault: 'true',
      },
      (payPalApi) => {
        if (this.basicSubscription) {
          this.basicSubscription.customInit(payPalApi);
        }
        if (this.advancedSubscription) {
          this.advancedSubscription.customInit(payPalApi);
        }
      }
    );

    this.checkAdminMembership();
  }

  changestatus() {
    this.response_payment.status = 1;
  }

  changestatus1() {
    this.response_payment.status = 2;
  }

  selectPackage(doc, i) {
    this.selectedDays = 'month';
    if (this.monthlyPackages[i].active == 0) {
      this.selectedIndex = i;
      this.plandetail = doc;
      this.slides.slideTo(i, 500);
      var plan =
        i == 0 ? 'P-0L873381XG5272536ML5XG2Q' : 'P-83D313183X592463LML5XHHI';
      localStorage.setItem('planId', plan);
      localStorage.setItem(
        'plan',
        i == 0 ? 'basicplanmonth1' : 'premiumplanmonth1'
      );
      localStorage.setItem('planDays', doc.days);
      localStorage.setItem('planName', doc.name);
    }
  }

  selectPackageYear(doc, i) {
    if (this.yearlyPackages[i].active == 0) {
      this.selectedDays = 'year';
      this.selectedIndexYear = i;
      this.plandetail = doc;
      this.slidesyear.slideTo(i, 500);
      localStorage.setItem(
        'plan',
        i == 0 ? 'basicplanyear1' : 'premiumplanyear1'
      );
      var plan =
        i == 0 ? 'P-7HD6069691310072FML5XHTA' : 'P-3CP35946WA5824128ML6PGXQ';
      localStorage.setItem('planId', plan);
    }
  }

  getConfigYearly(i, plan, plan_id: string): IPayPalConfig {
    var self = this;
    return {
      clientId:
        'AdydrMevylkBHlF-35LoxA9u-P3XV5CVxbRDAgm6HuIWiG55Gdc2gA28YMFN5S5TSjhaWWymp42pSg8n',
      currency: 'USD',
      vault: 'true',
      style: {
        label: 'paypal',
        layout: 'vertical',
        size: 'small',
        shape: 'pill',
        color: 'silver',
        tagline: false,
      },
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id: plan_id,
        });
      },
      onApprove: function (data, actions) {
        actions.subscription.get().then((details) => {
          self.paymentDetails = details;
          self.CreateSubscription(details);
        });
      },
      onCancel: (data, actions) => {},
      onError: (err) => {},
      onClick: (data, actions) => {
        self.planDetail = plan;
      },
    };
  }

  getConfig(i, plan, plan_id: string) {
    var self = this;
    return {
      clientId:
        'AdydrMevylkBHlF-35LoxA9u-P3XV5CVxbRDAgm6HuIWiG55Gdc2gA28YMFN5S5TSjhaWWymp42pSg8n',
      currency: 'USD',
      vault: 'true',
      style: {
        label: 'paypal',
        layout: 'vertical',
        size: 'small',
        shape: 'pill',
        color: 'silver',
        tagline: false,
      },
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id,
        });
      },
      onApprove: function (data, actions) {
        actions.subscription.get().then((details) => {
          alert('Success to subscribe!');
          self.paymentDetails = details;
          self.CreateSubscription(details);
        });
      },
      onCancel: (data, actions) => {},
      onError: (err) => {},
      onClick: (data, actions) => {
        self.planDetail = plan;
      },
    };
  }

  gotopayment() {
    if (this.selectedIndex == -1 && this.selectedIndexYear == -1) {
      this.apiService.presentToast('Please choose any susbcription.', 'danger');
      return;
    }
    this.apiService
      .post(
        '/check_payment_subscription',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        console.log(res);
        this.response_payment1 = res;
        if (this.response_payment1.status == 1) {
          this.events.publishSomeData({});
          this.router.navigate(['/paymentpage/', this.plandetail._id]);
        } else {
          var msg =
            this.response_payment1.data.name == 'Premium'
              ? 'You have already purchase premium susbcription.Are you sure to cancel?'
              : 'You have already purchased a subscription. Are you sure to cancel it and upgrade to premium?';
          this.presentAlertConfirm(this.response_payment1, msg);
        }
      });
  }

  async presentAlertConfirm(doc, msg) {
    const alert = await this.alertController.create({
      header: 'Cancel subscription',
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.cancelSubscription(doc);
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

  cancelSubscription(doc) {
    this.apiService
      .post(
        '/cancel_subscription',
        {
          payment_id: doc.payment._id,
          subs_id: doc.data._id,
          subscriptionid: doc.payment.subscriptionId,
          userId: localStorage.getItem('userId'),
        },
        ''
      )
      .subscribe((res) => {
        this.cancelRes = res;
        this.router.navigate(['/paymentpage/', this.plandetail._id]);
      });
  }

  getSusbcriptionList() {
    this.apiService.presentLoading();
    this.apiService
      .post(
        '/susbcription_list',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.response = res;
        this.apiService.stopLoading();
        this.response.data.forEach((item) => {
          if (item.days == '30') {
            this.monthlyPackages.push(item);
          } else {
          }

          var self = this;
          setTimeout(() => {
            self.slides.slideTo(0);
            self.slidesyear.slideTo(0);
            self.apiService.stopLoading();
          }, 1000);
        });
      });
  }

  CreateSubscription(details) {
    var dict = {
      userId: localStorage.getItem('userId'),
      price: details.billing_info.last_payment.amount.value,
      subs_id:
        this.selectedDays == 'month'
          ? this.monthlyPackages[this.selectedIndex]._id
          : this.yearlyPackages[this.selectedIndexYear]._id,
      days: this.selectedDays == 'month' ? '30' : '365',
      subscriptionId: details.id,
      packageId: details.plan_id,
      paymentDays: this.planDetail.days,
      subscriber: details.subscriber,
      plan_desc: details,

      plan_id: this.planDetail.id,
      start_time: this.paymentDetails.start_time.split('T')[0],
      plan_name: this.planDetail.name,
    };
    this.apiService
      .post('/add_payment_subscription', dict, '')
      .subscribe((res) => {
        this.response22 = res;
        localStorage.setItem('price', this.response22.data.price);
        this.apiService.presentToast('Purchased successfully', 'success');
        this.getSusbcriptionList();
        this.router.navigate(['/tabs/workoutselection']);
      });
  }

  goBack() {
    this.events.publishSomeData({});
    this.location.back();
  }
}
