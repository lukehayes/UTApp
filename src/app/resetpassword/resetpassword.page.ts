import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {
  authForm: FormGroup;
  responseData: any;
  is_submit = false;

  constructor(
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService
  ) {
    this.authForm = this.formBuilder.group({
      new_pass: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^.{6,}$/),
        ]),
      ],
    });
  }

  ngOnInit() {}

  submit() {
    this.is_submit = true;

    console.log(this.authForm.value);
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
      .post(
        '/change_forgot_password',
        {
          email: localStorage.getItem('forgot_email'),
          newpassword: this.authForm.value.new_pass,
        },
        ''
      )
      .subscribe((res) => {
        this.responseData = res;
        console.log('res = ', res);
        this.is_submit = false;
        this.apiService.stopLoading();

        if (this.responseData.status == 0) {
          this.apiService.presentToast(this.responseData.msg, 'danger');
        } else {
          this.apiService.presentToast(this.responseData.msg, 'success');
          localStorage.setItem('forgot_email', '');
          //this.router.navigate(['/login'])
          this.router.navigateByUrl('/login', { replaceUrl: true });
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
