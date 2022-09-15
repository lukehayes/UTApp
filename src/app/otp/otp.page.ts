import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  authForm: FormGroup;
  responseData: any;

  constructor(
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService
  ) {
    this.authForm = this.formBuilder.group({
      otp: [
        '',
        Validators.compose([Validators.required, Validators.pattern(/[0-9]/)]),
      ],
    });
  }

  ngOnInit() {}

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
        '/verify_otp_forgot',
        {
          email: localStorage.getItem('forgot_email'),
          otp: this.authForm.value.otp,
        },
        ''
      )
      .subscribe((res) => {
        this.responseData = res;
        this.apiService.stopLoading();

        if (this.responseData.status == 0) {
          this.apiService.presentToast(this.responseData.msg, 'danger');
        } else {
          this.apiService.presentToast(this.responseData.msg, 'success');
          this.router.navigateByUrl('/resetpassword', { replaceUrl: true });
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
