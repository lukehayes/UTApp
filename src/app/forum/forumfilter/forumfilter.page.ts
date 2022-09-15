import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { EventsService } from '../../services/events/events.service';
import { ApiService } from '../../services/apiservice.service';
import { GlobalFooService } from '../../services/globalFooService.service';
import { config } from '../../services/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController} from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-forumfilter',
  templateUrl: './forumfilter.page.html',
  styleUrls: ['./forumfilter.page.scss'],
})
export class ForumfilterPage implements OnInit {

  authForm: FormGroup;
  responseData: any;
  errors = config.errors;

  constructor(public formBuilder: FormBuilder,public apiService: ApiService, public router: Router, private globalFooService: GlobalFooService, public events:EventsService, public navCtrl:NavController, public modalController: ModalController) { 

    this.createForm();
  }

  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ngOnInit() {
  }

  //define the validators for form fields
  createForm(){
    this.authForm = this.formBuilder.group({
        title: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
    });
  };


  submit(){

    console.log(this.authForm.value);
    const controls = this.authForm.controls;
    console.log(this.authForm)
    if (this.authForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.apiService.presentLoading();

    this.apiService.post('/add_forum', {title : this.authForm.value.title,description: this.authForm.value.description, userId:localStorage.getItem('userId') }, '').subscribe((res) => {
      this.responseData = res;
      console.log('res = ', res);
      this.events.publishSomeData({});
      this.apiService.stopLoading(); 
      if(this.responseData.status == 0){
          this.apiService.presentToast(this.responseData.error, 'danger');
       }else{
        this.apiService.presentToast(this.responseData.error, 'success');
        this.dismiss();
       }
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.authForm.controls[controlName];
      if (!control) {
          return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }

}
