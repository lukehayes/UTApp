import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  type = 'password';
  authForm: FormGroup;
  responseData: any;
  errors = config.errors;
  userData: any;
  result: any;
  response_payment: any;
  freeTrial: any;
  adminMembershipStatus: any;

  constructor(
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    public events: EventsService,
    public navCtrl: NavController
  ) {
    this.createForm();
  }

  ngOnInit() {}

  //define the validators for form fields
  createForm() {
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.authForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(
            /[a-zA-Z][\w\.-]*[a-zA-Z0-9]{0,}@([a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]{2,})/
          ),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^.{6,}$/),
        ]),
      ],
    });
  }

  viewpass(type) {
    if (type == 'text') {
      this.type = 'password';
    } else {
      this.type = 'text';
    }
  }

  submit() {
    const controls = this.authForm.controls;
    if (this.authForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.apiService.presentLoading();

    this.apiService
      .post(
        '/login',
        {
          email: this.authForm.value.email,
          password: this.authForm.value.password,
        },
        ''
      )
      .subscribe((res) => {
        this.responseData = res;

        this.apiService.stopLoading();
        if (this.responseData.status == 0) {
          this.apiService.presentToast(this.responseData.error, 'danger');
        } else {
          this.apiService.presentToast(this.responseData.error, 'success');
          localStorage.setItem('userId', this.responseData.data._id);
          localStorage.setItem(
            'userObj',
            JSON.stringify(this.responseData.data)
          );

          var user = {
            _id: this.responseData.data._id,
            name: this.responseData.data.name,
            email: this.responseData.data.email,
            created_on: this.responseData.data.created_on,
            age:
              this.errors.indexOf(this.responseData.data.age) == -1
                ? this.responseData.data.age
                : '',
            gender:
              this.errors.indexOf(this.responseData.data.gender) == -1
                ? this.responseData.data.gender
                : '',
            image:
              this.errors.indexOf(this.responseData.data.image) == -1
                ? this.responseData.data.image
                : '',
            height:
              this.errors.indexOf(this.responseData.data.height) == -1
                ? this.responseData.data.height
                : '',
            weight:
              this.errors.indexOf(this.responseData.data.weight) == -1
                ? this.responseData.data.weight
                : '',
            acitvity_level:
              this.errors.indexOf(this.responseData.data.acitvity_level) == -1
                ? this.responseData.data.acitvity_level
                : '',
          };

          localStorage.setItem('userObj', JSON.stringify(user));
          this.checkAdminMembership();
          this.router.navigateByUrl('/tabs/workoutselection', {
            replaceUrl: true,
          });
          this.events.publishSomeData1({});
          // }
        }
      });
  }

  checkAdminMembership() {
    this.apiService
      .post(
        '/check_admin_activate_membership',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.adminMembershipStatus = res;
        this.checkTrial();
      });
  }

  checkTrial() {
    this.apiService
      .post('/check_free_trial', { userId: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        this.freeTrial = res;
        if (this.freeTrial.status == 1 || this.freeTrial.status == 0) {
          localStorage.setItem('freetrial', 'no');
          if (this.adminMembershipStatus.status == 0) {
            this.checkSubscription();
          } else {
            localStorage.setItem('subsexits', 'yes');
          }
        } else {
          localStorage.setItem('freetrial', 'yes');
          if (this.adminMembershipStatus.status == 0) {
          } else {
            localStorage.setItem('subsexits', 'yes');
          }
        }
      });
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
          if (this.adminMembershipStatus.status == 0) {
            localStorage.setItem('subsexits', 'no');
          } else {
            localStorage.setItem('subsexits', 'yes');
          }
          localStorage.setItem('price', '0');
          this.navCtrl.navigateRoot('/getstarted');
        } else {
          this.response_payment = res;
          localStorage.setItem('price', this.response_payment.data.price);
          localStorage.setItem('subsexits', 'yes');
        }
      });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.authForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
