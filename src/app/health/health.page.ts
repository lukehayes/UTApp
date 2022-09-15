import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../services/events/events.service';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-health',
  templateUrl: './health.page.html',
  styleUrls: ['./health.page.scss'],
})
export class HealthPage implements OnInit {
  profile: any;
  IMAGES_URL = config.IMAGES_URL;
  errors = config.errors;
  authForm: FormGroup;
  responseData: any;
  health: any;
  editable = true;

  constructor(
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    public navCtrl: NavController,
    private ref: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getProfile();
  }

  //define the validators for form fields
  createForm() {
    this.authForm = this.formBuilder.group({
      heart_rate: [''],
      height: [''],
      weight: [''],
      bp: [''],
      pulse_rate: [''],
      calories: [''],
      neck: [''],
      shoulder: [''],

      bust: [''],
      waist: [''],
      abdomen: [''],
      hips: [''],
      biceps_left: [''],
      biceps_right: [''],
      thigh_left: [''],
      thigh_right: [''],
      calf_right: [''],
      calf_left: [''],
      waist_hip_ratio: [''],
      known_illness: [''],
    });
  }

  getProfile() {
    this.apiService
      .post('/getProfile', { _id: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        this.profile = res;
        this.authForm.patchValue({
          height: this.profile.data.height,
          weight: this.profile.data.weight,
        });
        this.getHealthDetails();
      });
  }

  getHealthDetails() {
    this.apiService.presentLoading();
    this.apiService
      .post(
        '/get_health_details',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.health = res;
        this.apiService.stopLoading();
        if (this.health.data != null) {
          this.authForm.patchValue({
            heart_rate: this.health.data.heart_rate,
            bp: this.health.data.bp,
            pulse_rate: this.health.data.pulse_rate,
            calories: this.health.data.calories,
            neck: this.health.data.neck,
            shoulder: this.health.data.shoulder,

            bust: this.health.data.bust,
            waist: this.health.data.waist,
            abdomen: this.health.data.abdomen,
            hips: this.health.data.hips,
            biceps_left: this.health.data.biceps_left,
            biceps_right: this.health.data.biceps_right,
            thigh_left: this.health.data.thigh_left,
            thigh_right: this.health.data.thigh_right,
            calf_right: this.health.data.calf_right,
            calf_left: this.health.data.calf_left,
            waist_hip_ratio: this.health.data.waist_hip_ratio,
            known_illness: this.health.data.known_illness,
          });
        }
      });
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
        '/add_new_health',
        {
          heart_rate: this.authForm.value.heart_rate,
          bp: this.authForm.value.bp,
          pulse_rate: this.authForm.value.pulse_rate,
          calories: this.authForm.value.calories,
          neck: this.authForm.value.neck,
          shoulder: this.authForm.value.shoulder,
          bust: this.authForm.value.bust,
          waist: this.authForm.value.waist,
          abdomen: this.authForm.value.abdomen,
          hips: this.authForm.value.hips,
          biceps_left: this.authForm.value.biceps_left,
          biceps_right: this.authForm.value.biceps_right,
          thigh_left: this.authForm.value.thigh_left,
          thigh_right: this.authForm.value.thigh_right,
          calf_right: this.authForm.value.calf_right,
          calf_left: this.authForm.value.calf_left,
          waist_hip_ratio: this.authForm.value.waist_hip_ratio,
          height: this.authForm.value.height,
          weight: this.authForm.value.weight,
          known_illness: this.authForm.value.known_illness,
          userId: localStorage.getItem('userId'),
          id: this.health.data == null ? '' : this.health.data._id,
        },
        ''
      )
      .subscribe((res) => {
        this.responseData = res;
        this.editable = true;
        if (this.responseData.data.nModified == 1)
          this.apiService.presentToast('Updated successfully', 'sucess');
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
