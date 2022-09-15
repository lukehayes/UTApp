import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  type = 'password';
  authForm: FormGroup;
  responseData: any;
  errors = config.errors;
  constructor(
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController
  ) {
    this.createForm();
  }

  ngOnInit() {}

  //define the validators for form fields
  createForm() {
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
    });
  }

  submit() {
    const controls = this.authForm.controls;
    console.log(this.authForm);
    if (this.authForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.apiService.presentLoading();

    this.apiService
      .post('/forgot_password', { email: this.authForm.value.email }, '')
      .subscribe((res) => {
        this.responseData = res;
        this.apiService.stopLoading();

        if (this.responseData.status == 0) {
          this.apiService.presentToast(this.responseData.msg, 'danger');
        } else {
          localStorage.setItem('forgot_email', this.authForm.value.email);
          this.apiService.presentToast(this.responseData.msg, 'success');
          this.router.navigateByUrl('/otp', { replaceUrl: true });
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
