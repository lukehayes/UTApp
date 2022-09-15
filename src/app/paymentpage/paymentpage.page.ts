import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { NavController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import {
  PayPalScriptService,
  IPayPalConfig,
  NgxPaypalComponent,
} from 'ngx-paypal';
declare var window: any;
import { plans, plansWithTax, yearlyPlans } from '../services/paypalPlans';

@Component({
  selector: 'app-paymentpage',
  templateUrl: './paymentpage.page.html',
  styleUrls: ['./paymentpage.page.scss'],
})
export class PaymentpagePage implements OnInit {
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

  private plans: any;
  private year_plans: any;
  public configs = {};
  public configsYear = {};
  @ViewChild('basic') basicSubscription?: NgxPaypalComponent;
  @ViewChild('advanced') advancedSubscription?: NgxPaypalComponent;
  @ViewChild('basicYear') basicSubscription1?: NgxPaypalComponent;
  @ViewChild('advancedYear') advancedSubscription1?: NgxPaypalComponent;
  errors = config.errors;
  plan_name: any;
  detail: any;
  id: any;
  start_time: any;

  constructor(
    public location: Location,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController,
    private payPalScriptService: PayPalScriptService,
    activatedRoute: ActivatedRoute
  ) {
    this.id = activatedRoute.snapshot.paramMap.get('id');

    if (localStorage.getItem('plan') == 'basicplanmonth1') {
      this.plans = plansWithTax[0];
      this.plan_name = 'Standard Plan';
    } else if (localStorage.getItem('plan') == 'premiumplanmonth1') {
      this.plans = plansWithTax[1];
      this.plan_name = 'Premium Plan';
    } else if (localStorage.getItem('plan') == 'basicplanyear1') {
      this.plans = yearlyPlans[0];
      this.plan_name = 'Standard Plan';
    } else if (localStorage.getItem('plan') == 'premiumplanyear1') {
      this.plans = yearlyPlans[1];
      this.plan_name = 'Premium Plan';
    }

    this.events.getObservable().subscribe((data) => {
      if (localStorage.getItem('plan') == 'basicplanmonth1') {
        this.plans = plansWithTax[0];
        this.plan_name = 'Standard Plan';
      } else if (localStorage.getItem('plan') == 'premiumplanmonth1') {
        this.plans = plansWithTax[1];
        this.plan_name = 'Premium Plan';
      } else if (localStorage.getItem('plan') == 'basicplanyear1') {
        this.plans = yearlyPlans[0];
        this.plan_name = 'Standard Plan';
      } else if (localStorage.getItem('plan') == 'premiumplanyear1') {
        this.plans = yearlyPlans[1];
        this.plan_name = 'Premium Plan';
      }
    });
  }

  changePackage() {
    this.configs[this.plans.name] = this.getConfig(this.plans, this.plans.id);

    this.payPalScriptService.registerPayPalScript(
      {
        clientId:
          'ATJKKUPDB_0ExH45Q8oJG06K52OkhQgumFXkrTj64ViJ4hqWISHMdTgX72tsDQz7qTLnblEAFKr42EzR',
        currency: 'GBP',
        vault: 'true',
      },
      (payPalApi) => {
        if (this.basicSubscription) {
          this.basicSubscription.customInit(payPalApi);
        }
      }
    );
  }

  ngOnInit() {
    setTimeout(() => {
      this.changePackage();
    }, 2000);
  }

  ionViewDidEnter() {
    this.getSusbcriptionDetail();
  }

  getSusbcriptionDetail() {
    this.apiService.presentLoading();
    this.apiService
      .post('/susbcription_detail', { _id: this.id }, '')
      .subscribe((res) => {
        console.log(res);
        this.detail = res;
        this.apiService.stopLoading();
        this.paypalButton();
      });
  }

  getConfigYearly(plan, plan_id: string): IPayPalConfig {
    var self = this;
    return {
      clientId:
        'ATJKKUPDB_0ExH45Q8oJG06K52OkhQgumFXkrTj64ViJ4hqWISHMdTgX72tsDQz7qTLnblEAFKr42EzR',
      currency: 'GBP',
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

  getConfig(plan, plan_id: string) {
    var self = this;
    return {
      clientId:
        'ATJKKUPDB_0ExH45Q8oJG06K52OkhQgumFXkrTj64ViJ4hqWISHMdTgX72tsDQz7qTLnblEAFKr42EzR',
      currency: 'GBP',
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
          // 'start_time': self.start_time
        });
      },
      onApprove: function (data, actions) {
        actions.subscription.get().then((details) => {
          self.apiService.presentToast(
            'Susbcription purchased successfully.',
            'success'
          );
          self.paymentDetails = details;
          self.CreateSubscription(details);
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        self.planDetail = plan;

        console.log('Clicked:', self.selectedIndex, plan, data, actions);
      },
    };
  }

  CreateSubscription(details) {
    var dict = {
      userId: localStorage.getItem('userId'),
      price: this.detail.data.price,
      subs_id: this.detail.data._id,
      days: this.selectedDays == 'month' ? '30' : '365',
      subscriptionId: details.id,
      packageId: details.plan_id,
      paymentDays: this.detail.data.days,
      subscriber: details.subscriber,
      plan_desc: details,

      plan_id: this.detail.data.id,
      start_time: this.paymentDetails.create_time.split('T')[0],
      plan_name: this.detail.data.name,
      plan_details: this.detail,
    };
    this.apiService
      .post('/add_payment_subscription', dict, '')
      .subscribe((res) => {
        this.response22 = res;
        localStorage.setItem('price', this.response22.data.price);
        this.apiService.presentToast('Payment added successfully', 'success');
        this.events.publishSomeData({});
        this.router.navigate(['/tabs/workoutselection']);
      });
  }

  gotoexercise(doc) {
    localStorage.setItem('cat_id', doc.cat_id);
    localStorage.setItem('ability_id', doc.ref_id);
    this.router.navigate(['/exercises/', doc._id]);
  }
  goBack() {
    this.location.back();
  }

  gobackone() {
    this.navCtrl.back();
  }

  //paypal code
  paypalButton() {
    let _this = this;
    setTimeout(() => {
      // Render the PayPal button into #paypal-button-container
      <any>window['paypal']
        .Buttons({
          // Set up the transaction

          createSubscription: function (data, actions) {
            return actions.subscription.create({
              plan_id: localStorage.getItem('planId'),
            });
          },

          // Finalize the transaction
          onApprove: function (data, actions) {
            return actions.subscription
              .get()
              .then((details) => {
                // Show a success message to the buyer
                console.log('Transaction completed by ', details);
                _this.paymentDetails = details;
                _this.CreateSubscription(details);
              })
              .catch((err) => {
                console.log(err);
              });
          },
        })
        .render('#paypal-button-container');
    }, 1000);
    this.apiService.stopLoading();
  }
}
