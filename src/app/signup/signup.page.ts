import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  authForm: FormGroup;
  pass_type = 'password';
  confirm_pass_type = 'password';
  response: any;
  responseData: any;
  userData: any;
  errors = config.errors;
  is_submit = false;

  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  //define the validators for form fields
  createForm() {
    this.authForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
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
      confirm_password: ['', Validators.compose([Validators.required])],
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

    if (this.authForm.value.password != this.authForm.value.confirm_password) {
      return false;
    }

    var user = {
      name: this.authForm.value.name,
      email: this.authForm.value.email,
      age: '',
      gender: '',
      height: '',
      weight: '',
      activity_level: '',
      workout_type: '',
      workout_pref: '',
      not_choose: '',
      image: '',
      filename: '',
      weight_str: '',
      password: this.authForm.value.password,
    };

    this.apiService
      .post(
        '/checkEmail',
        {
          email: this.authForm.value.email,
        },
        ''
      )
      .subscribe((res) => {
        this.responseData = res;
        if (this.responseData.status == 1) {
          localStorage.setItem('userObj', JSON.stringify(user));
          this.router.navigate(['/gender']);
        } else {
          this.apiService.presentToast(this.responseData.error, 'danger');
        }
      });
  }

  passwordView(type) {
    if (type == 'password') {
      this.pass_type = 'text';
    } else {
      this.pass_type = 'password';
    }
  }

  confirmPasswordView(type) {
    if (type == 'password') {
      this.confirm_pass_type = 'text';
    } else {
      this.confirm_pass_type = 'password';
    }
  }
}
